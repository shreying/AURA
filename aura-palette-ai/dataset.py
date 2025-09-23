# dataset.py
import os
from PIL import Image
from torch.utils.data import Dataset
import pandas as pd

class ArmocromiaDataset(Dataset):
    def __init__(self, annotations_df, root_dir, transform=None, img_col='path_rgb_masked', label_col='class'):
        self.annotations = annotations_df.reset_index(drop=True)
        self.root_dir = root_dir
        self.transform = transform
        self.img_col = img_col
        self.label_col = label_col

        # FIXED: Changed dictionary keys to all lowercase to match the CSV data
        self.label_map = {"primavera": 0, "estate": 1, "autunno": 2, "inverno": 3}
        self.class_names = ["Spring", "Summer", "Autumn", "Winter"]

    def __len__(self):
        return len(self.annotations)

    def __getitem__(self, idx):
        row = self.annotations.iloc[idx]
        rel_path = row[self.img_col]
        img_path = os.path.join(self.root_dir, rel_path)
        
        try:
            image = Image.open(img_path).convert("RGB")
        except FileNotFoundError:
            print(f"Error: Image file not found at {img_path}")
            return None, None, None

        # The label_str from the CSV will now correctly match the lowercase key
        label_str = row[self.label_col]
        label = self.label_map[label_str]

        if self.transform:
            image = self.transform(image)

        return image, label, rel_path