# Render.com Miqrasiya Təlimatı

Bu təlimat, BarterTap tətbiqinin verilənlər bazasını Hostinger-dən Render.com-a necə köçürməyinizi izah edir.

## 1. Hazırlıq

### 1.1 Lazım olan alətlər
- `pg_dump` və `psql` (PostgreSQL alətləri)
- MySQL-dən PostgreSQL-ə köçürmə aləti (`mysqldump` və `pgloader`)

### 1.2 Render.com verilənlər bazası məlumatlarınızı əldə edin
- Render Dashboard-dan verilənlər bazası servisinə keçin
- "Connect" bölməsindən bağlantı məlumatlarını qeyd edin:
  - Hostname
  - Port
  - Database
  - Username
  - Password
  - Connection string

## 2. MySQL-dən Verilənləri İxrac edin

### 2.1 MySQL verilənlər bazasını dump edin
```bash
mysqldump -h ${MYSQL_HOST} -u ${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE} > bartertap_mysql_dump.sql
```

### 2.2 CSV formatına köçürün (alternativ yanaşma)
Əgər birbaşa dump ilə problemlər yaşanırsa, hər bir cədvəli CSV formatına ixrac edə bilərsiniz:

```bash
mysql -h ${MYSQL_HOST} -u ${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE} -e "SELECT * FROM users INTO OUTFILE '/tmp/users.csv' FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n';"
```

Eyni əməliyyatı bütün əsas cədvəllər üçün təkrarlayın: `items`, `categories`, `conversations`, `messages`, `images`, vəs.

## 3. PostgreSQL-ə Köçürün

### 3.1 Birbaşa pgloader ilə köçürmə (ən asan üsul)
pgloader, MySQL verilənlər bazasını birbaşa PostgreSQL-ə köçürə bilər:

```bash
pgloader mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@${MYSQL_HOST}/${MYSQL_DATABASE} postgresql://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}
```

### 3.2 Manual köçürmə (əgər pgloader mümkün deyilsə)

#### 3.2.1 PostgreSQL sxemini yaradın
Drizzle sxemini PostgreSQL-də yaratmaq üçün:

```bash
NODE_ENV=production npm run db:push
```

#### 3.2.2 CSV-ləri PostgreSQL-ə import edin
```bash
psql -h ${PG_HOST} -U ${PG_USER} -d ${PG_DATABASE} -c "\COPY users FROM '/tmp/users.csv' WITH (FORMAT csv, HEADER);"
```

Eyni əməliyyatı bütün əsas cədvəllər üçün təkrarlayın.

## 4. Verilənləri Doğrulayın

### 4.1 Əsas məlumatların köçürüldüyünü yoxlayın
```bash
psql -h ${PG_HOST} -U ${PG_USER} -d ${PG_DATABASE} -c "SELECT COUNT(*) FROM users;"
psql -h ${PG_HOST} -U ${PG_USER} -d ${PG_DATABASE} -c "SELECT COUNT(*) FROM items;"
```

### 4.2 Nümunə məlumatları yoxlayın
```bash
psql -h ${PG_HOST} -U ${PG_USER} -d ${PG_DATABASE} -c "SELECT id, username, email FROM users LIMIT 5;"
psql -h ${PG_HOST} -U ${PG_USER} -d ${PG_DATABASE} -c "SELECT id, title, category FROM items LIMIT 5;"
```

## 5. Əlaqələri və İndeksləri Yenidən Yaradın

Əgər əlaqələr və indekslər düzgün köçürülməyibsə, onları yenidən yaratmaq lazım ola bilər:

```bash
psql -h ${PG_HOST} -U ${PG_USER} -d ${PG_DATABASE} -f scripts/recreate_constraints.sql
```

## 6. Tətbiqi Render.com-da Yenidən Konfiqurasiya Edin

### 6.1 Mühit dəyişənlərini yeniləyin
Render Dashboard-da tətbiqin "Environment" bölməsində `DATABASE_URL` dəyişənini yeniləyin.

### 6.2 Tətbiqi yenidən başladın
Render Dashboard-da "Manual Deploy" > "Clear build cache & deploy" seçin.

## 7. Tətbiqi Sınaqdan Keçirin

### 7.1 Admin paneldən auth/məlumat daxil olma imkanını yoxlayın
- Admin hesabına daxil olun
- Əsas funksiyaları sınaqdan keçirin

### 7.2 İstifadəçi hesablarını yoxlayın
- Test istifadəçi hesabları ilə daxil olun
- Əsas funksiyaları sınaqdan keçirin

## 8. Problemlərin Həlli

### 8.1 Sequence problemləri
Ardıcıllıq dəyərlərinin sinxronizasiyası üçün:

```sql
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users), true);
SELECT setval('items_id_seq', (SELECT MAX(id) FROM items), true);
-- Digər cədvəllər üçün də eyni qaydada...
```

### 8.2 Data uyğunsuzluq problemləri
Verilənlərin tipləri və formatları arasında uyğunsuzluqlar üçün:

```sql
-- Tarix tipləri düzəltmək
UPDATE items SET created_at = NOW() WHERE created_at IS NULL;

-- Verilənlərin strukturunu düzəltmək
ALTER TABLE users ALTER COLUMN phone TYPE VARCHAR(20);
```

## 9. Köhnə Sistemi Arxivləyin

### 9.1 Hostinger verilənlər bazasını arxivləyin
Köhnə verilənlər üçün tam bir arxiv yaradın:

```bash
mysqldump -h ${MYSQL_HOST} -u ${MYSQL_USER} -p${MYSQL_PASSWORD} --all-databases > all_mysql_databases_backup.sql
```

### 9.2 Hostinger veb tətbiqini arxivləyin
Bütün faylların tam arxivini yaradın.

## 10. Əlavə Qeydlər

### 10.1 Hostinger ilə Render.com arasında keçid dövrü
Bir müddət hər iki sistemi paralel işlədə bilərsiniz:

1. Render.com API-yə Hostinger frontend-dən daxil olun
2. Köhnə URL-ləri yeniləri ilə əvəz edən bir redirect proxy yaradın

### 10.2 DNS dəyişikliklər
Əgər eyni domain adını istifadə etmək istəyirsinizsə, DNS qeydlərini ehtiyatla yeniləyin.

### 10.3 SSL Sertifikatları
Render.com avtomatik SSL sertifikatları təqdim edir, əlavə konfiqurasiya tələb olunmur.