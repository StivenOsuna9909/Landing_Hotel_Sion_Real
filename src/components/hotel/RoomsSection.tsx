import { Bed, Users, Wifi, Coffee, Shirt, Wind, Tv, Bath } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import suiteImage from '@/assets/room-suite.jpg';
import deluxeImage from '@/assets/room-deluxe.jpg';
import standardImage from '@/assets/IMG_7626.jpg';

const featureIcons: Record<string, typeof Bed> = {
  'rooms.features.multipleBeds': Bed,
  'rooms.features.threeBeds': Bed,
  'rooms.features.twoBeds': Bed,
  'rooms.features.fourGuests': Users,
  'rooms.features.threeGuests': Users,
  'rooms.features.twoGuests': Users,
  'rooms.features.wifi': Wifi,
  'rooms.features.ac': Wind,
  'rooms.features.tv': Tv,
  'rooms.features.privateBath': Bath,
  'rooms.features.laundry': Shirt,
  'rooms.features.coffeeStation': Coffee,
};

const RoomsSection = () => {
  const { t } = useTranslation();

  const rooms = [
    {
      id: 'suite',
      name: t('rooms.family.name'),
      description: t('rooms.family.description'),
      price: 180,
      image: suiteImage,
      features: [
        'rooms.features.multipleBeds',
        'rooms.features.fourGuests',
        'rooms.features.wifi',
        'rooms.features.tv',
        'rooms.features.ac',
        'rooms.features.privateBath',
        'rooms.features.laundry',
        'rooms.features.coffeeStation',
      ],
    },
    {
      id: 'deluxe',
      name: t('rooms.triple.name'),
      description: t('rooms.triple.description'),
      price: 135,
      image: deluxeImage,
      features: [
        'rooms.features.threeBeds',
        'rooms.features.threeGuests',
        'rooms.features.wifi',
        'rooms.features.tv',
        'rooms.features.ac',
        'rooms.features.privateBath',
        'rooms.features.laundry',
        'rooms.features.coffeeStation',
      ],
    },
    {
      id: 'standard',
      name: t('rooms.double.name'),
      description: t('rooms.double.description'),
      price: 60,
      image: standardImage,
      features: [
        'rooms.features.twoBeds',
        'rooms.features.twoGuests',
        'rooms.features.wifi',
        'rooms.features.tv',
        'rooms.features.ac',
        'rooms.features.privateBath',
        'rooms.features.laundry',
        'rooms.features.coffeeStation',
      ],
    },
  ];
  return (
    <section id="habitaciones" className="section-padding bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="font-body text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
            {t('rooms.accommodation')}
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
            {t('rooms.title')}
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            {t('rooms.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <article
              key={room.id}
              className="card-elegant group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-2xl text-foreground mb-3">
                  {room.name}
                </h3>
                <p className="font-body text-muted-foreground text-sm mb-4 leading-relaxed">
                  {room.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {room.features.map((feature) => {
                    const Icon = featureIcons[feature] || Bed;
                    return (
                      <span
                        key={feature}
                        className="flex items-center gap-1 text-xs text-muted-foreground"
                      >
                        <Icon size={14} />
                        {t(feature)}
                      </span>
                    );
                  })}
                </div>

                <a
                  href="#reservar"
                  className="block w-full btn-gold rounded text-center"
                >
                  {t('rooms.reserveRoom')}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoomsSection;
