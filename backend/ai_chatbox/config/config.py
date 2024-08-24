import openai

# Replace with your OpenAI API key
openai.api_key = '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'

def query_openai(prompt, max_tokens=150):
    response = openai.chat.completions.create(
        model="text-davinci-003",
        messages=prompt,
        max_tokens=max_tokens,
        temperature=0.7,
        top_p=1,
        n=1,
        stop=None
    )
    return response.choices[0].text.strip()

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
