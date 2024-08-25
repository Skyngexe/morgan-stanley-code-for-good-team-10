from openai import OpenAI

# Replace with your OpenAI API key
client = OpenAI(
    # defaults to os.environ.get("OPENAI_API_KEY")
    api_key='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'
)

def query_openai(prompt, max_tokens=150):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=prompt
    )
    return response.choices[0].message.content

# Test function
def test_openai_query():
    prompt = (
        "Street Management Workshop\n"
        "Do you or does someone you know feel overwhelmed by the demands of daily life? Do you want to take control of your well-being?\n"
        "Join us for a transformative stress management workshop and learn practical techniques to cultivate a healthier, more resilient mindset.\n"
        "Time: 11am to 12pm\n"
        "Date: 25 August, 2024 (Sunday)\n"
        "Cost: Free\n"
        "Venue: Gurudwara Sahib Library\n"
        "Sign up here: https://forms.gle/GPPajzBqn22uaaMNA\n"
        "Contact us at: 5561 0798\n"
        "Event website: xxxxxx.com\n\n"
        "Based on the above event details, can you tell me how to apply for this event?"
    )
    
    answer = query_openai(prompt)
    print(f"OpenAI Response: {answer}")

# Run the test
if __name__ == "__main__":
    test_openai_query()
