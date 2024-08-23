import google.auth
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import pandas as pd

# Function to get values from Google Sheets
def get_sheet_values(sheet_id):
    gsheet_url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv"
    df = pd.read_csv(gsheet_url)
    data_dict = df.to_dict(orient='records')
    print(data_dict)
    return data_dict