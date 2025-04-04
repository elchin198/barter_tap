
#!/bin/bash

# BarterTap - Cleanup Script for Deployment
# This script removes large, unnecessary files before deployment

echo "Starting BarterTap deployment cleanup..."

# Create a temporary directory for clean files
mkdir -p dist_clean

# Use rsync to copy only necessary files, excluding large ones
echo "Copying files to clean directory (excluding .git, archives, and other large files)..."
rsync -av \
  --exclude='.git' \
  --exclude='*.rar' \
  --exclude='*.zip' \
  --exclude='*.tar.gz' \
  --exclude='attached_assets/*.rar' \
  --exclude='attached_assets/*.zip' \
  --exclude='node_modules' \
  ./  dist_clean/

# Show space saved
original_size=$(du -sh . | awk '{print $1}')
clean_size=$(du -sh dist_clean | awk '{print $1}')

echo "Original project size: $original_size"
echo "Clean project size: $clean_size"

echo "Cleanup completed successfully!"
echo "The cleaned files are in the 'dist_clean' directory."
echo "You can now build from this directory or copy it to your deployment target."
