import os
import shutil
import glob
from PIL import Image

def get_dir_size(path):
    total = 0
    with os.scandir(path) as it:
        for entry in it:
            if entry.is_file():
                total += entry.stat().st_size
            elif entry.is_dir():
                total += get_dir_size(entry.path)
    return total

def backup_images(src_dir, backup_dir):
    print(f"Creating backup from {src_dir} to {backup_dir}...")
    if os.path.exists(backup_dir):
        print(f"Backup directory {backup_dir} already exists. Skipping backup step to prevent overwriting.")
        return
    shutil.copytree(src_dir, backup_dir)
    print("Backup complete.")

def optimize_image(img_path, max_size=(2560, 2560), quality=85):
    try:
        with Image.open(img_path) as img:
            # Check if image needs resizing
            if img.width > max_size[0] or img.height > max_size[1]:
                img.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            # Save the image with optimization
            # We overwrite the original file in the working directory
            # Exif data is generally lost during this resize/save unless explicitly preserved.
            # Preserving exif for web portfolio is usually unnecessary and adds size.
            
            # Convert to RGB if it's RGBA (PNG with transparency) and saving as JPEG
            # But we are keeping the original format, so we just save.
            
            # If it's a PNG, we can optimize it but 'quality' parameter is mostly for JPEG
            if img.format == 'PNG':
                 img.save(img_path, optimize=True)
            else: # Convert everything else (like JPG)
                 img.save(img_path, optimize=True, quality=quality)
                 
    except Exception as e:
        print(f"Error processing {img_path}: {e}")

def main():
    source_dir = r"d:\photography\images"
    backup_dir = r"d:\photography\images_backup"
    
    if not os.path.exists(source_dir):
        print(f"Source directory {source_dir} not found!")
        return

    # 1. Backup
    backup_images(source_dir, backup_dir)
    
    # Calculate original size
    orig_size_bytes = get_dir_size(source_dir)
    orig_size_mb = orig_size_bytes / (1024 * 1024)
    print(f"\nOriginal size of '{source_dir}': {orig_size_mb:.2f} MB")
    
    # 2. Process
    print("\nStarting optimization...")
    search_pattern = os.path.join(source_dir, '**', '*.*')
    files = glob.glob(search_pattern, recursive=True)
    
    image_files = [f for f in files if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    total_images = len(image_files)
    
    for i, file_path in enumerate(image_files):
        print(f"Processing {i+1}/{total_images}: {os.path.basename(file_path)}")
        optimize_image(file_path)
        
    # Calculate new size
    new_size_bytes = get_dir_size(source_dir)
    new_size_mb = new_size_bytes / (1024 * 1024)
    
    print("\nOptimization complete!")
    print(f"New size of '{source_dir}': {new_size_mb:.2f} MB")
    print(f"Total space saved: {orig_size_mb - new_size_mb:.2f} MB")

if __name__ == "__main__":
    main()
