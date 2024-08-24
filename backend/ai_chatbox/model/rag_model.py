import json
import os
import sys
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(project_root)
from config.config import query_openai
from openai import OpenAI

class RAGModel:
    def __init__(self, data_path):
        self.events = self.load_data(data_path)
        # Initialize OpenAI client
        self.client = OpenAI(api_key='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')  # Replace with your actual API key

    def load_data(self, data_path):
        with open(data_path, 'r', encoding='utf-8') as file:
            return json.load(file)

    def call_openai_for_relevance(self, event_details, query):
        messages = [
            {"role": "system", "content": "You are an AI assistant that helps determine event relevance. Your task is to check if the provided event details answer the user's query."},
            {"role": "user", "content": f"Event Details: {event_details}\nQuery: {query}\n\nDoes the event details include information that answers the query? Please explain your reasoning and provide a 'Yes' or 'No' at the end."}
        ]

        response = self.client.chat.completions.create(
            model="gpt-4", 
            messages=messages,
            max_tokens=100,  # Allow more space for reasoning
            temperature=0.3  # Keep temperature low for consistency
        )

        relevance_response = response.choices[0].message.content.strip().lower()
        # print("Relevance Response:", relevance_response)  # Debugging line

        # Consider 'yes' relevant even if the model provides additional context
        return "yes" in relevance_response


    def retrieve_relevant_event(self, query):
        relevant_events = []
        for event in self.events:
            event_details = event['event_details']
            # print(f"Checking event: {event_details}")
            # print("Query:", query)
            
            # Call OpenAI API to check relevance
            if self.call_openai_for_relevance(event_details, query):
                relevant_events.append(event)
        
        # print(f"Found {len(relevant_events)} relevant events.")
        return relevant_events

    def generate_response(self, query, events):
        context = "Here are some event details:\n\n"
        for event in events:
            context += f"{event['event_details']}\n\n"

        prompt = [
            {"role": "system", "content": "You are an AI assistant that provides event information based on provided details."},
            {"role": "user", "content": f"{context}Based on the above details, answer the following question: {query}"}
        ]

        response = query_openai(prompt)
        return response


    def answer_question(self, query):
        events = self.retrieve_relevant_event(query)
        if not events:
            return "Sorry, I couldn't find any relevant events based on your query."
        return self.generate_response(query, events)
