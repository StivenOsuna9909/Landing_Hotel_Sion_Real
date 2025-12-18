import { Play } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

const VideoSection = () => {
  const { t } = useTranslation();
  
  const videos = [
    { src: '/videos/img-7619', titleKey: 'videos.balconyView' },
    { src: '/videos/img-7627', titleKey: 'videos.facilities' },
    { src: '/videos/IMG_7628', titleKey: 'videos.balconyView2' },
    { src: '/videos/IMG_7631', titleKey: 'videos.facilities' },
    { src: '/videos/IMG_7641', titleKey: 'videos.balconyView3' },
    { src: '/videos/IMG_7644', titleKey: 'videos.facilities' },
    { src: '/videos/IMG_7635', titleKey: 'videos.facilities' },
  ];
  const [videoErrors, setVideoErrors] = useState<Record<number, boolean>>({});

  const handleVideoError = (index: number) => {
    setVideoErrors(prev => ({ ...prev, [index]: true }));
  };

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <p className="font-body text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
            {t('videos.title')}
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground">
            {t('videos.subtitle')}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {videos.map((video, index) => (
            <div key={index} className="group">
              <div className="relative aspect-[9/16] md:aspect-video overflow-hidden rounded-lg shadow-elegant bg-muted">
                {videoErrors[index] ? (
                  <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground p-4 text-center">
                    <div>
                      <p className="font-body text-sm mb-2">No se pudo cargar el video</p>
                      <p className="font-body text-xs">El formato .MOV puede no ser compatible con tu navegador.</p>
                      <p className="font-body text-xs mt-2">Por favor, convierte el video a formato MP4.</p>
                    </div>
                  </div>
                ) : (
                  <video
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                    style={{
                      WebkitTransform: 'translateZ(0)',
                      transform: 'translateZ(0)',
                    }}
                    controlsList="nodownload"
                    onError={() => handleVideoError(index)}
                    onLoadStart={() => console.log('Cargando video:', video.src)}
                    onCanPlay={() => console.log('Video listo para reproducir:', video.src)}
                  >
                    <source src={`${video.src}.mp4`} type="video/mp4" />
                    <source src={`${video.src}.MP4`} type="video/mp4" />
                    <source src={`${video.src}.mov`} type="video/quicktime" />
                    <source src={`${video.src}.MOV`} type="video/quicktime" />
                    Tu navegador no soporta videos HTML5.
                  </video>
                )}
              </div>
              <h3 className="font-display text-xl text-foreground mt-4 text-center">
                {t(video.titleKey)}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;