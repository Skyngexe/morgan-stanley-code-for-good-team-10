import os
from dotenv import load_dotenv
from langchain.document_loaders import TextLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.chains import create_retriever, create_stuff_documents_chain
from langchain.chains.retrieval_qa import RetrievalQAChain
from langchain.vectorstores import FAISS
from langchain.llms import OpenAI

class EventRAGAgent:
    def __init__(self):
        # Load environment variables
        load_dotenv()

        # Initialize LLM (Language Model)
        self.llm = OpenAI(temperature=0.7, model="gpt-3.5-turbo")

        # Load data from 'data.txt'
        self.loader = TextLoader('data.txt')
        documents = self.loader.load()

        # Create FAISS vector store from the documents
        self.embeddings = OpenAIEmbeddings()
        self.vectorstore = FAISS.from_documents(documents, self.embeddings)

        # Create a retriever from the vector store
        self.retriever = create_retriever(self.vectorstore)

        # System prompt for answering event-related questions
        self.qa_system_prompt = (
            """
            You are an Event Information Bot. Your primary role is to provide information about events 
            based on the given context. Answer questions such as when an event starts, how to apply, 
            where it takes place, and any other relevant details.

            If the context does not contain the requested information, respond with "I'm sorry, I couldn't find that information."
            """
        )

        # Create a chain for question answering
        self.question_answer_chain = create_stuff_documents_chain(self.llm, self.qa_system_prompt)

        # Create a retrieval chain using the retriever and QA chain
        self.rag_chain = RetrievalQAChain(
            retriever=self.retriever,
            combine_documents_chain=self.question_answer_chain
        )

    def invoke(self, input: str):
        """Invoke the retrieval chain with the provided input.

        Args:
            input (str): The user input or query.

        Returns:
            str: The AI's response text.
        """
        # Process the user's query through the retrieval chain
        result = self.rag_chain.run({"query": input})
        return result['output_text']

    def stream(self, input: str):
        """Stream the retrieval chain with the provided input.

        Args:
            input (str): The user input or query.

        Yields:
            str: The AI's response text.
        """
        # Process the user's query through the retrieval chain
        for chunk in self.rag_chain.stream({"query": input}):
            yield chunk["output_text"]


# Example usage to start the continual chat
def start_chat(bot: EventRAGAgent):
    """Start a continual chat session with the AI."""
    print("Start chatting with the AI! Type 'exit' to end the conversation.")
    while True:
        query = input("You: ")
        if query.lower() == "exit":
            break
        # Invoke the bot with the user's query
        answer = bot.invoke(query)
        # Display the AI's response
        print(f"AI: {answer}")


# Main function to start the continual chat
if __name__ == "__main__":
    bot = EventRAGAgent()
    start_chat(bot)
