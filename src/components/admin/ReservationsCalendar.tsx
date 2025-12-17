import { useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Reservation } from '@/services/reservations';
import { format, isSameDay, isWithinInterval, parseISO } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { cn } from '@/lib/utils';

interface ReservationsCalendarProps {
  reservations: Reservation[];
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

const ReservationsCalendar = ({ 
  reservations, 
  selectedDate,
  onDateSelect 
}: ReservationsCalendarProps) => {
  // Filtrar solo reservas confirmadas/pagadas
  const confirmedReservations = useMemo(() => {
    return reservations.filter(r => r.status === 'confirmed' || r.status === 'paid');
  }, [reservations]);

  // Función para determinar si una fecha tiene reservas
  const getDateStatus = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Verificar si es fecha de entrada
    const isCheckIn = confirmedReservations.some(r => 
      isSameDay(parseISO(r.checkIn), date)
    );
    
    // Verificar si es fecha de salida
    const isCheckOut = confirmedReservations.some(r => 
      isSameDay(parseISO(r.checkOut), date)
    );
    
    // Verificar si está dentro de un período de reserva
    const isOccupied = confirmedReservations.some(r => {
      const checkIn = parseISO(r.checkIn);
      const checkOut = parseISO(r.checkOut);
      return isWithinInterval(date, { start: checkIn, end: checkOut });
    });
    
    return { isCheckIn, isCheckOut, isOccupied };
  };

  // Modificar el estilo de las celdas del calendario
  const modifiers = useMemo(() => {
    const occupiedDates: Date[] = [];
    const checkInDates: Date[] = [];
    const checkOutDates: Date[] = [];
    
    confirmedReservations.forEach(reservation => {
      const checkIn = parseISO(reservation.checkIn);
      const checkOut = parseISO(reservation.checkOut);
      
      // Agregar todas las fechas ocupadas
      let currentDate = new Date(checkIn);
      while (currentDate <= checkOut) {
        occupiedDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      checkInDates.push(checkIn);
      checkOutDates.push(checkOut);
    });
    
    return {
      occupied: occupiedDates,
      checkIn: checkInDates,
      checkOut: checkOutDates,
    };
  }, [confirmedReservations]);

  const modifiersClassNames = {
    occupied: 'bg-primary/20 border-2 border-primary',
    checkIn: 'bg-green-500/30 border-2 border-green-500 font-bold',
    checkOut: 'bg-red-500/30 border-2 border-red-500 font-bold',
  };

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        locale={es}
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
        className="rounded-lg border bg-card"
      />
      
      {/* Leyenda */}
      <div className="flex flex-wrap gap-4 text-sm font-body">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500/30 border-2 border-green-500 rounded"></div>
          <span className="text-muted-foreground">Entrada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary/20 border-2 border-primary rounded"></div>
          <span className="text-muted-foreground">Ocupado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500/30 border-2 border-red-500 rounded"></div>
          <span className="text-muted-foreground">Salida</span>
        </div>
      </div>
    </div>
  );
};

export default ReservationsCalendar;

