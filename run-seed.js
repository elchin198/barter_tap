/**
 * NextBarter üçün seed skripti
 * Verilənlər bazasını test məlumatları ilə doldurmaq üçün
 */
import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;
dotenv.config();

// Check if DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  //console.error('DATABASE_URL mühit dəyişəni tapılmadı!');
  process.exit(1);
}

// Create a database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test users data
const users = [
  {
    username: 'admin',
    email: 'admin@nextbarter.az',
    password: '$2b$10$GxlzIFaOQl9iUGrjfxS3a.3E4Z7lZYh0hOWzLJ5HNNJKkPiQ3L5GS', // password123
    fullName: 'Admin User',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    bio: 'NextBarter admin və təsisçisi',
    phone: '+994501234567',
    city: 'Bakı',
    rating: 5,
    ratingCount: 28,
    role: 'admin',
    active: true
  },
  {
    username: 'elshad_m',
    email: 'elshad@example.com',
    password: '$2b$10$GxlzIFaOQl9iUGrjfxS3a.3E4Z7lZYh0hOWzLJ5HNNJKkPiQ3L5GS',
    fullName: 'Elşad Məmmədov',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    bio: 'Elektronika həvəskarı və mühəndis',
    phone: '+994551234567',
    city: 'Bakı',
    rating: 4,
    ratingCount: 15,
    role: 'user',
    active: true
  },
  {
    username: 'aysel_h',
    email: 'aysel@example.com',
    password: '$2b$10$GxlzIFaOQl9iUGrjfxS3a.3E4Z7lZYh0hOWzLJ5HNNJKkPiQ3L5GS',
    fullName: 'Aysel Hüseynova',
    avatar: 'https://randomuser.me/api/portraits/women/23.jpg',
    bio: 'Kitab həvəskarı',
    phone: '+994701234567',
    city: 'Sumqayıt',
    rating: 5,
    ratingCount: 12,
    role: 'user',
    active: true
  },
  {
    username: 'nicat85',
    email: 'nicat@example.com',
    password: '$2b$10$GxlzIFaOQl9iUGrjfxS3a.3E4Z7lZYh0hOWzLJ5HNNJKkPiQ3L5GS',
    fullName: 'Nicat Əliyev',
    avatar: 'https://randomuser.me/api/portraits/men/35.jpg',
    bio: 'İdman və sağlam həyat tərzi',
    phone: '+994551234568',
    city: 'Gəncə',
    rating: 3,
    ratingCount: 5,
    role: 'user',
    active: true
  },
  {
    username: 'leyla_r',
    email: 'leyla@example.com',
    password: '$2b$10$GxlzIFaOQl9iUGrjfxS3a.3E4Z7lZYh0hOWzLJ5HNNJKkPiQ3L5GS',
    fullName: 'Leyla Rəhimli',
    avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
    bio: 'Sənətkar və dizayner',
    phone: '+994701234569',
    city: 'Bakı',
    rating: 5,
    ratingCount: 18,
    role: 'user',
    active: true
  }
];

// Category data
const categories = [
  { name: 'Elektronika', displayName: 'Elektronika', icon: 'Smartphone', color: '#4299e1' },
  { name: 'Geyim', displayName: 'Geyim', icon: 'Shirt', color: '#ed8936' },
  { name: 'Kitablar', displayName: 'Kitablar', icon: 'BookOpen', color: '#38a169' },
  { name: 'Ev və bağ', displayName: 'Ev və bağ', icon: 'Home', color: '#805ad5' },
  { name: 'İdman', displayName: 'İdman', icon: 'Dumbbell', color: '#e53e3e' },
  { name: 'Oyuncaqlar', displayName: 'Oyuncaqlar', icon: 'Gamepad2', color: '#d69e2e' },
  { name: 'Nəqliyyat', displayName: 'Nəqliyyat', icon: 'Car', color: '#3182ce' },
  { name: 'Kolleksiya', displayName: 'Kolleksiya', icon: 'Award', color: '#9c4221' },
  { name: 'Digər', displayName: 'Digər', icon: 'Package', color: '#718096' }
];

// Sample item data (shortened version)
const sampleItems = [
  {
    title: 'Apple iPhone 12 Pro - 128GB',
    description: 'Əla vəziyyətdə, heç bir cızığı yoxdur. Orijinal qutusu və aksessuarları mövcuddur. Real alıcılar əlaqə saxlaya bilər.',
    category: 'Elektronika',
    subcategory: 'Telefonlar',
    condition: 'Əla',
    city: 'Bakı',
    price: 1200,
    wantedExchange: 'Macbook və ya iPad Pro',
    status: 'active',
    imageUrls: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format',
      'https://images.unsplash.com/photo-1598327105854-2b779d93607c?w=600&auto=format'
    ]
  },
  {
    title: 'Nike Air Force 1 - Orijinal 42 ölçü',
    description: 'Orijinal brend, istifadə olunmayıb, etiketləri üzərindədir. Ölçü balaca gəldiyi üçün satılır.',
    category: 'Geyim',
    subcategory: 'Ayaqqabılar',
    condition: 'Yeni',
    city: 'Bakı',
    price: 220,
    wantedExchange: 'Adidas Originals və ya digər Nike modeli 43 ölçü',
    status: 'active',
    imageUrls: [
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format',
      'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=600&auto=format'
    ]
  },
  {
    title: 'Harry Potter kolleksiyası - 7 kitab dəsti',
    description: 'Tam kolleksiya, yaxşı vəziyyətdə, cırılma yoxdur. İngilis dilində, original versiya.',
    category: 'Kitablar',
    subcategory: 'Bədii ədəbiyyat',
    condition: 'Yaxşı',
    city: 'Sumqayıt',
    price: 85,
    wantedExchange: 'Game of Thrones kitab seriyası',
    status: 'active',
    imageUrls: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format',
      'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600&auto=format'
    ]
  },
  {
    title: 'IKEA yemək masası dəsti (6 nəfərlik)',
    description: 'Az istifadə olunub, əla vəziyyətdədir. Köçdüyüm üçün satıram. Stol və 6 stul daxildir.',
    category: 'Ev və bağ',
    subcategory: 'Mebel',
    condition: 'Yaxşı',
    city: 'Bakı',
    price: 450,
    wantedExchange: 'Divan və ya işlənmiş notebook',
    status: 'active',
    imageUrls: [
      'https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=600&auto=format',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format'
    ]
  },
  {
    title: 'Adidas idman dəsti - M ölçü',
    description: 'Orijinal Adidas idman geyimi dəsti. İdman zalında istifadə üçün ideal. Köynək, şort və idman ayaqqabısı daxildir.',
    category: 'İdman',
    subcategory: 'Fitness',
    condition: 'Əla',
    city: 'Bakı',
    price: 130,
    wantedExchange: 'Nike idman dəsti və ya tennis raketkası',
    status: 'active',
    imageUrls: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&auto=format',
      'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&auto=format'
    ]
  }
];

// Helper function to generate random date in the past 30 days
const randomDate = () {
  const today = new Date();
  const pastDays = Math.floor(Math.random() * 30);
  const date = new Date(today);
  date.setDate(today.getDate() - pastDays);
  return date;
}

// Helper function to pick random item from array
const randomItem = (array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper to generate random view count
const randomViewCount = () {
  return Math.floor(Math.random() * 500) + 5;
}

// Seed the database
async const seedDatabase = () {
  const client = await pool.connect();

  try {
    //// console.log('🌱 Starting database seeding...');

    await client.query('BEGIN');

    // Check if users already exist
    const existingUsers = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(existingUsers.rows[0].count) > 0) {
      //// console.log(`>> ${existingUsers.rows[0].count} users already exist, skipping user seed`);
    } else {
      //// console.log('\n📝 Seeding users...');

      // Track count for summary rather than individual users
      let userCount = 0;
      for (const user of users) {
        await client.query(
          `INSERT INTO users
           (username, email, password, full_name, avatar, phone, city, created_at)
           VALUES
           ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            user.username,
            user.email,
            user.password,
            user.fullName,
            user.avatar,
            user.phone,
            user.city,
            new Date()
          ]
        );
        userCount++;
      }
      //// console.log(`>> Created ${userCount} users`);
    }

    // Check if categories already exist
    const existingCategories = await client.query('SELECT COUNT(*) FROM categories');
    if (parseInt(existingCategories.rows[0].count) > 0) {
      //// console.log(`>> ${existingCategories.rows[0].count} categories already exist, skipping category seed`);
    } else {
      //// console.log('\n📝 Seeding categories...');

      for (const category of categories) {
        await client.query(
          `INSERT INTO categories
           (name, display_name, icon, color, created_at)
           VALUES
           ($1, $2, $3, $4, $5)`,
          [
            category.name,
            category.displayName,
            category.icon,
            category.color,
            new Date()
          ]
        );
        //// console.log(`>> Created category: ${category.displayName}`);
      }
    }

    // Check if items already exist
    const existingItems = await client.query('SELECT COUNT(*) FROM items');
    if (parseInt(existingItems.rows[0].count) > 0) {
      //// console.log(`>> ${existingItems.rows[0].count} items already exist, skipping item seed`);
    } else {
      //// console.log('\n📝 Seeding items...');

      // Get all users
      const userResult = await client.query('SELECT id FROM users');
      const userIds = userResult.rows.map(user => user.id);

      if (userIds.length === 0) {
        throw new Error('No users found in the database');
      }

      // Create items with associated images
      for (const item of sampleItems) {
        // Get a random user ID
        const userId = randomItem(userIds);
        const createdAt = randomDate();
        const viewCount = randomViewCount();

        // Insert the item
        const itemResult = await client.query(
          `INSERT INTO items
           (title, description, category, subcategory, status, location, user_id, created_at, updated_at)
           VALUES
           ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING id`,
          [
            item.title,
            item.description,
            item.category,
            item.subcategory,
            item.status,
            item.city, // location field in DB
            userId,
            createdAt,
            new Date()
          ]
        );

        const itemId = itemResult.rows[0].id;

        // Insert images for the item
        for (let i = 0; i < item.imageUrls.length; i++) {
          const isMain = i === 0; // First image is main
          await client.query(
            `INSERT INTO images
             (item_id, file_path, is_main, created_at)
             VALUES
             ($1, $2, $3, $4)`,
            [
              itemId,
              item.imageUrls[i],
              isMain,
              new Date()
            ]
          );
        }

        //// console.log(`>> Created item: ${item.title}`);
      }

      // Generate more random items
      //// console.log('\n📝 Generating more random items...');

      // Define all possible values
      const CONDITIONS = ['Yeni', 'Əla', 'Yaxşı', 'Normal', 'İşlənmiş'];
      const CITIES = ['Bakı', 'Sumqayıt', 'Gəncə', 'Mingəçevir', 'Şəki', 'Quba', 'Lənkəran', 'Şirvan'];
      const STATUSES = ['active', 'pending', 'sold', 'expired'];

      // Category-specific data
      const TITLES_BY_CATEGORY = {
        'Elektronika': [
          'Samsung Galaxy S21 - Əla vəziyyətdə',
          'Sony PlayStation 5 - Yeni',
          'Apple MacBook Pro 2022',
          'JBL Bluetooth səs ucaldıcı',
          'Xiaomi Mi Robot Vacuum'
        ],
        'Geyim': [
          'Zara kişi cemperi - Yeni (L)',
          'Adidas idman forması',
          'Qadın dəri gödəkçəsi',
          'Tommy Hilfiger kişi köynəyi',
          'Gucci kəmər - Orijinal'
        ],
        'Kitablar': [
          'Azərbaycan ədəbiyyatı toplusu',
          'İngilis dili öyrənmək üçün kitablar',
          'Game of Thrones - bütün seriya',
          'Psixologiya kitabları dəsti',
          'Biznesi necə qurmalı - Seth Godin'
        ],
        'Ev və bağ': [
          'Yeni mətbəx dəsti - istifadə olunmayıb',
          'Bağ əşyaları dəsti',
          'Müasir divar saatı',
          'BOSCH qabyuyan maşın - az istifadə olunub',
          'Yataq dəsti - IKEA (Tək)'
        ]
      };

      const DESCRIPTIONS_BY_CATEGORY = {
        'Elektronika': [
          'İdeal işlək vəziyyətdə, batareyası uzun müddət davam edir. Qiymət müzakirə oluna bilər. Ehtiyat hissələri də let.',
          'Yeni, istifadə olunmayıb, açılmamış qutuda. İstənilən sınaq və yoxlama ilə razıyam.',
          'Az istifadə olunub, yaxşı vəziyyətdədir. Bütün funksiyaları işləyir. Barter digər elektronika ilə mümkündür.'
        ],
        'Geyim': [
          'Bir dəfə istifadə olunub, əla vəziyyətdədir. Orijinal qəbz let. Digər geyimlərlə barter ola bilər.',
          'Yüksək keyfiyyətli parça, əl ilə istehsal olunub. Xaricdən gətirilib, mağaza qiyməti daha yüksəkdir.',
          'Hədiyyə kimi alınıb, heç geyinilməyib. Ölçü uyğun gəlmədiyi üçün satılır. Şəkildəki kimi mükəmməl vəziyyətdədir.'
        ],
        'Kitablar': [
          'Yeni vəziyyətdə, heç oxunmayıb. Mövzu ilə maraqlanmadığım üçün satıram. Digər kitablarla barter ola bilər.',
          'Kolleksiyamdan artıq nüsxə. Səhifələri təmiz, cırilma yoxdur. Nadir tapılan nəşrdir.',
          'Bütün seriya mövcuddur, eyni nəşriyyatdan. Təmiz saxlanılıb, sifarişlə xaricdən gətirilib.'
        ],
        'Ev və bağ': [
          'Yeni vəziyyətdə, quraşdırılmayıb. IKEA-dan alınıb, qəbzi və təlimatı mövcuddur.',
          'Yüksək keyfiyyətli material, praktik dizayn. Köçdüyüm üçün satıram.',
          'Almaniyanın Bosch brendindən. 2 il rəsmi zəmanəti let. Enerji qənaətli A+++ sinif.'
        ]
      };

      const SUBCATEGORIES_BY_CATEGORY = {
        'Elektronika': ['Telefonlar', 'Noutbuklar', 'Qulaqlıqlar', 'Fotoaparatlar', 'TV', 'Planşetlər'],
        'Geyim': ['Kişi geyimləri', 'Qadın geyimləri', 'Ayaqqabılar', 'Aksesuarlar', 'İdman geyimləri'],
        'Kitablar': ['Bədii ədəbiyyat', 'Dərsliklər', 'Biznes', 'Tarix', 'Uşaq kitabları'],
        'Ev və bağ': ['Mebel', 'Məişət texnikası', 'Bağ alətləri', 'İşıqlandırma', 'Mətbəx']
      };

      const IMAGES_BY_CATEGORY = {
        'Elektronika': [
          'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format',
          'https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=600&auto=format'
        ],
        'Geyim': [
          'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&auto=format',
          'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=600&auto=format'
        ],
        'Kitablar': [
          'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format',
          'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600&auto=format'
        ],
        'Ev və bağ': [
          'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=600&auto=format',
          'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format'
        ]
      };

      // Generate additional 15 random items
      const additionalItems = 15;
      for (let i = 0; i < additionalItems; i++) {
        // Get a random user ID
        const userId = randomItem(userIds);

        // Select a random category from the available categories
        const categoryKeys = Object.keys(TITLES_BY_CATEGORY);
        const category = randomItem(categoryKeys);

        // Random data
        const title = randomItem(TITLES_BY_CATEGORY[category]);
        const description = randomItem(DESCRIPTIONS_BY_CATEGORY[category]);
        const subcategory = randomItem(SUBCATEGORIES_BY_CATEGORY[category]);
        const condition = randomItem(CONDITIONS);
        const city = randomItem(CITIES);
        const price = Math.floor(Math.random() * 2000) + 15; // Random price between 15-2000
        const status = randomItem(STATUSES);
        const createdAt = randomDate();
        const viewCount = randomViewCount();

        // Random wanted exchange
        const wantedCategory = randomItem(categoryKeys);
        const wantedExchange = `${randomItem(TITLES_BY_CATEGORY[wantedCategory])} və ya oxşar`;

        // Insert the item
        const itemResult = await client.query(
          `INSERT INTO items
           (title, description, category, subcategory, status, location, user_id, created_at, updated_at)
           VALUES
           ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING id`,
          [
            title,
            description,
            category,
            subcategory,
            status,
            city, // location in DB
            userId,
            createdAt,
            new Date()
          ]
        );

        const itemId = itemResult.rows[0].id;

        // Get images for this category
        const images = IMAGES_BY_CATEGORY[category];

        // Add 1-2 images
        const imageCount = Math.floor(Math.random() * 2) + 1;
        for (let j = 0; j < imageCount && j < images.length; j++) {
          const isMain = j === 0; // First image is main
          await client.query(
            `INSERT INTO images
             (item_id, file_path, is_main, created_at)
             VALUES
             ($1, $2, $3, $4)`,
            [
              itemId,
              images[j],
              isMain,
              new Date()
            ]
          );
        }

        //// console.log(`>> Created additional item ${i + 1}/${additionalItems}: ${title}`);
      }
    }

    await client.query('COMMIT');
    //// console.log('\n🎉 Database seeding completed successfully!');

  } catch (error) {
    await client.query('ROLLBACK');
    //console.error('❌ Error during database seeding:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the seeding const seedDatabase = ()
  .then(() => {
    //// console.log('Seed script completed!');
    process.exit(0);
  })
  .catch(err => {
    //console.error('Fatal error during seeding:', err);
    process.exit(1);
  });