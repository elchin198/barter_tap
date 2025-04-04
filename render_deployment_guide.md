# Render.com Deployment Təlimatları

Bu təlimatlar BarterTap layihəsinin Render.com platformasında uğurla yerləşdirilməsi üçün addım-addım göstərişlər verir.

## Əsas Maneələr və Həlləri

Render.com-da yerləşdirmə zamanı qarşılaşılan əsas problemlər:

1. **MIME tipi xətaları**: JavaScript modulları düzgün MIME tipi ilə xidmət edilmir
2. **Build keşi problemləri**: Köhnə keş fayl ziddiyyətlərinə səbəb olur
3. **Faylların tapılmaması**: Build prosesindən sonra statik fayllar düzgün yerləşdirilmir

Bu təlimatlar bu problemləri həll etmək üçün addımları əhatə edir.

## Önşərtlər

Başlamazdan əvvəl aşağıdakılardan əmin olun:

- Render.com hesabınız var
- GitHub repozitoriyanıza Render.com-un girişi var
- Layihənin kökündə `render.yaml` faylı var

## Deployment Addımları

### 1. Vacib Faylların Mövcudluğunu Yoxlayın

Render.com-un düzgün işləməsi üçün bu faylların repoda olduğundan əmin olun:

- `render.yaml` - Render.com konfiqurasiyaları
- `render-server.js` - Xüsusi Express server
- `api_healthcheck.js` - Sistemin sağlamlıq yoxlaması

### 2. Asılılıqları Yeniləyin

Render.com-da deployment etməzdən əvvəl, lokal olaraq bu asılılıqları əlavə edin:

```bash
npm install compression cors --save
git add package.json package-lock.json
git commit -m "Render deployment üçün asılılıqlar əlavə edildi"
git push
```

### 3. Render Dashboard-da Deployment

1. Render.com Dashboard-a daxil olun
2. "New" və ya "+" düyməsinə klikləyin
3. "Blueprint" seçin (Render.yaml faylı varsa)
4. GitHub repozitoriyanızı seçin
5. "Deploy" düyməsinə klikləyin

### 4. Manual Deploy və Keş Təmizliyi

Deployment uğursuz olarsa:

1. Render Dashboard-da servisinizi seçin
2. "Manual Deploy" düyməsinə klikləyin
3. "Clear build cache & deploy" seçin
4. Build prosesinin log-larını diqqətlə izləyin

### 5. Deployment problemlərini aradan qaldırma

#### MIME tipi xətaları

Əgər JavaScript faylları ilə MIME tipi problemləri yaşayırsınızsa:

1. `render-server.js` faylının düzgün MIME tipi təyin etdiyini yoxlayın
2. `render.yaml` faylında başlıqların düzgün qurulduğunu yoxlayın

#### Build prosesi xətaları

Build prosesində xətalarla qarşılaşdıqda:

1. Log fayllarında konkret xəta mesajlarını axtarın
2. Çatışmayan asılılıqlar üçün `package.json` faylını yoxlayın
3. Build əmrinin `render.yaml` faylında düzgün qeyd edildiyini təsdiqləyin

### 6. Health Check URL-ni yoxlayın

Deployment tamamlandıqdan sonra health check endpoint-inin işlədiyini yoxlayın:

```
https://barter-api-8jr6.onrender.com/api/healthcheck
```

Əgər bu URL 200 OK cavabı verirsə, serveriniz düzgün işləyir.

## Faydalı Render.com Əmrləri

 
- **Build əmri üçün**: `npm ci && npm run build`
- **Start əmri üçün**: `node render-server.js`
- **Health check yolu üçün**: `/api/healthcheck`

## Təhlükəsizlik Məsləhətləri

- Render Dashboard-da bütün mühit dəyişənlərini quraşdırdığınıza əmin olun
- DATABASE_URL və SESSION_SECRET kimi həssas məlumatları təhlükəsiz şəkildə saxlayın
- Rate limiting və ya WAF (Web Application Firewall) istifadə etməyi düşünün

## Əlavə Mənbələr

- [Render.com Rəsmi Sənədləri](https://render.com/docs)
- [Express.js Static File Serving](https://expressjs.com/en/starter/static-files.html)
- [GitHub Actions ilə Render.com-a yerləşdirmə](https://render.com/docs/github-actions)

## Tez-tez qarşılaşılan problemlər və həlləri

### 1. "Module not found" xətası

- `package.json` faylında müvafiq paketin əlavə edildiyini yoxlayın
- `npm ci` əmrinin build prosesində düzgün işlədiyindən əmin olun

### 2. MIME tipi problemləri

- Statik fayllar üçün MIME tiplərinin `render-server.js`-də və `render.yaml`-da düzgün təyin edildiyini yoxlayın
- Headers bölməsini `render.yaml` faylında yoxlayın

### 3. Assets fayllarının tapılmaması

- `dist/public/assets` qovluğunun mövcudluğunu yoxlayın
- Build prosesinin uğurla tamamlandığından əmin olun

### 4. CPU və ya yaddaş limiti aşıldı

- Free tier-də Render.com-un məhdudiyyətlərinə diqqət edin
- CPU-intensiv əməliyyatları optimallaşdırın
- Yaddaş sızıntılarını izləyin və aradan qaldırın