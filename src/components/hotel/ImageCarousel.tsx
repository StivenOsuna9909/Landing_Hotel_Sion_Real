import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import lobbyImage from '@/assets/hotel-lobby.jpg';
import poolImage from '@/assets/hotel-pool.jpg';
import restaurantImage from '@/assets/hotel-restaurant.jpg';
import suiteImage from '@/assets/room-suite.jpg';
import roomExtra from '@/assets/room-extra.jpg';
import roomTripleImage from '@/assets/room-triple.jpg';
import roomTriple2Image from '@/assets/IMG_7630.jpg';
import roomCuadrupleImage from '@/assets/IMG_7636.jpg';
import comedorImage from '@/assets/hotel-comedor.jpg';
import banoImage from '@/assets/IMG_7614.jpg';
import bano2Image from '@/assets/IMG_7637.jpg';
import pasilloPiso2Image from '@/assets/pasillo_piso_2.jpg';
import pasilloPiso2Vista2Image from '@/assets/pasillo_piso_2_2.jpg';
import pasilloPiso3Image from '@/assets/pasillo_piso_3.jpg';

const ImageCarousel = () => {
  const { t } = useTranslation();
  
  const images = [
    { src: lobbyImage, alt: 'Recepción Hotel Sion Real', titleKey: 'gallery.reception' },
    { src: comedorImage, alt: 'Comedor del hotel', titleKey: 'gallery.dining' },
    { src: poolImage, alt: 'Pasillo del hotel', titleKey: 'gallery.facilities' },
    { src: restaurantImage, alt: 'Pasillo con pisos decorativos', titleKey: 'gallery.hallways' },
    { src: suiteImage, alt: 'Habitación múltiple', titleKey: 'gallery.rooms' },
    { src: roomExtra, alt: 'Habitación triple', titleKey: 'gallery.tripleRoom' },
    { src: roomTripleImage, alt: 'Habitación triple', titleKey: 'gallery.tripleRoom2' },
    { src: roomTriple2Image, alt: 'Habitación Triple', titleKey: 'gallery.tripleRoom' },
    { src: roomCuadrupleImage, alt: 'Habitación cuádruple', titleKey: 'gallery.quadrupleRoom' },
    { src: banoImage, alt: 'Baño del hotel', titleKey: 'gallery.bathroom' },
    { src: bano2Image, alt: 'Baños del hotel', titleKey: 'gallery.bathrooms' },
    { src: pasilloPiso2Image, alt: 'Parte del pasillo piso 2', titleKey: 'gallery.hallwayFloor2' },
    { src: pasilloPiso2Vista2Image, alt: 'Otra vista pasillo 2', titleKey: 'gallery.hallwayFloor2View2' },
    { src: pasilloPiso3Image, alt: 'Pasillo piso 3', titleKey: 'gallery.hallwayFloor3' },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <section id="galeria" className="section-padding bg-secondary">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <p className="font-body text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
            {t('gallery.title')}
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground">
            {t('gallery.subtitle')}
          </h2>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Main Image */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg shadow-elegant">
            {images.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-contain bg-background"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/70 to-transparent p-8">
                  <h3 className="font-display text-2xl md:text-3xl text-cream">
                    {t(image.titleKey)}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-background transition-colors shadow-card"
            aria-label="Anterior"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-background transition-colors shadow-card"
            aria-label="Siguiente"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-6">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary w-8'
                    : 'bg-muted hover:bg-muted-foreground'
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageCarousel;
