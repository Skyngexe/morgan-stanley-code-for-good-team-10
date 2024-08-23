

import os
import google.auth
from googleapiclient import discovery
from oauth2client import client, file, tools

GOOGLE_API_KEY = 'AIzaSyBvNwgd8fxcRtL-hK1yPJMb6UWU5QvGVoY'
SCOPES = [
    "https://www.googleapis.com/auth/forms.body.readonly",
    "https://www.googleapis.com/auth/forms.responses.readonly",
]
email = "chanchengleong@gmail.com"
form_id = "11Keikwwn3gcC0c6-TzvHikcNj96_x_YnJrBcTUOIoVs"

def get_responses():
  credentials, _ = google.auth.default()
  # creds = credentials.with_subject(email).with_scopes(SCOPES)
  store = file.Storage("token.json")
  flow = client.flow_from_clientsecrets("client_secrets.json", SCOPES)
  creds = tools.run_flow(flow, store)
  service = discovery.build(
      serviceName='forms',
      version='v1',
      credentials=creds,
      discoveryServiceUrl=f'https://forms.googleapis.com/$discovery/rest?version=v1&key={GOOGLE_API_KEY}&labels=FORMS_BETA_TESTERS',
      num_retries=3,
  )

  result = service.forms().responses().get(formId=form_id).execute()
  print(result)
  return result

# Version 1
# from apiclient import discovery
# from httplib2 import Http
# from oauth2client import client, file, tools

# SCOPES = "https://www.googleapis.com/auth/forms.responses.readonly"
# DISCOVERY_DOC = "https://forms.googleapis.com/$discovery/rest?version=v1"

# store = file.Storage("token.json")
# creds = None
# if not creds or creds.invalid:
#   flow = client.flow_from_clientsecrets("client_secrets.json", SCOPES)
#   creds = tools.run_flow(flow, store)
#   service = discovery.build(
#     "forms",
#     "v1",
#     http=creds.authorize(Http()),
#     discoveryServiceUrl=DISCOVERY_DOC,
#     static_discovery=False,
# )

# # Prints the responses of your specified form:
# form_id = "11Keikwwn3gcC0c6-TzvHikcNj96_x_YnJrBcTUOIoVs"

# def get_responses():
#   result = service.forms().responses().list(formId=form_id).execute()
#   print(result)
#   return result