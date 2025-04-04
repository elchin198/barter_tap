import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { ArrowUpIcon } from "lucide-react";

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  // Scroll to top funksiyası
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Səhifə yüklənəndə yuxarı scroll etmək
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>{t("legal.privacyPolicy", "Gizlilik Siyasəti")} | BarterTap.az</title>
        <meta name="description" content={t("legal.privacyPolicyDescription", "BarterTap.az platformasının gizlilik siyasəti ilə tanış olun. Məlumatlarınızın necə qorunduğunu və istifadə edilməsini öyrənin.")} />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent">{t("legal.privacyPolicy", "Gizlilik Siyasəti")}</h1>
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="prose prose-green max-w-none">
              <p className="text-gray-600 mb-6 font-medium">
                Son yenilənmə tarixi: 29 Mart 2025
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">1. Giriş</h2>
              <p className="text-gray-700 leading-relaxed">
                BarterTap.az ("biz", "bizim", "platformamız") istifadəçilərimizin məxfiliyinə hörmətlə yanaşır.
                Bu Gizlilik Siyasəti sizin şəxsi məlumatlarınızın toplanması, istifadəsi və qorunması barədə
                məlumat verir. Platformamızdan istifadə etməklə bu siyasətin şərtlərini qəbul etmiş olursunuz.
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                BarterTap.az əşya mübadiləsi platforması olaraq, istifadəçilərin şəxsi məlumatlarının qorunmasını prioritet sayır. Bu sənəd, 
                platformamızı istifadə edərkən hansı məlumatları topladığımızı, bu məlumatları necə işlədiyimizi və təhlükəsizlik tədbirlərimizi 
                əhatə edir.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">2. Topladığımız məlumatlar</h2>
              <p className="text-gray-700 leading-relaxed">
                Platformamızdan istifadə etdiyiniz zaman aşağıdakı məlumatları toplaya bilərik:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 my-4">
                <ul className="list-disc pl-6 mb-0 space-y-2">
                  <li><span className="font-medium">Qeydiyyat məlumatları:</span> adınız, e-poçt ünvanınız, telefon nömrəniz, şifrəniz</li>
                  <li><span className="font-medium">Profil məlumatları:</span> şəkliniz, bioqrafiyanız, yerləşdiyiniz şəhər</li>
                  <li><span className="font-medium">Əşya məlumatları:</span> təklifə qoyduğunuz əşyalar, onların təsvirləri və şəkilləri</li>
                  <li><span className="font-medium">Ünsiyyət məlumatları:</span> digər istifadəçilərlə mesajlaşmalarınız</li>
                  <li><span className="font-medium">İstifadə məlumatları:</span> platformamızla necə qarşılıqlı əlaqədə olduğunuz barədə texniki məlumat</li>
                  <li><span className="font-medium">Coğrafi məlumatlar:</span> yerləşdiyiniz ümumi ərazi haqqında məlumat</li>
                  <li><span className="font-medium">Cihaz məlumatları:</span> istifadə etdiyiniz cihaz, brauzer növü və əməliyyat sistemi</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-green-600">2.1. Avtomatik toplanan məlumatlar</h3>
              <p className="text-gray-700 leading-relaxed">
                Siz platformamızı istifadə edərkən bəzi məlumatlar avtomatik olaraq toplanır:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 my-4">
                <ul className="list-disc pl-6 mb-0 space-y-2">
                  <li>IP ünvanınız</li>
                  <li>Cihaz növünüz</li>
                  <li>Tarix və vaxt məlumatları</li>
                  <li>Platformadakı fəaliyyətləriniz</li>
                  <li>Əməliyyat sisteminiz və brauzeriniz haqqında məlumat</li>
                  <li>Platformaya giriş mənbələri</li>
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">3. Məlumatlarınızı necə istifadə edirik</h2>
              <p className="text-gray-700 leading-relaxed">
                Topladığımız məlumatları aşağıdakı məqsədlər üçün istifadə edirik:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 my-4">
                <ul className="list-disc pl-6 mb-0 space-y-2">
                  <li>Hesabınızı yaratmaq və idarə etmək</li>
                  <li>Platformamızın xidmətlərini təmin etmək və yaxşılaşdırmaq</li>
                  <li>Sizinlə əlaqə saxlamaq və digər istifadəçilərlə bağlantı qurmağınıza imkan vermək</li>
                  <li>Təhlükəsizliyi təmin etmək və dələduzluq hallarının qarşısını almaq</li>
                  <li>Platformamızın istifadəsini təhlil etmək və təkmilləşdirmək</li>
                  <li>Qanuni öhdəliklərimizə əməl etmək</li>
                  <li>İstifadəçi təcrübəsini fərdiləşdirmək</li>
                  <li>Barter təkliflərini daha səmərəli emal etmək</li>
                  <li>Texniki problemləri həll etmək</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-green-600">3.1. Hüquqi əsaslarımız</h3>
              <p className="text-gray-700 leading-relaxed">
                Məlumatlarınızı aşağıdakı hüquqi əsaslarla emal edirik:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 my-4">
                <ul className="list-disc pl-6 mb-0 space-y-2">
                  <li><span className="font-medium">Müqavilə öhdəliklərini yerinə yetirmək:</span> Sizə xidmətlərimizi təqdim etmək üçün</li>
                  <li><span className="font-medium">Qanuni maraqlarımız:</span> Platformamızı təkmilləşdirmək və təhlükəsizliyini təmin etmək üçün</li>
                  <li><span className="font-medium">Razılığınız:</span> Razılıq verdiyiniz hallarda məlumatlarınızı işləmək üçün</li>
                  <li><span className="font-medium">Qanuni öhdəliklər:</span> Qanunvericiliyin tələb etdiyi hallarda</li>
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">4. Məlumatların paylaşılması</h2>
              <p className="text-gray-700 leading-relaxed">
                Biz sizin məlumatlarınızı aşağıdakı hallarda üçüncü tərəflərlə paylaşa bilərik:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 my-4">
                <ul className="list-disc pl-6 mb-0 space-y-2">
                  <li>Razılığınızla</li>
                  <li>Xidmət göstərən etibarlı tərəfdaşlarımızla (məsələn, hosting provayderləri)</li>
                  <li>Qanuni tələblərə cavab vermək üçün (məhkəmə qərarları və s.)</li>
                  <li>Platformamızın təhlükəsizliyini qorumaq və dələduzluğun qarşısını almaq üçün</li>
                  <li>Platformamızın normal fəaliyyətini təmin etmək üçün xidmət təminatçıları ilə</li>
                  <li>Biznes satışı və ya birləşməsi zamanı (bu halda məlumatların qorunması haqqında sizi məlumatlandıracağıq)</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-green-600">4.1. Üçüncü tərəf xidmət təminatçıları</h3>
              <p className="text-gray-700 leading-relaxed">
                Xidmətlərimizi göstərmək üçün üçüncü tərəf xidmət təminatçılarından istifadə edirik. Bunlara daxildir:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 my-4">
                <ul className="list-disc pl-6 mb-0 space-y-2">
                  <li>Hostinq və server xidmətləri</li>
                  <li>Məlumat analitikası</li>
                  <li>E-poçt xidmət təminatçıları</li>
                  <li>Təhlükəsizlik və dələduzluğa qarşı mübarizə xidmətləri</li>
                  <li>Ödəniş emal xidmətləri (əgər varsa)</li>
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">5. İctimai profil və paylaşımlar</h2>
              <p className="text-gray-700 leading-relaxed">
                Platformamızda paylaşdığınız bəzi məlumatlar (profil şəkliniz, şəhəriniz, əşya elanlarınız) ictimai ola bilər.
                Bu məlumatların platformamız xaricində də görünə biləcəyini nəzərə alın. İstəmədiyiniz məlumatları
                paylaşmamağınızı tövsiyə edirik.
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                İctimai profiliniz əsasən aşağıdakıları əhatə edir:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 my-4">
                <ul className="list-disc pl-6 mb-0 space-y-2">
                  <li>İstifadəçi adınız</li>
                  <li>Profil şəkliniz</li>
                  <li>Təklif etdiyiniz əşyalar</li>
                  <li>Şəhəriniz/yerləşdiyiniz məkan</li>
                  <li>Profil təsviriniz</li>
                  <li>Qiymətləndirmə və rəyləriniz</li>
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">6. Məlumatların təhlükəsizliyi</h2>
              <p className="text-gray-700 leading-relaxed">
                Biz sizin məlumatlarınızı qorumaq üçün müvafiq texniki və təşkilati tədbirlər görürük.
                Lakin internet üzərindən ötürülən heç bir məlumatın 100% təhlükəsiz olmadığını qeyd etmək istəyirik.
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                Tətbiq etdiyimiz təhlükəsizlik tədbirlərinə aşağıdakılar daxildir:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 my-4">
                <ul className="list-disc pl-6 mb-0 space-y-2">
                  <li>SSL şifrələmə (bütün məlumat ötürmələri üçün)</li>
                  <li>Güclü şifrələmə ilə məlumat saxlama</li>
                  <li>Məlumatlara giriş məhdudiyyətləri (yalnız icazəsi olan işçilər)</li>
                  <li>Mütəmadi təhlükəsizlik auditləri</li>
                  <li>Məlumat pozuntularına qarşı nəzarət sistemləri</li>
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">7. Məlumatların saxlanması</h2>
              <p className="text-gray-700 leading-relaxed">
                Şəxsi məlumatlarınızı yalnız lazım olduğu müddət ərzində saxlayırıq.
                Hesabınızı sildikdə, qanuni öhdəliklərimizi yerinə yetirmək üçün tələb olunan məlumatlar istisna olmaqla, 
                bütün şəxsi məlumatlarınız silinəcək.
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                Məlumat saxlama müddətləri aşağıdakı kimi müəyyən edilir:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 my-4">
                <ul className="list-disc pl-6 mb-0 space-y-2">
                  <li>Aktiv hesabların məlumatları: Hesab aktiv olduğu müddətdə</li>
                  <li>Mesajlaşma məlumatları: Son aktivlikdən sonra 2 il</li>
                  <li>Əşya elanları: Elan silindikdən sonra 1 il</li>
                  <li>Ödəniş məlumatları (mövcud olduqda): Qanunvericilikdə tələb olunan müddət ərzində</li>
                  <li>Log faylları və analitika: Maksimum 2 il</li>
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">8. Cookie-lər və izləmə texnologiyaları</h2>
              <p className="text-gray-700 leading-relaxed">
                Platformamız daha yaxşı istifadəçi təcrübəsi təmin etmək üçün cookie-lər və oxşar texnologiyalardan istifadə 
                edir. Bu texnologiyaların necə işlədiyini və onları necə idarə edə biləcəyinizi "Çərəzlər Siyasəti"mizdə öyrənə bilərsiniz.
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                İstifadə etdiyimiz cookie növləri:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 my-4">
                <ul className="list-disc pl-6 mb-0 space-y-2">
                  <li><span className="font-medium">Zəruri cookie-lər:</span> Platformanın düzgün işləməsi üçün lazımi cookie-lər</li>
                  <li><span className="font-medium">Funksional cookie-lər:</span> Tərcihlərinizi və seçimlərinizi yadda saxlamaq üçün</li>
                  <li><span className="font-medium">Analitik cookie-lər:</span> Platformanın necə istifadə olunduğunu anlamaq üçün</li>
                  <li><span className="font-medium">Təhlükəsizlik cookie-ləri:</span> Təhlükəsizlik məqsədləri üçün</li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed mt-2">
                Cookie-ləri brauzerinizin parametrləri vasitəsilə hər zaman idarə edə və ya söndürə bilərsiniz.
                Lakin, bəzi zəruri cookie-ləri söndürdükdə platformanın bəzi funksiyaları düzgün işləməyə bilər.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">9. Sizin hüquqlarınız</h2>
              <p className="text-gray-700 leading-relaxed">
                Şəxsi məlumatlarınızla bağlı aşağıdakı hüquqlara maliksiniz:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 my-4">
                <ul className="list-disc pl-6 mb-0 space-y-2">
                  <li><span className="font-medium">Məlumatlara giriş hüququ:</span> Məlumatlarınıza giriş əldə etmək və onların surətini almaq</li>
                  <li><span className="font-medium">Düzəliş hüququ:</span> Yanlış və ya natamam məlumatların düzəldilməsini tələb etmək</li>
                  <li><span className="font-medium">Silinmə hüququ:</span> Müəyyən hallarda məlumatlarınızın silinməsini tələb etmək</li>
                  <li><span className="font-medium">Məhdudlaşdırma hüququ:</span> Məlumatlarınızın işlənməsini məhdudlaşdırmaq</li>
                  <li><span className="font-medium">Məlumatların daşınabilməsi:</span> Məlumatlarınızın daşınabilmə hüququ</li>
                  <li><span className="font-medium">Etiraz hüququ:</span> Məlumatlarınızın işlənməsinə etiraz etmək</li>
                  <li><span className="font-medium">Avtomatlaşdırılmış qərarlara dair hüquqlar:</span> Yalnız avtomatlaşdırılmış emal əsasında qəbul edilmiş qərarların insan tərəfindən yenidən baxılmasını tələb etmək</li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed mt-2">
                Bu hüquqlarınızdan istifadə etmək üçün <a href="mailto:info@bartertap.az" className="text-green-600 hover:underline">info@bartertap.az</a> ünvanı ilə bizimlə əlaqə saxlaya bilərsiniz.
                Biz sorğunuza 30 gün ərzində cavab verəcəyik.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">10. Uşaqların məxfiliyi</h2>
              <p className="text-gray-700 leading-relaxed">
                Platformamız 18 yaşdan yuxarı şəxslər üçün nəzərdə tutulub. Bilərəkdən 18 yaşdan aşağı şəxslərdən
                şəxsi məlumat toplamırıq. Əgər 18 yaşdan aşağı uşağın məlumatlarını topladığımızı düşünürsünüzsə,
                lütfən bizimlə əlaqə saxlayın və biz belə məlumatları dərhal siləcəyik.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">11. Beynəlxalq məlumat transferləri</h2>
              <p className="text-gray-700 leading-relaxed">
                Biz Azərbaycanda yerləşən bir platformayıq və məlumatlarınız Azərbaycan və/və ya Avropa İqtisadi Zonasında 
                (AİZ) saxlanılır. Bununla belə, xidmət təminatçılarımızın bir qismi bu bölgələrdən kənarda yerləşə bilər.
                Bu halda, məlumatlarınızın müvafiq təhlükəsizlik tədbirləri ilə qorunmasını təmin edirik.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">12. Siyasətə dəyişikliklər</h2>
              <p className="text-gray-700 leading-relaxed">
                Bu Gizlilik Siyasətini vaxtaşırı yeniləyə bilərik. Siyasətə edilən hər hansı dəyişiklik barədə
                platformamızda bildiriş yerləşdirəcəyik və əhəmiyyətli dəyişikliklər olduğu təqdirdə sizə e-poçt vasitəsilə məlumat verəcəyik.
                Bu səhifəni vaxtaşırı yoxlamağınızı tövsiyə edirik.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">13. Bizimlə əlaqə</h2>
              <p className="text-gray-700 leading-relaxed">
                Bu Gizlilik Siyasəti və ya şəxsi məlumatlarınızla bağlı hər hansı sualınız varsa,
                <a href="mailto:info@bartertap.az" className="text-green-600 hover:underline mx-1">info@bartertap.az</a>
                ünvanı ilə bizimlə əlaqə saxlaya bilərsiniz.
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                Bizi aşağıdakı vasitələrlə də əldə edə bilərsiniz:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 my-4">
                <ul className="list-none pl-0 mb-0 space-y-2">
                  <li><span className="font-medium">Ünvan:</span> Əhməd Rəcəbli, Bakı, Azərbaycan</li>
                  <li><span className="font-medium">Telefon:</span> +994 55 255 48 00</li>
                  <li><span className="font-medium">E-poçt:</span> info@bartertap.az</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Yuxarı qalxmaq düyməsi */}
          <div className="flex justify-center mt-8">
            <button 
              onClick={scrollToTop}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-full transition-colors flex items-center"
            >
              <ArrowUpIcon className="h-4 w-4 mr-2" />
              Yuxarı qayıt
            </button>
          </div>
        </div>
      </div>
    </>
  );
}