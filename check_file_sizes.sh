
#!/bin/bash

# BarterTap - File Size Checker
# This script finds and reports large files in the project

echo "Checking for large files in the project..."
echo "Files larger than 10MB:"

# Find files larger than 10MB and sort by size
find . -type f -not -path "./node_modules/*" -not -path "./.git/*" -size +10M -exec du -h {} \; | sort -hr

echo ""
echo "Total space used by different directories:"
du -sh .git attached_assets node_modules public dist 2>/dev/null

echo ""
echo "Project total size (excluding node_modules):"
du -sh --exclude="node_modules" .

echo ""
echo "Check completed!"
