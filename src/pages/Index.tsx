import Header from '@/components/hotel/Header';
import HeroSection from '@/components/hotel/HeroSection';
import ImageCarousel from '@/components/hotel/ImageCarousel';
import VideoSection from '@/components/hotel/VideoSection';
import RoomsSection from '@/components/hotel/RoomsSection';
import BookingForm from '@/components/hotel/BookingForm';
import TariffTable from '@/components/hotel/TariffTable';
import ContactSection from '@/components/hotel/ContactSection';
import Footer from '@/components/hotel/Footer';
import WhatsAppButton from '@/components/hotel/WhatsAppButton';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <RoomsSection />
        <ImageCarousel />
        <VideoSection />
        <TariffTable />
        <BookingForm />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
