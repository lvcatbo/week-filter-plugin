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

export type TimeType = WeekType | MonthType | 'custom';

export interface IView {
    view_id: string,
    view_name: string,
    view_type: string,
    property: IViewProperty,
}

interface IViewProperty {
    filter_info?: IFilterInfo,
    hidden_fields: string[],
}

interface IFilterInfo {
    conjunction: 'and' | 'or',
    conditions: {
        field_id: string,
        value: string,
        field_type?: string,
        operator: 'is' | 'isNot' | 'contains' | 'doesNotContain' |
        'isGreater' | 'isLess' | 'isEmpty' | 'isNotEmpty' | 'isGreaterEqual' | 'isLessEqual',
    }[],
}

interface QueryData{
    appToken: string,
    personalToken: string,
    tableId: string,
    viewId?: string,
}