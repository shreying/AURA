# train_finetune.py
# (This is the same complete script provided in the previous response)
import os
import argparse
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision.models import resnet18, ResNet18_Weights
import torchvision.transforms as transforms
from dataset import ArmocromiaDataset
import json
from tqdm import tqdm

def get_transforms():
    train_transform = transforms.Compose([
        transforms.Resize((224,224)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(10),
        transforms.ColorJitter(brightness=0.1, contrast=0.1, saturation=0.1, hue=0.02), # Color-preserving augmentation
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485,0.456,0.406], std=[0.229,0.224,0.225])
    ])
    val_transform = transforms.Compose([
        transforms.Resize((224,224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485,0.456,0.406], std=[0.229,0.224,0.225])
    ])
    return train_transform, val_transform

def main(args):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    df = pd.read_csv(args.annotations)
    train_df = df[df['partition']=='train'].reset_index(drop=True)
    val_df = df[df['partition']=='validation'].reset_index(drop=True)
    test_df = df[df['partition']=='test'].reset_index(drop=True) if 'test' in df['partition'].unique() else None

    train_transform, val_transform = get_transforms()
    train_ds = ArmocromiaDataset(train_df, args.root, transform=train_transform)
    val_ds = ArmocromiaDataset(val_df, args.root, transform=val_transform)

    train_loader = DataLoader(train_ds, batch_size=args.batch_size, shuffle=True, num_workers=0, pin_memory=True)
    val_loader = DataLoader(val_ds, batch_size=args.batch_size, shuffle=False, num_workers=0, pin_memory=True)

    model = resnet18(weights=ResNet18_Weights.DEFAULT)
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, 4)

    for param in model.parameters():
        param.requires_grad = False
    if args.unfreeze_layer4:
        for name, param in model.named_parameters():
            if "layer4" in name or "fc" in name:
                param.requires_grad = True
    else:
        for param in model.fc.parameters():
            param.requires_grad = True

    model = model.to(device)
    criterion = nn.CrossEntropyLoss()
    params_to_train = [p for p in model.parameters() if p.requires_grad]
    optimizer = optim.Adam(params_to_train, lr=args.lr)
    scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=5, gamma=0.1)

    best_val_acc = 0.0
    for epoch in range(args.epochs):
        model.train()
        running_loss = 0.0
        for images, labels, _ in tqdm(train_loader, desc=f"Train Epoch {epoch+1}/{args.epochs}"):
            if images is None: continue
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item() * images.size(0)
        epoch_loss = running_loss / len(train_ds)

        model.eval()
        correct = 0
        total = 0
        with torch.no_grad():
            for images, labels, _ in val_loader:
                if images is None: continue
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                _, preds = torch.max(outputs, 1)
                total += labels.size(0)
                correct += (preds == labels).sum().item()
        val_acc = 100 * correct / total
        print(f"Epoch {epoch+1} Summary | Train Loss: {epoch_loss:.4f} | Val Acc: {val_acc:.2f}%")

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), args.out_model)
            print(f"-> New best model saved to {args.out_model}")

        scheduler.step()
    
    # Final Test Set Evaluation
    if test_df is not None:
        print("\nRunning final evaluation on test set...")
        test_ds = ArmocromiaDataset(test_df, args.root, transform=val_transform)
        test_loader = DataLoader(test_ds, batch_size=args.batch_size)
        model.load_state_dict(torch.load(args.out_model))
        model.eval()
        correct = 0
        total = 0
        with torch.no_grad():
            for images, labels, _ in test_loader:
                if images is None: continue
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                _, preds = torch.max(outputs, 1)
                total += labels.size(0)
                correct += (preds == labels).sum().item()
        print(f"Final Test Accuracy: {100*correct/total:.2f}%")


    label_map_info = {
        'label_map': train_ds.label_map,
        'idx_to_label': {str(v): k for k, v in train_ds.label_map.items()},
        'idx_to_friendly': {str(i): name for i, name in enumerate(train_ds.class_names)}
    }
    with open('label_map.json', 'w') as f:
        json.dump(label_map_info, f, indent=4)
    print("Saved label_map.json")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Train Palette AI model.")
    # CHANGE THIS LINE to point to the new file
    parser.add_argument('--annotations', default='data/Deep-Armocromia/annotations_with_validation.csv')
    parser.add_argument('--root', default='data/Deep-Armocromia')
    parser.add_argument('--epochs', type=int, default=10)
    parser.add_argument('--batch_size', type=int, default=32)
    parser.add_argument('--lr', type=float, default=1e-3)
    parser.add_argument('--out_model', default='palette_model_best.pth')
    parser.add_argument('--unfreeze_layer4', action='store_true')
    args = parser.parse_args()
    main(args)