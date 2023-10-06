import { WeekType, MonthType } from "~/types/types.d";

interface Option {
    color: "" | "default" | "warning" | "primary" | "success" | "text" | "info" | "danger",
    label: string,
    value: WeekType | MonthType,
}

export const weekOptions: {
    lastWeek: Option,
    thisWeek: Option,
    nextWeek: Option,
} = {
    lastWeek: {
        color: 'warning',
        label: 'weekNames.lastWeek',
        value: WeekType.lastWeek,
    },
    thisWeek: {
        color: 'primary',
        label: 'weekNames.thisWeek',
        value: WeekType.thisWeek,
    },
    nextWeek: {
        color: 'success',
        label: 'weekNames.nextWeek',
        value: WeekType.nextWeek,
    },
}

export const monthOptions: {
    lastMonth: Option,
    thisMonth: Option,
    nextMonth: Option,
} = {
    lastMonth: {
        color: 'warning',
        label: 'monthNames.lastMonth',
        value: MonthType.lastMonth,
    },
    thisMonth: {
        color: 'primary',
        label: 'monthNames.thisMonth',
        value: MonthType.thisMonth,
    },
    nextMonth: {
        color: 'success',
        label: 'monthNames.nextMonth',
        value: MonthType.nextMonth,
    },
}

