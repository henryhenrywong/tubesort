from flask import Flask, render_template, send_from_directory,json,jsonify

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

@app.route("/example.json")
def data():
    f = open('static/js/example.json')
    data = json.load(f)
    return jsonify(data)

