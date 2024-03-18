import dayjs from "dayjs"
import quarterOfYear from 'dayjs/plugin/quarterOfYear';

dayjs.extend(quarterOfYear);

export default (t: any) => {
  return  [
    {
      text: t('shortcut.lastYear'),
      value: () => {
        const start = dayjs().subtract(1, 'year').startOf('year').toDate();
        const end = dayjs().subtract(1, 'year').endOf('year').toDate();
        return [start, end];
      }
    },
    {
      text: t('shortcut.thisYear'),
      value: () => {
        const start = dayjs().startOf('year').toDate();
        const end = dayjs().endOf('year').toDate();
        return [start, end];
      }
    },
    {
      text: t('shortcut.nextYear'),
      value: () => {
        const start = dayjs().add(1, 'year').startOf('year').toDate();
        const end = dayjs().add(1, 'year').endOf('year').toDate();
        return [start, end];
      }
    },
    {
      text: t('shortcut.lastQuarter'),
      value: () => {
        const start = dayjs().subtract(1, 'quarter').startOf('quarter').toDate();
        const end = dayjs().subtract(1, 'quarter').endOf('quarter').toDate();
        return [start, end];
      }
    },
    {
      text: t('shortcut.thisQuarter'),
      value: () => {
        const start = dayjs().startOf('quarter').toDate();
        const end = dayjs().endOf('quarter').toDate();
        return [start, end];
      }
    },
    {
      text: t('shortcut.nextQuarter'),
      value: () => {
        const start = dayjs().add(1, 'quarter').startOf('quarter').toDate();
        const end = dayjs().add(1, 'quarter').endOf('quarter').toDate();
        return [start, end];
      }
    },

    {
      text: t('shortcut.lastWeek'),
      value: () => {
        const start = dayjs().subtract(1, 'week').startOf('week').toDate();
        const end = dayjs().subtract(1, 'week').endOf('week').toDate();
        return [start, end];
      }
    },
    {
      text: t('shortcut.thisWeek'),
      value: () => {
        const start = dayjs().startOf('week').toDate();
        const end = dayjs().endOf('week').toDate();
        return [start, end];
      }
    },
    {
      text: t('shortcut.nextWeek'),
      value: () => {
        const start = dayjs().add(1, 'week').startOf('week').toDate();
        const end = dayjs().add(1, 'week').endOf('week').toDate();
        return [start, end];
      }
    },
    {
      text: t('shortcut.last3Months'),
      value: () => {
        const start = dayjs().subtract(3, 'month').startOf('month').toDate();
        const end = dayjs().endOf('month').toDate();
        return [start, end];
      }
    }
  ];
}