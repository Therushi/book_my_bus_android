import uuid from 'react-native-uuid';
import dayjs from 'dayjs';

export const generateId = (): string => uuid.v4() as string;

export const now = (): string => dayjs().format('YYYY-MM-DD HH:mm:ss');

export const formatDate = (date: string): string =>
  dayjs(date).format('DD MMM YYYY');

export const formatTime = (date: string): string =>
  dayjs(date).format('hh:mm A');

export const formatDateTime = (date: string): string =>
  dayjs(date).format('DD MMM YYYY, hh:mm A');

export const formatCurrency = (amount: number): string =>
  `₹${amount.toFixed(2)}`;

export const tripStatusLabel: Record<string, string> = {
  scheduled: 'Scheduled',
  on_time: 'On Time',
  delayed: 'Delayed',
  departed: 'Departed',
  cancelled: 'Cancelled',
};

export const tripStatusColor: Record<string, string> = {
  scheduled: '#2196F3',
  on_time: '#4CAF50',
  delayed: '#FFC107',
  departed: '#6C63FF',
  cancelled: '#FF5252',
};
