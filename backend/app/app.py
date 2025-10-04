from flask import Flask
from flask_cors import CORS
from routes.summarizer_routes import summarizer_bp
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# Optional: check if API key is loaded
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    print("Warning: OPENAI_API_KEY not found in environment variables!")

app = Flask(__name__)
CORS(app)
app.register_blueprint(summarizer_bp)

if __name__ == "__main__":
    app.run(debug=True, port=8000)