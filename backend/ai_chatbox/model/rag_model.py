import json
import os
import sys
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(project_root)
from config.config import query_openai

class RAGModel:
    def __init__(self, data_path):
        self.events = self.load_data(data_path)

    def load_data(self, data_path):
        with open(data_path, 'r', encoding='utf-8') as file:
            return json.load(file)

    def retrieve_relevant_event(self, query):
        # Simple retrieval mechanism based on keyword matching
        relevant_events = []
        for event in self.events:
            if query.lower() in event['event_details'].lower():
                relevant_events.append(event)
        return relevant_events

    def generate_response(self, query, events):
        # Create a context for OpenAI API to generate an answer
        context = "Here are some event details:\n\n"
        for event in events:
            context += f"{event['event_details']}\n\n"

        prompt = f"{context}Based on the above details, answer the following question: {query}"

        response = query_openai(prompt)
        return response

    def answer_question(self, query):
        events = self.retrieve_relevant_event(query)
        if not events:
            return "Sorry, I couldn't find any relevant events based on your query."
        return self.generate_response(query, events)
