import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Calendar, 
  LogOut, 
  DollarSign, 
  Users, 
  CheckCircle, 
  Clock,
  XCircle,
  Hotel,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale/es';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import ReservationsCalendar from '@/components/admin/ReservationsCalendar';
import { 
  getReservations, 
  getConfirmedReservations,
  getReservationStats,
  Reservation 
} from '@/services/reservations';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [confirmedReservations, setConfirmedReservations] = useState<Reservation[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [allReservations, confirmed, statistics] = await Promise.all([
        getReservations(),
        getConfirmedReservations(),
        getReservationStats(),
      ]);
      
      setReservations(allReservations);
      setConfirmedReservations(confirmed);
      setStats(statistics);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las reservas',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reservas del mes seleccionado
  const monthReservations = useMemo(() => {
    if (!selectedDate) return confirmedReservations;
    
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    
    return confirmedReservations.filter(reservation => {
      const checkIn = parseISO(reservation.checkIn);
      const checkOut = parseISO(reservation.checkOut);
      
      return isWithinInterval(checkIn, { start, end }) || 
             isWithinInterval(checkOut, { start, end }) ||
             (checkIn <= start && checkOut >= end);
    });
  }, [confirmedReservations, selectedDate]);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="font-body text-muted-foreground">Cargando reservas...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const handleLogout = () => {
    logout();
    toast({
      title: 'Sesión cerrada',
      description: 'Has cerrado sesión exitosamente',
    });
    navigate('/admin/login');
  };

  const getStatusBadge = (status: Reservation['status']) => {
    const variants: Record<Reservation['status'], { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      pending: { variant: 'secondary', label: 'Pendiente' },
      confirmed: { variant: 'default', label: 'Confirmada' },
      paid: { variant: 'default', label: 'Pagada' },
      cancelled: { variant: 'destructive', label: 'Cancelada' },
    };
    
    const { variant, label } = variants[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getPaymentMethodBadge = (method: Reservation['paymentMethod']) => {
    const colors: Record<Reservation['paymentMethod'], string> = {
      PSE: 'bg-blue-500/10 text-blue-500 border-blue-500',
      NEQUI: 'bg-[#D62631]/10 text-[#D62631] border-[#D62631]',
      WHATSAPP: 'bg-green-500/10 text-green-500 border-green-500',
    };
    
    return (
      <Badge variant="outline" className={colors[method]}>
        {method}
      </Badge>
    );
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Hotel className="text-primary" size={24} />
                </div>
                <div>
                  <h1 className="font-display text-xl text-foreground">Hotel Sion Real</h1>
                  <p className="font-body text-sm text-muted-foreground">Panel de Administración</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-input bg-background hover:bg-secondary transition-colors font-body text-sm"
              >
                <LogOut size={16} />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-body text-sm font-medium">Total Reservas</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-display font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground font-body">
                  {stats.confirmed} confirmadas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-body text-sm font-medium">Ingresos Totales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-display font-bold">
                  COP ${stats.totalRevenue.toLocaleString('es-CO')}
                </div>
                <p className="text-xs text-muted-foreground font-body">
                  Reservas confirmadas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-body text-sm font-medium">Pendientes</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-display font-bold">{stats.pending}</div>
                <p className="text-xs text-muted-foreground font-body">
                  Requieren atención
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-body text-sm font-medium">Canceladas</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-display font-bold">{stats.cancelled}</div>
                <p className="text-xs text-muted-foreground font-body">
                  Reservas canceladas
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs: Calendario y Lista */}
          <Tabs defaultValue="calendar" className="space-y-4">
            <TabsList>
              <TabsTrigger value="calendar">Calendario</TabsTrigger>
              <TabsTrigger value="reservations">Reservas</TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Calendario de Reservas</CardTitle>
                  <CardDescription className="font-body">
                    Visualiza las reservas activas y la disponibilidad del hotel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <ReservationsCalendar
                      reservations={reservations}
                      selectedDate={selectedDate}
                      onDateSelect={setSelectedDate}
                    />
                    <div className="space-y-4">
                      <h3 className="font-display text-lg font-semibold">
                        Reservas del Mes
                      </h3>
                      {monthReservations.length === 0 ? (
                        <p className="font-body text-muted-foreground">
                          No hay reservas para este mes
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {monthReservations.map((reservation) => (
                            <div
                              key={reservation.id}
                              className="p-4 border border-border rounded-lg bg-card space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-body font-medium">
                                  {reservation.customerName}
                                </span>
                                {getStatusBadge(reservation.status)}
                              </div>
                              <div className="text-sm text-muted-foreground font-body">
                                <p>
                                  {format(parseISO(reservation.checkIn), 'dd/MM/yyyy', { locale: es })} - 
                                  {format(parseISO(reservation.checkOut), 'dd/MM/yyyy', { locale: es })}
                                </p>
                                <p>{reservation.roomName}</p>
                                <p className="font-semibold text-foreground">
                                  COP ${reservation.total.toLocaleString('es-CO')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reservations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Reservas Confirmadas y Pagadas</CardTitle>
                  <CardDescription className="font-body">
                    Lista completa de reservas exitosas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {confirmedReservations.length === 0 ? (
                    <p className="font-body text-muted-foreground text-center py-8">
                      No hay reservas confirmadas aún
                    </p>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="font-body">Cliente</TableHead>
                            <TableHead className="font-body">Habitación</TableHead>
                            <TableHead className="font-body">Entrada</TableHead>
                            <TableHead className="font-body">Salida</TableHead>
                            <TableHead className="font-body">Huéspedes</TableHead>
                            <TableHead className="font-body">Total</TableHead>
                            <TableHead className="font-body">Pago</TableHead>
                            <TableHead className="font-body">Estado</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {confirmedReservations
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .map((reservation) => (
                              <TableRow key={reservation.id}>
                                <TableCell className="font-body">
                                  <div>
                                    <p className="font-medium">{reservation.customerName}</p>
                                    <p className="text-sm text-muted-foreground">{reservation.customerEmail}</p>
                                  </div>
                                </TableCell>
                                <TableCell className="font-body">{reservation.roomName}</TableCell>
                                <TableCell className="font-body">
                                  {format(parseISO(reservation.checkIn), 'dd/MM/yyyy', { locale: es })}
                                </TableCell>
                                <TableCell className="font-body">
                                  {format(parseISO(reservation.checkOut), 'dd/MM/yyyy', { locale: es })}
                                </TableCell>
                                <TableCell className="font-body">{reservation.guests}</TableCell>
                                <TableCell className="font-body font-semibold">
                                  COP ${reservation.total.toLocaleString('es-CO')}
                                </TableCell>
                                <TableCell className="font-body">
                                  {getPaymentMethodBadge(reservation.paymentMethod)}
                                </TableCell>
                                <TableCell className="font-body">
                                  {getStatusBadge(reservation.status)}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;

