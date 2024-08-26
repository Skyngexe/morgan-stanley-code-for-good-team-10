from flask import Flask, request, jsonify
import os
import requests
import datetime
import pytz
from apscheduler.schedulers.background import BackgroundScheduler
from pymongo import MongoClient
from dotenv import load_dotenv
import certifi
from flask_cors import CORS  # Import CORS
from bson import ObjectId
from ai_chatbox.model.rag_model import RAGModel
from pymongo import MongoClient
from enum import Enum
from bson import json_util
import json
from googleapiclient import discovery
from httplib2 import Http
from oauth2client import client, file, tools
from gform_services import get_responses_with_formId, get_form_with_formId, get_form_and_resposes, create_registration_and_feedback_form, extract_time, extract_date
from bson.objectid import ObjectId
import datetime

model = RAGModel(data_path='./ai_chatbox/data/event.js')


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

# Load environment variables
load_dotenv()
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
scheduler = BackgroundScheduler()
scheduler.start()
HONG_KONG_TZ = pytz.timezone('Asia/Hong_Kong')


# Constants from environment variables
API_URL = os.getenv("API_URL")
ID_INSTANCE = os.getenv("ID_INSTANCE")
API_TOKEN_INSTANCE = os.getenv("API_TOKEN_INSTANCE")
MEDIA_URL = os.getenv("MEDIA_URL")
mongo_uri = os.getenv("DATABASE_URL")
client = MongoClient(mongo_uri)
try:
    client = MongoClient(mongo_uri,  tlsCAFile=certifi.where())
    db = client.get_database("codeforgood")
    print(db)
    print("Connected to MongoDB")
    collection_list = db.list_collection_names()
    print("Collections in 'codeforgood':", collection_list)
    participants_collection = db.participants
    events_collection = db.events
except Exception as e:
    print("MongoDB connection error:", e)

# Helper function to check quota fulfillment
def is_quota_fulfilled(event_id):
    event = events_collection.find_one({"_id": ObjectId(event_id)})
    if not event:
        return False
    
    required_participants = event.get("required_participants", 10)
    required_volunteers = event.get("required_volunteers", 10)
    registered_participants = len(event.get("registered_participants", []))
    registered_volunteers = len(event.get("registered_volunteers", []))

    if registered_participants >= required_participants and registered_volunteers >= required_volunteers:
        return True
    return False

def mark_feedback_sent(event_id):
    try:
        events_collection.update_one(
            {"_id": event_id},
            {"$set": {"feedback_sent": True}}
        )
        print(f"Feedback marked as sent for event {event_id}")
    except Exception as e:
        print(f"Error marking feedback as sent for event {event_id}: {e}")
    # print(f"Feedback marked as sent for event {event_id}")


#either this or just all the people who have ever attended any event as part of Zubin
def get_past_participants(category):
    try:
        print(list(participants_collection.find({"category": category})))
        return list(participants_collection.find({"category": category}))
    except Exception as e:
        print(f"Error retrieving past participants for category {category}: {e}")
        return []    
    # return [{"phone_number": "85291420560@c.us"}]

# Convert timedelta to a more readable format
def format_timedelta(delta):
    days = delta.days
    seconds = delta.seconds
    hours = seconds // 3600
    minutes = (seconds // 60) % 60

    if days > 0:
        return f"{days} days"
    elif hours > 0:
        return f"{hours} hours"
    elif minutes > 0:
        return f"{minutes} minutes"
    else:
        return "a few moments"



def get_event_details(event_id):
    
    try:
        event = events_collection.find_one({"_id": ObjectId(event_id)})
        if event:
            # Return the event details
            return event
        else:
            print(f"No event found with ID {event_id}")
            return {}
    except Exception as e:
        print(f"Error retrieving event details for event {event_id}: {e}")
        return {}

#when its time for the reminders, get the registered people and send the reminder
def get_registered_participants(event_id):
    try:
        event = events_collection.find_one({"_id": ObjectId(event_id)})
        if event:
            # Return the event details
            registered_participants = event.get("registered_participants", [])
            return registered_participants  
    except Exception as e:
        print(f"Error retrieving registered participants for event {event_id}: {e}")
        return []
    # return [{"phone_number": "85291420560@c.us"}]


#List of contacts for everyone who attended the event and send a thank you message with the feedback link
def get_attended_participants(event_id):
    try:
        event = events_collection.find_one({"_id": ObjectId(event_id)})
        if event:
            # Return the event details
            attended_participants = event.get("attended_participants", [])
            return attended_participants  
    except Exception as e:
        print(f"Error retrieving registered participants for event {event_id}: {e}")
        return []
    # return [{"phone_number": "85291420560@c.us"}]


def send_whatsapp_message(chat_id, message, image_url=None, file_name=None, file_path=None):
    try:
        if image_url:
            url = f"{API_URL}/waInstance{ID_INSTANCE}/sendFileByUrl/{API_TOKEN_INSTANCE}"
            payload = {"chatId": chat_id, "urlFile": image_url, "fileName": "file.png", "caption": message}
            headers = {"Content-Type": "application/json"}
            response = requests.post(url, headers=headers, json=payload)
        elif file_path:
            url = f"{MEDIA_URL}/waInstance{ID_INSTANCE}/sendFileByUpload/{API_TOKEN_INSTANCE}"
            payload = {"chatId": chat_id, "caption": message}
            files = [('file', (os.path.basename(file_path), open(file_path, 'rb'), 'image/jpeg'))]
            response = requests.post(url, data=payload, files=files)
        else:
            url = f"{API_URL}/waInstance{ID_INSTANCE}/sendMessage/{API_TOKEN_INSTANCE}"
            payload = {"chatId": chat_id, "message": message}
            headers = {"Content-Type": "application/json", "Authorization": f"Bearer {API_TOKEN_INSTANCE}"}
            response = requests.post(url, json=payload, headers=headers)

        response.raise_for_status()
        return response.text.encode('utf8')
    except requests.exceptions.RequestException as e:
        print(f"Error sending message: {e}")



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


# Check quotas and send promotional messages if needed
def check_and_send_promotional_messages(event_id, message):
    if not is_quota_fulfilled(event_id):
        event_details = get_event_details(event_id)
        if not event_details:
            return

        remaining_categories = ["category1", "category2", "category3"]  # Adjust as needed
        for category in remaining_categories:
            participants = get_past_participants(category)
            for participant in participants:
                send_whatsapp_message(participant["phone_number"], message, event_details.get('image_url', "https://avatars.mds.yandex.net/get-pdb/477388/77f64197-87d2-42cf-9305-14f49c65f1da/s375"),
            event_details.get('file_name', None),
            event_details.get('file_path', None))
        
        print(f"Sent promotional messages for event {event_id} to remaining categories.")
    else:
        print(f"Quotas fulfilled for event {event_id}. No additional promotional messages needed.")



@app.route('/send-promotional-message', methods=['POST'])
def send_promotional_message():
    data = request.get_json()
    event_id = data.get('eventId')
    event_details = get_event_details(event_id)
    # event_date = event_details.get('date_time')  # Assuming this is a datetime object
    event_date = datetime.datetime.now()
    if event_date is not None:
    # If `event_date` is timezone naive, make it timezone-aware
        if event_date.tzinfo is None:
            event_date = HONG_KONG_TZ.localize(event_date)
# Correct the assignment of two_weeks_before
    two_weeks_before = event_date + datetime.timedelta(minutes=2)
    # Calculate time 2 weeks before the event date



    participants = get_past_participants(event_details.get('category'))  # Adjust category as needed
    for participant in participants:
        participant_name = participant.get("name", "Participant")
        message = (
    f"Hello {participant_name}! \U0001F44B\n\n"
    f"\U0001F389 *New Event Alert!* \U0001F389\n\n"
    f"We are thrilled to invite you to our upcoming event: *{event_details.get('name')}*\n\n"
    f"\U0001F4DD*Event Description:*\n"
    f"{event_details.get('description')}\n\n"
    f"\U0001F4C5 *Date:* {event_details.get('date_time')}\n"
    f"\U0001F3F7 *Category:* {event_details.get('category')}\n"
    f"\U0001F4CD *Location:* {event_details.get('location')}\n\n"
    f"To register, please click the link below:\n"
    f"[Register Here](www.google.com)\n\n"
    f"We're excited to see you there and make this event even more special! \U0001F31F\n\n"
    f"Feel free to share this with friends and help us spread the word! \U0001F4E3\U0001F30D\n\n"
    f"Best Regards,\n"
    f"*Zubin Foundation* "
)

        send_whatsapp_message(
            participant["phone_number"],
            message,
            event_details.get('image_url', "https://avatars.mds.yandex.net/get-pdb/477388/77f64197-87d2-42cf-9305-14f49c65f1da/s375"),
            event_details.get('file_name', None),
            event_details.get('file_path', None)
        )
    
    # if datetime.datetime.now(HONG_KONG_TZ) > two_weeks_before:
    #     print(f"Two weeks before the event date for event {event_id} has already passed.")
    #     return

    # Schedule the quota check job
    scheduler.add_job(
        check_and_send_promotional_messages,
        'date',
        run_date=two_weeks_before,
        args=[event_id, message]
    )
    print(f"Scheduled promotional message check for event {event_id} on {two_weeks_before}.")

    return jsonify({"status": "Promotional messages sent"}), 200

@app.route('/schedule-reminders', methods=['POST'])
def schedule_reminders():
    data = request.get_json()
    event_id = data.get('eventId')
    reminder_times = ["7 days", "3 days", "1 day", "3 hours", "2 minutes"]
    event = get_event_details(event_id)
    print(f"Received data: {data}")  # Debugging print for received data

    
    participants = get_registered_participants(event_id)
    print(participants)

    now = datetime.datetime.now(HONG_KONG_TZ)
    print(now)

    for participant_name in participants:
        participant = participants_collection.find_one({"name": participant_name})
        if not participant:
            print(f"Participant {participant_name} not found.")
            continue
        for time_str in reminder_times:
            # Calculate delta
            if 'day' in time_str:
                delta = datetime.timedelta(days=int(time_str.split()[0]))
                print("DELTA", delta)
            elif 'hour' in time_str:
                delta = datetime.timedelta(hours=int(time_str.split()[0]))
            elif 'minute' in time_str:
                delta = datetime.timedelta(minutes=int(time_str.split()[0]))
            else:
                delta = None

            # Calculate reminder time
            # reminder_time = event["date_time"] - delta
            reminder_time = now+datetime.timedelta(minutes=3) - delta

            
            reminder_time = HONG_KONG_TZ.localize(reminder_time) if reminder_time.tzinfo is None else reminder_time
            print("REMINDER TIME: ", reminder_time)
            formatted_delta = format_timedelta(delta)

            reminder_message = (
    f"\U0001F6A8 REMINDER!!!!! \U0001F6A8\n\n"
    f"Hello {participant.get('name', 'Participant')}! \U0001F44B\n\n"
    f"\U0001F4C5 *Event Starting Soon!* \U0001F4C5\n\n"
    f"\U000026A0 *Only {formatted_delta} left!* \U000026A0\n\n"
    f"Our event, *{event.get('name')}*, is starting in just {formatted_delta}! \U000023F3\n\n"
    f"\U0001F4DD *Event Details:*\n"
    f"- *Description:* {event.get('description')}\n"
    f"- *Date & Time:* {event.get('date_time')}\n"
    f"- *Category:* {event.get('category')}\n"
    f"- *Location:* {event.get('location')}\n\n"
    f"Please get ready to join us soon! \U0001F389\n\n"
    f"We're excited to see you there! \U0001F31F\n\n"
    f"Warm Regards,\n"
    f"*Zubin Foundation Team* \U0001F31F"
)



            
            if reminder_time > now:
                # Check if the reminder time is for 2 minutes
                if delta == datetime.timedelta(minutes=2):
                    # Schedule the send location job
                    scheduler.add_job(
    send_location_message,
    'date',
    run_date=reminder_time,
    kwargs={
        "event_id": event_id,
        "latitude": event.get('latitude', 22.429999423293598),
        "longitude": event.get('longitude', 114.20863803595589),
        "address": event.get('location'),
        "name_location": event.get('location'),
        "chat_id": participant["phone_number"]
    }
)

                print("Scheduled location message for 2 minutes reminder.")
                
                    # Schedule the regular reminder message
                scheduler.add_job(
                        send_whatsapp_message,
                        'date',
                        run_date=reminder_time,
                        args=[participant["phone_number"], reminder_message, event.get('image_url', "https://avatars.mds.yandex.net/get-pdb/477388/77f64197-87d2-42cf-9305-14f49c65f1da/s375")]
                    )
                print(f"Scheduled reminder for event '{event['name']}'")
                print(f"Reminder Time: {reminder_time}")
            else:
                print(f"Reminder time {reminder_time} is in the past or now, not scheduling.")
            

    return jsonify({"status": "Reminders scheduled"}), 200

def send_location_message(event_id, latitude, longitude, address, name_location, chat_id):
    # Validate required parameters
    # if not all([latitude, longitude, name_location, chat_id]):
    #     print({"error": "latitude, longitude, nameLocation, and chatId are required"})
    #     return

    # Create payload
    payload = {
        "chatId": chat_id,
        "nameLocation": name_location,
        "address": address,
        "latitude": latitude,
        "longitude": longitude
    }

    url = f"{API_URL}/waInstance{ID_INSTANCE}/sendLocation/{API_TOKEN_INSTANCE}"
    response = requests.post(url, json=payload, headers={"Content-Type": "application/json"})

    if response.status_code != 200:
        print(f"Failed to send location message to {chat_id}. Status code: {response.status_code}")

    print({"status": "Location messages sent"})

@app.route('/send-location-message', methods=['POST'])
def send_location_message_route():
    data = request.get_json()
    event_id = data["event_id"]
    latitude = data.get("latitude", 114.20863803595589 )
    longitude = data.get("longitude", 22.429999423293598)
    address = data.get("address")
    name_location = data.get("address")
    chat_id = data.get("chatId")

    # Validate required parameters
    if not all([latitude, longitude, name_location, chat_id]):
        return jsonify({"error": "latitude, longitude, nameLocation, and chatId are required"}), 400

    # Call the function that handles sending the location message
    send_location_message(event_id, latitude, longitude, address, name_location, chat_id)

    return jsonify({"status": "Location messages sent"}), 200


@app.route('/send-thank-you-message', methods=['POST'])
def send_thank_you_message():
    # Get event details from the request
    data = request.get_json()
    event_id = data.get('eventId')
    print(event_id)

    if not event_id:
        return jsonify({"error": "Event ID is required"}), 400

    # Retrieve the event details
    event = get_event_details(event_id)

    if not event:
        return jsonify({"error": "Event not found"}), 404

    event_name = event.get("name", "the event")
    feedback_form_url = event.get("feedback_form_url", "#")

    # Retrieve participants who attended the event
    participants = get_attended_participants(event_id)

    if not participants:
        return jsonify({"status": "No participants found for this event"}), 200

    # Get the current time
    now = datetime.datetime.now(HONG_KONG_TZ)

    # Schedule thank you messages
    for participant_name in participants:
        participant = participants_collection.find_one({"name": participant_name})
        if not participant:
            print(f"Participant {participant_name} not found.")
            continue
        message = (
    f"\U0001F389 Hello {participant_name}! \U0001F389\n\n"
    f"Thank you so much for joining us at *{event_name}*! \U0001F44F We hope you had a fantastic time. \U0001F64C\n\n"
    f"\U0001F4DD *We value your feedback!* Could you please take a moment to share your experience with us? Your thoughts help us improve and create even better events in the future. \U0001F913\n\n"
    f"Click the link below to complete a quick feedback form:\n"
    f"{feedback_form_url}\n\n"
    f"\U0001F64F *Thank you for your time and input!* We truly appreciate it.\n\n"
    f"Best Regards,\n"
    f"*Zubin Foundation Team* \U0001F31F"
)

        
        scheduler.add_job(
            send_whatsapp_message,
            'date',
            run_date=now + datetime.timedelta(minutes=1),  # Schedule the message 10 minutes after event completion
            args=[
                participant["phone_number"],
                message,
                None,
                None,
                None
            ]
        )

    # Mark feedback as sent for the event
    mark_feedback_sent(event_id)

    return jsonify({"status": "Thank you messages scheduled for all participants"}), 200


@app.route('/cancel-event', methods=['POST'])
def cancel_event():
    data = request.get_json()
    event_id = data.get('eventId')

    if not event_id:
        return jsonify({"error": "Event ID is required"}), 400

    # Retrieve the event details
    event = get_event_details(event_id)

    if not event:
        return jsonify({"error": "Event not found"}), 404

    try:
        # Update the event status to canceled
        events_collection.update_one(
            {"_id": ObjectId(event_id)},
            {"$set": {"status": "canceled"}}
        )
        print(f"Event {event_id} canceled successfully")

        # Optionally, notify registered participants about the cancellation
        participants = get_registered_participants(event_id)
        for participant_name in participants:
            participant = participants_collection.find_one({"name": participant_name})
            if not participant:
                print(f"Participant {participant_name} not found.")            
            message = (
                f"\U0001F6D1 *Important Notice!* \U0001F6D1\n\n"
                f"Hello {participant.get('name', 'Participant')}! \U0001F44B\n\n"
                f"Unfortunately, the event *{event.get('name')}* scheduled for {event.get('date_time')} has been canceled. \U0001F622\n\n"
                f"We apologize for any inconvenience this may cause.\n\n"
                f"Thank you for your understanding.\n\n"
                f"Best Regards,\n"
                f"*Zubin Foundation Team* \U0001F31F"
            )
            send_whatsapp_message(
            participant["phone_number"],
            message,
            event.get('image_url', "https://avatars.mds.yandex.net/get-pdb/477388/77f64197-87d2-42cf-9305-14f49c65f1da/s375"),
            event.get('file_name', None),
            event.get('file_path', None)
        )
        return jsonify({"status": "Event canceled and participants notified"}), 200

    except Exception as e:
        print(f"Error canceling event {event_id}: {e}")
        return jsonify({"error": "An error occurred while canceling the event"}), 500

# Healthcheck API Route
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


# 5. Create Event
@app.route('/create/event', methods=['POST'])
def create_new_event_and_form():
    try:
        new_event = request.json  # Access JSON data from the request object
        new_event["startDate"]= datetime.datetime.strptime(new_event["startDate"], "%Y-%m-%dT%H:%M") 
        new_event["endDate"]= datetime.datetime.strptime(new_event["endDate"], "%Y-%m-%dT%H:%M") 
        forms = create_registration_and_feedback_form(new_event)
        new_event['form_Id'] = forms["form_Id"]
        new_event['registrationURL'] = forms["registrationURL"]
        new_event['feedback_form_Id'] = forms["feedback_form_Id"]
        new_event['feedbackURL'] = forms["feedbackURL"]

        event_details.insert_one(new_event)
        result = event_data.insert_one(new_event)
        
        event_id = result.inserted_id
        latitude = 114.20863803595589
        longitude = 22.429999423293598
        address = new_event.get("location")
        name_location = new_event.get("location")
        chat_id = "85362831088@c.us"
        send_location_message(event_id, latitude, longitude, address, name_location, chat_id)
        
        return jsonify({'message': 'Event data inserted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# 6. Return All Events Details
@app.route('/eventdetails', methods=['GET'])
def get_all_event_details():
    events = list(events_detail_collection.find({}, {'_id': 0})) 
    return jsonify(events)


# 7. Update Single Event Information with Event ID
@app.route('/update/event/<event_id>', methods=['PUT'])
def update_event_with_id(event_id):
    update_data = request.json
    update_data["startDate"]= datetime.datetime.strptime(update_data["startDate"], "%Y-%m-%dT%H:%M") 
    update_data["endDate"]= datetime.datetime.strptime(update_data["endDate"], "%Y-%m-%dT%H:%M") 
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




















































