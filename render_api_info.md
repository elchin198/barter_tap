# Render.com API Məlumatı

## Mövcud API Məlumatı

Render.com-da yerləşdirilən BarterTap API-nin hazırkı ünvanı:

```
https://barter-api-8jr6.onrender.com
```

## API Endpoints

API aşağıdakı əsas nöqtələri təqdim edir:

### Sağlamlıq Yoxlaması
```
GET /api/health
```
Endpoint serverin işləmə vəziyyətini yoxlamaq üçün istifadə edilir. Cavab kimi aşağıdakı JSON obyekti qaytarılır:
```json
{
  "status": "ok",
  "timestamp": "2025-03-27T12:34:56.789Z",
  "environment": "production",
  "version": "1.0.0"
}
```

### Autentifikasiya
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me
```

### İstifadəçi İdarəetməsi
```
GET /api/users/:id
PUT /api/users/me
```

### Elanlar
```
GET /api/items
GET /api/items/:id
POST /api/items
PUT /api/items/:id
DELETE /api/items/:id
GET /api/items/category/:category
```

### Kateqoriyalar
```
GET /api/categories
```

### Söhbətlər
```
GET /api/conversations
GET /api/conversations/:id
POST /api/conversations
GET /api/conversations/:id/messages
POST /api/conversations/:id/messages
```

### Bildirişlər
```
GET /api/notifications
PUT /api/notifications/:id/read
```

### WebSocket
```
WS /api/ws?userId=:userId
```

## Render.com ilə İnteqrasiya

Render.com məlumatları:

1. **Verilənlər bazası bağlantısı**: Render.com Postgres verilənlər bazası xidməti istifadə edilir. Verilənlər bazası URL-i Render tərəfindən `DATABASE_URL` mühit dəyişəni kimi təmin edilir.

2. **Miqyaslanma**: Render.com Free plan istifadə edilir, lakin daha çox istifadəçi tələbi olduqda Starter və ya Standard plana yüksəltmək tövsiyə olunur.

3. **Loqlar**: Log məlumatları Render dashboard vasitəsilə əlçatandır.

4. **Daimi işləmə**: Free planda server 15 dəqiqə işləmədikdə yuxu rejiminə keçir.

## Frontend İnteqrasiyası

Frontend-də API-yə bağlanmaq üçün aşağıdakı mühit dəyişənindən istifadə olunur:

```
VITE_API_URL=https://barter-api-8jr6.onrender.com
```

Bu dəyər `.env.production` faylında göstərilməlidir.

## Davamlı İnteqrasiya və Göndərmə

GitHub repository ilə Render.com xidmətinə davamlı göndərmə qurmaq üçün layihə strukturundakı `render.yaml` faylından istifadə edin.

## Hostinger-də Quraşdırma

Əgər siz Hostinger-də bu API-yə bağlanmaq istəyirsinizsə, Hostinger-də yerləşdirilmiş PHP frontend-indən bu endpointləri çağırmaq üçün aşağıdakı CORS konfiqurasiyasının server tərəfində etkin olduğundan əmin olun:

```javascript
app.use(
  cors({
    origin: ['https://bartertap.az', 'http://localhost:3000'],
    credentials: true
  })
);
```