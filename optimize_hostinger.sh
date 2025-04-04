#!/bin/bash

# BarterTap.az Hostinger Optimallaşdırma Skripti
# Bu skript Hostinger mühitində saytı optimallaşdırmaq üçün vasitədir

# SSH məlumatları
HOST="46.202.156.134"
PORT="65002"
USER="u726371272"

# Hostinger-də hədəf qovluq
REMOTE_DIR="public_html"

# Əsas faylların mövcudluğunu yoxlayırıq
if [ ! -f ".htaccess" ] || [ ! -f "index.php" ]; then
    echo "Xəta: .htaccess və ya index.php faylları tapılmadı."
    echo "Əvvəlcə faylları yaratmalısınız."
    exit 1
fi

echo "Hostinger optimallaşdırma prosesi başlayır..."

# 1. Hostinger panelindən PHP versiyasını yoxlayırıq
echo "PHP versiyasını yoxlayırıq..."
ssh -p $PORT $USER@$HOST "php -v | head -n 1"

# 2. .htaccess faylını köçürürük
echo ".htaccess faylını köçürürük..."
scp -P $PORT .htaccess $USER@$HOST:$REMOTE_DIR/

# 3. index.php faylını köçürürük
echo "index.php faylını köçürürük..."
scp -P $PORT index.php $USER@$HOST:$REMOTE_DIR/

# 4. hostinger_cache_clear.php faylını köçürürük
echo "Keş təmizləmə skriptini köçürürük..."
scp -P $PORT hostinger_cache_clear.php $USER@$HOST:$REMOTE_DIR/

# 5. JavaScript fayllarını yoxlayırıq
echo "JavaScript fayllarının MIME tiplərini yoxlayırıq..."
ssh -p $PORT $USER@$HOST "cd $REMOTE_DIR && find assets -name '*.js' -type f -print | head -n 3"

# 6. JavaScript fayllarının MIME tipini dəyişirik
echo "JavaScript fayllarının başlanğıcını düzəldirik..."
ssh -p $PORT $USER@$HOST "cd $REMOTE_DIR && find assets -name '*.js' -type f -exec sed -i '1s/^/\/\/ @ts-nocheck\n/' {} \;"

# 7. Keş məlumatlarını təmizləyirik
echo "Hostinger keşini təmizləyirik..."
ssh -p $PORT $USER@$HOST "cd $REMOTE_DIR && php hostinger_cache_clear.php"

# 8. Hostinger xüsusi konfiqurasiyalarını yoxlayırıq
echo "Hostinger konfiqurasiyalarını yoxlayırıq..."
ssh -p $PORT $USER@$HOST "cd $REMOTE_DIR && grep 'AddType' .htaccess"

# 9. Əsas index.html faylını yoxlayırıq
echo "index.html faylını yoxlayırıq..."
ssh -p $PORT $USER@$HOST "cd $REMOTE_DIR && grep -n 'type=' index.html | grep -i script"

# 10. index.html faylında script tipini dəyişdiririk
echo "index.html faylında script tipini düzəldirik..."
ssh -p $PORT $USER@$HOST "cd $REMOTE_DIR && sed -i 's/type=\"module\"/type=\"application\/javascript\"/g' index.html"

echo "Optimallaşdırma prosesi tamamlandı."
echo "Saytın URL-dən yoxlanması tövsiyə olunur: https://bartertap.az"
echo "Brauzer keşini təmizləməyi unutmayın (Ctrl+F5 və ya Shift+F5)"