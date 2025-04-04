# Render.com Deployment Təlimatları

Bu təlimatlar Render.com platformasında BarterTap tətbiqini yerləşdirmək üçün addım-addım təlimatları təmin edir.

## Əsas Problem

MIME tipləri ilə bağlı xəta: `Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "text/html"`. 

Bu problem JavaScript module fayllarının düzgün MIME tipləri ilə təqdim edilməməsi səbəbindən yaranır. Biz bunu həll edirik.

## Deployment Addımları

### 1. Deployment Paketini Hazırlamaq

```bash
# İcazəni dəyiş
chmod +x render_deploy.sh

# Deployment paketini yarat
./render_deploy.sh
```

Bu, dist/ qovluğunda deployment paketini yaradacaq.

### 2. Render.com üçün Manual Deployment

Render.com-da manual yerləşdirmək üçün:

1. Render.com hesabınıza daxil olun
2. "New" düyməsinə klikləyin
3. "Web Service" seçin
4. GitHub reponuzu seçin
5. Aşağıdakı parametrləri konfiqurasiya edin:
   - Name: bartertap
   - Environment: Node
   - Build Command: `cd dist && npm install`
   - Start Command: `cd dist && node simplified-server.js`
   - Add Environment Variable:
     - `PORT`: 10000
     - `NODE_ENV`: production

### 3. Render YAML ilə Deployment

Alternativ olaraq, `render.yaml` faylını istifadə edə bilərsiniz:

1. dist qovluğunuzu GitHub-a push edin
2. Render.com hesabınıza daxil olun
3. "New" düyməsinə klikləyin
4. "Blueprint" seçin
5. GitHub reponuzu seçin
6. render.yaml faylının aşkarlanması üçün gözləyin və onun yerləşdirilməsini təsdiqləyin

## Troubleshooting

Əgər MIME tipi problemləri davam edirsə:

1. Render.com dashboard-dan web xidmətinizə daxil olun
2. "Environment" bölməsində aşağıdakı environment dəyişənlərini əlavə edin:
   - `SERVE_STATIC_WITH_MIDDLEWARE`: true

## Monitorinq

Deployment sonra:

1. "Logs" bölməsindən serverinizin loglarını izləyin
2. "Events" bölməsindən build və deploy prosesini izləyin

## HTTPS Sertifikatı

Render.com avtomatik olaraq HTTPS sertifikatını təqdim edir. Heç bir əlavə konfiqurasiya tələb olunmur.

## Domain İnteqrasiyası

Öz domainizə qoşulmaq üçün:

1. Render.com dashboard-dan web xidmətinizdə "Settings" bölməsinə keçin
2. "Custom Domain" bölməsini tapın
3. Öz domainizi əlavə edin və DNS ilə bağlı təlimatları izləyin