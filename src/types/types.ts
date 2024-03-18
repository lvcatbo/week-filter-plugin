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

export type FilterType = WeekType | MonthType | 'custom';

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