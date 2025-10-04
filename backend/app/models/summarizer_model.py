import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

def summarize_text(text, max_len=150, min_len=30):
    try:
        # Initialize OpenAI client (no http_client or proxies)
        client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

        # Create the prompt
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

        # Extract the summary
        summary = response.choices[0].message.content.strip()
        return summary

    except Exception as e:
        return f"Error generating summary: {str(e)}. Please check your OpenAI API key and connection."

# Example usage
if __name__ == "__main__":
    text = """Court: Bombay High Court
Judgment Date: October 3, 2025
Bench: Justices Revati Mohite Dere and Neela Gokhale
Case Number: Writ Petition No. 12345 of 2025

Background:
In June 2025, SBI classified the loan account of Reliance Communications (RCom) and its promoter, Anil Ambani, as "fraud" under the Reserve Bank of India’s (RBI) Master Directions on Fraud Risk Management. The classification was based on alleged fund diversion and misrepresentation of financial statements. Consequently, SBI reported the matter to the RBI, initiating further investigations.

Petitioner’s Argument:
Anil Ambani challenged the classification, arguing that the decision violated principles of natural justice. He contended that he was not provided an opportunity for a personal hearing and that the documents relied upon by SBI were not shared with him. Ambani further claimed that as a non-executive director of RCom, he should not be held personally liable for the company’s financial misdeeds.

Respondent’s Defense:
SBI defended its decision, stating that multiple notices were issued to Ambani, seeking his explanation regarding the alleged discrepancies. The bank maintained that the classification was in accordance with RBI guidelines and its internal policies. SBI emphasized that the allegations were serious and warranted the “fraud” tag to protect public interest.

Court’s Observations:
The bench noted that while the consequences of a “fraud” classification are severe, it is within the bank’s discretion to make such determinations based on internal assessments and regulatory guidelines. The court observed that Ambani had ample opportunities to respond to the notices but failed to provide satisfactory explanations. Furthermore, the court highlighted that as a promoter-director, Ambani held a fiduciary responsibility towards the company’s financial integrity.

Judgment:
The Bombay High Court dismissed Anil Ambani’s petition, upholding SBI’s decision to classify the RCom loan account as “fraud.” The court found no merit in Ambani’s arguments and affirmed that the classification was in line with established banking practices and regulatory norms.

Implications:
This judgment reinforces the authority of banks to classify accounts as “fraud” based on internal investigations and regulatory guidelines. It also underscores the accountability of promoters and directors in ensuring the financial transparency and integrity of their companies.

Next Steps:
Anil Ambani has the option to appeal the decision before the Supreme Court of India if he believes there are grounds to challenge the High Court’s ruling."""

    print(summarize_text(text))