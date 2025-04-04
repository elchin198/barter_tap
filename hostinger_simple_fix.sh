#!/bin/bash
# BarterTap.az Hostinger Fix Script
# Bu script Hostinger-də xüsusi .htaccess yaradır və lazımi düzəlişlər edir

# Qovluğu müəyyən edirik
ROOT_FOLDER="./public_html"

# Public_html qovluğunu yoxlayırıq
if [ ! -d "$ROOT_FOLDER" ]; then
  echo "Xəta: $ROOT_FOLDER qovluğu tapılmadı."
  echo "Bu scripti Hostinger serverində public_html qovluğunun üst qovluğunda işlədin."
  exit 1
fi

# .htaccess faylı yaradırıq
echo "Hostinger-də .htaccess faylı yaradılır..."
cat > "$ROOT_FOLDER/.htaccess" << 'EOL'
# BarterTap.az üçün .htaccess faylı
# Bu fayl Hostinger serverində JavaScript MIME tipi problemini həll edir

# Enable the rewrite engine
RewriteEngine On
RewriteBase /

# Serving Brotli compressed CSS/JS if available and the browser accepts it
<IfModule mod_rewrite.c>
  RewriteCond %{HTTP:Accept-Encoding} br
  RewriteCond %{REQUEST_FILENAME}.br -f
  RewriteRule ^(.*)$ $1.br [L]
  <FilesMatch "\.(js|css|html|svg|xml)\.br$">
    RemoveType application/x-brotli
    RemoveLanguage .br
    AddType text/javascript .js.br
    AddType text/css .css.br
    AddType text/html .html.br
    AddType image/svg+xml .svg.br
    AddType application/xml .xml.br
    AddEncoding br .br
  </FilesMatch>
</IfModule>

# MIME tipləri ilə bağlı problemləri həll edir
<IfModule mod_mime.c>
  # JavaScript MIME tipləri
  AddType application/javascript .js
  AddType application/javascript .mjs
  AddType text/javascript .js
  AddType text/javascript .mjs
  
  # JSON MIME tipləri
  AddType application/json .json
  
  # CSS MIME tipləri
  AddType text/css .css
  
  # Font MIME tipləri
  AddType font/ttf .ttf
  AddType font/otf .otf
  AddType font/woff .woff
  AddType font/woff2 .woff2
  AddType application/vnd.ms-fontobject .eot
  
  # Image MIME tipləri
  AddType image/svg+xml .svg
  AddType image/png .png
  AddType image/jpeg .jpg .jpeg
  AddType image/gif .gif
  AddType image/webp .webp
  
  # Media MIME tipləri
  AddType audio/ogg .ogg
  AddType audio/mpeg .mp3
  AddType video/mp4 .mp4
  AddType video/webm .webm
</IfModule>

# Səhv səhifələrini yönləndirmək
ErrorDocument 404 /index.html
ErrorDocument 403 /index.html
ErrorDocument 500 /index.html

# Seçilmiş headers
<IfModule mod_headers.c>
  # CORS - cross origin qaydalar
  Header set Access-Control-Allow-Origin "*"
  Header set Access-Control-Allow-Methods "GET, POST, OPTIONS, PUT, DELETE"
  Header set Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  
  # SPA üçün cache qaydalar
  <FilesMatch "\.(?i:html)$">
    Header set Cache-Control "max-age=0, no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires "Wed, 11 Jan 1984 05:00:00 GMT"
  </FilesMatch>
  
  # Static assets üçün cache qaydalar
  <FilesMatch "\.(?i:js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
    Header set Cache-Control "max-age=31536000, public"
  </FilesMatch>
</IfModule>

# SPA routing üçün bütün istəkləri index.html-ə yönləndirmək
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Mövcud fayllar və qovluqlar üçün yenidən yönləndirməməliyik
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # API istəklərini yönləndirməməliyik
  RewriteCond %{REQUEST_URI} !^/api/
  
  # Qalan bütün istəkləri index.html-ə yönləndiririk
  RewriteRule ^ index.html [QSA,L]
</IfModule>
EOL

echo ".htaccess faylı uğurla yaradıldı."

# index.html faylını axtarırıq və yoxlayırıq
INDEX_FILE="$ROOT_FOLDER/index.html"
if [ -f "$INDEX_FILE" ]; then
  echo "index.html faylı tapıldı. JavaScript tipini yoxlayırıq..."
  
  # index.html faylında "type='module'" axtarırıq
  if grep -q "type=\"module\"" "$INDEX_FILE"; then
    echo "type=\"module\" tapıldı. Faylın ehtiyat nüsxəsini yaradırıq..."
    cp "$INDEX_FILE" "${INDEX_FILE}.backup"
    
    # type="module" -> type="application/javascript" ilə əvəz edirik
    sed -i 's/type="module"/type="application\/javascript"/g' "$INDEX_FILE"
    echo "index.html faylı uğurla yeniləndi."
  else
    echo "index.html faylında type=\"module\" tapılmadı. Dəyişiklik edilmədi."
  fi
else
  echo "Xəbərdarlıq: $INDEX_FILE faylı tapılmadı."
fi

echo "Prosses tamamlandı. Sayt yoxlanılmalıdır."
echo "Brauzer keşini təmizləməyi unutmayın!"