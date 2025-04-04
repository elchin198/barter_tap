# Hostinger-də JavaScript MIME Tipi Problemlərinin Həlli

Bu təlimat BarterTap.az saytının Hostinger hostingdə yerləşdirilməsi zamanı qarşılaşdığınız JavaScript MIME tipi problemlərini həll etmək üçün hərtərəfli bir bələdçidir.

## Problemin Anlaşılması

Hostinger-də JavaScript fayllarının yüklənməsində "Failed to load module script: MIME type 'text/html'" xətası alırsınızsa, bunun üç əsas səbəbi ola bilər:

1. **Serverdə JavaScript faylı tapılmır**: Server 404 xətası qaytarır (hansı ki, content type-ı text/html-dir)
2. **Server JavaScript fayllarını yanlış MIME tipi ilə göndərir**: Server JS fayllarına text/html kimi baxır
3. **Script tag düzgün konfiqurasiya edilməyib**: HTML-dəki `type="module"` və server konfiqurasiyası uyğun deyil

## Həll Addımları

### 1. Hostinger-də Faylların Düzgün Yerləşdirilməsi

Bütün build fayllarının `public_html` qovluğuna köçürüldüyünü yoxlayın:

```bash
# Local maşında build prosesi
npm run build

# Build outputunu Hostinger-ə yükləmək
scp -r dist/public/* user@hostinger-server:public_html/
```

**Önəmli**: `public_html/` içinə yüklədiyiniz zaman, fayl strukturu düz olmalıdır, yəni `public_html/assets/index-123.js` kimi olmalıdır, `public_html/dist/public/assets/index-123.js` deyil.

### 2. `.htaccess` Faylının Yaradılması

`simple_htaccess.txt` faylını `public_html` qovluğunda `.htaccess` adı ilə yaradın:

```bash
cp simple_htaccess.txt public_html/.htaccess
```

Və ya `hostinger_simple_fix.sh` skriptini FTP ilə serverə yükləyib işlədin:

```bash
chmod +x hostinger_simple_fix.sh
./hostinger_simple_fix.sh
```

### 3. `index.html` Faylının Düzəldilməsi

`index.html` faylını düzəldin və `type="module"` yerinə `type="application/javascript"` istifadə edin:

```html
<!-- Köhnə -->
<script type="module" src="/assets/index-123.js"></script>

<!-- Yeni -->
<script type="application/javascript" src="/assets/index-123.js"></script>
```

Bu düzəlişi manual olaraq edə bilərsiniz və ya `hostinger_simple_fix.sh` skriptindən istifadə edə bilərsiniz.

### 4. Hostinger-də Problemlərin Yoxlanması

Yükləmədən sonra aşağıdakı yoxlamaları aparın:

1. **Fayl mövcudluğunu yoxlayın**: URL-i direkt olaraq brauzerə yazın, məsələn: `https://bartertap.az/assets/index-123.js` - əgər 404 xətası alırsınızsa, fayl yoxdur
2. **MIME tipini yoxlayın**: Brauzer DevTools-un Network panelindən faylın "Response Headers" bölməsinə baxın - "Content-Type" göstərilməlidir
3. **HTTP cavabını yoxlayın**: `curl -I https://bartertap.az/assets/index-123.js` əmrini işlədin və "Content-Type" headerinə baxın

## Ətraflı Testlər

### Nəyi Axtarmaq Lazımdır

Hostinger cPanel və ya File Manager-dən belə yoxlayın:

1. **Əsas qovluqda `.htaccess` varmı?**: `public_html/.htaccess` faylının mövcudluğunu yoxlayın
2. **Build faylları düzgün köçürülüb?**: `public_html/assets/` qovluğunda fayllar olmalıdır
3. **Server jurnal faylları**: `error_log` faylını yoxlayın - burada xətaları görə bilərsiniz

### Əsas Yerləşdirmə Qaydaları - Hostinger

1. **Bütün build fayllarını köçürün**: `dist/public/*` → `public_html/`
2. **`.htaccess` faylınızı yaradın**: Yuxarıda göstərilən konfiqurasiya ilə
3. **JavaScript yüklənməsini düzəldin**: `type="application/javascript"` istifadə edin
4. **Brauzer keşini təmizləyin**: Ctrl+F5 və ya Network panelində "Disable cache" seçin

## Problemlərin Həlli

### 1. "Failed to load module script: MIME type text/html"

- **Həll**: `.htaccess` faylını yoxlayın və JavaScript üçün düzgün MIME tiplərinin təyin edildiyinə əmin olun:
  ```
  AddType application/javascript .js
  AddType application/javascript .mjs
  ```
- **Alternativ həll**: `index.html` faylında `type="module"` → `type="application/javascript"` ilə əvəz edin

### 2. "404 Not Found" xətaları

- **Həll**: Faylların düzgün yüklənib-yüklənmədiyini yoxlayın. `public_html/` qovluğunun içərisində faylları axtarın. Lazım gələrsə yenidən yükləyin.

### 3. "CORS policy" xətaları

- **Həll**: `.htaccess` faylına CORS headerlərini əlavə edin:
  ```
  Header set Access-Control-Allow-Origin "*"
  Header set Access-Control-Allow-Methods "GET, POST, OPTIONS, PUT, DELETE"
  ```

## Qısa Yoxlama Siyahısı

- [ ] JavaScript faylları serverdə mövcuddur
- [ ] `.htaccess` faylı `public_html` qovluğunda yaradılıb
- [ ] `index.html` faylında script tagları düzgün konfiqurasiya edilib
- [ ] Hostinger cPanel-dən jurnal faylları üçün "Error Log" bölməsini yoxlayın
- [ ] Brauzer keşi tam təmizlənib (Ctrl+F5)

## Daha Çox Problemlərlə Qarşılaşsanız

Əgər problem davam edərsə:

1. **Hostinger-ə müraciət edin**: Support bölməsindən mod_mime və üstquruluşun aktiv olub-olmadığını soruşun
2. **Vite konfiqurasiyasını dəyişin**: Uzun müddətli həll üçün Vite build konfiqurasiyasını dəyişin
3. **PHP əsaslı bir boşqabı nəzərdən keçirin**: Əgər Hostinger-in quraşdırmaları SPA-nı tam dəstəkləmirsə