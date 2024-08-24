from flask import Flask, request, jsonify
from pymongo import MongoClient
from enum import Enum
from bson import json_util
import json
from apiclient import discovery
from httplib2 import Http
from oauth2client import client, file, tools

app = Flask(__name__)


MONGO_URI = "mongodb+srv://codeforgood2024team10:DevL8aYJXQsTm9@cluster0.acjuj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
EVENT_DB = "Event"
USER_DB = 'User'


# Connect to MongoDB
db_client = MongoClient(MONGO_URI)
event_db = db_client[EVENT_DB]
user_db = db_client[USER_DB]
event_data = event_db['Event Data']
user_data = event_db['User Data']

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
    for event in data:
        event['_id'] = str(event['_id'])  # Convert ObjectId to string
    return jsonify(json.loads(json_util.dumps(data)))


@app.route('/healthcheck')
def healthcheck():
    return 'Server is up and running!'

@app.route('/update', methods=['PUT'])
def update_event_data():
    query = request.json.get('query', {})
    new_values = request.json.get('new_values', {})
    event_data.update_many(query, {'$set': new_values})
    return jsonify({'message': 'Data updated successfully'})

def transform_event_data_to_feedback_questions():
    # Fetch events and transform them into Google Forms question format
        data = list(event_data.find({}))
        questions = []

        for event in data:
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

            questions.append({
                "createItem": {
                    "item": {
                    "title": (
                        "What suggestions do you have for improvement?"
                    ),
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

@app.route('/create/form', methods=['POST'])
def create_gform():
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

    # Request body for creating a form
    NEW_FORM = {
        "info": {
            "title": "Event feeback form",
        }
    }

    # Creates the initial form
    result = form_service.forms().create(body=NEW_FORM).execute()

    # Adds the question to the form
    question_setting = (
        form_service.forms()
        .batchUpdate(formId=result["formId"], body=transform_event_data_to_feedback_questions())
        .execute()
    )

    # Prints the result to show the question has been added
    get_result = form_service.forms().get(formId=result["formId"]).execute()
    return get_result

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

@app.route('/response/form', methods=['GET'])
def get_responses():
    data = get_responses_with_formId("1gwDQnugorvErtxgSY97hAa-EEtC7kWb6q35n5zZxvgo")
    print(data)
    return {"data": data}
    
if __name__ == "__main__":
    app.run(debug=True)