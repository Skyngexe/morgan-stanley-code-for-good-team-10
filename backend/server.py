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



if __name__ == "__main__":
    app.run(debug=True)




















































