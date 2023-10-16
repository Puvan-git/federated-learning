from flask import Flask, render_template, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from models.server import FedAvg
import logging

# Set the desired log level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
logging.basicConfig(level=logging.DEBUG)


app = Flask(__name__)
CORS(app)
socketio = SocketIO(
    app, cors_allowed_origins="http://localhost:3000", ping_timeout=40, ping_interval=5, async_mode='eventlet')


@app.route('/')
def index():
    return render_template('index.html')


app.static_folder = 'static'


@socketio.on('train')
# For now the message parameter will be optional,
# send user input thru the form afterwards
def start_training(message=None):
    # user_input = message.get('params', {})  # Get user input as a dictionary
    logging.debug('Received "train" event')  # Log that the event was received

    # Example: Access individual parameters
    FedAvg()
    print("training is done")

    socketio.emit('update_status', {
        'data': 'Training completed!'}, namespace='/train')


def simulate_training(rounds):
    # Access user input parameters and configure the training process
    import time
    for i in range(rounds):
        time.sleep(1)
        status_message = f'Training step {i+1}/{rounds}'
        emit('update_status', {'data': status_message}, namespace='/train')


if __name__ == '__main__':
    socketio.run(app, debug=True)
