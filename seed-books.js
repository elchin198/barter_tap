import { createPgConnection } from './server/db.js';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './shared/schema.js';

// Azərbaycan dilində kitab dataları yaratmaq üçün skript
const bookItems = [
  {
    title: "Azərbaycan Tarixi: İlk Çağlardan Müasirliyə Qədər",
    description: "Bu kitab Azərbaycan tarixini ətraflı əhatə edən akademik mənbədir. Qədim dövrlərdən müasir zamana qədər olan tarixi mərhələləri əhatə edir. Kitab son tədqiqatlar və arxiv materiallarına əsaslanır, 780 səhifədən ibarətdir. Az istifadə olunub, əla vəziyyətdədir.",
    category: "books",
    subcategory: "tarix",
    condition: "yaxşı",
    status: "active",
    price: 35,
    city: "Bakı",
    wantedExchange: "Müasir ədəbiyyat kitabları və ya bağçılıq alətləri ilə mübadilə edə bilərəm"
  },
  {
    title: "Dalğaların Səsi - Müasir Azərbaycan Ədəbiyyatı Antologiyası",
    description: "Müasir Azərbaycan ədəbiyyatının ən yaxşı əsərlərindən ibarət unikal toplu. Kitab müasir Azərbaycan yazıçılarının hekayə, şeir və esselərini əhatə edir. 2019-cu ildə nəşr olunub, yaxşı vəziyyətdədir. Səhifələrində kiçik qeydlər let, amma oxumağa mane olmur.",
    category: "books",
    subcategory: "ədəbiyyat",
    condition: "normal",
    status: "active",
    price: 25,
    city: "Gəncə",
    wantedExchange: "Tarix kitabları, bədii ədəbiyyat və ya musiqi alətləri ilə dəyişərəm."
  },
  {
    title: "Proqramlaşdırma: Python və JavaScript - Tam başlanğıc kursu",
    description: "İnformatika və proqramlaşdırma sahəsində yeni başlayanlar üçün əla bir mənbə. Python və JavaScript dilləri üzərindən praktiki tapşırıqlar və izahlı kodlarla təlimatlar. 2020-ci il nəşri. Təzə kimidir, demək olar ki, istifadə olunmayıb.",
    category: "books",
    subcategory: "texnologiya",
    condition: "əla",
    status: "active",
    price: 45,
    city: "Sumqayıt",
    wantedExchange: "Elektron cihazlar, sərt disk, qulaqlıq, klaviatura və ya texnologiya kitabları ilə dəyişərəm."
  },
  {
    title: "Azərbaycan Mətbəxi: Ənənəvi və Müasir Reseptlər",
    description: "Azərbaycan milli mətbəxi haqqında geniş resept toplusu. Həm ənənəvi, həm də müasir üslubda hazırlanan yeməklər, şirniyyatlar və içkilər haqqında məlumat və hazırlanma qaydaları. 320 səhifəlik rəngli illüstrasiyalı kitab. Tək nöqsanı birinci səhifədəki kiçik cırıqdır.",
    category: "books",
    subcategory: "kulinariya",
    condition: "normal",
    status: "active",
    price: 30,
    city: "Bakı",
    wantedExchange: "Mətbəx əşyaları, qab-qacaq və ya sağlam həyat tərzi kitabları ilə dəyişərəm."
  },
  {
    title: "Biznes və İdarəetmə: Uğurun Əsasları",
    description: "Biznes idarəetməsində uğur qazanmaq istəyənlər üçün əvəzsiz bir mənbə. Start-up yaratmaq, komanda qurmaq, marketinq strategiyası hazırlamaq və maliyyə idarəçiliyi haqqında praktiki məlumatlar. 2021-ci il nəşri, yeni kimidir.",
    category: "books",
    subcategory: "biznes",
    condition: "əla",
    status: "active",
    price: 40,
    city: "Bakı",
    wantedExchange: "Biznes təhlili proqramları, USB yaddaş və ya biznes və marketinq kitabları ilə dəyişmək istəyirəm."
  },
  {
    title: "Səyahətnamə: Azərbaycanı Kəşf Etmək",
    description: "Azərbaycanın gözəl məkanları, tarixi abidələri və mədəni mərkəzləri haqqında ətraflı səyahət kitabı. Qobustan, Şəki, Lahıc, Qəbələ, Gəncə və digər yerlərin foto və təsvirləri. 2018-ci il nəşri, az istifadə olunub.",
    category: "books",
    subcategory: "səyahət",
    condition: "yaxşı",
    status: "active",
    price: 28,
    city: "Quba",
    wantedExchange: "Səyahət ləvazimatları, çadır, fənər və ya xəritələrlə dəyişmək olar."
  },
  {
    title: "Uşaqlar üçün Azərbaycan Nağılları Toplusu",
    description: "Azərbaycan xalq nağıllarının ən gözəl nümunələrini əhatə edən uşaq kitabı. Rəngli illüstrasiyalı, böyük şriftli mətn. 2020-ci il nəşri, 150 səhifə. Uşağım böyüdüyü üçün artıq bizə lazım deyil.",
    category: "books",
    subcategory: "uşaq ədəbiyyatı",
    condition: "yaxşı",
    status: "active",
    price: 20,
    city: "Şəki",
    wantedExchange: "Uşaq oyuncaqları, rəsm ləvazimatları və ya digər uşaq kitabları ilə dəyişə bilərəm."
  }
];

async const seedBooks = () {
  // console.log('Kitab məlumatları əlavə edilir...');

  try {
    // PostgreSQL verilənlər bazasına qoşulma
    const pool = await createPgConnection();
    const db = drizzle(pool);

    for (const book of bookItems) {
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30)); // Son 30 gün ərzində

      await db.insert(schema.items).values({
        ...book,
        userId: 1, // Default user ID (dəyişdirmək lazımdırsa yenidən təyin edin)
        createdAt: createdAt,
        updatedAt: new Date(),
        viewCount: Math.floor(Math.random() * 100) // Təsadüfi baxış sayı
      });
    }

    // console.log('Kitab məlumatları uğurla əlavə edildi!');
  } catch (error) {
    console.error('Məlumatları əlavə edərkən xəta baş verdi:', error);
  } finally {
    process.exit(0);
  }
}

seedBooks();