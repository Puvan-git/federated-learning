import matplotlib.pyplot as plt
import numpy as np

mlp2_noniid = np.load('./results/FedAvg_mnist_rounds-' +
                      str(30) + '_iid-1_mlp2.npy', allow_pickle=True).tolist()

# Test accuracy Non-IID
plt.figure()
plt.plot(range(1, 30 + 1),
         mlp2_noniid[2][0: 30], '', label='FedAvg-MLP2')

plt.xlabel('Rounds')
plt.ylabel('Test accuracy')
plt.title('Test accuracy vs training rounds for Non-IID data')

# Train loss Non-IID
plt.figure()
plt.plot(range(1, 30 + 1),
         mlp2_noniid[0][0: 30], '', label='FedAvg-MLP2')

plt.legend()
plt.yscale('log')
plt.xscale('log')
plt.xlabel('Rounds')
plt.ylabel('Train loss')
plt.title('Train loss vs training rounds for Non-IID data')

# test loss Non-IID
plt.figure()
plt.plot(range(1, 30 + 1),
         mlp2_noniid[1][0: 30], '', label='FedAvg-MLP2')

plt.legend()
plt.yscale('log')
plt.xscale('log')
plt.xlabel('Rounds')
plt.ylabel('Test loss')
plt.title('Test loss vs training rounds for Non-IID data')


plt.show()
