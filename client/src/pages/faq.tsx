import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Search, ArrowRight, MessageCircle } from "lucide-react";

export default function FAQ() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // FAQ kategoriyaları və suallar
  const faqCategories = {
    all: { 
      title: t('faq.categories.all', 'Bütün Suallar'), 
      icon: <HelpCircle className="h-5 w-5" /> 
    },
    general: { 
      title: t('faq.categories.general', 'Ümumi'), 
      icon: <HelpCircle className="h-5 w-5" /> 
    },
    account: { 
      title: t('faq.categories.account', 'Hesab'), 
      icon: <HelpCircle className="h-5 w-5" /> 
    },
    barter: { 
      title: t('faq.categories.barter', 'Mübadilə'), 
      icon: <HelpCircle className="h-5 w-5" /> 
    },
    safety: { 
      title: t('faq.categories.safety', 'Təhlükəsizlik'), 
      icon: <HelpCircle className="h-5 w-5" /> 
    },
    support: { 
      title: t('faq.categories.support', 'Dəstək'), 
      icon: <HelpCircle className="h-5 w-5" /> 
    }
  };

  // FAQ sualları
  const faqItems = [
    // Ümumi suallar
    {
      id: 'what-is-bartertap',
      question: t('faq.general.whatIsBarterTap.question', 'BarterTap nədir?'),
      answer: t('faq.general.whatIsBarterTap.answer', 'BarterTap, istifadəçilərə əşyalarını pulsuz mübadilə etməyə imkan verən onlayn platformadır. Burada istifadə etmədiyiniz əşyaları paylaşa və sizə lazım olan əşyalarla dəyişdirə bilərsiniz. Platforma Azərbaycanda yaşayan insanların əşyalarını asanlıqla dəyişdirməsi üçün yaradılmışdır.'),
      category: 'general'
    },
    {
      id: 'how-does-it-work',
      question: t('faq.general.howItWorks.question', 'BarterTap necə işləyir?'),
      answer: t('faq.general.howItWorks.answer', 'BarterTap-da əşya mübadiləsi üç sadə addımdan ibarətdir: 1) Əşyanızı əlavə edin və şəkillərini yükləyin, 2) Sizə maraqlı olan əşyalar üçün təklif göndərin, 3) Razılaşdıqdan sonra görüşün və mübadiləni həyata keçirin. Platforma tamamilə istifadəçi rahatlığı üçün dizayn edilmişdir.'),
      category: 'general'
    },
    {
      id: 'is-it-free',
      question: t('faq.general.isItFree.question', 'BarterTap istifadəsi pulsuzdur?'),
      answer: t('faq.general.isItFree.answer', 'Bəli, BarterTap-ın əsas xidmətləri tamamilə pulsuzdur. Qeydiyyat, əşya əlavə etmək, axtarış və mübadilə prosesi üçün heç bir ödəniş tələb olunmur. Biz əşyaların pul ödəmədən məhz mübadilə prinsipini dəstəkləyirik.'),
      category: 'general'
    },
    {
      id: 'bartertap-vs-others',
      question: t('faq.general.barterVsOthers.question', 'BarterTap digər platformalardan nə ilə fərqlənir?'),
      answer: t('faq.general.barterVsOthers.answer', 'BarterTap, tamamilə mübadilə konsepsiyasına fokuslanır, alqı-satqı yox. Əsas fərqlərimiz: 1) Təklükəsiz mübadilə sistemi, 2) Azərbaycanda yerli əhaliyə xidmət, 3) İstifadəçi reytinq sistemi, 4) Çoxdilli dəstək (Azərbaycan, Rus, İngilis), 5) İstifadəçi dostu interfeys və 6) Əşyanın vəziyyətini dəqiq göstərən xüsusi kateqoriya sistemi.'),
      category: 'general'
    },
    {
      id: 'currency-on-platform',
      question: t('faq.general.currencyQuestion.question', 'Əşyaların dəyəri necə hesablanır?'),
      answer: t('faq.general.currencyQuestion.answer', 'BarterTap platformasında pulla alqı-satqı əvəzinə birbaşa əşya mübadiləsi həyata keçirilir. Əşyaların təqribi dəyərləri manatla göstərilsə də, bu yalnız istiqamətləndirici məlumatdır. Siz əşya sahibi ilə razılaşaraq istənilən mübadiləni həyata keçirə bilərsiniz. Əsas məqsəd pul mübadiləsi olmadan əşyalarınızı dəyişməkdir.'),
      category: 'general'
    },

    // Hesab sualları
    {
      id: 'create-account',
      question: t('faq.account.createAccount.question', 'Hesab necə yaradılır?'),
      answer: t('faq.account.createAccount.answer', 'Hesab yaratmaq üçün "Qeydiyyat" düyməsinə klikləyin, tələb olunan məlumatları doldurun və istifadəçi şərtlərini qəbul edin. Daha sonra e-poçt ünvanınızı təsdiqləyərək hesabınızı aktivləşdirə bilərsiniz. Qeydiyyat prosesi sadəcə bir neçə dəqiqə çəkir.'),
      category: 'account'
    },
    {
      id: 'account-verification',
      question: t('faq.account.verification.question', 'Hesabımı necə təsdiqləyə bilərəm?'),
      answer: t('faq.account.verification.answer', 'Hesabınızı təsdiqləmək üçün qeydiyyat zamanı göstərdiyiniz e-poçt ünvanına göndərilən linkə klikləyin. Əgər təsdiq e-poçtu gəlməyibsə, "spam" qovluğunu yoxlayın və ya dəstək xidmətinə müraciət edin. Hesabınızı təsdiqləmək təhlükəsizlik baxımından vacibdir və platformanın bütün funksiyalarına giriş əldə etməyinizə imkan verir.'),
      category: 'account'
    },
    {
      id: 'forgot-password',
      question: t('faq.account.forgotPassword.question', 'Şifrəmi unutmuşam. Nə etməliyəm?'),
      answer: t('faq.account.forgotPassword.answer', 'Şifrəni unutduğunuz halda "Giriş" səhifəsindəki "Şifrəni unutmusunuz?" linkini istifadə edin. E-poçt ünvanınızı daxil edin və şifrə sıfırlama təlimatları göndəriləcək. Şifrə sıfırlama linki 24 saat ərzində etibarlıdır. Təhlükəsizlik üçün güclü və unikal bir şifrə yaratmağı unutmayın.'),
      category: 'account'
    },
    {
      id: 'delete-account',
      question: t('faq.account.deleteAccount.question', 'Hesabımı necə silə bilərəm?'),
      answer: t('faq.account.deleteAccount.answer', 'Hesabınızı silmək üçün "Profil" bölməsinə daxil olun, "Hesab parametrləri" seçin və "Hesabı sil" düyməsini tapın. Silinmə prosesi təsdiqləndikdən sonra, bütün şəxsi məlumatlarınız, elanlarınız və mesajlarınız sistemdən silinəcək. Bu proses geri qaytarıla bilməz, ona görə diqqətli olun.'),
      category: 'account'
    },
    {
      id: 'profile-picture',
      question: t('faq.account.profilePicture.question', 'Profil şəklimi necə dəyişə bilərəm?'),
      answer: t('faq.account.profilePicture.answer', 'Profil şəklinizi dəyişmək üçün "Profil" səhifənizdəki profil şəkli ikonasına klikləyin və "Şəkli dəyiş" seçimini seçin. Cihazınızdan şəkil yükləyə və kəsə bilərsiniz. Profil şəklinizin platformada etibar yaratmaq üçün real və aydın olması tövsiyə olunur.'),
      category: 'account'
    },

    // Mübadilə sualları
    {
      id: 'add-item',
      question: t('faq.barter.addItem.question', 'Əşya necə əlavə edilir?'),
      answer: t('faq.barter.addItem.answer', 'Əşya əlavə etmək üçün "Əşya əlavə et" düyməsinə klikləyin, əşyanın adı, təsviri, kateqoriyası və vəziyyəti kimi məlumatları daxil edin. Daha sonra ən azı bir və ən çoxu 10 şəkil yükləyin. Yaxşı keyfiyyətli şəkillər və detallı təsvir potensial mübadilə imkanlarınızı artırır. Tamamlandıqdan sonra əşyanız platformada görünəcək.'),
      category: 'barter'
    },
    {
      id: 'make-offer',
      question: t('faq.barter.makeOffer.question', 'Təklif necə edilir?'),
      answer: t('faq.barter.makeOffer.answer', 'Təklif etmək üçün bəyəndiyiniz əşyanın detallarına baxın və "Təklif et" düyməsinə klikləyin. Öz əşyanızı və ya əşyalarınızı seçin və qısa mesaj yazaraq təklifinizi göndərin. Əşya sahibi təklifinizi qəbul və ya rədd edə bilər. Konkret və aydın təkliflər daha çox qəbul edilmə şansına malikdir.'),
      category: 'barter'
    },
    {
      id: 'multiple-items-offer',
      question: t('faq.barter.multipleItems.question', 'Bir təklifdə birdən çox əşya təklif edə bilərəm?'),
      answer: t('faq.barter.multipleItems.answer', 'Bəli, bir təklifdə birdən çox əşya təklif edə bilərsiniz. Təklif formasında "Əşya əlavə et" düyməsini istifadə edərək mübadiləyə daxil etmək istədiyiniz digər əşyaları seçə bilərsiniz. Bu, xüsusilə dəyəri yüksək olan əşyalar üçün mübadilə etmək istədikdə faydalıdır. Maksimum 5 əşya bir təklifdə daxil edilə bilər.'),
      category: 'barter'
    },
    {
      id: 'successful-exchange',
      question: t('faq.barter.successfulExchange.question', 'Uğurlu mübadilə necə həyata keçirilir?'),
      answer: t('faq.barter.successfulExchange.answer', 'Təklifiniz qəbul edildikdən sonra əşya sahibi ilə mesajlaşaraq görüş vaxtı və yeri təyin edin. Görüşdə əşyaları dəyişdirdikdən sonra platformada mübadiləni "Tamamlanmış" kimi işarələyin və qarşı tərəfi qiymətləndirin. Bu mərhələ platformanın etibarlılıq sistemində çox vacibdir və gələcək mübadiləçilərə kömək edir.'),
      category: 'barter'
    },
    {
      id: 'edit-item',
      question: t('faq.barter.editItem.question', 'Əlavə etdiyim əşyanı necə redaktə edə və ya silə bilərəm?'),
      answer: t('faq.barter.editItem.answer', '"Profilim" bölməsindən "Mənim əşyalarım" siyahısını açın. Redaktə etmək istədiyiniz əşyanın yanındakı seçimlər menyusuna klikləyin və "Redaktə et" və ya "Sil" seçimini seçin. Əşya üçün aktiv təklif və ya razılaşma yoxdursa, istənilən vaxt redaktə və ya silə bilərsiniz.'),
      category: 'barter'
    },
    {
      id: 'completed-exchanges',
      question: t('faq.barter.completedExchanges.question', 'Keçmiş mübadilələrim haqqında məlumatı harada görə bilərəm?'),
      answer: t('faq.barter.completedExchanges.answer', 'Keçmiş mübadilələrinizə "Profilim" bölməsindəki "Mübadilə tarixçəsi" tabında baxa bilərsiniz. Burada tamamlanmış, ləğv edilmiş və davam edən bütün mübadilələriniz, tarix, əşya və digər istifadəçi məlumatları ilə birlikdə göstərilir.'),
      category: 'barter'
    },

    // Təhlükəsizlik sualları
    {
      id: 'secure-exchange',
      question: t('faq.safety.secureExchange.question', 'Təhlükəsiz mübadilə üçün tövsiyələr nələrdir?'),
      answer: t('faq.safety.secureExchange.answer', 'Təhlükəsiz mübadilə üçün: 1) İctimai yerlərdə görüşün (məsələn, ticarət mərkəzləri, kafeterialar), 2) Heç vaxt şəxsi məlumatlarınızı (ev ünvanı, bank məlumatları) paylaşmayın, 3) Şübhəli təkliflərdən çəkinin, 4) İmkan daxilində yanınızda birini gətirin, 5) Əşyanın vəziyyətini yoxlamadan razılaşmayın, 6) Gecə vaxtı və ya təhlükəli ərazilərdə görüşməyin.'),
      category: 'safety'
    },
    {
      id: 'report-user',
      question: t('faq.safety.reportUser.question', 'Şübhəli istifadəçini necə bildirə bilərəm?'),
      answer: t('faq.safety.reportUser.answer', 'Şübhəli istifadəçini bildirmək üçün onun profil səhifəsindəki "Bildir" düyməsini istifadə edin. Problemi təsvir edin və mövcud olduqda, sübutlar təqdim edin. Həmçinin mesajlaşma pəncərəsindəki "Problemi bildir" seçimindən də istifadə edə bilərsiniz. Şikayətlər anonim qalır və komandamız tərəfindən ciddi şəkildə araşdırılır.'),
      category: 'safety'
    },
    {
      id: 'privacy-protection',
      question: t('faq.safety.privacyProtection.question', 'Məxfiliyim necə qorunur?'),
      answer: t('faq.safety.privacyProtection.answer', 'BarterTap şəxsi məlumatlarınızı qorumaq üçün güclü şifrələmə və təhlükəsizlik protokolları istifadə edir. Biz yalnız xidmətlərimizi təmin etmək üçün lazım olan məlumatları toplayırıq. Telefon nömrəniz və e-poçt ünvanınız digər istifadəçilərə göstərilmir. İstifadəçilərlə yalnız platforma daxilində və görüşə gəlməzdən əvvəl ünsiyyət qurmağı tövsiyə edirik.'),
      category: 'safety'
    },
    {
      id: 'fake-accounts',
      question: t('faq.safety.fakeAccounts.question', 'Saxta hesabları necə tanıya bilərəm?'),
      answer: t('faq.safety.fakeAccounts.answer', 'Saxta hesabları tanımaq üçün diqqət edin: 1) Profil şəkli yoxdur və ya ümumi şəkildir, 2) Şübhəli dərəcədə aşağı qiymətlər, 3) Hesab yeni yaradılıb və heç bir rəy yoxdur, 4) Məlumatlar ziddiyyətlidir və ya çoxsaylı qrammatik səhvlər var, 5) Tələsik qərarlar tələb edir, 6) Platformadan kənar ünsiyyət təklif edir. Bu cür hesablardan şübhələnsəniz, onları "Bildir" funksiyası ilə bildirin.'),
      category: 'safety'
    },
    {
      id: 'security-tips',
      question: t('faq.safety.securityTips.question', 'Hesabımı necə qoruya bilərəm?'),
      answer: t('faq.safety.securityTips.answer', 'Hesabınızı qorumaq üçün: 1) Güclü və unikal şifrə istifadə edin, 2) Şifrənizi heç kimlə bölüşməyin, 3) Şübhəli linklərdən çəkinin, 4) Müntəzəm olaraq hesab məlumatlarınızı yoxlayın, 5) Tanımadığınız cihazlardan çıxış edin, 6) Şübhəli fəaliyyət hiss etdikdə dərhal şifrənizi dəyişin, 7) İki faktorlu doğrulama aktiv edin. Bu tədbirlər hesabınızın təhlükəsizliyini təmin edəcək.'),
      category: 'safety'
    },

    // Dəstək sualları
    {
      id: 'contact-support',
      question: t('faq.support.contactSupport.question', 'Dəstək xidməti ilə necə əlaqə saxlaya bilərəm?'),
      answer: t('faq.support.contactSupport.answer', 'Dəstək xidməti ilə "Əlaqə" bölməsində onlayn forma vasitəsilə, support@bartertap.az e-poçt ünvanına yazaraq və ya platformanın "Canlı dəstək" funksiyası vasitəsilə əlaqə saxlaya bilərsiniz. Həmçinin +994 55 255 48 00 nömrəsi ilə iş saatları ərzində (Bazar ertəsi-Cümə, 9:00-18:00) əlaqə saxlaya bilərsiniz. Komandamız tezliklə sorğunuza cavab verəcək.'),
      category: 'support'
    },
    {
      id: 'problem-with-exchange',
      question: t('faq.support.problemWithExchange.question', 'Mübadilə zamanı problem yaşadım. Nə etməliyəm?'),
      answer: t('faq.support.problemWithExchange.answer', 'Mübadilə zamanı problem yaşadıqda, əvvəlcə digər istifadəçi ilə mesajlaşma vasitəsilə həll etməyə çalışın. Əgər bu kömək etməzsə, "Mübadilə problemi bildir" funksiyasını istifadə edərək dəstək xidmətinə müraciət edin və hadisə haqqında ətraflı məlumat verin. Məlumatlarınız ciddi şəkildə araşdırılacaq və münaqişəni həll etmək üçün müvafiq tədbirlər görüləcək.'),
      category: 'support'
    },
    {
      id: 'suggest-feature',
      question: t('faq.support.suggestFeature.question', 'Platforma üçün təklif və ya fikir necə bildirə bilərəm?'),
      answer: t('faq.support.suggestFeature.answer', 'Platforma üçün təkliflərinizi feedback@bartertap.az e-poçt ünvanına göndərə və ya "Geri bildiriş" bölməsindəki formanı doldura bilərsiniz. Bütün təkliflər nəzərdən keçirilir və platformanın inkişafı üçün nəzərə alınır. İstifadəçi təcrübəsini yaxşılaşdırmaq üçün geri bildirişləriniz bizim üçün çox dəyərlidir.'),
      category: 'support'
    },
    {
      id: 'response-time',
      question: t('faq.support.responseTime.question', 'Dəstək sorğusuna nə qədər tez cavab alacağam?'),
      answer: t('faq.support.responseTime.answer', 'Dəstək xidmətimiz sorğulara adətən 24 saat ərzində cavab verir. Mürəkkəb məsələlər üçün bu müddət 48 saata qədər uzana bilər. Təcili məsələlər üçün "Canlı dəstək" funksiyasından iş saatlarında (Bazar ertəsi-Cümə, 9:00-18:00) istifadə etməyiniz tövsiyə olunur.'),
      category: 'support'
    },
    {
      id: 'language-support',
      question: t('faq.support.languageSupport.question', 'Hansı dillərdə dəstək ala bilərəm?'),
      answer: t('faq.support.languageSupport.answer', 'BarterTap dəstək xidməti üç dildə xidmət göstərir: Azərbaycan, Rus və İngilis. Sorğunuzu hansı dildə göndərsəniz, həmin dildə cavab alacaqsınız. Platformanın interfeysi də bu üç dildə mövcuddur və istənilən vaxt dəyişdirilə bilər.'),
      category: 'support'
    }
  ];

  // Axtarış və filtrasiya
  const filteredFaqs = faqItems.filter(faq => {
    // Kateqoriyaya görə filtrasiya
    const categoryMatch = activeCategory === 'all' || faq.category === activeCategory;

    // Axtarış sorğusuna görə filtrasiya
    const searchMatch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatch && searchMatch;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Axtarış funksiyası
  };

  return (
    <>
      <Helmet>
        <title>{t("faq.title", "Tez-tez verilən suallar")} | BarterTap.az</title>
        <meta name="description" content={t("faq.description", "BarterTap.az haqqında tez-tez verilən suallar və onların cavabları. Barter mübadiləsi, hesab yaratma və platformanın işləməsi haqqında ətraflı məlumat əldə edin.")} />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-center">{t("faq.title", "Tez-tez verilən suallar")}</h1>
          <p className="text-gray-600 text-center mb-8">
            {t("faq.subtitle", "BarterTap platforması haqqında ən çox soruşulan sualların cavablarını burada tapa bilərsiniz.")}
          </p>

          {/* Axtarış forması */}
          <div className="mb-8">
            <form onSubmit={handleSearchSubmit} className="relative max-w-md mx-auto">
              <Input
                type="text"
                placeholder={t("faq.searchPlaceholder", "Sual axtar...")}
                className="pr-10 pl-4 py-3 rounded-lg shadow-sm border border-gray-200"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Kateqoriya tabları */}
          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
            <div className="flex justify-center">
              <TabsList className="bg-gray-100 rounded-lg overflow-x-auto flex whitespace-nowrap p-1">
                {Object.entries(faqCategories).map(([key, category]) => (
                  <TabsTrigger 
                    key={key} 
                    value={key}
                    className="px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded"
                  >
                    <div className="flex items-center gap-2">
                      {category.icon}
                      <span>{category.title}</span>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Suallar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              {filteredFaqs.length > 0 ? (
                <Accordion type="single" collapsible className="space-y-4">
                  {filteredFaqs.map((faq) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <AccordionItem value={faq.id} className="border rounded-lg overflow-hidden">
                        <AccordionTrigger className="px-4 py-4 hover:bg-gray-50 hover:no-underline font-medium">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-4 bg-gray-50 text-gray-700">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-10">
                  <HelpCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">{t("faq.noResults", "Heç bir sual tapılmadı")}</h3>
                  <p className="text-gray-500">
                    {t("faq.tryAnotherSearch", "Axtarış sorğunuza uyğun sual tapılmadı. Başqa açar sözlər sınayın və ya bütün kateqoriyaları göstərmək üçün filtri sıfırlayın.")}
                  </p>
                </div>
              )}
            </motion.div>
          </Tabs>

          {/* Əlavə kömək lazımdırsa bölməsi */}
          <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-3">{t("faq.needMoreHelp", "Cavabınızı tapa bilmədiniz?")}</h2>
            <p className="text-gray-600 mb-4">
              {t("faq.contactSupport", "Dəstək komandamız sizə kömək etməyə hazırdır. Bizimlə əlaqə saxlayın.")}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                variant="default" 
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                onClick={() => window.location.href = "/contact"}
              >
                <MessageCircle className="h-5 w-5" />
                {t("faq.contactUs", "Bizimlə əlaqə")}
              </Button>
              <Button 
                variant="outline" 
                className="text-green-600 border-green-600 hover:bg-green-50 flex items-center gap-2"
                onClick={() => window.location.href = "/help"}
              >
                <HelpCircle className="h-5 w-5" />
                {t("faq.helpCenter", "Kömək mərkəzi")}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}