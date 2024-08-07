from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/asteroids")
def asteroids():
    return render_template("asteroids.html")


@app.route("/store_score", methods=["POST"])
def store_score():
    score = int(request.form["score"])
    # Here insert the score into the database
    # If update is successful return success, otherwise return failure
    return "success"

@app.route("/about")
def about():
    return render_template("about.html")

