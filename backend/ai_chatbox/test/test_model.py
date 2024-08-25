import os
import sys
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(project_root)
from model.rag_model import RAGModel

def test_rag_model():
    model = RAGModel(data_path='./data/events.json')
    
    questions = [
        "What time is the Street Management Workshop?",
        "When is the event?",
        "How can I apply for the Street Management Workshop?",
        "Where is the event being held?",
        "How much does the event cost?",
        "What is the contact number for the event?"
    ]
    
    for question in questions:
        print(f"Q: {question}")
        answer = model.answer_question(question)
        print(f"A: {answer}\n")

if __name__ == "__main__":
    test_rag_model()
