# Modify Federated Learning algorithm

import torch
import time
import torch
import copy
import numpy as np
from utils.dataset import load_dataset, load_model, exp_details, save_data
from models.test import test
from models.client import LocalUpdate, cal_loss
from flask_socketio import emit
from argparse import Namespace


def FedAvg():
    """
    fedavg main algorithm
    - fedProx < possible algorithm, allow selection choice from user
    """

    args = Namespace(
        dataset='mnist',
        local_ep=10,
        model='mlp1',
        rounds=5,
        iid=1,
        num_users=10,
        num_classes=10,
        lr=0.01,
        frac=0.1,
        num_channels=32,
        decay=1,
        local_bs=16,
        bs=128,
        momentum=0.5,
        optimizer='sgd',
        gpu=0,
        verbose=0,
        seed=1,
        selected_clients=0,
        split='user'
    )

    args.device = torch.device(
        f"cuda:{args.gpu}" if torch.cuda.is_available() and args.gpu != -
        1 else "cpu"
    )
    # load and split dataset
    dataset_train, dataset_test, dict_users = load_dataset(args)
    # build model
    model = load_model(args, dataset_train)
    w_server = model.state_dict()
    exp_details(args)
    loss_train_all = []
    loss_test_all = []
    accur_test_all = []

    for iter in range(1, args.rounds + 1):
        round_start_time = time.time()
        model.train()
        loss_locals = []
        if args.selected_clients:
            w_clients = []
        else:
            w_clients = [w_server for i in range(args.num_users)]
        clients_num = max(int(args.frac * args.num_users), 1)
        idxs_clients = np.random.choice(
            range(args.num_users), clients_num, replace=False
        )
        for idx in idxs_clients:  # local update
            local = LocalUpdate(
                args=args, dataset=dataset_train, idxs=dict_users[idx])
            w, loss = local.train(copy.deepcopy(model).to(args.device), iter)
            if args.selected_clients:
                w_clients.append(copy.deepcopy(w))
            else:
                w_clients[idx] = copy.deepcopy(w)
            loss_locals.append(copy.deepcopy(loss))
        w_server = avg(w_clients)
        model.load_state_dict(w_server)

        loss_train = cal_loss(args, copy.deepcopy(model),
                              dataset_train, dict_users)
        acc_test, loss_test = test(model, args, dataset_test)

        loss_train_all.append(loss_train)
        loss_test_all.append(loss_test)
        accur_test_all.append(acc_test)
        results_all = [loss_train_all, loss_test_all, accur_test_all]
        # save results
        if iter % 50 == 0 or iter == args.rounds:
            save_data(args, results_all, model, iter)
        print("Round {}, Loss {:.3f}".format(iter, loss_train))
        print("Accuracy: {:.3f}".format(acc_test.item()))
        print(
            "Runtime: " +
            str(round(time.time() - round_start_time, 2)) + " seconds\n"
        )

        data = {"rounds": iter,
                "losses": loss_train,
                "accuracies": acc_test.item()}

        print("Emitting update event with data:", data)
        emit('update', data)

        # Emit training status to frontend
        # emit('update', {
        #     'rounds': f"Round {iter}/{args.rounds}, losses {loss_train:.3f}, accuracies {acc_test.item():.3f}"})
        # emit('update', {'rounds': iter, 'losses': loss_train,
        #      'accuracies': acc_test.item()})
        print(f"Round {iter} data is sent\n")


def avg(w_clients):
    """
    server aggregation process
    """
    w_avg = copy.deepcopy(w_clients[0])
    for k in w_avg.keys():
        for i in range(1, len(w_clients)):
            w_avg[k] += w_clients[i][k]
        w_avg[k] = torch.div(w_avg[k], len(w_clients))
    return w_avg
