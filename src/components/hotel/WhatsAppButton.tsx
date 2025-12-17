import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const phoneNumber = '573133505180'; // Número sin espacios ni caracteres especiales
  const message = encodeURIComponent(`Hola, me gustaría reservar una habitación en Hotel Sion Real.

📅 Fecha de entrada: 

📅 Fecha de salida: 

👥 Número de Huéspedes: 

🛏️ Tipo de habitación: 

⭐ Preferencias: 
(por ejemplo: cama matrimonial, no fumador, fumador, planta baja, balcón)

¿Podrían confirmarme disponibilidad y tarifa total (incluyendo impuestos y desayuno o comidas)? ¿Cuál es la política de cancelación y si ofrecen traslado al aeropuerto?

📋 Contacto:
• Nombre completo: 
• WhatsApp: 
• Correo: 
• Cédula de ciudadanía: 

Muchas gracias, quedo atento/a a su respuesta.`);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce hover:animate-none group"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={28} className="group-hover:scale-110 transition-transform" />
      <span className="sr-only">Contactar por WhatsApp</span>
    </a>
  );
};

export default WhatsAppButton;

