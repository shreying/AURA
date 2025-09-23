# api.py
from flask import Flask, request, jsonify
import torch
import torch.nn as nn
from torchvision import transforms
from torchvision.models import resnet18
from PIL import Image
import io
import json

app = Flask(__name__)

# --- Load Model and Label Info ---
DEVICE = torch.device("cpu")
with open('label_map.json', 'r') as f:
    label_info = json.load(f)
idx_to_friendly = label_info['idx_to_friendly']

model = resnet18(weights=None)
num_ftrs = model.fc.in_features
model.fc = nn.Linear(num_ftrs, 4)
model.load_state_dict(torch.load('palette_model_best.pth', map_location=DEVICE))
model.eval()

# --- Image Preprocessing ---
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    return transform(img).unsqueeze(0)

# --- API Endpoint ---
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'no file provided'}), 400
    
    file = request.files['file']
    try:
        img_bytes = file.read()
        tensor = preprocess_image(img_bytes).to(DEVICE)
        
        with torch.no_grad():
            outputs = model(tensor)
            probs = torch.softmax(outputs, dim=1).squeeze()
            top_prob, top_idx = torch.max(probs, 0)
            
            pred_idx_str = str(top_idx.item())
            
            result = {
                'predictions': [{
                    'label_friendly': idx_to_friendly.get(pred_idx_str, "Unknown"),
                    'probability': top_prob.item()
                }]
            }
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)