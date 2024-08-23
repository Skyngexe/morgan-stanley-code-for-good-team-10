import google.auth
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import pandas as pd

sheet_id = '1ZkvjH4i6U8h2iGLI711dwio1VN5FtAxqbO40EWjEtuo'
sheet_name = "Data"

gsheet_url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/gviz/tq?tqx=out:csv&sheet={sheet_name}"
# gsheet_url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv"

def get_sheet_values():
    df = pd.read_csv(gsheet_url)
    data_dict = df.to_dict(orient='records')
    print(data_dict)
    return data_dict