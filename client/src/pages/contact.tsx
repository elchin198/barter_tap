import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Mail, Phone, Clock, Send } from "lucide-react";
import { BsWhatsapp, BsTelegram } from "react-icons/bs";

export default function Contact() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Actual submission would use an API endpoint
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: t('contact.successTitle', 'Mesajınız göndərildi'),
        description: t('contact.successDescription', 'Sizinlə tezliklə əlaqə saxlayacağıq'),
        variant: "default",
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: t('contact.errorTitle', 'Xəta baş verdi'),
        description: t('contact.errorDescription', 'Mesajınız göndərilmədi. Zəhmət olmasa yenidən cəhd edin'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t("contact.title", "Bizimlə Əlaqə")} | BarterTap.az</title>
        <meta name="description" content={t("contact.description", "BarterTap.az ilə əlaqə saxlayın. Suallarınız, təklifləriniz və ya problemləriniz üçün bizə yazın.")} />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-center">{t("contact.title", "Bizimlə Əlaqə")}</h1>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            {t("contact.subtitle", "Suallarınız, təklifləriniz və ya problemləriniz üçün bizə yazın. Tezliklə sizə cavab verəcəyik.")}
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Contact Info */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">{t("contact.getInTouch", "Bizimlə Əlaqə")}</h2>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {t("contact.address", "Ünvan")}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        Əhməd Rəcəbli, Bakı, Azərbaycan
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {t("contact.email", "E-poçt")}
                      </h3>
                      <a href="mailto:info@bartertap.az" className="text-green-600 hover:underline mt-1 block">
                        info@bartertap.az
                      </a>
                      <a href="mailto:support@bartertap.az" className="text-green-600 hover:underline mt-1 block">
                        support@bartertap.az
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {t("contact.phone", "Telefon")}
                      </h3>
                      <a href="tel:+994552554800" className="text-green-600 hover:underline mt-1 block">
                        +994 55 255 48 00
                      </a>

                      <div className="flex space-x-3 mt-2">
                        <a 
                          href="https://wa.me/994552554800" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-1 text-green-600 hover:text-green-700"
                          title={t("contact.whatsapp", "WhatsApp")}
                        >
                          <BsWhatsapp className="h-4 w-4" />
                          <span className="text-sm">WhatsApp</span>
                        </a>

                        <a 
                          href="https://t.me/bartertap" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-1 text-green-600 hover:text-green-700"
                          title={t("contact.telegram", "Telegram")}
                        >
                          <BsTelegram className="h-4 w-4" />
                          <span className="text-sm">Telegram</span>
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {t("contact.workingHours", "İş saatları")}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {t("contact.workdays", "Bazar ertəsi - Cümə")}: 9:00 - 18:00
                      </p>
                      <p className="text-gray-600 mt-1">
                        {t("contact.weekend", "Şənbə - Bazar")}: {t("contact.closed", "Bağlıdır")}
                      </p>
                    </div>
                  </li>
                </ul>

                <div className="mt-6">
                  <h3 className="font-medium text-gray-900 mb-3">
                    {t("contact.location", "Mövqeyimiz")}
                  </h3>
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d194473.46594450455!2d49.714956020302565!3d40.394524632721736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d6bd6211cf9%3A0x343f6b5e7ae56c6b!2zQmFrxLEsIEF6yZlyYmF5Y2Fu!5e0!3m2!1str!2s!4v1623251211316!5m2!1str!2s" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen={false} 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade">
                    </iframe>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <h2 className="text-xl font-semibold mb-6">{t("contact.sendMessage", "Mesaj göndərin")}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        {t("contact.yourName", "Adınız")} *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full"
                        placeholder={t("contact.namePlaceholder", "Adınızı daxil edin")}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        {t("contact.yourEmail", "E-poçt ünvanınız")} *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full"
                        placeholder={t("contact.emailPlaceholder", "E-poçt ünvanınızı daxil edin")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                      {t("contact.subject", "Mövzu")} *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full"
                      placeholder={t("contact.subjectPlaceholder", "Mövzunu daxil edin")}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      {t("contact.message", "Mesajınız")} *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full min-h-[150px]"
                      placeholder={t("contact.messagePlaceholder", "Mesajınızı daxil edin")}
                    />
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                    >
                      {isSubmitting ? t("contact.sending", "Göndərilir...") : t("contact.send", "Göndər")}
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}