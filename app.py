from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/train')
def train_model():
    # Code to start the model training process
    return "Training has started!"

if __name__ == '__main__':
    app.run(debug=True)
