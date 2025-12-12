import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Badge } from "../../ui/badge";

const bookings = [
  {
    id: 'BK-2401',
    guest: 'John Smith',
    room: '205',
    checkIn: '2025-11-06',
    checkOut: '2025-11-10',
    status: 'Confirmed',
    amount: '$680'
  },
  {
    id: 'BK-2402',
    guest: 'Sarah Johnson',
    room: '312',
    checkIn: '2025-11-07',
    checkOut: '2025-11-12',
    status: 'Checked-in',
    amount: '$950'
  },
  {
    id: 'BK-2403',
    guest: 'Michael Brown',
    room: '108',
    checkIn: '2025-11-06',
    checkOut: '2025-11-08',
    status: 'Checked-in',
    amount: '$340'
  },
  {
    id: 'BK-2404',
    guest: 'Emily Davis',
    room: '421',
    checkIn: '2025-11-08',
    checkOut: '2025-11-15',
    status: 'Pending',
    amount: '$1,190'
  },
  {
    id: 'BK-2405',
    guest: 'David Wilson',
    room: '217',
    checkIn: '2025-11-06',
    checkOut: '2025-11-09',
    status: 'Confirmed',
    amount: '$510'
  },
];

const statusColors = {
  'Confirmed': 'bg-blue-100 text-blue-800',
  'Checked-in': 'bg-green-100 text-green-800',
  'Pending': 'bg-yellow-100 text-yellow-800',
};

export function RecentBookings() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Booking ID</TableHead>
            <TableHead>Guest</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Check-in</TableHead>
            <TableHead>Check-out</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.id}</TableCell>
              <TableCell>{booking.guest}</TableCell>
              <TableCell>{booking.room}</TableCell>
              <TableCell>{booking.checkIn}</TableCell>
              <TableCell>{booking.checkOut}</TableCell>
              <TableCell>
                <Badge 
                  variant="secondary" 
                  className={statusColors[booking.status as keyof typeof statusColors]}
                >
                  {booking.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{booking.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
