from argparse import Namespace
from models.client import LocalUpdate, cal_loss
from models.test import test
from utils.dataset import load_dataset, load_model, exp_details, save_data
import numpy as np
import copy
import time
import torch
from flask import Flask, render_template, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO
import logging
import eventlet

eventlet.monkey_patch()

# Set the desired log level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000",
                    ping_timeout=60000, ping_interval=5000, async_mode='eventlet')


@app.route('/')
def index():
    return render_template('index.html')


app.static_folder = 'static'


@socketio.on('train')
def start_training(message=None):
    user_input = message
    # For demonstration purposes:
    print("Received form data:", user_input)
    try:
        # Log that the event was received
        logging.debug('Received "train" event')
        socketio.emit('train_confirmed', "Training has started!",
                      callback=acknowledgment)

        FedAvg(user_input)
    except Exception as e:
        print(f"Error during training: {e}")


def acknowledgment():
    print("Acknowledgment received from client!")


# Modify Federated Learning algorithm
def FedAvg(user_params=None):
    """
    fedavg main algorithm
    - fedProx < possible algorithm, allow selection choice from user
    """

    args = Namespace(
        dataset=user_params.get('dataset'),
        local_ep=int(user_params.get('localEpochs')),
        model='mlp1',
        rounds=int(user_params.get('communicationRounds')),
        iid=1,
        num_users=int(user_params.get('numUsers')),
        num_classes=10,
        lr=0.01,
        frac=(float(user_params.get('fracUsers'))) / 100,
        num_channels=32,
        decay=1,
        local_bs=int(user_params.get('batchSize')),
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

            client_model = copy.deepcopy(model).to(args.device)
            client_model.load_state_dict(w)
            client_accuracy, _ = test(client_model, args, dataset_test)

            client_data = {
                "clientID": f"Client {idx+1}",
                "round": iter,
                "loss": loss,
                "accuracy": client_accuracy.item()
            }

            socketio.emit('update_client', client_data)
            logging.debug(
                f"Emitting update for selected client in round {iter}")

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

        data = {"round": iter,
                "loss": loss_train,
                "accuracy": acc_test.item()}

        print("Emitting update event with data:", data)

        print(type(socketio))
        socketio.emit('update', data)
        logging.debug(f"Emitting update for round {iter}")

        eventlet.sleep(0)

        if (iter == args.rounds):
            # Emit the "Training completed!" message after the training concludes
            completion_message = "Training completed"
            socketio.emit('update_status', completion_message)
            logging.debug("Emitting training completion status.")


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


if __name__ == '__main__':
    import eventlet.wsgi
    eventlet.wsgi.server(eventlet.listen(('', 5001)), app)
