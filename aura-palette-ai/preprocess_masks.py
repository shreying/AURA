# preprocess_masks.py
import os
import cv2
import pandas as pd
from tqdm import tqdm

DATA_DIR = "data/Deep-Armocromia"
CSV = os.path.join(DATA_DIR, "annotations.csv")

df = pd.read_csv(CSV)

def ensure_dir(path):
    os.makedirs(os.path.dirname(path), exist_ok=True)

print("--- Starting Preprocessing to Create Masked Images ---")
for _, row in tqdm(df.iterrows(), total=len(df), desc="Processing images"):
    masked_rel = row.get('path_rgb_masked')
    orig_rel = row.get('path_rgb_original')
    mask_rel = row.get('path_mask')
    
    masked_abs_path = os.path.join(DATA_DIR, masked_rel) if pd.notna(masked_rel) else ""

    # Create masked image only if it doesn't already exist
    if not os.path.exists(masked_abs_path):
        if pd.isna(orig_rel) or pd.isna(mask_rel):
            continue

        orig_path = os.path.join(DATA_DIR, orig_rel)
        mask_path = os.path.join(DATA_DIR, mask_rel)

        if os.path.exists(orig_path) and os.path.exists(mask_path):
            img = cv2.imread(orig_path, cv2.IMREAD_COLOR)
            mask = cv2.imread(mask_path, cv2.IMREAD_GRAYSCALE)

            if img is None or mask is None:
                continue
            
            # Ensure mask is the same size as the image
            mask_resized = cv2.resize(mask, (img.shape[1], img.shape[0]), interpolation=cv2.INTER_NEAREST)
            
            # Apply the mask
            _, bin_mask = cv2.threshold(mask_resized, 1, 255, cv2.THRESH_BINARY)
            masked_img = cv2.bitwise_and(img, img, mask=bin_mask)
            
            # Save the new masked image
            ensure_dir(masked_abs_path)
            cv2.imwrite(masked_abs_path, masked_img)

print("--- Preprocessing Complete ---")