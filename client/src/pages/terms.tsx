import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { ArrowUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
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
        <title>{t("legal.terms", "İstifadə Şərtləri")} | BarterTap.az</title>
        <meta name="description" content={t("legal.termsDescription", "BarterTap.az platformasının istifadə şərtləri ilə tanış olun. Platformadan istifadə qaydaları və öhdəliklər haqqında məlumat əldə edin.")} />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent">{t("legal.terms", "İstifadə Şərtləri")}</h1>
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="prose prose-green max-w-none">
              <p className="text-gray-600 mb-6 font-medium">
                Son yenilənmə tarixi: 29 Mart 2025
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">1. Giriş</h2>
              <p className="text-gray-700 leading-relaxed">
                BarterTap.az veb saytına ("platforma", "sayt", "xidmət") xoş gəlmisiniz. Bu platformadan istifadə etməklə siz bu İstifadə Şərtlərini ("Şərtlər") qəbul etmiş olursunuz. Bu şərtlərlə razı deyilsinizsə, lütfən platformadan istifadə etməyin. BarterTap.az bu şərtləri istənilən vaxt dəyişdirmək hüququnu özündə saxlayır və belə dəyişikliklər haqqında bildiriş edə bilər.
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                Bu İstifadə Şərtləri BarterTap.az platformasından istifadənizlə bağlı siz və BarterTap.az arasında hüquqi müqavilədir. Platforma əşyaların barter edilməsi - yəni pul ödənişi olmadan əşyaların birbaşa dəyişdirilməsi üçün nəzərdə tutulub.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">2. Hesab yaratma və təhlükəsizlik</h2>
              <p className="text-gray-700 leading-relaxed">
                Platformamızdan tam istifadə etmək üçün qeydiyyatdan keçməli və hesab yaratmalısınız. Aşağıdakıları təmin etməlisiniz:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 my-4">
                <ul className="list-disc pl-6 mb-0 space-y-2">
                  <li>Hesab yaradarkən düzgün, dəqiq, və aktual məlumatlar təqdim etməli</li>
                  <li>Hesab təhlükəsizliyinizi qorumalı və şifrənizi gizli saxlamalı</li>
                  <li>Hesabınızda baş verən istənilən qeyri-icazəli fəaliyyət barədə dərhal bizə məlumat verməli</li>
                  <li>Profilinizi həmişə aktual saxlamalı</li>
                  <li>18 yaşdan yuxarı olmalı</li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed mt-2">
                Biz hesabınızdakı bütün fəaliyyətlərdən sizi məsul hesab edirik. Kimsə sizin icazəniz olmadan hesabınızdan istifadə edirsə, dərhal bizə bildirməlisiniz.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-green-600">2.1. Hesabın ləğvi</h3>
              <p className="text-gray-700 leading-relaxed">
                İstənilən vaxt və istənilən səbəbdən hesabınızı ləğv edə bilərsiniz. Hesabınızı ləğv etmək üçün "Profil" bölməsindəki müvafiq seçimlərdən istifadə edin. Biz də platformamızdan sui-istifadə, qaydalarımızın pozulması və ya digər qanuni səbəblərdən istifadəçi hesablarını ləğv etmək hüququnu özümüzdə saxlayırıq.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">3. Platformanın istifadəsi</h2>
              <p className="text-gray-700 leading-relaxed">
                BarterTap.az platforması əşyaların siyahıya alınması, təklif edilməsi və dəyişdirilməsinə imkan verir. Platformada aşağıdakı fəaliyyətlər qadağandır:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 my-4">
                <ul className="list-disc pl-6 mb-0 space-y-2">
                  <li>Qanunsuz və ya qadağan edilmiş məhsulların siyahıya alınması</li>
                  <li>Digər istifadəçilərə spam və ya arzuolunmaz mesajlar göndərmək</li>
                  <li>Platformamızın funksionallığına müdaxilə etmək</li>
                  <li>Digər istifadəçiləri aldatmaq və ya kələk gəlmək</li>
                  <li>Digər istifadəçilərə qarşı təhqiramiz, təhdid və ya təcavüzkar davranış</li>
                  <li>Platformadan avtomatlaşdırılmış vasitələrlə icazəsiz istifadə</li>
                  <li>Başqa şəxslər kimi özünü qələmə vermək</li>
                  <li>Qeyri-dəqiq, saxta və ya yanıldıcı informasiya dərc etmək</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-green-600">3.1. Qadağan edilmiş əşyalar</h3>
              <p className="text-gray-700 leading-relaxed">
                Aşağıdakı əşyaların siyahıya alınması qəti qadağandır:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 my-4">
                <ul className="list-disc pl-6 mb-0 space-y-2">
                  <li>Silahlar, hərbi ləvazimatlar və partlayıcı maddələr</li>
                  <li>Narkotik və psixotrop maddələr</li>
                  <li>Resept tələb edən dərmanlar</li>
                  <li>Alkoqollu içkilər və tütün məmulatları</li>
                  <li>Canlı heyvanlar</li>
                  <li>Pornoqrafik materiallar</li>
                  <li>İntellektual mülkiyyət hüquqlarını pozan əşyalar</li>
                  <li>Şəxsi məlumatlar və ya məlumat bazaları</li>
                  <li>Saxta sənədlər və şəxsiyyət vəsiqələri</li>
                  <li>Oğurlanmış və ya qanunsuz əldə edilmiş əşyalar</li>
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">4. İstifadəçi məzmunu</h2>
              <p className="text-gray-700 leading-relaxed">
                Platformamızda əşya elanları, şəkillər, təsvirlər və mesajlar kimi məzmun paylaşa bilərsiniz. Paylaşdığınız məzmunla bağlı aşağıdakıları təmin etməlisiniz:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 my-4">
                <ul className="list-disc pl-6 mb-0 space-y-2">
                  <li>Paylaşdığınız məzmuna tam hüquq və səlahiyyətə sahib olmalısınız</li>
                  <li>Məzmun heç bir üçüncü tərəfin hüquqlarını pozmamalıdır</li>
                  <li>Məzmun bu İstifadə Şərtlərinə uyğun olmalıdır</li>
                  <li>Əşyaların vəziyyəti və xüsusiyyətləri barədə dəqiq məlumat verməlisiniz</li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed mt-2">
                Platformada paylaşdığınız məzmunla bağlı bütün məsuliyyəti siz daşıyırsınız. Biz platformamızda dərc edilən istənilən məzmunu silmək, redaktə etmək və ya mümkün etmək haqqını özümüzdə saxlayırıq.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">5. Əqli mülkiyyət hüquqları</h2>
              <p className="text-gray-700 leading-relaxed">
                BarterTap.az, logolar, qrafika, dizayn, interfeys və proqram təminatı daxil olmaqla platformamızın bütün aspektləri bizim əqli mülkiyyətimizdir. Sizə platformadan şəxsi və qeyri-kommersiya məqsədləri üçün istifadə etmək üçün məhdud, qeyri-eksklüziv, ötürülməz lisenziya veririk.
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                Aşağıdakılar qadağandır:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 my-4">
                <ul className="list-disc pl-6 mb-0 space-y-2">
                  <li>Platformamızın məzmununu kopyalamaq, dəyişdirmək və ya yaymaq</li>
                  <li>Platformamızın kodunu dekompilyasiya, tərs mühəndislik və ya əldə etməyə cəhd etmək</li>
                  <li>Platformamızı bizim yazılı icazəmiz olmadan kommersiya məqsədləri üçün istifadə etmək</li>
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">6. Məxfilik</h2>
              <p className="text-gray-700 leading-relaxed">
                Şəxsi məlumatlarınızın necə toplanması, istifadəsi və mühafizəsi barədə məlumat üçün <a href="/privacy" className="text-green-600 hover:underline">Gizlilik Siyasəti</a> sənədimizə baxın. Platformadan istifadə etməklə Gizlilik Siyasətimizi də qəbul etmiş olursunuz.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">7. Mübadilə prosesi</h2>
              <p className="text-gray-700 leading-relaxed">
                BarterTap.az sadəcə əşyaların mübadilə edilməsi üçün platformadır. Biz mübadilə prosesinin bir tərəfi deyilik və əşyaların keyfiyyətinə, vəziyyətinə və ya dəyərinə görə məsuliyyət daşımırıq.
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                Mübadilə prosesində:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 my-4">
                <ul className="list-disc pl-6 mb-0 space-y-2">
                  <li>Bütün razılaşmalar istifadəçilər arasında birbaşa bağlanır</li>
                  <li>Əşyanın vəziyyətini yoxlamaq istifadəçinin məsuliyyətidir</li>
                  <li>Təhlükəsiz və ictimai yerlərdə görüşməyi tövsiyə edirik</li>
                  <li>Platformamız vasitəsilə edilən mübadiləyə görə heç bir komissiya və ya ödəniş tutmuruq</li>
                  <li>Mübadiləni tamamladıqdan sonra platforma vasitəsilə bildirməyinizi xahiş edirik</li>
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">8. Məsuliyyətin məhdudlaşdırılması</h2>
              <p className="text-gray-700 leading-relaxed">
                BarterTap.az platforması "olduğu kimi" və "mövcud olduğu kimi" təqdim edilir. Platformadan istifadə ilə bağlı bütün risklər sizin üzərinizə düşür. Biz platformanın davamlı, təhlükəsiz, səhvsiz olacağına və ya hər hansı nəticəyə səbəb olacağına zəmanət vermirik.
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                Qanunun icazə verdiyi maksimum həddə, BarterTap.az və onun rəhbərləri, əməkdaşları və nümayəndələri heç bir halda istifadəçilərə platformadan istifadə nəticəsində yaranan birbaşa, dolayı, təsadüfi, xüsusi, nümunəvi və ya nəticəli zərərlərə görə məsuliyyət daşımayacaq.
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                Bu məhdudiyyətlərə aşağıdakılarla bağlı zərərlər də daxildir:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 my-4">
                <ul className="list-disc pl-6 mb-0 space-y-2">
                  <li>Platformadan istifadə və ya istifadə edə bilməmək</li>
                  <li>Digər istifadəçilərlə mübadiləyə və ya əlaqəyə dair hər hansı məsələlər</li>
                  <li>Platformada əşyalarla bağlı edilən iddialar və ya mübadiləyə dair mübahisələr</li>
                  <li>Üçüncü tərəflərin hərəkətləri və ya məlumatları</li>
                  <li>Məlumat itkisi və ya korlanması</li>
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">9. Kompensasiya</h2>
              <p className="text-gray-700 leading-relaxed">
                Siz BarterTap.az, onun törəmə şirkətlərini, rəhbərlik, əməkdaşlar və nümayəndələrini aşağıdakılardan yaranan hər hansı iddia, tələb, zərər, öhdəlik, xərc və ya xərclərdən (hüquqşünas ödənişləri də daxil olmaqla) müdafiə edəcək və kompensasiya edəcəksiniz:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 my-4">
                <ul className="list-disc pl-6 mb-0 space-y-2">
                  <li>Bu İstifadə Şərtlərini pozmanız</li>
                  <li>Platformada paylaşdığınız məzmun</li>
                  <li>Digər istifadəçilərə və ya üçüncü tərəflərə qarşı qanunsuz və ya zərərli hərəkətlər</li>
                  <li>Hər hansı hüquqi pozuntu və ya qanun pozuntusu</li>
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">10. Dəyişikliklər və xitam</h2>
              <p className="text-gray-700 leading-relaxed">
                Biz istənilən vaxt bu İstifadə Şərtlərini dəyişdirmək hüququna sahibik. Əhəmiyyətli dəyişikliklər barədə sizi məlumatlandıracağıq. Dəyişikliklər dərc edildikdən sonra platformadan davam edən istifadəniz yenilənmiş şərtləri qəbul etdiyinizi göstərir.
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                Həmçinin, istənilən vaxt və istənilən səbəbdən platformaya giriş hüququnuzu dayandırmaq və ya ləğv etmək hüququnu özümüzdə saxlayırıq.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-600">11. Əlaqə məlumatları</h2>
              <p className="text-gray-700 leading-relaxed">
                Bu İstifadə Şərtləri və ya platformamızla bağlı hər hansı sualınız varsa, bizimlə aşağıdakı üsullarla əlaqə saxlaya bilərsiniz:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 my-4">
                <ul className="list-none pl-0 mb-0 space-y-2">
                  <li><span className="font-medium">E-poçt:</span> <a href="mailto:info@bartertap.az" className="text-green-600 hover:underline">info@bartertap.az</a></li>
                  <li><span className="font-medium">Əlaqə forması:</span> <a href="/contact" className="text-green-600 hover:underline">Bizimlə əlaqə səhifəsi</a></li>
                  <li><span className="font-medium">Ünvan:</span> Əhməd Rəcəbli, Bakı, Azərbaycan</li>
                </ul>
              </div>

              <div className="mt-12 text-center">
                <p className="text-gray-600 italic">
                  BarterTap.az platformasını istifadə etməklə siz bu İstifadə Şərtlərini tam olaraq qəbul etmiş olursunuz.
                </p>
              </div>
            </div>
          </div>

          {/* Scroll to top button */}
          <div className="fixed bottom-6 right-6">
            <Button
              onClick={scrollToTop}
              variant="outline"
              size="icon"
              className="rounded-full bg-green-600 text-white hover:bg-green-700 shadow-md"
            >
              <ArrowUpIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}