# create_validation_set.py
import pandas as pd
from sklearn.model_selection import train_test_split

# --- CONFIGURATION ---
# The original annotations file provided by the dataset creators
INPUT_CSV = 'data/Deep-Armocromia/annotations.csv'

# The new file we will create that includes a validation set
OUTPUT_CSV = 'data/Deep-Armocromia/annotations_with_validation.csv'

# We will use 15% of the training data to create our validation set
VALIDATION_SIZE = 0.15 

print("--- Starting: Creating Validation Set ---")

# 1. Load the original annotations file
df = pd.read_csv(INPUT_CSV)

# 2. Separate the existing training and testing data
train_df = df[df['partition'] == 'train']
test_df = df[df['partition'] == 'test']

# 3. Split the training data into a new, smaller training set and a validation set.
# The 'stratify' argument is important! It ensures the proportion of each season 
# (Autumn, Spring, etc.) is the same in both the new training and validation sets.
new_train_df, val_df = train_test_split(
    train_df,
    test_size=VALIDATION_SIZE,
    random_state=42, # Ensures the split is the same every time you run it
    stratify=train_df['class']
)

# 4. Assign the new 'validation' label to the partition column
# We use .copy() to avoid a SettingWithCopyWarning from pandas
val_df = val_df.copy()
val_df['partition'] = 'validation'

# 5. Combine the new training set, new validation set, and original test set
final_df = pd.concat([new_train_df, val_df, test_df]).reset_index(drop=True)

# 6. Save the result to a new CSV file
final_df.to_csv(OUTPUT_CSV, index=False)

print(f"Successfully created validation set.")
print(f"New CSV file saved to: {OUTPUT_CSV}")
print("\nNew partition distribution:")
print(final_df['partition'].value_counts())
print("\n--- Script Complete ---")