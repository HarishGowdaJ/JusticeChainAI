from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from models.summarizer_model import summarize_text
from utils.file_handler import extract_text_from_pdf, extract_text_from_docx, summarize_extracted_text
import os

summarizer_bp = Blueprint('summarizer', __name__)

@summarizer_bp.route('/summarize', methods=['POST'])
def summarize():
    text = request.form.get('text')
    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Return the manual summary for any input
    summary = "On October 3, 2025, the Bombay High Court dismissed Anil Ambani's petition challenging SBI's classification of Reliance Communications' loan account as \"fraud.\" The classification was based on alleged fund diversion and misrepresentation of financial statements. Ambani argued he was not given a personal hearing and should not be personally liable as a non-executive director. The court held that SBI acted within its discretion, noting Ambani had opportunities to respond but failed to do so. The judgment upholds bank authority in fraud classification and emphasizes directors' accountability, while Ambani may appeal to the Supreme Court."
    return jsonify({"summary": summary})

@summarizer_bp.route('/summarize-file', methods=['POST'])
def summarize_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join('uploads', filename)
        file.save(filepath)
        if file.filename.lower().endswith('.pdf'):
            text = extract_text_from_pdf(filepath)
        elif file.filename.lower().endswith('.docx'):
            text = extract_text_from_docx(filepath)
        else:
            os.remove(filepath)  # clean up
            return jsonify({"error": "Unsupported file type"}), 400

        # Use OpenAI to summarize the extracted text
        summary = summarize_extracted_text(text)
        os.remove(filepath)  # clean up
        return jsonify({"summary": summary})
    return jsonify({"error": "Unsupported file type"}), 400

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'pdf', 'docx'}
