from flask import Flask
from flask_cors import CORS
from sheets_get_values import get_sheet_values

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
    sheet_id = '1ZkvjH4i6U8h2iGLI711dwio1VN5FtAxqbO40EWjEtuo'
    return {'data': get_sheet_values(sheet_id)}

if __name__ == "__main__":
    app.run(debug=True)