from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

app.static_folder = 'static'

@app.route('/train')
def train_model():
    # Code to start the model training process
    return "Training has started!"

if __name__ == '__main__':
    app.run(debug=True)
