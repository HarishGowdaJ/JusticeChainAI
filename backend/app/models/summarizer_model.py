import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def summarize_text(text, max_len=150, min_len=30):
    try:
        # Initialize OpenAI client
        client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

        # Create the prompt for summarization
        prompt = f"Please provide a concise summary of the following legal judgment text in {min_len}-{max_len} words:\n\n{text}"

        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a legal expert specializing in summarizing court judgments. Provide clear, concise, and accurate summaries."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=max_len,
            temperature=0.3
        )

        # Extract the summary from the response
        summary = response.choices[0].message.content.strip()

        return summary

    except Exception as e:
        return f"Error generating summary: {str(e)}. Please check your OpenAI API key and connection."
