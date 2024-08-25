from flask import Flask, request, jsonify
from pymongo import MongoClient
from enum import Enum
from bson import json_util
import json
from apiclient import discovery
from httplib2 import Http
from oauth2client import client, file, tools
from flask_cors import CORS


# Create Registration Feedback Form Questions
def registration_form_questions():
    questions = []
    questions.append({
        "createItem": {
            "item": {
            "title": (
                "Are you a volunteer or a participant?"
            ),
            "questionItem": {
                "question": {
                    "required": True,
                    "choiceQuestion": {
                        "type": "RADIO",
                        "options": [
                            {"value": "Volunteer"},
                            {"value": "Participant"}
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
                "What is your email address?"
            ),
            "questionItem": {
                "question": {
                    "required": True,
                    "textQuestion": {
                        "paragraph": False
                    },
                }
            },
        },
        "location": {"index": 1},
    }
    })
    questions.append({
        "createItem": {
            "item": {
            "title": (
                "What is your WhatsApp number?"
            ),
            "questionItem": {
                "question": {
                    "required": True,
                    "textQuestion": {
                        "paragraph": False
                    },
                }
            },
        },
        "location": {"index": 2},
    }
    })
    return {"requests": questions}

# Create Feedback Form Questions
def feedback_form_questions(event):
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

# Create Both Forms
def create_registration_and_feedback_form(new_event):
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
    
    # Registration Form
    print("Now making registration form")
    NEW_FORM = {
        "info": {
            "title": f"{new_event['name']} Registration Form",
        }
    }
    # Creates the initial form
    registration_form= form_service.forms().create(body=NEW_FORM).execute()
    # Adds the question to the form
    update_body = {
        "requests": [
            {
                "updateFormInfo": {
                    "info": {
                        "description": f"Description: {new_event['descriptions']}\nLocation: {new_event['location']}\nDate: {new_event['startDate']} - {new_event['endDate']}\nVolunteers needed: {new_event['volunteer_Quota']}\nParticipants needed: {new_event['participant_Quota']}\n Please use the email u sign up for your Zubin account"
                    },
                    "updateMask": "description"
                }
            },
        ]
    }
    # Adds the description and other settings to the form
    form_service.forms().batchUpdate(formId=registration_form["formId"], body=update_body).execute()
    form_service.forms().batchUpdate(formId=registration_form["formId"], body=registration_form_questions()).execute()
    # Prints the result to show the question has been added
    # get_result = form_service.forms().get(formId=registration_form["formId"]).execute()

    # Feedback Form
    print("Now making feedback form")
    event_start_time = extract_time(new_event['startDate'])
    event_end_time = extract_time(new_event['endDate'])
    event_date = extract_date(new_event['startDate'])
    # Request body for creating a form
    NEW_FORM = {
        "info": {
            "title": f"Feedback form on {new_event['name']} that is hosted on {event_date} from {event_start_time} to {event_end_time}"
        }
    }
    # Creates the initial form
    feedback_form = form_service.forms().create(body=NEW_FORM).execute()
    # Adds the questions based on event data
    form_service.forms().batchUpdate(formId=feedback_form["formId"], body=feedback_form_questions(new_event)).execute()  # Update function.execute()
    # Prints the result to show the question has been added
    # get_result = form_service.forms().get(formId=feedback_form["formId"]).execute()
    # gform_url = get_result.get("responderUri")
    # gform_id = get_result.get("formId")
    return {"form_Id": registration_form["formId"], "registrationURL": registration_form["responderUri"], "feedback_form_Id": feedback_form["formId"], "feedbackURL": feedback_form["responderUri"]}

def extract_date(datetime):
    start_date = datetime.fromisoformat(str(datetime)) 
    return start_date.strftime("%Y-%m-%d")

def extract_time(datetime):
    time = datetime.fromisoformat(str(datetime)) 
    return time.strftime("%H:%M:%S")


# Getting Response
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


def get_form_with_formId(formId):
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

    get_result = form_service.forms().get(formId=formId).execute()
    print(get_result)
    return get_result


def get_form_and_resposes(formId):
    SCOPES = ["https://www.googleapis.com/auth/forms.body", "https://www.googleapis.com/auth/forms.responses.readonly"]
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

    form = form_service.forms().get(formId=formId).execute()
    questions = {item['questionItem']['question']['questionId']: item['title']
                for item in form['items'] if 'questionItem' in item}
    responses = form_service.forms().responses().list(formId=formId).execute()
    print({"questions": questions, "responses": responses})
    return {"questions": questions, "responses": responses}