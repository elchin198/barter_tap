#!/bin/bash
set -e

echo "========== BarterTap Render Deployment Script =========="
echo "Setting up deployment for Render.com..."

# Ensure all npm dependencies are installed first
echo "Installing all dependencies..."
npm install

# Install specific packages needed for render-server.js
echo "Installing compression and cors packages..."
npm install compression cors --save

# Build the project
echo "Building the project..."
npm run build

# Create health check file if it doesn't exist
if [ ! -f "api_healthcheck.js" ]; then
  echo "Creating health check endpoint..."
  cat > api_healthcheck.js << 'EOF'
// Simple health check endpoint for Render.com
export default (req, res) => {
  res.status(200).json({ status: 'ok', message: 'BarterTap API is running' });
};
EOF
fi

# Fix the index.html if needed
if grep -q "/assets/index.js" index.html; then
  echo "Fixing index.html references..."
  sed -i 's|"/assets/index.js"|"/client/src/main.tsx"|g' index.html
  sed -i 's|"/assets/index.css"|"/client/src/styles/index.css"|g' index.html
fi

echo "Deployment setup complete. Your application is ready for Render.com!"
echo "Use the following settings in your Render dashboard:"
echo "- Build Command: ./render_deploy.sh"
echo "- Start Command: node render-server.js"
echo "- Health Check Path: /api/healthcheck"
echo "========================================================="

# Render üçün vacib faylların əsas qovluğa köçürülməsi
cp render-server.js dist/
cp api_healthcheck.js dist/
cp render.yaml dist/
cp package.json dist/
cp package-lock.json dist/

# Lazımi paketləri quraşdır
echo "Render.com üçün asılılıqları quraşdırılır..."
cd dist
npm init -y
cat > package.json << EOL
{
  "name": "bartertap-render",
  "version": "1.0.0",
  "main": "render-server.js",
  "type": "commonjs",
  "dependencies": {
    "express": "^4.18.2",
    "compression": "^1.7.4",
    "cors": "^2.8.5"
  },
  "scripts": {
    "start": "node render-server.js"
  }
}
EOL

npm install

# İndeks faylında MIME tipi probleminin həllini yoxla
echo "index.html faylı yoxlanılır..."
if [ -f "index.html" ]; then
  cat index.html | sed 's/type="module"/type="application\/javascript"/g' > index.html.fixed
  mv index.html.fixed index.html
else
  echo "WARNING: index.html faylı tapılmadı!"
fi

# Uploads qovluğunu yaradıb icazələrini tənzimlə
echo "Uploads qovluğu yaradılır..."
mkdir -p public/uploads/items
mkdir -p public/uploads/avatars
chmod -R 755 public/uploads

echo "Deployment paketi hazırdır!"
echo "Render.com hesabınıza daxil olun və GitHub repozitoriyası ilə qoşulun."
echo "render.yaml Blueprint ilə avtomatik yerləşdirmə və ya manual web service yaratma ilə davam edin."

# JavaScript fayllarını say
echo "JavaScript faylları:"
find . -name "*.js" | wc -l

echo "Render.com URL: https://bartertap.onrender.com"
echo "Qeyd: Render.com üçün manual deployment etməyi tövsiyə edirik."