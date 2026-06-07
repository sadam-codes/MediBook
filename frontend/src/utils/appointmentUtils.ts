import { parse, isAfter } from 'date-fns';

export function getAppointmentDateTime(date: string, time: string): Date {
    const base = new Date(date);

    const formats = ['h:mm a', 'HH:mm', 'h:mm aa'];
    for (const fmt of formats) {
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

/** Confirmed appointment whose date/time is still in the future. */
export function isUpcomingAppointment(
    appt: { date: string; time: string; status: string } | null | undefined,
): boolean {
    if (!appt || appt.status !== 'confirmed') {
        return false;
    }

    return isAfter(getAppointmentDateTime(appt.date, appt.time), new Date());
}

export function canPatientModifyAppointment(
    appt: { date: string; time: string; status: string; paymentStatus?: string },
    minHours = 24,
): boolean {
    if (appt.status !== 'confirmed' || appt.paymentStatus !== 'paid') {
        return false;
    }
    return getHoursUntilAppointment(appt.date, appt.time) >= minHours;
}

export function isReviewEligible(
    appt: { status: string; review?: { id: number } | null },
): boolean {
    return appt.status === 'completed' && !appt.review;
}

export function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        pending: 'Pending Payment',
        confirmed: 'Confirmed',
        cancelled: 'Cancelled',
        completed: 'Completed',
        no_show: 'No Show',
    };
    return labels[status] ?? status;
}

export function isPastAppointment(appt: { date: string; time: string }): boolean {
    return !isAfter(getAppointmentDateTime(appt.date, appt.time), new Date());
}

export function findActiveDoctorBooking(appointments: any[], doctorUserId: number) {
    return (
        appointments.find(
            (a) => a.doctorUserId === doctorUserId && isUpcomingAppointment(a),
        ) ?? null
    );
}
