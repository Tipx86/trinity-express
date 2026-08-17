export function formatCurrency(amount: number, currency: string = 'RWF'): string {
  const rounded = Math.round(amount);
  switch (currency.toUpperCase()) {
    case 'RWF':
      return `${rounded.toLocaleString('en-US')} RWF`;
    case 'UGX':
      return `UGX ${rounded.toLocaleString('en-US')}`;
    case 'KES':
      return `KES ${rounded.toLocaleString('en-US')}`;
    case 'USD':
      return `$${rounded.toFixed(2)}`;
    case 'SSP':
      return `SSP ${rounded.toLocaleString('en-US')}`;
    default:
      return `${rounded.toLocaleString('en-US')} ${currency}`;
  }
}

export function formatDuration(minutes: number): string {
  if (!minutes || minutes <= 0) return '0m';
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (hours > 0 && remainingMins > 0) {
    return `${hours}h ${remainingMins}m`;
  }
  if (hours > 0) {
    return `${hours} hrs`;
  }
  return `${remainingMins} mins`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return date.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatTime(timeStr: string): string {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  if (h === undefined || m === undefined) return timeStr;
  const hours = parseInt(h, 10);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours.toString().padStart(2, '0')}:${m} ${ampm}`;
}

export function generateBookingRef(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = 'TE-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateTicketNumber(bookingRef: string, seatNumber: number): string {
  const cleanRef = bookingRef.replace(/[^A-Z0-9]/gi, '');
  return `TKT-${cleanRef}-S${seatNumber.toString().padStart(2, '0')}`;
}

export function generateSecurityToken(): string {
  return 'TE_SEC_' + Math.random().toString(36).substring(2, 10).toUpperCase() + Date.now().toString(36).toUpperCase();
}
