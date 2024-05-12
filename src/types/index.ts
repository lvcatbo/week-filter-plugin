interface FilterForm {
  fieldId: string,
  showInNew: boolean,
  applySetting: boolean,
  filterType: 'week' | 'month' | 'year',
  dateRange: [unknown, unknown],
  tipLabel: '近' | '前' | '第',
  count: number,
}

// interface IFilterInfo {
//   conjunction: 'and' | 'or',
//   conditions: {
//       field_id: string,
//       value: string,
//       field_type?: string,
//       operator: 'is' | 'isNot' | 'contains' | 'doesNotContain' |
//       'isGreater' | 'isLess' | 'isEmpty' | 'isNotEmpty' | 'isGreaterEqual' | 'isLessEqual',
//   }[],
// }
