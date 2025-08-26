from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
from supabase import create_client, Client as SupabaseClient
from flask_cors import CORS
from werkzeug.utils import secure_filename
# Load env vars
load_dotenv()

app = Flask(__name__)
CORS(app)  # <- allows all origins by default


# Flask setup

# Supabase setup        
SUPABASE_URL = os.getenv("REACT_APP_SUPABASE_URL")
SUPABASE_KEY = os.getenv("REACT_APP_SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET")
supabase: SupabaseClient = create_client(SUPABASE_URL, SUPABASE_KEY)

# -----------------------------
# CLIENT ROUTES
# -----------------------------
@app.route('/clients', methods=['POST'])
def create_client():
    data = request.json
    response = supabase.table("clients").insert({
        "username": data.get("username"),
        "email": data.get("email"),
        "password": data.get("password")
    }).execute()
    new_client = response.data[0]
    return jsonify({
        "id": new_client["id"],
        "username": new_client["username"],
        "email": new_client["email"]
    }), 201

@app.route('/clients', methods=['GET'])
def list_clients():
    response = supabase.table("clients").select("*").execute()
    return jsonify(response.data or [])

@app.route('/clients/<int:client_id>', methods=['GET'])
def get_client(client_id):
    response = supabase.table("clients").select("id, username, email").eq("id", client_id).single().execute()
    if response.data is None:
        return jsonify({"error": "Client not found"}), 404
    client = response.data
    return jsonify({
        "id": client["id"],
        "username": client["username"],
        "email": client["email"]
    })

@app.route('/clients/<int:client_id>', methods=['PUT'])
def update_client(client_id):
    data = request.json
    update_data = {}
    if "username" in data:
        update_data["username"] = data["username"]
    if "email" in data:
        update_data["email"] = data["email"]
    if "password" in data:
        update_data["password"] = data["password"]

    response = supabase.table("clients").update(update_data).eq("id", client_id).execute()
    if not response.data:
        return jsonify({"error": "Client not found or update failed"}), 404
    updated_client = response.data[0]
    return jsonify({
        "id": updated_client["id"],
        "username": updated_client["username"],
        "email": updated_client["email"]
    })

@app.route('/clients/<int:client_id>', methods=['DELETE'])
def delete_client(client_id):
    response = supabase.table("clients").delete().eq("id", client_id).execute()
    if not response.data:
        return jsonify({"error": "Client not found"}), 404
    return jsonify({"message": "Client deleted"})

# -----------------------------
# PHOTO ROUTES
# -----------------------------

def list_folder_contents(bucket, path=''):
    """Recursively list all files in a bucket folder"""
    try:
        print(f"Listing contents for bucket: {bucket}, path: {path}")  # Debug print
        contents = supabase.storage.from_(bucket).list(path)
        print(f"Raw contents: {contents}")  # Debug print

        all_files = []
        for item in contents:  # Remove .data access since list() returns a direct list
            name = item.get('name')
            if not name:
                continue
                
            full_path = f"{path}/{name}" if path else name
            full_path = full_path.lstrip('/')  # Remove leading slash if present
            
            # Check if it's an image file
            is_image = any(name.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.gif'])
            
            if not is_image and '.' not in name:  # If not an image and no extension, treat as folder
                print(f"Recursing into folder: {full_path}")  # Debug print
                all_files.extend(list_folder_contents(bucket, full_path))
            elif is_image:  # Only process image files
                public_url = supabase.storage.from_(bucket).get_public_url(full_path)
                print(f"Found image: {full_path}")  # Debug print
                all_files.append({
                    "filename": name,
                    "fullPath": full_path,
                    "url": public_url["publicURL"] if isinstance(public_url, dict) else public_url
                })
        
        return all_files
    except Exception as e:
        print(f"Error in list_folder_contents for path {path}: {str(e)}")
        return []

@app.route('/gallery/photos', methods=['GET'])
def list_all_photos():
    try:
        print(f"Starting photo listing with bucket: {SUPABASE_BUCKET}")  # Debug print
        
        # Recursively list all files in the bucket
        photos = list_folder_contents(SUPABASE_BUCKET)
        
        if not photos:
            print("No photos found")  # Debug print
            return jsonify([])
        
        print(f"Found {len(photos)} photos")  # Debug print
        for photo in photos:
            print(f"Photo: {photo['fullPath']} -> {photo['url']}")  # Debug print
            
        return jsonify(photos)
    except Exception as e:
        print(f"Error in list_all_photos: {str(e)}")  # Debug print
        return jsonify({"error": str(e)}), 500
@app.route('/gallery/<int:gallery_id>/upload', methods=['POST'])
def upload_photo(gallery_id):
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    filename = file.filename

    try:
        file_content = file.read()
        # Upload file to Supabase Storage
        upload_response = supabase.storage.from_(SUPABASE_BUCKET).upload(filename, file_content)
        if upload_response.get("error"):
            raise Exception(upload_response["error"]["message"])
        # Get public URL
        public_url = supabase.storage.from_(SUPABASE_BUCKET).get_public_url(filename).get("publicURL")

        # Insert photo record in DB
        photo_response = supabase.table("photos").insert({
            "filename": filename,
            "storage_url": public_url,
            "gallery_id": gallery_id
        }).execute()
        if photo_response.error:
            raise Exception(photo_response.error.message)

        new_photo = photo_response.data[0]
        return jsonify({
            "id": new_photo["id"],
            "filename": new_photo["filename"],
            "url": new_photo["storage_url"]
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/gallery/<int:gallery_id>/photos', methods=['GET'])
def list_photos(gallery_id):
    response = supabase.table("photos").select("id, filename, storage_url").eq("gallery_id", gallery_id).execute()
    if response.error:
        return jsonify({"error": str(response.error)}), 400
    photos = [
        {"id": p["id"], "filename": p["filename"], "url": p["storage_url"]}
        for p in response.data
    ]
    return jsonify(photos)

@app.route('/photo/<int:photo_id>', methods=['DELETE'])
def delete_photo(photo_id):
    # First retrieve photo to get filename for deleting from storage
    photo_response = supabase.table("photos").select("filename").eq("id", photo_id).single().execute()
    if photo_response.error or photo_response.data is None:
        return jsonify({"error": "Photo not found"}), 404
    filename = photo_response.data["filename"]

    # Delete from storage
    storage_response = supabase.storage.from_(SUPABASE_BUCKET).remove([filename])
    if storage_response.get("error"):
        return jsonify({"error": storage_response["error"]["message"]}), 500

    # Delete from DB
    delete_response = supabase.table("photos").delete().eq("id", photo_id).execute()
    if delete_response.error:
        return jsonify({"error": str(delete_response.error)}), 500

    return jsonify({"message": "Photo deleted"}), 200

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/clients/upload', methods=['POST'])
def upload_client_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in request'}), 400
    
    file = request.files['file']
    client_id = request.form.get('client_id')
    
    if not client_id:
        return jsonify({'error': 'Missing client_id'}), 400
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_content = file.read()

        # Upload to Supabase bucket
        result = supabase.storage.from_(SUPABASE_BUCKET).upload(
            f"{client_id}/{filename}", file_content
        )

        if result.get("error"):
            return jsonify({'error': result['error']['message']}), 500

        # Get public URL
        public_url = supabase.storage.from_(SUPABASE_BUCKET).get_public_url(f"{client_id}/{filename}")['publicUrl']

        # Optional: Save metadata to database
        supabase.table("client_images").insert({
            "client_id": client_id,
            "filename": filename,
            "url": public_url
        }).execute()

        return jsonify({'message': 'File uploaded', 'url': public_url}), 200

    return jsonify({'error': 'Invalid file type'}), 400

# -----------------------------
# HEALTH CHECK
# -----------------------------
@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"msg": "Backend running 🚀"})

# -----------------------------
# RUN
# -----------------------------
if __name__ == '__main__':
    app.run(debug=True)