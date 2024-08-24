from flask import Flask, request, jsonify
import os
import requests
import datetime
import pytz
from apscheduler.schedulers.background import BackgroundScheduler
from pymongo import MongoClient
from dotenv import load_dotenv
import certifi


# Load environment variables
load_dotenv()
app = Flask(__name__)
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


#either this or just all the people who have ever attended any event as part of zubnin
def get_past_participants(category):
    try:
        print(list(participants_collection.find({"category": category})))
        return list(participants_collection.find({"category": category}))
    except Exception as e:
        print(f"Error retrieving past participants for category {category}: {e}")
        return []    
    # return [{"phone_number": "85291420560@c.us"}]



def get_event_details(event_id):
    try:
        event = events_collection.find_one({"_id": event_id})
        if event:
            naive_datetime = event['date_time']
            aware_datetime = HONG_KONG_TZ.localize(naive_datetime)
            return {
                "date_time": aware_datetime,
                "name": event.get("name", "Unknown Event")
            }
        else:
            print(f"No event found with ID {event_id}")
            return {}
    except Exception as e:
        print(f"Error retrieving event details for event {event_id}: {e}")
        return {}    # naive_datetime = datetime.datetime.strptime("2024-08-24 10:09:00", "%Y-%m-%d %H:%M:%S")
    # aware_datetime = HONG_KONG_TZ.localize(naive_datetime)  # Convert naive datetime to timezone-aware datetime
    
    # return {
    #     "date_time": aware_datetime,
    #     "name": "Sample Event"
    # }

#when its time for the reminders, get the registered people and send the reminder
def get_registered_participants(event_id):
    try:
        return list(participants_collection.find({"registered_events": event_id}))
    except Exception as e:
        print(f"Error retrieving registered participants for event {event_id}: {e}")
        return []
    # return [{"phone_number": "85291420560@c.us"}]


#List of contacts for everyone who attended the event and send a thank you message with the feedback link
def get_attended_participants(event_id):
    try:
        return list(participants_collection.find({"attended_events": event_id}))
    except Exception as e:
        print(f"Error retrieving attended participants for event {event_id}: {e}")
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

@app.route('/send-promotional-message', methods=['POST'])
def send_promotional_message():
    data = request.get_json()
    chat_id = data.get("chatId")
    image_url = data.get("urlFile")
    file_name = data.get("fileName")
    caption = data.get("caption")
    file_path = data.get("filePath")
    category = data.get("category")

    if not chat_id or not caption:
        return jsonify({"error": "chatId and caption are required"}), 400

    participants = get_past_participants(category)  # Adjust category as needed
    for participant in participants:
        send_whatsapp_message(
            participant["phone_number"],
            caption,
            image_url=image_url,
            file_name=file_name,
            file_path=file_path
        )
    return jsonify({"status": "Promotional messages sent"}), 200

@app.route('/schedule-reminders', methods=['POST'])
def schedule_reminders():
    data = request.get_json()
    event_id = data["event_id"]
    reminder_times = data["reminder_times"]
    message_template = data["message_template"]
    image_url = data.get("image_url")

    event = get_event_details(event_id)
    participants = get_registered_participants(event_id)

    now = datetime.datetime.now(HONG_KONG_TZ)

    for participant in participants:
        for time_str in reminder_times:
            # Calculate delta
            if 'day' in time_str:
                delta = datetime.timedelta(days=int(time_str.split()[0]))
            elif 'hour' in time_str:
                delta = datetime.timedelta(hours=int(time_str.split()[0]))
            elif 'minute' in time_str:
                delta = datetime.timedelta(minutes=int(time_str.split()[0]))
            else:
                delta = None

            # Calculate reminder time
            reminder_time = event["date_time"] - delta
            reminder_time = HONG_KONG_TZ.localize(reminder_time) if reminder_time.tzinfo is None else reminder_time



            if reminder_time > now:
                scheduler.add_job(
                    send_whatsapp_message,
                    'date',
                    run_date=reminder_time,
                    args=[participant["phone_number"], message_template.format(event_name=event["name"], time=time_str), image_url, None, None]
                )

                # Print reminder details
                print(f"Scheduled reminder for event '{event['name']}'")
                print(f"Participant: {participant['phone_number']}")
                print(f"Reminder Time: {reminder_time}")
                print(f"Message: {message_template.format(event_name=event['name'], time=time_str)}")
                print(f"Image URL: {image_url}")
                print("-" * 40)

            else:
                print(f"Reminder time {reminder_time} is in the past or now, not scheduling.")

    return jsonify({"status": "Reminders scheduled"}), 200

@app.route('/send-location-message', methods=['POST'])
def send_location_message():
    data = request.get_json()
    event_id = data["event_id"]
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    address = data.get("address")
    name_location = data.get("nameLocation")
    chat_id = data.get("chatId")

    if not all([latitude, longitude, name_location, chat_id]):
        return jsonify({"error": "latitude, longitude, nameLocation, and chatId are required"}), 400

    event = get_event_details(event_id)
    location_time = event["date_time"] - datetime.timedelta(minutes=2)
    if location_time <= datetime.datetime.now(pytz.utc):
        return jsonify({"error": "Scheduled time for sending location is in the past"}), 400

    participants = get_registered_participants(event_id)
    for participant in participants:
        payload = {"chatId": participant["phone_number"], "nameLocation": name_location, "address": address, "latitude": latitude, "longitude": longitude}
        url = f"{API_URL}/waInstance{ID_INSTANCE}/sendLocation/{API_TOKEN_INSTANCE}"
        response = requests.post(url, json=payload, headers={"Content-Type": "application/json"})
        if response.status_code != 200:
            print(f"Failed to send location message. Status code: {response.status_code}")

    return jsonify({"status": "Location messages sent"}), 200

@app.route('/send-thank-you-message', methods=['POST'])
def send_thank_you_message():
    # Get event details from the request
    data = request.get_json()
    event_id = data.get("event_id")

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
    for participant in participants:
        participant_name = participant.get("name", "Participant")
        message = (
            f"Hi {participant_name},\n\n"
            f"Thank you for attending our {event_name}. We hope you enjoyed it. Your feedback is crucial to us. "
            f"Could you please take a moment to share your thoughts by clicking on the following link: {feedback_form_url}? "
            f"Your input means a lot. Thank you!"
        )
        
        scheduler.add_job(
            send_whatsapp_message,
            'date',
            run_date=now + datetime.timedelta(minutes=10),  # Schedule the message 10 minutes after event completion
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



# Healthcheck API Route
@app.route('/healthcheck')
def healthcheck():
    return 'Server is up and running!'



if __name__ == "__main__":
    app.run(debug=True)

