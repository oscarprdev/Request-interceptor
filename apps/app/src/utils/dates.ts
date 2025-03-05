import { format, parseISO } from 'date-fns';

/**
 * Formats a date string into a human-readable format
 * @param dateString ISO date string from the backend
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Formats a date string into a date and time format
 * @param dateString ISO date string from the backend
 * @returns Formatted date and time string
 */
export function formatDateTime(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy h:mm a');
  } catch (error) {
    console.error('Error formatting date time:', error);
    return dateString;
  }
}

/**
 * Converts a PostgreSQL timestamp string to an ISO date string
 * @param pgTimestamp PostgreSQL timestamp string (e.g., "2025-03-03 08:09:58.180833")
 * @returns ISO date string
 */
export function convertPgTimestampToIso(pgTimestamp: string): string {
  try {
    // Replace space with T and remove microseconds if present
    return pgTimestamp.replace(' ', 'T').replace(/\.\d+$/, '') + 'Z';
  } catch (error) {
    console.error('Error converting PostgreSQL timestamp:', error);
    return pgTimestamp;
  }
}

/**
 * Formats a PostgreSQL timestamp directly to a human-readable format
 * @param pgTimestamp PostgreSQL timestamp string (e.g., "2025-03-03 08:09:58.180833")
 * @returns Formatted date string
 */
export function formatPgDate(pgTimestamp: string): string {
  try {
    const isoDate = convertPgTimestampToIso(pgTimestamp);
    return formatDate(isoDate);
  } catch (error) {
    console.error('Error formatting PostgreSQL date:', error);
    return pgTimestamp;
  }
}

/**
 * Formats a PostgreSQL timestamp directly to a human-readable date and time format
 * @param pgTimestamp PostgreSQL timestamp string (e.g., "2025-03-03 08:09:58.180833")
 * @returns Formatted date and time string
 */
export function formatPgDateTime(pgTimestamp: string): string {
  try {
    const isoDate = convertPgTimestampToIso(pgTimestamp);
    return formatDateTime(isoDate);
  } catch (error) {
    console.error('Error formatting PostgreSQL date time:', error);
    return pgTimestamp;
  }
}
