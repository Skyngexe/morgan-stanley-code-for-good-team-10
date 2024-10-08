from ai_chatbox.model.rag_model import RAGModel

from flask import Flask, request, jsonify
from pymongo import MongoClient
from enum import Enum
from bson import json_util
import json
from googleapiclient import discovery
from httplib2 import Http
from oauth2client import client, file, tools
from flask_cors import CORS, cross_origin
from gform_services import get_responses_with_formId, get_form_with_formId, get_form_and_resposes, create_registration_and_feedback_form, extract_time, extract_date
from bson import ObjectId

model = RAGModel(data_path='./ai_chatbox/data/event.js')

app = Flask(__name__)
CORS(app, supports_credentials=True)

from datetime import datetime

MONGO_URI = "mongodb+srv://codeforgood2024team10:DevL8aYJXQsTm9@cluster0.acjuj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
EVENT_DB = "Event"
USER_DB = 'User'
FEEDBACK_DB = 'Feedback'
# Connect to MongoDB
db_client = MongoClient(MONGO_URI)
event_db = db_client[EVENT_DB]
user_db = db_client[USER_DB]
feedback_db = db_client[FEEDBACK_DB]
event_data = event_db['Event Data']
user_data = user_db['User Data']
event_details= event_db['Event Details']
# user_data = user_db['User Data']
events_detail_collection = event_db['Event Details']
feedback_collection = feedback_db['Events Feedback']


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

@app.route('/healthcheck')
def healthcheck():
    return 'Server is up and running!'


# 1. Find User
@app.route('/read/user/<id>', methods=['GET'])
def get_user_by_google_id(id):
    try:
        user = user_data.find_one({"googleId": id})
        if user:
            # Convert ObjectId to string
            user['_id'] = str(user['_id'])
            return jsonify({"message": "User found", "user": user})
        else:
            return jsonify({"message": "User not found"})
    except Exception as e:
        return jsonify({"message": str(e)})


# 2. Create User
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
    
    
# 3. Return Event
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


# 4. Return All Events
@app.route('/read/events', methods=['GET'])
def get_events():
    events = list(event_data.find()) 
    for event in events:
        event['_id'] = str(event['_id'])  
    return jsonify(events)

def create_unique_event_id():
    max_event_id = event_data.find_one(sort=[("event_id", -1)])  # Get the event with the highest event_id
    if max_event_id and max_event_id.get("event_id"):
        next_event_id = int(max_event_id.get("event_id")) + 1
    else:
        next_event_id = 1
    
    return next_event_id


# 5. Create Event
@app.route('/create/event', methods=['POST'])
def create_new_event_and_form():
    try:

        new_event = request.json  # Access JSON data from the request object
        new_event["startDate"]= datetime.strptime(new_event["startDate"], "%Y-%m-%dT%H:%M") 
        new_event["endDate"]= datetime.strptime(new_event["endDate"], "%Y-%m-%dT%H:%M") 
        forms = create_registration_and_feedback_form(new_event)
        new_event['form_Id'] = forms["form_Id"]
        new_event['registrationURL'] = forms["registrationURL"]
        new_event['feedback_form_Id'] = forms["feedback_form_Id"]
        new_event['feedbackURL'] = forms["feedbackURL"]
        new_event['eventId'] = create_unique_event_id()
        event_details.insert_one(new_event)
        print(new_event)
        event_data.insert_one(new_event)
        
        return jsonify({'message': 'Event data inserted successfully'}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# 6. Return All Events Details
@app.route('/eventdetails', methods=['GET'])
def get_event_details():
    events = list(events_detail_collection.find({}, {'_id': 0})) 
    return jsonify(events)


# 7. Update Single Event Information with Event ID
@app.route('/update/event/<event_id>', methods=['PUT'])
def update_event_with_id(event_id):
    update_data = request.json
    update_data["startDate"]= datetime.strptime(update_data["startDate"], "%Y-%m-%dT%H:%M") 
    update_data["endDate"]= datetime.strptime(update_data["endDate"], "%Y-%m-%dT%H:%M") 
    if '_id' in update_data:
        del update_data['_id']  # Remove _id from update_data to avoid modifying the immutable field
    event_object_id = ObjectId(event_id)
    result = event_data.update_one(
        {"_id": event_object_id},
        {"$set": update_data}
    )
    # Check if the update was successful
    if result.matched_count == 0:
        return jsonify({"error": "Event not found"}), 404
    if result.modified_count == 0:
        return jsonify({"message": "No changes made to the event"}), 200
    update_forms(event_object_id)
    return jsonify({"message": "Event updated successfully"}), 200
    
def update_forms(event_id):
    # Find the event in the database
    event = event_data.find_one({"_id": event_id})
    if not event:
        return {"error": "Event not found"}, 404

    # Extract form_Id and feedback_form_Id
    form_id = event.get("form_Id")
    feedback_form_Id = event.get("feedback_form_Id")

    if not form_id or not feedback_form_Id:
        return {"error": "Form IDs not found in the event data"}, 400
    
    # Initialize the Google Forms API service
    API_SCOPES = "https://www.googleapis.com/auth/forms.body"
    DISCOVERY_DOC = "https://forms.googleapis.com/$discovery/rest?version=v1"
    store = file.Storage("token.json")
    creds = None
    if not creds or creds.invalid:
        flow = client.flow_from_clientsecrets("credentials.json", API_SCOPES)
        creds = tools.run_flow(flow, store)
    form_service = discovery.build(
        "forms",
        "v1",
        http=creds.authorize(Http()),
        discoveryServiceUrl=DISCOVERY_DOC,
        static_discovery=False,
    )

    registration_update_body = {
        "requests": [
            {
                "updateFormInfo": {
                    "info": {
                        "title": f"{event['name']} Registration Form",
                        "description": f"Description: {event['descriptions']}\nLocation: {event['location']}\nDate: {event['startDate']} - {event['endDate']}\nVolunteers needed: {event['volunteer_Quota']}\nParticipants needed: {event['participant_Quota']}\n Please use the email you signed up with for your Zubin account"
                    },
                    "updateMask": "title,description"
                }
            },
        ]
    }
    form_service.forms().batchUpdate(formId=form_id, body=registration_update_body).execute()

    event_start_time = extract_time(event['startDate'])
    event_end_time = extract_time(event['endDate'])
    event_date = extract_date(event['startDate'])
    feedback_update_body = {
        "requests": [
            {
                "updateFormInfo": {
                    "info": {
                        "title": f"Feedback form on {event['name']} that is hosted on {event_date} from {event_start_time} to {event_end_time}"
                    },
                    "updateMask": "title"
                }
            },
        ]
    }
    form_service.forms().batchUpdate(formId=feedback_form_Id, body=feedback_update_body).execute()

    return {"message": "Forms updated successfully"}, 200
    

# 8. Delete Single Event with Event ID
@app.route('/delete/event/<event_id>', methods=['DELETE'])
def delete_event_with_id(event_id):
    try:
        event_object_id = ObjectId(event_id)
        result = event_data.delete_one({"_id": event_object_id})
        # Check if the delete was successful
        if result.deleted_count == 0:
            return jsonify({"error": "Event not found"}), 404
        return jsonify({"message": "Event deleted successfully"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
# 9. Update Multiple Events with custom Query
@app.route('/update/events', methods=['PUT'])
def update_event_data():
    query = request.json.get('query', {})
    new_values = request.json.get('new_values', {})
    event_data.update_many(query, {'$set': new_values})
    return jsonify({'message': 'Data updated successfully'})

def fetch_event_data(event_id):
    try:
        event = event_data.find_one({"eventId": event_id})
        if event:
            return event  # Return the event data as a dictionary
        else:
            raise ValueError("Event not found.")
    except Exception as e:
        raise ValueError(f"Error fetching event: {str(e)}")

def fetch_event_data_with_formId(formId):
    try:
        event = event_data.find_one({"form_Id": formId})
        if event:
            return event  # Return the event data as a dictionary
        else:
            raise ValueError("Event not found.")
    except Exception as e:
        raise ValueError(f"Error fetching event: {str(e)}")
    
def store_event_feedback_link(feedback_url, event_id, gform_id):
    try:
        event = event_data.find_one({"eventId": event_id})

        if event:
           if event:
            event_data.update_one(
                {"eventId": event_id},
                {
                    "$set": {
                        "feedbackURL": feedback_url,
                        "feedback_form_Id": gform_id
                    }
                }
            )
            return {"message": "Feedback URL added successfully."}, 200
        
        else:
            raise ValueError("Event not found.")
        
    except Exception as e:
        raise ValueError(f"Error fetching event: {str(e)}")

# # 10. Create Feedback Google Form with Event ID
# @app.route('/create/form/<int:event_id>', methods=['POST'])
# def create_feedback_form(event_id):
#     SCOPES = "https://www.googleapis.com/auth/forms.body"
#     DISCOVERY_DOC = "https://forms.googleapis.com/$discovery/rest?version=v1"

#     store = file.Storage("token.json")
#     creds = None
#     if not creds or creds.invalid:
#         flow = client.flow_from_clientsecrets("credentials.json", SCOPES)
#         creds = tools.run_flow(flow, store)

#     form_service = discovery.build(
#         "forms",
#         "v1",
#         http=creds.authorize(Http()),
#         discoveryServiceUrl=DISCOVERY_DOC,
#         static_discovery=False,
#     )

#     try:
#         event_data_for_gform = fetch_event_data(event_id)
#         event_start_time = extract_time(event_data_for_gform['startDate'])
#         event_end_time = extract_time(event_data_for_gform['endDate'])
#         event_date = extract_date(event_data_for_gform['startDate'])
#         # Request body for creating a form
#         NEW_FORM = {
#             "info": {
#                 "title": f" Feedback form on {event_data_for_gform['name']} that is hosted on f{event_date} from {event_start_time} to {event_end_time}"
#             }
#         }

#         # Creates the initial form
#         result = form_service.forms().create(body=NEW_FORM).execute()

#         # Adds the questions based on event data
#         question_setting = (
#             form_service.forms()
#             .batchUpdate(formId=result["formId"], body=transform_event_data_to_feedback_questions(event_data_for_gform))  # Update function
#             .execute()
#         )

#         # Prints the result to show the question has been added
#         get_result = form_service.forms().get(formId=result["formId"]).execute()
#         gform_url = get_result.get("responderUri")
#         gform_id = get_result.get("formId")

#         if gform_url:
#             store_event_feedback_link(gform_url, event_id, gform_id)
#         return get_result
    
#     except ValueError as e:
#         return {"error": str(e)}, 404 


# 10. Return Google Form with Form ID
@app.route('/form/<formId>', methods=['GET'])
def get_form(formId):
    data = get_form_with_formId(formId)
    print(data)
    return {"data": data}


# 11. Return Google Form Responses with Form ID
@app.route('/form/response/<formId>', methods=['GET'])
def get_responses(formId):
    data = get_responses_with_formId(formId)
    print(data)
    return {"data": data}


# 12. Return Questions and Responses of a Google Form with Form ID
@app.route('/form/question_and_responses/<formId>', methods=['GET'])
def get_form_item(formId):
    data = get_form_and_resposes(formId)
    return data

# 13. Save Feedbacks from Google Form and Return Feedbacks with Form ID
@app.route('/feedback/<formId>', methods=['GET'])
def get_gform_feedback(formId):
    save_feedback(formId)
    feedback = list(feedback_collection.find({'form_Id': formId}))
    for item in feedback:
        item['_id'] = str(item['_id'])
    return jsonify(feedback)
    

'''
@app.route('/image/<image_id>', methods=['GET'])
def get_image(image_id):
    try:
        gfs_file = gfs_photo.get(image_id)
        return gfs_file.read(), 200, {
            'Content-Type': gfs_file.content_type,
            'Content-Disposition': f'attachment; filename={gfs_file.filename}'
        }
    except Exception as e:
        return jsonify({'error': str(e)}), 404
'''
# save feedback from gform based on formId to Feedback.Event Feedback
def save_feedback(formId):
    event = get_form_and_resposes(formId)
    
    if not event:
        return {"message": "Event with the specified form_Id not found."}, 404

    try:
        for response in event.get('responses', {}).get('responses', []):
            responseId = response.get('responseId')
            
            feedback = None
            rating = None

            for question_id, answer_data in response.get('answers', {}).items():
                value = answer_data.get('textAnswers', {}).get('answers', [{}])[0].get('value', '')

                if value.isdigit():
                    if int(value) in [1, 2, 3, 4, 5]:
                        rating = value
                else:
                    feedback = value

            
            #existing_feedback = feedback_collection.find_one({'responseId': responseId})
            exiting_event = feedback_collection.find_one({'form_Id': formId})
            event_data_collection = event_data.find_one({'feedback_form_Id': formId})
            
            name = event_data_collection['name']
            eventId = event_data_collection['eventId']
            location = event_data_collection['location']
            startDate = event_data_collection['startDate']
            endDate = event_data_collection['endDate']
            event_type = event_data_collection['eventType']

            if exiting_event:
                if responseId not in exiting_event['responseId']:
                    feedback_collection.update_one(
                        {'form_Id': formId},
                        {'$push': {'responseId': responseId, 'feedback': feedback, 'rating': rating}}
                    )
            else:
                new_document = {
                    'name': name,
                    'eventId': eventId,
                    'location': location,
                    'startDate': startDate,
                    'endDate': endDate,
                    'event_type': event_type,
                    'responseId': [responseId],
                    'form_Id': formId,
                    'feedback': [feedback] if feedback else [],
                    'rating': [rating] if rating else []
                }
                feedback_collection.insert_one(new_document)

        return {"message": "Feedback saved successfully"}

    except Exception as e:
        return {"error": str(e)}, 500


# 14. Save All Registration Form Responses to Event and User Table
@app.route('/form/response/regform', methods=['GET'])
def save_geresponses():
    events = event_data.find({})
    for event in events:
        formId = event.get('form_Id')
        if formId:
            data = get_responses_with_formId(formId)
            print(data)
            save_registration_responses(data, formId)
    return {"message": "all registration info saved"}

# function to save registration reponses (phone number & email) into the event_data based on formId and role 
def save_registration_responses(data, formId):
    event = fetch_event_data_with_formId(formId)
    try:
        responses = data.get('responses')
        if responses:
            for response in data['responses']:
                email = None
                role = None
                phone_number = None

                for question_id, answer_data in response['answers'].items():
                    value = answer_data['textAnswers']['answers'][0]['value']
                    if "@" in value:
                        email = value
                    elif value.isdigit():
                        phone_number = value
                    else:
                        role = value

                if event:
                    register = None
                    if role == 'Volunteer':
                        register = "registered_volunteer"
                    else:
                        register = "registered_participants"

                    existing_event = event_data.find_one({'form_Id': formId})
                    user = user_data.find_one({
                                '$or': [
                                    {'email': email},
                                    {'phone': phone_number}
                                ]
                            })
                    
                    if user:
                        if existing_event:
                            updateUserDataWithRegisteredEvent(existing_event, user)
                            updateEventRegisteredDetails(register, formId, email, phone_number)
                        else:
                            return {"message": "Event with the specified form_Id not found."}, 404
                    else:
                        if existing_event:
                            updateEventRegisteredDetails(register, formId, email, phone_number)
                        else:
                            return {"message": "Event with the specified form_Id not found."}, 404

        return {"message": "Feedback URL added successfully."}, 200
    
    except ValueError as e:
        return {"error": str(e)}, 404 

def updateUserDataWithRegisteredEvent(existing_event, user):
    event_id = existing_event['eventId']
    event_name = existing_event['name']
    google_id = user['googleId']
    if 'registered_events' not in user or event_id not in [event[0] for event in user['registered_events']]:
        registered_events_count = len(set([event[0] for event in user.get('registered_events', [])]))
        update_query = {
            '$push': {
                'registered_events': [event_id, event_name]
            },
            '$set': {
                'points': registered_events_count
            }
        }
        user_data.update_one(
            {'googleId': google_id},
            update_query
        )

def serialize_user(user):
    # Convert ObjectId to string for serialization
    user['_id'] = str(user['_id'])
    return user

def reloadLeaderBoard():
    all_users = list(user_data.find({}))
    for user in all_users:
        registered_events_count = len(set([event[0] for event in user.get('registered_events', []) if isinstance(event, (list, tuple))]))
        user_data.update_one(
            {'_id': user['_id']},
            {'$set': {'points': registered_events_count}}
        )
        
    serialized_users = [serialize_user(user) for user in all_users]
    return json.dumps(serialized_users, default=str)


# 15. Return Leaderboard 
@app.route('/leaderboard', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_leaderboard():
    leaderboard_data = reloadLeaderBoard()
    return jsonify(json.loads(leaderboard_data))


def checkIfAlreadyRegisteredEvent(register, formId, email, phone_number):
    check = event_data.find_one({
                            "form_Id": formId,
                            register: {
                                "$elemMatch": {
                                    "email": email,
                                    "phone_number": phone_number
                                }
                            }

                        })
    return check  

def updateEventRegisteredDetails(register, formId, email, phone_number):
    existing_combination = checkIfAlreadyRegisteredEvent(register, formId, email, phone_number)

    if not existing_combination:
        event_data.update_one(
            {"form_Id": formId},
            {
                "$push": {
                    register: {
                        "email": email,
                        "phone_number": phone_number
                    },
                    "$set": {
                        "num_of_f" + register: {"$size": "$register"}
                    }   
                }
            }
        )

# API Route for AI Chatbot
@app.route('/chatbot', methods=['POST'])
def get_model_answer():
    data = request.json
    question = data.get('question')
    answer = model.answer_question(question)
    print(answer)
    return {"answer": answer}

if __name__ == "__main__":
    app.run(debug=True)