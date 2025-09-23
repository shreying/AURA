# dataset_inspect.py
import os
import pandas as pd

DATA_DIR = "data/Deep-Armocromia"
CSV = os.path.join(DATA_DIR, "annotations.csv")

print("--- Starting Dataset Inspection ---")
df = pd.read_csv(CSV)

print(f"Total rows found: {len(df)}")
print(f"Columns: {df.columns.tolist()}")
print(f"Partitions: {df['partition'].unique().tolist()}")
print(f"Classes (Italian): {df['class'].unique().tolist()}")
print("\nClass distribution:")
print(df['class'].value_counts())

# Check for missing files
check_cols = ['path_rgb_original', 'path_rgb_masked', 'path_mask']
missing_files_report = {col: [] for col in check_cols}

print("\nChecking for missing image files...")
for i, row in df.iterrows():
    for col in check_cols:
        if col in df.columns and pd.notna(row[col]):
            file_path = os.path.join(DATA_DIR, row[col])
            if not os.path.exists(file_path):
                missing_files_report[col].append(row[col])

has_missing = False
for col, missing_list in missing_files_report.items():
    if missing_list:
        has_missing = True
        print(f"\nWARNING: Found {len(missing_list)} missing files for '{col}'")
        print(f"  Examples: {missing_list[:5]}")

if not has_missing:
    print("All file paths in checked columns are valid.")
else:
    print("Consider running preprocess_masks.py if 'path_rgb_masked' files are missing but 'path_mask' exists.")
    
print("--- Inspection Complete ---")