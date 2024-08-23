from flask import Flask
from sheets_get_values import get_sheet_values
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def default():
    return 'Team 10 server'

# Healthcheck API Route
@app.route('/healthcheck')
def healthcheck():
    return 'Server is up and running!'

# API Route to get data from Google Sheets
@app.route('/responses')
def responses():
    return {'data': get_sheet_values()}

if __name__ == "__main__":
    app.run(debug=True)