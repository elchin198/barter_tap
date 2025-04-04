
#!/bin/bash
echo "=== Starting Render.com Build Process ==="

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building the project..."
npm run build

# Ensure proper folder structure for Render.com
echo "Preparing folder structure..."
mkdir -p dist/public
cp -r public/* dist/public/ 2>/dev/null || true

# Copy necessary files
echo "Copying configuration files..."
cp render.yaml dist/ 2>/dev/null || true
cp package.json dist/ 2>/dev/null || true
cp package-lock.json dist/ 2>/dev/null || true

echo "=== Build Process Completed ==="
