import { parse } from 'date-fns';

const TIME_FORMATS = ['h:mm a', 'HH:mm', 'h:mm aa'];

export function getAppointmentDateTime(date: string, time: string): Date {
    const base = new Date(date);

    for (const fmt of TIME_FORMATS) {
        try {
            const parsed = parse(time, fmt, base);
            if (!isNaN(parsed.getTime())) {
                return parsed;
            }
        } catch {
            // try next format
        }
    }

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay;
}

export function getHoursUntilAppointment(date: string, time: string): number {
    const appointmentAt = getAppointmentDateTime(date, time);
    return (appointmentAt.getTime() - Date.now()) / (1000 * 60 * 60);
}

export function isAppointmentInPast(date: string, time: string): boolean {
    return getAppointmentDateTime(date, time).getTime() < Date.now();
}

export function isWithinReminderWindow(date: string, time: string): boolean {
    const hoursUntil = getHoursUntilAppointment(date, time);
    return hoursUntil > 0 && hoursUntil <= 24;
}
