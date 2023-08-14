import numpy as np
from torchvision import datasets, transforms
from scipy.stats import ks_2samp


def mnist_iid(dataset, num_users):
    """
    split data in iid way
    """
    num_items = int(len(dataset) / num_users)
    dict_users, all_idxs = {}, [i for i in range(len(dataset))]
    for i in range(num_users):
        dict_users[i] = set(np.random.choice(
            all_idxs, num_items, replace=False))
        all_idxs = list(set(all_idxs) - dict_users[i])
    return dict_users


def mnist_noniid(dataset, num_users):
    """
    split data in noniid way
    - use KS Metric to split [-]
    - dirichlet distribution []
    - quantity based label imbalance []
    """

    # """
    # random manner
    # """
    # num_shards, num_imgs = 200, 300
    # idx_shard = [i for i in range(num_shards)]
    # dict_users = {i: np.array([], dtype="int64") for i in range(num_users)}
    # idxs = np.arange(num_shards * num_imgs)
    # labels = dataset.train_labels.numpy()

    # idxs_labels = np.vstack((idxs, labels))
    # idxs_labels = idxs_labels[:, idxs_labels[1, :].argsort()]
    # idxs = idxs_labels[0, :]

    # for i in range(num_users):
    #     rand_set = set(np.random.choice(idx_shard, 2, replace=False))
    #     idx_shard = list(set(idx_shard) - rand_set)
    #     for rand in rand_set:
    #         dict_users[i] = np.concatenate(
    #             (dict_users[i], idxs[rand *
    #              num_imgs: (rand + 1) * num_imgs]), axis=0
    #         )
    # return dict_users

    """
    KS metric manner
    """
    num_shards, num_imgs = 200, 300
    idx_shard = [i for i in range(num_shards)]
    dict_users = {i: np.array([], dtype="int64") for i in range(num_users)}
    idxs = np.arange(num_shards * num_imgs)
    labels = dataset.train_labels.numpy()

    idxs_labels = np.vstack((idxs, labels))
    idxs_labels = idxs_labels[:, idxs_labels[1, :].argsort()]
    idxs = idxs_labels[0, :]

    # Calculate the CDF of label distribution
    cdf_labels = np.cumsum(np.bincount(labels)) / len(labels)

    for i in range(num_users):
        # Calculate the CDF of label distribution for this user
        user_labels = labels[dict_users[i]]
        cdf_user_labels = np.cumsum(
            np.bincount(user_labels)) / len(user_labels)

        # Calculate the KS statistic between the user's CDF and the overall CDF
        ks_statistic, _ = ks_2samp(cdf_user_labels, cdf_labels)

        # Sort the shards based on KS statistic in descending order
        idx_shard.sort(
            key=lambda x: -abs(ks_statistic - (2 * x / num_shards - 1)))

        # Choose shards with highest KS statistic
        chosen_shards = idx_shard[:2]
        idx_shard = idx_shard[2:]

        # Assign images from chosen shards to the user
        for rand in chosen_shards:
            dict_users[i] = np.concatenate(
                (dict_users[i], idxs[rand *
                 num_imgs: (rand + 1) * num_imgs]), axis=0
            )

    return dict_users
