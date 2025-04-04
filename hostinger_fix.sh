#!/bin/bash

# Hostinger-də saytı yerləşdirmək üçün bash skripti

# SSH məlumatları
HOST="46.202.156.134"
PORT="65002"
USER="u726371272"

# Yerli build qovluğu
BUILD_DIR="./dist/public"

# Hostinger-də hədəf qovluq
REMOTE_DIR="public_html"

# İlk olaraq build prosesini yoxlayaq
if [ ! -d "$BUILD_DIR" ]; then
    echo "Build qovluğu yoxdur! Əvvəlcə build edin."
    exit 1
fi

# Hostinger qovluğundakı mövcud faylların siyahısını al
echo "Mövcud faylların siyahısını alıram..."
ssh -p $PORT $USER@$HOST "ls -la $REMOTE_DIR"

# İstifadəçidən təsdiq istə
read -p "Davam etmək istəyirsinizmi? Hostingerdəki bütün fayllar silinəcək. (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Proses dayandırıldı."
    exit 1
fi

# Hostinger qovluğunu təmizlə (index.html-dən başqa)
echo "Hostinger public_html qovluğunu təmizləyirəm..."
ssh -p $PORT $USER@$HOST "find $REMOTE_DIR -mindepth 1 -type f -not -name 'index.php' -not -name '.htaccess' -delete"
ssh -p $PORT $USER@$HOST "find $REMOTE_DIR -mindepth 1 -type d -delete"

# .htaccess faylı üçün
echo "Xüsusi .htaccess faylı yaradıram..."
cat > .htaccess << 'EOL'
# Enable the rewrite engine
RewriteEngine On
RewriteBase /

# Serve Brotli compressed CSS, JS if available and accepted
<IfModule mod_headers.c>
  <IfModule mod_rewrite.c>
      RewriteCond %{HTTP:Accept-Encoding} br
      RewriteCond %{REQUEST_FILENAME}.br -f
      RewriteRule ^(.*)$ $1.br [QSA,L]
      <FilesMatch "\.br$">
          Header append Content-Encoding br
          Header append Vary Accept-Encoding
      </FilesMatch>
  </IfModule>
</IfModule>

# Set correct MIME types for JavaScript modules and regular JavaScript files
<IfModule mod_mime.c>
  AddType application/javascript .js
  AddType application/javascript .mjs
  AddType text/css .css
</IfModule>

# Ensure JavaScript files are served with the correct MIME type
<FilesMatch "\.js$">
  ForceType application/javascript
</FilesMatch>

# Ensure CSS files are served with the correct MIME type
<FilesMatch "\.css$">
  ForceType text/css
</FilesMatch>

# Handle SPA routing - direct all requests to index.html except for actual files/directories
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Set security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-XSS-Protection "1; mode=block"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set Permissions-Policy "geolocation=(), microphone=(), camera=()"
  
  # Set Content-Security-Policy to allow commonly-used resources
  Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googleapis.com *.gstatic.com; style-src 'self' 'unsafe-inline' *.googleapis.com; img-src 'self' data: blob: *.tile.openstreetmap.org *.googleapis.com; font-src 'self' data: *.gstatic.com *.googleapis.com; connect-src 'self' *.bartertap.az barter-api-8jr6.onrender.com wss://*.onrender.com ws://*.onrender.com; frame-src 'self'; object-src 'none';"
  
  # Browser caching
  <FilesMatch "\.(html|htm)$">
    Header set Cache-Control "max-age=0, no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires "Wed, 11 Jan 1984 05:00:00 GMT"
  </FilesMatch>
  
  <FilesMatch "\.(css|js|mjs)$">
    Header set Cache-Control "max-age=31536000, public"
  </FilesMatch>
  
  <FilesMatch "\.(jpg|jpeg|png|gif|ico|svg|webp)$">
    Header set Cache-Control "max-age=31536000, public"
  </FilesMatch>
</IfModule>
EOL

# Faylları Hostinger-ə köçürün
echo "Faylları Hostinger-ə köçürürəm..."
scp -P $PORT -r $BUILD_DIR/* $USER@$HOST:$REMOTE_DIR/
scp -P $PORT .htaccess $USER@$HOST:$REMOTE_DIR/

echo "Köçürmə tamamlandı."

# index.html-i xüsusi olaraq yoxla və düzəliş et
echo "index.html-i düzəldirəm..."
ssh -p $PORT $USER@$HOST "cd $REMOTE_DIR && sed -i 's/type=\"module\"/type=\"application\/javascript\"/g' index.html"

echo "İşlənmiş faylların siyahısını yoxlayın:"
ssh -p $PORT $USER@$HOST "ls -la $REMOTE_DIR"

echo "Proses tamamlandı - bartertap.az saytını yoxlayın."