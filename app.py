from flask import Flask, render_template, send_from_directory
from flask_socketio import SocketIO, emit
from models.server import FedAvg
import logging

# Set the desired log level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
logging.basicConfig(level=logging.DEBUG)


app = Flask(__name__)
socketio = SocketIO(app, async_mode='eventlet')


@app.route('/')
def index():
    return render_template('index.html')


app.static_folder = 'static'


@socketio.on('train')
def start_training(message):
    user_input = message.get('params', {})  # Get user input as a dictionary
    logging.debug('Received "train" event')  # Log that the event was received

    # Example: Access individual parameters
    FedAvg(user_input)

    # Start your federated training here with user_input parameters
    # Replace simulate_training() with your actual training logic
    simulate_training(user_input.get('rounds', 10))

    emit('update_status', {
         'data': 'Training completed!'}, namespace='/train')


def simulate_training(rounds):
    # Access user input parameters and configure the training process

    # Your actual federated training logic using the user's input
    import time
    for i in range(rounds):
        time.sleep(1)
        status_message = f'Training step {i+1}/{rounds}'
        emit('update_status', {'data': status_message}, namespace='/train')


if __name__ == '__main__':
    socketio.run(app, debug=True)
