import { Switch, Route, useLocation, RouteComponentProps } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { NotFoundAdapter } from "@/lib/RouteAdapters";
import Unauthorized from "@/pages/unauthorized";
import Home from "@/pages/BarterTapHome";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ItemDetail from "@/pages/ItemDetail";
import ItemListing from "@/pages/ItemListing";
import CreateItem from "@/pages/CreateItem";
import ItemsList from "@/pages/ItemsList";
import Profile from "@/pages/Profile";
import Messages from "@/pages/Messages";
import Notifications from "@/pages/Notifications";
import Offers from "@/pages/Offers";
import NewOffer from "@/pages/NewOffer";
import HowItWorks from "@/pages/HowItWorks";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms";
import HelpCenter from "@/pages/help";
import FAQ from "@/pages/faq";
import Contact from "@/pages/contact";
import Map from "@/pages/Map";
import Dashboard from "@/pages/Dashboard";
import { AuthProvider } from "@/context/AuthContext";
import { AdminProvider } from "@/context/AdminContext";
import { ProtectedRoute } from "@/lib/protected-route";
import { GuestRoute } from "@/lib/guest-route";
import { AdminProtectedRoute } from "@/components/admin/AdminProtectedRoute";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { useEffect } from "react";
import AdvertisementBanner from "@/components/ads/AdvertisementBanner"; // Added import

// Admin pages
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminUsers from "@/pages/admin/Users";
import AdminListings from "@/pages/admin/Listings";
import AdminOffers from "@/pages/admin/Offers";
import AdminStats from "@/pages/admin/Stats";
import AdminAdvertisements from "@/pages/admin/Advertisements"; // Added import


function Router() {
  const [location] = useLocation();

  // Check if we're on an admin page
  const isAdminRoute = location.startsWith('/admin');

  // Admin routes don't use the same layout as the main site
  if (isAdminRoute && location !== '/admin/login') {
    return (
      <div className="min-h-screen">
        <SEO title="Admin Panel | BarterTap" noIndex={true} />
        <Switch>
          <Route path="/admin/login" component={AdminLogin} />
          <AdminProtectedRoute path="/admin" component={AdminDashboard} />
          <AdminProtectedRoute path="/admin/dashboard" component={AdminDashboard} />
          <AdminProtectedRoute path="/admin/users" component={AdminUsers} />
          <AdminProtectedRoute path="/admin/listings" component={AdminListings} />
          <AdminProtectedRoute path="/admin/offers" component={AdminOffers} />
          <AdminProtectedRoute path="/admin/advertisements" component={AdminAdvertisements} /> {/* Added route */}
          <AdminProtectedRoute path="/admin/stats" component={AdminStats} />
          <Route path="/admin/*" component={NotFoundAdapter} />
        </Switch>
      </div>
    );
  }

  // Regular site routes
  return (
    <div className="min-h-screen flex flex-col">
      {/* Base SEO that will apply to all pages */}
      <SEO pathName={location} />

      <Navbar />
      {/* Advertisement Banners */}
      <AdvertisementBanner position="left" />
      <AdvertisementBanner position="right" />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <GuestRoute path="/login" component={Login} />
          <GuestRoute path="/register" component={Register} />
          <Route path="/admin/login" component={AdminLogin} />
          <ProtectedRoute path="/item/new" component={CreateItem} />
          <ProtectedRoute path="/items/new" component={CreateItem} />
          <Route path="/item/:id" component={ItemDetail} />
          <Route path="/items/:id" component={ItemDetail} />
          <Route path="/items" component={ItemsList} />
          <ProtectedRoute path="/profile" component={Profile} />
          <ProtectedRoute path="/my-items" component={Profile} />
          <ProtectedRoute path="/dashboard" component={Dashboard} />
          <ProtectedRoute path="/messages" component={Messages} />
          <ProtectedRoute path="/notifications" component={Notifications} />
          <ProtectedRoute path="/offers" component={Offers} />
          <ProtectedRoute path="/offers/new" component={NewOffer} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route path="/categories" component={ItemsList} />
          <Route path="/search" component={ItemsList} />
          <Route path="/map" component={Map} />
          <Route path="/help" component={HelpCenter} />
          <Route path="/faq" component={FAQ} />
          <Route path="/contact" component={Contact} />
          <Route path="/unauthorized" component={Unauthorized} />
          <Route path="/privacy" component={PrivacyPolicy} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms" component={TermsOfService} />
          <Route path="/:rest*" component={NotFoundAdapter} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  // Uyğulamanın yüklənməsi əvvəli dil parametrini təmin edin
  // Əgər i18nextLng localStorage-də yoxdursa, əsas dil (Azərbaycan) təyin edin
  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (!savedLanguage) {
      localStorage.setItem('i18nextLng', 'az');
      i18n.changeLanguage('az');
    } else if (savedLanguage !== i18n.language) {
      // Əgər localStorage dəyəri i18n dilinə uyğun deyilsə, i18n-i yeniləyin
      i18n.changeLanguage(savedLanguage);
    }

    // HTML lang atributunu da yeniləyin
    document.documentElement.lang = savedLanguage || 'az';
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AdminProvider>
            <Router />
            <Toaster />
          </AdminProvider>
        </AuthProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}

export default App;