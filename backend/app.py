from flask import Flask, request, jsonify, send_from_directory, abort
from flask_cors import CORS
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Set upload folder in Flask config
app.config["UPLOAD_FOLDER"] = "uploads"
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)


@app.route("/upload", methods=["POST"])
def upload_file():
    """Handles file uploads."""
    uploaded_file = request.files.get("file")

    if not uploaded_file:
        return jsonify({"error": "No file provided"}), 400

    file_path = os.path.join(app.config["UPLOAD_FOLDER"], uploaded_file.filename)
    uploaded_file.save(file_path)

    return jsonify({"message": "File uploaded successfully", "filename": uploaded_file.filename}), 200


@app.route("/files/<path:filename>")
def get_file(filename):
    """Serves requested file if it exists."""
    if not os.path.exists(os.path.join(app.config["UPLOAD_FOLDER"], filename)):
        abort(404, description="File not found")

    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


if __name__ == "__main__":
    app.run(debug=True)
