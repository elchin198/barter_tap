# JavaScript MIME Tipi Problemlərinin Həlli Təlimatı

Bu təlimat "Failed to load module script: MIME type 'text/html'" xətasının həlli üçün hərtərəfli bir bələdçidir. Həm Hostinger, həm də Render.com kimi platformalarda istifadə edilə bilər.

## Problemin Anlaşılması

JavaScript module fayllarının yüklənməsində "Failed to load module script: MIME type 'text/html'" xətası, əsasən 3 səbəbdən qaynaqlanır:

1. **Faylın tapılmaması**: Server, faylı tapa bilmir və 404 (təbii ki, HTML) xətası qaytarır
2. **Yanlış MIME tipi**: Server, JavaScript fayllarını düzgün MIME tipi ilə təqdim etmir
3. **Module/script tipi uyğunsuzluğu**: HTML-dəki `type="module"` və serverin MIME tipi konfiqurasiyası bir-birinə uyğun deyil

## Hosting Platformalarına Görə Həll Yolları

### Hostinger (.htaccess istifadə edərək)

1. **`.htaccess` faylı yaradın** və bu tənzimləmələri əlavə edin:

   ```apache
   # JavaScript MIME tipləri
   AddType application/javascript .js
   AddType application/javascript .mjs
   AddType text/javascript .js
   AddType text/javascript .mjs
   
   # Digər media tipləri də təyin edin
   AddType application/json .json
   AddType text/css .css
   ```

2. **Script tipini dəyişin**: `index.html` faylında, script taglarını dəyişin:

   ```html
   <!-- Köhnə -->
   <script type="module" src="/assets/index-123.js"></script>
   
   <!-- Yeni -->
   <script type="application/javascript" src="/assets/index-123.js"></script>
   ```

3. **Sadə skriptdən istifadə edin**: Bu repodan `hostinger_simple_fix.sh` skriptini yükləyib işlədin.

### Render.com (Express Server ilə)

1. **Xüsusi Express server konfiqurasiyası** yaradın:

   ```javascript
   // MIME tipi middleware
   app.use((req, res, next) => {
     const ext = path.extname(req.path).toLowerCase();
     if (ext === '.js' || ext === '.mjs') {
       res.set('Content-Type', 'application/javascript');
     }
     next();
   });
   
   // Static fayl xidməti
   app.use(express.static(publicFolder, {
     setHeaders: (res, filePath) => {
       const ext = path.extname(filePath).toLowerCase();
       if (ext === '.js' || ext === '.mjs') {
         res.set('Content-Type', 'application/javascript');
       }
     }
   }));
   ```

2. **`render.yaml` faylında** MIME tipləri üçün headers bölməsi əlavə edin:

   ```yaml
   headers:
     - path: /assets/*.js
       name: Content-Type
       value: application/javascript
   ```

3. **Bu repodakı hazır serverləri istifadə edin**: `render-server.js` və `api_healthcheck.js` kimi hazır faylları yükləyin və istifadə edin.

## Ümumi Həll Yolları (Platformadan Asılı Olmayaraq)

1. **Fayl tapılması probleminin həlli**:
   - Yerləşdirmə strukturunun düzgün olduğundan əmin olun: `dist/public/*` faylları direkt olaraq `public_html/` qovluğuna köçürülməlidir
   - Fayl yolları düzgün olmalıdır: `/assets/file.js` kimi yol üçün `public_html/assets/file.js` faylı mövcud olmalıdır

2. **MIME tipi probleminin həlli**:
   - Hostinger: `.htaccess` faylında düzgün MIME tipləri təyin edin
   - Render.com: Express middleware və header tənzimləmələri əlavə edin
   - Bütün platformalarda: `type="module"` → `type="application/javascript"` dəyişdirin

3. **Test və yoxlamalar**:
   - Brauzer DevTools-un Network panelindən faylların HTTP cavablarını yoxlayın
   - `curl -I` əmri ilə Content-Type headerləri yoxlayın
   - Brauzer keşini təmizləyin

## Hostinger və Render.com üçün Təlimatlar

Bu reponun tərkibində aşağıdakı faydalı fayllar var:

- **Hostinger üçün**:
  - `simple_htaccess.txt` - Ətraflı `.htaccess` nümunəsi
  - `hostinger_simple_fix.sh` - Avtomatik düzəliş skripti
  - `hostinger_instructions.md` - Ətraflı təlimatlar

- **Render.com üçün**:
  - `render-server.js` - Tam konfiqurasiya edilmiş Express server
  - `render.yaml` - Render.com üçün blueprint faylı  
  - `api_healthcheck.js` - Sağlamlıq yoxlaması üçün endpoint
  - `render_deployment_guide.md` - Ətraflı təlimatlar

## Yoxlama Siyahısı

Aşağıdakı əsas nöqtələri yoxlayın:

- [ ] JavaScript faylları düzgün yerləşdirilib və mövcuddur
- [ ] Server MIME tiplərini düzgün tənzimləyir
- [ ] HTML-də script tagları uyğun şəkildə tənzimlənib
- [ ] Bütün keşlər təmizlənib

## Problem Davam Edirsə

Əgər bu həllərdən sonra problem davam edirsə:

1. **Vite konfiqurasiyasını dəyişdirin**: `vite.config.ts` faylında build tənzimləmələrini dəyişin
2. **Minimal test səhifəsi yaradın**: Sadə bir HTML + JS faylı yaradıb problemi təkrar etməyə çalışın
3. **Hostinq support-ə müraciət edin**: server konfiqurasiyası ilə bağlı əlavə məlumat istəyin

Bu təlimat Hostinger və Render.com-da qarşılaşa biləcəyiniz ən yaygın JavaScript MIME tipi problemlərini həll etməlidir. Hər bir mühit üçün daha ətraflı məlumat üçün xüsusi sənədlər əlavə edilmişdir.