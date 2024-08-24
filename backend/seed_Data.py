from pymongo import MongoClient
from datetime import datetime, timezone
from bson import ObjectId
from dotenv import load_dotenv
import os
import certifi
import pytz


mongo_uri = "mongodb+srv://user1:qBgwWgYxtuFyDchn@cluster0.n3vcub6.mongodb.net/?appName=Cluster0"
try:
    client = MongoClient(mongo_uri,  tlsCAFile=certifi.where())
    db = client.get_database("codeforgood")
    print(db)
    print("Connected to MongoDB")
except Exception as e:
    print("MongoDB connection error:", e)

# List all collections in the database
collection_list = db.list_collection_names()
print("Collections in 'codeforgood':", collection_list)
# Access collections
participants_collection = db.participants
events_collection = db.events

# Insert multiple participant documents with registered and attended events
participants = [
    {
        "name": "John Doe",
        "phone_number": "85291420560@c.us",
        "email": "john.doe@example.com",
        "category": "Climate",
        "registered_events": ["community_cleanup", "tech_workshop"],
        "attended_events": ["community_cleanup"],
        "feedback_sent": True,
        "feedback_links": ["http://example.com/feedback/john_doe"]
    },
    {
        "name": "Jane Smith",
        "phone_number": "85291420560@c.us",
        "email": "jane.smith@example.com",
        "category": "Children",
        "registered_events": ["charity_run"],
        "attended_events": ["charity_run"],
        "feedback_sent": True,
        "feedback_links": ["http://example.com/feedback/jane_smith"]
    },
    {
        "name": "Alice Johnson",
        "phone_number": "85291420560@c.us",
        "email": "alice.johnson@example.com",
        "category": "Women",
        "registered_events": ["tech_workshop"],
        "attended_events": [],
        "feedback_sent": False,
        "feedback_links": []
    }
]

# Insert the participants into the collection
participants_collection.insert_many(participants)
print("Participants inserted")

# Insert multiple event documents with participants
events = [
    {
        "name": "Community Cleanup",
        "date_time": pytz.timezone('Asia/Hong_Kong').localize(datetime(2024, 9, 15, 10, 0)),
        "location": "Central Park, Hong Kong",
        "category": "Women",
        "description": "A community cleanup event to help clean up the local park.",
        "registered_participants": ["john_doe"],
        "attended_participants": ["john_doe"],
        "feedback_collected": True
    },
    {
        "name": "Charity Run",
        "date_time": pytz.timezone('Asia/Hong_Kong').localize(datetime(2024, 10, 5, 8, 30)),
        "location": "Victoria Park, Hong Kong",
        "category": "Children",
        "description": "A charity run to raise funds for local causes.",
        "registered_participants": ["jane_smith"],
        "attended_participants": ["jane_smith"],
        "feedback_collected": True
    },
    {
        "name": "Tech Workshop",
        "date_time": pytz.timezone('Asia/Hong_Kong').localize(datetime(2024, 11, 12, 14, 0)),
        "location": "Hong Kong Science Park",
        "category": "Climate",
        "description": "A workshop on the latest technologies and innovations.",
        "registered_participants": ["john_doe", "alice_johnson"],
        "attended_participants": [],
        "feedback_collected": False
    }
]

# Insert the events into the collection
events_collection.insert_many(events)
print("Events inserted")