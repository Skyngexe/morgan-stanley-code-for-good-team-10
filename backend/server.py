from flask import Flask, request, jsonify
from pymongo import MongoClient
from enum import Enum
from bson import json_util
import json
from apiclient import discovery
from httplib2 import Http
from oauth2client import client, file, tools
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


MONGO_URI = "mongodb+srv://codeforgood2024team10:DevL8aYJXQsTm9@cluster0.acjuj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
EVENT_DB = "Event"
USER_DB = 'User'


# Connect to MongoDB
db_client = MongoClient(MONGO_URI)
event_db = db_client[EVENT_DB]
user_db = db_client[USER_DB]
event_data = event_db['Event Data']
event_details= event_db['Event Details']
user_data = event_db['User Data']
events_detail_collection = event_db['Event Details']

class UserRole(Enum):
    """
        Enum representing the roles of users.

    Attributes:
        VOLUNTEER: Represents a volunteer user.
        ADMIN: Represents an admin user.
        PARTICIPANT: Represents a participant user.
    """

    VOLUNTEER = "volunteer"
    ADMIN = "admin"
    PARTICIPANT = "participant"

@app.route('/')
def default():
    return 'Team 10 server'

@app.route('/write/user', methods=['POST'])
def create_new_user():
    """
    Create a new user and insert the user data into the database.

    Expects JSON data in the request body with the following structure:
    
    {
        "username": "Jane123",
        "password": "Janeaccount",
        "email": "jane@abc.com",
        "number": "62018209",
        "role": "volunteer",
        "ethnicity": "American",
        "gender": "Female",
        "age": {
            "$numberInt": "20"
        },
        "preferred_language": "english",
        "points": {
            "$numberInt": "0"
        }
    }

    Returns:
        dict: A dictionary containing a success message if the user data is inserted successfully.

    Raises:
        400: If there are any errors during the user creation process.

    Notes:
        - The function expects JSON data in the request body with the following fields:
            - "role": The role of the user. Allowed values are 'volunteer', 'admin', or 'participants'.
    """
    try:
        new_user = request.json  # Access JSON data from the request object
        
        # Validate the "role" field against the Enum values
        if "role" in new_user and new_user["role"] not in [role.value for role in UserRole]:
            return jsonify({'error': 'Invalid role value. Allowed values are: volunteer, admin, moderator'}), 400
        
        user_data.insert_one(new_user)
        return jsonify({'message': 'User data inserted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/write/event', methods=['POST'])
def create_new_event():
    """
    Create a new event and insert the event data into the database.

    Expects JSON data in the request body with the following structure:
    
    {
        "name": "Weekly Chai Gathering for EM Women",
        "description": "A Weekly gathering for Women, join us if interested!",
        "imageURL": "https://scontent-hkg1-2.xx.fbcdn.net/v/t39.30808-6/453646501_505226555…",
        "startDate": "24 August 2024",
        "endDate": "20 December 2024",
        "volunteer_Quota": 5,
        "participant_Quota": 20,
        "eventType": "women",
        "videoURL": "https://www.youtube.com/watch?v=SlDJUL7lMCk",
        "status": "full",
        "location": "Singapore",
        "fee": "free"
    }

    Returns:
        dict: A dictionary containing a success message if the event data is inserted successfully.

    Raises:
        400: If there are any errors during the event creation process.

    Notes:
        - Make sure to provide the required fields in the JSON data for the new event.
    """
    try:
        new_event = request.json  # Access JSON data from the request object
        event_data.insert_one(new_event)
        return jsonify({'message': 'Event data inserted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
@app.route('/read/event', methods=['GET'])
def read_event_data():
    data = list(event_data.find({}))
    event_details = list(events_detail_collection.find({}))
    for event in data:
            event['_id'] = str(event['_id'])
        
    for detail in event_details:
        detail['_id'] = str(detail['_id'])

        # Merge the two lists
    merged_data = []
    
    for event in data:
        # Create a copy of the event to avoid mutating the original
        merged_event = event.copy()
        
        # Match with event details using eventId
        event_id = event['eventId']['$numberInt'] if isinstance(event['eventId'], dict) else event['eventId']
        detail = next((d for d in event_details if (d['eventId']['$numberInt'] if isinstance(d['eventId'], dict) else d['eventId']) == event_id), None)
        
        if detail:
            # Merge fields from detail into merged_event
            for key, value in detail.items():
                if key not in merged_event:
                    merged_event[key] = value
                else:
                    merged_event[f"{key}_detail"] = value
        
        merged_data.append(merged_event)

    return jsonify(json.loads(json_util.dumps(merged_data)))


@app.route('/healthcheck')
def healthcheck():
    return 'Server is up and running!'

@app.route('/update', methods=['PUT'])
def update_event_data():
    query = request.json.get('query', {})
    new_values = request.json.get('new_values', {})
    event_data.update_many(query, {'$set': new_values})
    return jsonify({'message': 'Data updated successfully'})

def transform_event_data_to_feedback_questions(event):
    # Transform a single event into Google Forms question format
    questions = []

    # Rating question
    questions.append({
        "createItem": {
            "item": {
                "title": (
                    f"How would you rate {event['name']} from 1 (Lowest) to 5 (Highest)?"
                ),
                "questionItem": {
                    "question": {
                        "required": True,
                        "choiceQuestion": {
                            "type": "RADIO",
                            "options": [
                                {"value": "1"},
                                {"value": "2"},
                                {"value": "3"},
                                {"value": "4"},
                                {"value": "5"}
                            ],
                            "shuffle": False,
                        },
                    }
                },
            },
            "location": {"index": 0},
        }
    })

    # Suggestions question
    questions.append({
        "createItem": {
            "item": {
                "title": "What suggestions do you have for improvement?",
                "questionItem": {
                    "question": {
                        "required": True,
                        "textQuestion": {
                            "paragraph": True
                        },
                    }
                },
            },
            "location": {"index": 1},
        }
    })

    return {"requests": questions}

def fetch_event_data(event_id):
    try:
        event = event_data.find_one({"eventId": event_id})
        if event:
            return event  # Return the event data as a dictionary
        else:
            raise ValueError("Event not found.")
    except Exception as e:
        raise ValueError(f"Error fetching event: {str(e)}")
    
def extract_date(datetime):
    start_date = datetime.fromisoformat(str(datetime)) 
    return start_date.strftime("%Y-%m-%d")

def extract_time(datetime):
    time = datetime.fromisoformat(str(datetime)) 
    return time.strftime("%H:%M:%S")

def store_event_feedback_link(feedback_url, event_id):
    try:
        event = event_data.find_one({"eventId": event_id})

        if event:
            event_data.update_one(
                {"eventId": event_id},
                {"$set": {"feedbackURL": feedback_url}}
            )
            return {"message": "Feedback URL added successfully."}, 200
        
        else:
            raise ValueError("Event not found.")
        
    except Exception as e:
        raise ValueError(f"Error fetching event: {str(e)}")

@app.route('/create/form/<int:event_id>', methods=['POST'])
def create_gform(event_id):
    SCOPES = "https://www.googleapis.com/auth/forms.body"
    DISCOVERY_DOC = "https://forms.googleapis.com/$discovery/rest?version=v1"

    store = file.Storage("token.json")
    creds = None
    if not creds or creds.invalid:
        flow = client.flow_from_clientsecrets("credentials.json", SCOPES)
        creds = tools.run_flow(flow, store)

    form_service = discovery.build(
        "forms",
        "v1",
        http=creds.authorize(Http()),
        discoveryServiceUrl=DISCOVERY_DOC,
        static_discovery=False,
    )


    try:
        event_data_for_gform = fetch_event_data(event_id) 
        event_start_time = extract_time(event_data_for_gform['startDate'])
        event_end_time = extract_time(event_data_for_gform['endDate'])
        event_date = extract_date(event_data_for_gform['startDate'])
        # Request body for creating a form
        NEW_FORM = {
            "info": {
                "title": f" Feedback form on {event_data_for_gform['name']} that is hosted on f{event_date} from {event_start_time} to {event_end_time}"
            }
        }

        # Creates the initial form
        result = form_service.forms().create(body=NEW_FORM).execute()

        # Adds the questions based on event data
        question_setting = (
            form_service.forms()
            .batchUpdate(formId=result["formId"], body=transform_event_data_to_feedback_questions(event_data_for_gform))  # Update function
            .execute()
        )

        # Prints the result to show the question has been added
        get_result = form_service.forms().get(formId=result["formId"]).execute()
        gform_url = get_result.get("responderUri")

        if gform_url:
            store_event_feedback_link(gform_url, event_id)
        return get_result
    
    except ValueError as e:
        return {"error": str(e)}, 404 
    
def get_responses_with_formId(formId): 
    SCOPES = "https://www.googleapis.com/auth/forms.responses.readonly"
    DISCOVERY_DOC = "https://forms.googleapis.com/$discovery/rest?version=v1"

    store = file.Storage("token.json")
    creds = None
    if not creds or creds.invalid:
        flow = client.flow_from_clientsecrets("credentials.json", SCOPES)
        creds = tools.run_flow(flow, store)

    form_service = discovery.build(
        "forms",
        "v1",
        http=creds.authorize(Http()),
        discoveryServiceUrl=DISCOVERY_DOC,
        static_discovery=False,
    )

    result = form_service.forms().responses().list(formId=formId).execute()
    return result

@app.route('/response/form/<formId>', methods=['GET'])
def get_responses(formID):
    data = get_responses_with_formId(formID)
    print(data)
    return {"data": data}

# write a function that gets data from event data and event details and merge them so frontend can use it 

    
if __name__ == "__main__":
    app.run(debug=True)