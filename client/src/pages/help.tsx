import React from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, Search, BookOpen, MessageCircle, Shield, Users, ArrowRight, AlertTriangle, FileText, Star } from "lucide-react";

export default function HelpCenter() {
  const { t } = useTranslation();

  // Scroll to top funksiyası
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Kömək kateqoriyaları
  const helpCategories = [
    {
      id: "getting-started",
      title: t("help.categories.gettingStarted", "Başlanğıc"),
      icon: <BookOpen className="h-5 w-5" />,
      description: t("help.categories.gettingStartedDesc", "Platformadan istifadə etməyə başlamaq üçün əsas məlumatlar"),
      topics: [
        {
          id: "create-account",
          title: t("help.topics.createAccount", "Hesab yaratmaq"),
          description: t("help.topics.createAccountDesc", "BarterTap.az-da necə qeydiyyatdan keçmək olar"),
          link: "/help/create-account"
        },
        {
          id: "adding-items",
          title: t("help.topics.addingItems", "Əşya əlavə etmək"),
          description: t("help.topics.addingItemsDesc", "Mübadilə üçün əşya necə əlavə edilir"),
          link: "/how-it-works"
        },
        {
          id: "browsing-items",
          title: t("help.topics.browsingItems", "Əşyalara baxmaq"),
          description: t("help.topics.browsingItemsDesc", "Platformada mövcud əşyaları necə axtarmaq və tapmaq olar"),
          link: "/items"
        },
      ]
    },
    {
      id: "bartering",
      title: t("help.categories.bartering", "Mübadilə prosesi"),
      icon: <Users className="h-5 w-5" />,
      description: t("help.categories.barteringDesc", "Əşyaların mübadiləsi və təkliflərin verilməsi haqqında"),
      topics: [
        {
          id: "make-offer",
          title: t("help.topics.makeOffer", "Təklif vermək"),
          description: t("help.topics.makeOfferDesc", "Mübadilə təklifi necə edilir"),
          link: "/how-it-works"
        },
        {
          id: "negotiate",
          title: t("help.topics.negotiate", "Danışıqlar aparmaq"),
          description: t("help.topics.negotiateDesc", "Mübadilə şərtlərini razılaşdırmaq"),
          link: "/how-it-works"
        },
        {
          id: "complete-exchange",
          title: t("help.topics.completeExchange", "Mübadiləni tamamlamaq"),
          description: t("help.topics.completeExchangeDesc", "Mübadiləni necə uğurla həyata keçirmək olar"),
          link: "/how-it-works"
        },
      ]
    },
    {
      id: "account",
      title: t("help.categories.account", "Hesab idarəetməsi"),
      icon: <Users className="h-5 w-5" />,
      description: t("help.categories.accountDesc", "Hesabınız və profil parametrləri ilə bağlı"),
      topics: [
        {
          id: "profile-settings",
          title: t("help.topics.profileSettings", "Profil parametrləri"),
          description: t("help.topics.profileSettingsDesc", "Profil məlumatlarınızı necə redaktə etmək olar"),
          link: "/profile"
        },
        {
          id: "notifications",
          title: t("help.topics.notifications", "Bildirişlər"),
          description: t("help.topics.notificationsDesc", "Bildirişləri necə idarə etmək olar"),
          link: "/notifications"
        },
        {
          id: "delete-account",
          title: t("help.topics.deleteAccount", "Hesabı silmək"),
          description: t("help.topics.deleteAccountDesc", "Hesabınızı necə silə bilərsiniz"),
          link: "/profile"
        },
      ]
    },
    {
      id: "safety",
      title: t("help.categories.safety", "Təhlükəsizlik"),
      icon: <Shield className="h-5 w-5" />,
      description: t("help.categories.safetyDesc", "Təhlükəsiz barter təcrübəsi üçün tövsiyələr"),
      topics: [
        {
          id: "safe-trading",
          title: t("help.topics.safeTrading", "Təhlükəsiz mübadilə"),
          description: t("help.topics.safeTradingDesc", "Əşyaları təhlükəsiz mübadilə etmək qaydaları"),
          link: "/faq"
        },
        {
          id: "report-issues",
          title: t("help.topics.reportIssues", "Problemləri bildirmək"),
          description: t("help.topics.reportIssuesDesc", "Şübhəli hesabları və hərəkətləri necə bildirmək olar"),
          link: "/contact"
        },
        {
          id: "privacy-tips",
          title: t("help.topics.privacyTips", "Məxfilik məsləhətləri"),
          description: t("help.topics.privacyTipsDesc", "Şəxsi məlumatlarınızı necə qorumaq olar"),
          link: "/privacy"
        },
      ]
    },
    {
      id: "troubleshooting",
      title: t("help.categories.troubleshooting", "Problemlərin həlli"),
      icon: <AlertTriangle className="h-5 w-5" />,
      description: t("help.categories.troubleshootingDesc", "Tez-tez qarşılaşılan problemlər və həlləri"),
      topics: [
        {
          id: "login-issues",
          title: t("help.topics.loginIssues", "Giriş problemləri"),
          description: t("help.topics.loginIssuesDesc", "Hesaba daxil ola bilmirsiniz? Həllər burada"),
          link: "/faq"
        },
        {
          id: "image-upload",
          title: t("help.topics.imageUpload", "Şəkil yükləmə"),
          description: t("help.topics.imageUploadDesc", "Şəkil yükləmə problemlərinin həlli"),
          link: "/faq"
        },
        {
          id: "messages-not-sending",
          title: t("help.topics.messagesNotSending", "Mesajlar göndərilmir"),
          description: t("help.topics.messagesNotSendingDesc", "Mesajlaşma problemlərinin həlli"),
          link: "/contact"
        },
      ]
    },
  ];

  // Populyar kömək məqalələri
  const popularHelpArticles = [
    {
      id: "how-bartertap-works",
      title: t("help.popular.howBarterTapWorks", "BarterTap necə işləyir?"),
      description: t("help.popular.howBarterTapWorksDesc", "Platformadan istifadənin əsas prinsipləri"),
      icon: <HelpCircle className="h-10 w-10 text-green-600" />,
      link: "/how-it-works"
    },
    {
      id: "making-successful-trades",
      title: t("help.popular.makingSuccessfulTrades", "Uğurlu mübadilə necə edilir?"),
      description: t("help.popular.makingSuccessfulTradesDesc", "Barter təkliflərinizi qəbul etdirmək üçün məsləhətlər"),
      icon: <Star className="h-10 w-10 text-green-600" />,
      link: "/how-it-works"
    },
    {
      id: "account-privacy",
      title: t("help.popular.accountPrivacy", "Hesab məxfiliyi"),
      description: t("help.popular.accountPrivacyDesc", "Şəxsi məlumatlarınızı necə qorumaq olar"),
      icon: <Shield className="h-10 w-10 text-green-600" />,
      link: "/privacy"
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t("help.title", "Kömək Mərkəzi")} | BarterTap.az</title>
        <meta name="description" content={t("help.description", "BarterTap.az-ın kömək mərkəzi. Tez-tez verilən suallar, istifadə təlimatları və problemlərin həlli üçün bölməmiz.")} />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-center">{t("help.title", "Kömək Mərkəzi")}</h1>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            {t("help.subtitle", "BarterTap platformasından ən yaxşı şəkildə istifadə etməyinizə kömək edəcək bütün məlumatları burada tapa bilərsiniz.")}
          </p>

          {/* Axtarış bölməsi */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 mb-10">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold mb-4 text-center text-green-700">
                {t("help.searchTitle", "Sualınız var?")}
              </h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t("help.searchPlaceholder", "Kömək mərkəzində axtar...")}
                  className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Button className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white">
                  {t("help.search", "Axtar")}
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 justify-center">
                <span className="text-sm text-gray-500">{t("help.popularSearches", "Populyar axtarışlar:")}</span>
                <a href="/faq" className="text-sm text-green-600 hover:underline">{t("help.popularSearch1", "təklif vermək")}</a>
                <a href="/faq" className="text-sm text-green-600 hover:underline">{t("help.popularSearch2", "hesab yaratmaq")}</a>
                <a href="/faq" className="text-sm text-green-600 hover:underline">{t("help.popularSearch3", "şəkil yükləmək")}</a>
              </div>
            </div>
          </div>

          {/* Populyar məqalələr */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              {t("help.popularArticles", "Populyar kömək məqalələri")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularHelpArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-md transition-shadow border border-gray-200">
                  <CardHeader className="pb-0">
                    <div className="flex justify-center mb-2">
                      {article.icon}
                    </div>
                    <CardTitle className="text-center text-xl">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center mb-4">{article.description}</CardDescription>
                    <div className="flex justify-center">
                      <Link href={article.link}>
                        <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                          {t("help.readMore", "Daha ətraflı")}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Kateqoriyalara görə kömək */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-center">
              {t("help.browseByCategory", "Kateqoriyaya görə gözdən keçirin")}
            </h2>

            <Tabs defaultValue="getting-started" className="mb-10">
              <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 mb-6 bg-transparent h-auto gap-2">
                {helpCategories.map((category) => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="border border-gray-200 rounded-lg flex flex-col items-center py-3 data-[state=active]:bg-green-50 data-[state=active]:border-green-200 data-[state=active]:text-green-700 h-auto"
                  >
                    <div className="flex items-center justify-center mb-1 text-green-600">
                      {category.icon}
                    </div>
                    <div className="text-sm font-medium">{category.title}</div>
                  </TabsTrigger>
                ))}
              </TabsList>

              {helpCategories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="pt-2">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="text-green-600">{category.icon}</div>
                      <h3 className="text-xl font-semibold">{category.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-6">{category.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.topics.map((topic) => (
                        <Link key={topic.id} href={topic.link}>
                          <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:bg-green-50 transition-colors cursor-pointer">
                            <h4 className="font-medium text-gray-900 mb-2">{topic.title}</h4>
                            <p className="text-gray-600 text-sm mb-3">{topic.description}</p>
                            <div className="flex items-center text-green-600 text-sm">
                              {t("help.learnMore", "Daha ətraflı")}
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Əlavə köməyə ehtiyacınız var? */}
          <div className="mt-12 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold mb-3">{t("help.needMoreHelp", "Əlavə köməyə ehtiyacınız var?")}</h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              {t("help.contactUsDesc", "Sualınıza cavab tapa bilmirsiniz? Dəstək komandamız sizə kömək etməyə hazırdır.")}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/faq">
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto text-green-600 border-green-600 hover:bg-green-50 flex items-center gap-2"
                >
                  <BookOpen className="h-5 w-5" />
                  {t("help.faq", "Tez-tez verilən suallar")}
                </Button>
              </Link>
              <Link href="/contact">
                <Button 
                  variant="default" 
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 flex items-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  {t("help.contactUs", "Bizimlə əlaqə")}
                </Button>
              </Link>
              <Link href="/terms">
                <Button 
                  variant="ghost" 
                  className="w-full sm:w-auto text-gray-600 hover:text-green-600 flex items-center gap-2"
                >
                  <FileText className="h-5 w-5" />
                  {t("help.termsAndPolicies", "Qaydalar və siyasətlər")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}