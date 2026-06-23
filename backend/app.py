from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

CHARACTERS = [
    'Ethan', 'Harvy', 'Clarence', 'Ryan', 'Nash', 'James', 'Audrey',
    'Elise', 'Maxine', 'Joy', 'Brittney', 'Bella', 'Gwen', 'Alice',
    'Daniela', 'Reign'
]

def get_background(character):
    mapping = {
        'Alice': 'Smith Background.png',
        'Harvy': 'Smith Background.png',
        'Audrey': 'Thompson Background.png',
        'James': 'Thompson Background.png',
        'Bella': 'Wright Background.png',
        'Brittney': 'Wright Background.png',
        'Clarence': 'Clarence Background.png',
        'Daniela': 'Jones Background.png',
        'Maxine': 'Jones Background.png',
        'Elise': 'Gomez Background.png',
        'Ryan': 'Gomez Background.png',
        'Ethan': 'Williams Background.png',
        'Reign': 'Williams Background.png',
        'Gwen': 'Washington Background.png',
        'Nash': 'Washington Background.png',
        'Joy': 'Joy Background.png',
    }
    return mapping.get(character, 'Background.png')

def load_bio(character_name):
    txt_path = os.path.join(app.static_folder, 'assets', 'txt', f"{character_name}.txt")
    if os.path.exists(txt_path):
        with open(txt_path, encoding='utf-8') as f:
            return f.read().strip()
    print(f"⚠️ Bio not found for: {character_name}")  # Debug log
    return "Bio not found."

@app.route('/api/characters')
def get_characters():
    return jsonify(CHARACTERS)

@app.route('/api/character/<name>')
def get_character(name):
    name = name.title()
    bio = load_bio(name)
    
    if bio == "Bio not found.":
        return jsonify({"error": f"Character '{name}' not found"}), 404

    return jsonify({
        "name": name,
        "bio": bio,
        "background": get_background(name),
        "image": f"{name}.png"
    })

# Serve static assets (backup in case needed)
@app.route('/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory(os.path.join(app.static_folder, 'assets'), filename)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    print(f"🚀 Flask server running on port {port}")
    app.run(host='0.0.0.0', port=port)