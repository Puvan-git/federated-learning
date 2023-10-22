# Visualisation for Federated-learning

## Introduction
Federated learning is the leading paradigm for the collaborative training of machine learning models in a privacy-preserving manner. It was first introduced by Google as a learning paradigm for the next- word prediction model in google keyboards. I have built an interactive platform that supports experimentation of federated learning algorithms. It will serve as an educational visualization platform that provides analytical insights into the federated training process. This project may involve frameworks such as TensorFlow.js, D3.js, React.

## Prerequisites
- Node.js >= v16+
- npm >= v9+
- Flask v2+
- numpy v1.2+
- tensorflow v2.14+
- torch v2.1+
- eventlet v0.33+
- python-socketio >= v5.8+

## Installation
1. Clone the repository: `git clone https://github.com/Puvan-git/federated-learning.git`
2. Navigate to the app's directory: `cd federated-learning`
3. Install dependencies: `npm install`

## Running the App
To start the development server,
1. Start a terminal
2. run: `python3 app.py`
3. Begin new terminal
4. Navigate to `/frontend` directory
5. run: `npm start` on current terminal

## Features & Usage
1. Form-Based Hyperparameter Selection:
   - Users can interactively select or input hyperparameters for the model training.
   - This form is easily accessible on the main page, ensuring that users can quickly set their desired parameters before training.
2. Navigation to Training Page:
   - After hyperparameter selection, users are directed to a training page where they can observe the training process.
   - The transition from hyperparameter selection to training provides a smooth user experience and logical flow to the app.
3.Global Model Training Visualization:
   - Users can monitor the global model's training in real-time.
   - This feature provides transparency, allowing users to understand how the model is improving over time and possibly diagnose any training issues.
4. Client Filtering Option:
   - Users have the flexibility to choose which client's training they want to view.
   - This allows for more granular observation and can be particularly useful in a federated learning setting, where different clients might have varying data distributions       and training patterns.
5. Simultaneous Training Displays:
   - The app provides the capability to display the global model's training and a selected client's training side by side.
   - This comparative view can offer insights into how individual client training affects or aligns with the global model's training.

## Screenshots
## Training results with Fractional_Participation_Rate = 0.6
Client 2
![Client 2](https://github.com/Puvan-git/federated-learning/blob/main/images/global_w_client2.png)

Client 3
![Client 3](https://github.com/Puvan-git/federated-learning/blob/main/images/global_w_client3.png)

## Troubleshooting
1) Failing to plot graph data
   - Clear browser cache
   - Hard refresh current page
   - Navigate to main page
   - Begin executing flow as per normal
