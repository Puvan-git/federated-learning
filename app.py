from flask import Flask, render_template, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO
from models.server import FedAvg
import logging

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
# For now the message parameter will be optional,
# send user input thru the form afterwards
def start_training(message=None):
    # user_input = message.get('params', {})  # Get user input as a dictionary
    try:
        # Log that the event was received
        logging.debug('Received "train" event')
        socketio.emit('train_confirmed', "Training has started!")
        print("train_confirmed event attempted to be emitted from server.")

        # Example: Access individual parameters
        FedAvg(socketio)
        print("training is done")

        socketio.emit('update_status', {
            'data': 'Training completed!'})
    except Exception as e:
        print(f"Error during training: {e}")


# def simulate_training(rounds):
#     # Access user input parameters and configure the training process
#     import time
#     for i in range(rounds):
#         time.sleep(1)
#         status_message = f'Training step {i+1}/{rounds}'
#         emit('update_status', {'data': status_message}, namespace='/train')


if __name__ == '__main__':
    socketio.run(app, debug=True)
