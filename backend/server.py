from flask import Flask, jsonify
from pymongo import MongoClient
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

# Connect to MongoDB
client = MongoClient("mongodb+srv://codeforgood2024team10:DevL8aYJXQsTm9@cluster0.acjuj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client['Event']
events_collection = db['Event Data']

# API Route to get events
@app.route('/events', methods=['GET'])
def get_events():
    events = list(events_collection.find({}, {'_id': 0})) 
    return jsonify(events)

if __name__ == "__main__":
    app.run(debug=True)