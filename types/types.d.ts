export enum WeekType {
    lastWeek = 'last_week',
    nextWeek = 'next_week',
    thisWeek = 'this_week',
}

export enum MonthType {
    lastMonth = 'last_month',
    nextMonth = 'next_month',
    thisMonth = 'this_month',
}

export type TimeType = WeekType | MonthType;

