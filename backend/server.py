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
events_detail_collection = db['Event Details']

# API Route to get events
@app.route('/eventdata', methods=['GET'])
def get_event_data():
    events = list(events_collection.find({}, {'_id': 0})) 
    return jsonify(events)

@app.route('/eventdetails', methods=['GET'])
def get_event_details():
    events = list(events_detail_collection.find({}, {'_id': 0})) 
    return jsonify(events)

@app.route('/combined_events', methods=['GET'])
def combined_events():
    # Adjusted aggregation pipeline for a left join-like behavior
    result = db.event_data.aggregate([
        {
            '$lookup': {
                'from': 'event_details',
                'localField': 'eventId',
                'foreignField': 'eventId',
                'as': 'eventDetails'
            }
        },
        {
            '$unwind': {
                'path': '$eventDetails',
                'preserveNullAndEmptyArrays': True  # Ensures non-matched are included
            }
        },
        {
            '$project': {
                # Specify fields to include or exclude
                'eventId': 1,
                'eventDetails': 1
                # Add other fields as needed
            }
        }
    ])
    return jsonify(list(result))


if __name__ == "__main__":
    app.run(debug=True)