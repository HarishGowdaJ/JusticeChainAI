import pdfplumber
from docx import Document
import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def extract_text_from_pdf(file_path):
    """Extract text from PDF file"""
    try:
        with pdfplumber.open(file_path) as pdf:
            text = ''
            for page in pdf.pages:
                text += page.extract_text() or ''
        return text
    except Exception as e:
        return f"Error extracting PDF text: {str(e)}"

def extract_text_from_docx(file_path):
    """Extract text from DOCX file"""
    try:
        doc = Document(file_path)
        text = ''
        for para in doc.paragraphs:
            text += para.text + '\n'
        return text
    except Exception as e:
        return f"Error extracting DOCX text: {str(e)}"

def summarize_extracted_text(text, max_len=150, min_len=30):
    """Use OpenAI to summarize extracted text from files"""
    try:
        if len(text.strip()) < 10:
            return "Extracted text is too short to summarize."

        # Initialize OpenAI client
        client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

        # Create the prompt for summarization
        prompt = f"Please provide a concise summary of the following legal document text in {min_len}-{max_len} words:\n\n{text}"

        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a legal expert specializing in summarizing court documents and legal texts. Provide clear, concise, and accurate summaries."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=max_len,
            temperature=0.3
        )

        # Extract the summary from the response
        summary = response.choices[0].message.content.strip()

        return summary

    except Exception as e:
        return f"Error generating summary from extracted text: {str(e)}. Please check your OpenAI API key and connection."
