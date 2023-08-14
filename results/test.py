import matplotlib.pyplot as plt
import numpy as np

mlp2_noniid = np.load('./results/FedAvg_mnist_rounds-' +
                      str(20) + '_iid-0_mlp2.npy', allow_pickle=True).tolist()
cnn2_noniid = np.load('./results/FedAvg_mnist_rounds-' +
                      str(20) + '_iid-0_cnn2.npy', allow_pickle=True).tolist()

# Test accuracy Non-IID
plt.figure()
plt.plot(range(1, 20 + 1),
         mlp2_noniid[2][0: 20], '', label='FedAvg-MLP2')
plt.plot(range(1, 20 + 1),
         cnn2_noniid[2][0: 20], '', label='FedAvg-CNN2')

plt.xlabel('Rounds')
plt.ylabel('Test accuracy')
plt.title('Test accuracy vs training rounds for Non-IID data')

# Train loss Non-IID
plt.figure()
plt.plot(range(1, 20 + 1),
         mlp2_noniid[0][0: 20], '', label='FedAvg-MLP2')
plt.plot(range(1, 20 + 1),
         cnn2_noniid[0][0: 20], '', label='FedAvg-CNN2')

plt.legend()
plt.yscale('log')
plt.xscale('log')
plt.xlabel('Rounds')
plt.ylabel('Train loss')
plt.title('Train loss vs training rounds for Non-IID data')

# test loss Non-IID
plt.figure()
plt.plot(range(1, 20 + 1),
         mlp2_noniid[1][0: 20], '', label='FedAvg-MLP2')
plt.plot(range(1, 20 + 1),
         cnn2_noniid[1][0: 20], '', label='FedAvg-CNN2')

plt.legend()
plt.yscale('log')
plt.xscale('log')
plt.xlabel('Rounds')
plt.ylabel('Test loss')
plt.title('Test loss vs training rounds for Non-IID data')


plt.show()
