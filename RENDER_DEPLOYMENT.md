# BarterTap.az - Render.com Yerləşdirmə Təlimatları

Bu sənəd BarterTap.az layihəsinin Render.com platformasında yerləşdirilməsi üçün addım-addım təlimatları təqdim edir.

## Əsas addımlar

1. [Render.com](https://render.com) hesabına daxil olun və ya qeydiyyatdan keçin
2. "New" düyməsinə klikləyin və "Web Service" seçin
3. GitHub repositoriyasını qoşun (Connect your GitHub account)
4. BarterTap layihəsinin repositoriyasını seçin
5. Aşağıdakı tənzimləmələri daxil edin:

### Əsas tənzimləmələr

- **Name**: bartertap (və ya istədiyiniz ad)
- **Region**: Frankfurt (və ya sizə yaxın region)
- **Branch**: main
- **Runtime**: Node
- **Build Command**: `npm install && npm run build`
- **Start Command**: `node render-server.js`
- **Health Check Path**: `/api/healthcheck`

### Mühit dəyişənləri (Environment Variables)

"Environment" bölməsində əlavə edin:

- `NODE_ENV`: production
- `PORT`: 10000

## Troubleshooting - Tez-tez qarşılaşılan problemlər

### 1. Paketlərin tapılmaması problemi

Əgər `Cannot find module 'X'` xətası alırsınızsa:

```bash
# Bu əmri yerli mühitinizdə işlədin və dəyişiklikləri push edin
npm install X --save
git add package.json package-lock.json
git commit -m "Add missing dependency X"
git push
```

### 2. MIME tipi problemləri

Əgər JavaScript və ya CSS faylları düzgün yüklənmirsə:

- `render.yaml` faylındakı `headers` bölməsini yoxlayın
- `render-server.js` faylında Express tərəfindən təqdim edilən statik faylları yoxlayın

### 3. Quraşdırmadan sonra sayt görünmürsə

Bu əmrləri Render.com konsolu vasitəsilə icra edin:

```bash
ls -la
ls -la dist/
cat render-server.js
```

## Yerləşdirmə stаtusu yoxlama

Deployment başladıqdan sonra log-ları yoxlayın. Uğurlu deployment göstəriciləri:

- "Build successful" mesajı
- "Starting service with 'node render-server.js'" mesajı
- Healthcheck-in uğurla keçməsi

## Əlavə qeydlər

- Render.com ücretsiz planında təxminən 15 dəqiqə fəaliyyətsizlikdən sonra server yuxu rejimininə keçir. İlk sorğu zamanı yenidən başlamaq üçün 30-60 saniyə lazım ola bilər.
- Əgər mümkünsə, statik fayllar üçün CDN (Content Delivery Network) istifadə etməyi düşünün.

## Yardım üçün əlaqə

Texniki dəstək və əlavə məlumat üçün:
- Email: hicran.huseynli@gmail.com
- Telegram: @hicranhuseynli