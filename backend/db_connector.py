from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

# Connection string
url = "mongodb+srv://codeforgood2024team10:DevL8aYJXQsTm9@cluster0.acjuj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a new client and connect to the server
client = MongoClient(url, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
    
    # List all databases
    databases = client.list_database_names()
    print("Databases:", databases)
    
    # Replace 'your_database_name' with the name of your database
    db = client['your_database_name']
    collections = db.list_collection_names()
    print("Collections in your_database_name:", collections)
    
    # Replace 'your_collection_name' with the name of your collection
    collection = db['your_collection_name']
    documents = collection.find()
    
    # Print documents
    for doc in documents:
        print(doc)
except Exception as e:
    print(e)