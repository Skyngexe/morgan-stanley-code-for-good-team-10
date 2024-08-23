from flask import Flask

app = Flask(__name__)

@app.route('/')
def default():
    return 'Team 10 server'

# Healthcheck API Route
@app.route('/healthcheck')
def healthcheck():
    return 'Server is up and running!'

if __name__ == "__main__":
    app.run(debug=True)