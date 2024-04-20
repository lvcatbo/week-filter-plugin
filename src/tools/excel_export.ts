import {IFieldMeta, IRecord, ITable, FieldType, CurrencyCode } from '@lark-base-open/js-sdk'
import dayjs from 'dayjs'
import { WorkSheet, utils, writeFile } from 'xlsx';


/**
 * 获取字段和原始数据
 * @param table 当前的ITable对象
 * @returns {fieldList, allRecords} 字段信息列表和原始数据
 * 
 */
const getRawData = async (table: ITable) => {
  /** 获取有序fieldList 和 数据record */
  const view = await table.getActiveView();
  const fieldList = await view.getFieldMetaList();
  fieldList.forEach(field => {
    if(field.type === FieldType.Currency) {
      field.name = `${field.name} (${getCurrencySymbol((field.property as any).currencyCode)})`; 
    }
  })

  let hasMore = true;
  let allRecords :IRecord[] = [];
  while(hasMore) {
    let records = await table.getRecords({
      pageSize: 5000,
      viewId: view.id
    });
    hasMore = records.hasMore;
    allRecords = allRecords.concat(records.records);
  }
  debugger
  console.log(allRecords,fieldList)
  return {fieldList, allRecords}
}

/**
 * 组装excel数据
 * @param rawData :IRecord[] 原始数据(有序记录)
 * @param fieldList :IFieldMeta[] 字段信息列表（有序）
 * @return rows: xlsx可识别的数据对象数组
 */
const generateRows = (fieldList: IFieldMeta[], rawData: IRecord[]): any[] => {
  let rows = rawData.map((record: IRecord, index: number) => {
    let row = {};
    for(const field of fieldList) {
      row[field.name] = generateCellData(field, record.fields[field.id]);
    };
    return row;
  })
  return rows;
}

/**
 * 数据类型转化，
 * 将原始多维表数据转换为excel可读取的数据
 * @field 字段信息（提供原始的字段类型）
 * @value 原始数据
 * @return 转化后的数据
 */
const generateCellData = (field: IFieldMeta, value: any): string => {
  if (value == null) return undefined;

  switch (field.type) {
    case FieldType.Text:
      return value[0].text;
    case FieldType.Number:
    case FieldType.Currency:
    case FieldType.Phone:
    case FieldType.Rating:
    case FieldType.Email:
      return value;
    case FieldType.Checkbox:
      return value ? '是' : '否';
    case FieldType.SingleSelect: 
      return value.text;
    case FieldType.MultiSelect:
    case FieldType.Formula:
      return value?.map(val => val?.text.toString()).join(', ');
    case FieldType.User:
    case FieldType.CreatedUser:
    case FieldType.ModifiedUser:
    case FieldType.GroupChat:
      return value?.map(val => val?.name).join(', ');
    case FieldType.Url:
      return value?.map(val => val?.link).join(', ')
    case FieldType.Progress:
      return `${value * 100}%`;
    case FieldType.Location:
      return value.fullAddress;
    case FieldType.AutoNumber:
      return value.value;
    case FieldType.CreatedTime:
    case FieldType.DateTime:
    case FieldType.ModifiedTime:
      return dayjs(value).format('YYYY-MM-DD');
    default:
      return '未支持'
  }
}

/**
 * 货币标识符
 * @param currencyCode 货币代码
 * @return 货币符号
 */
const getCurrencySymbol = (currencyCode: CurrencyCode) => {
  switch (currencyCode) {
    case CurrencyCode.CNY:
      return '￥';
    case CurrencyCode.USD:
      return '$';
    case CurrencyCode.EUR:
      return '€';
    case CurrencyCode.GBP:
      return '£';
    case CurrencyCode.AED:
      return 'د.إ';
    case CurrencyCode.AUD:
      return '$';
    case CurrencyCode.BRL:
      return 'R$';
    case CurrencyCode.CAD:
      return '$';
    case CurrencyCode.CHF:
      return 'CHF';
    case CurrencyCode.HKD:
      return '$';
    case CurrencyCode.INR:
      return '₹';
    case CurrencyCode.IDR:
      return 'Rp';
    case CurrencyCode.JPY:
      return '¥';
    case CurrencyCode.KRW:
      return '₩';
    case CurrencyCode.MOP:
      return 'MOP$';
    case CurrencyCode.MXN:
      return '$';
    case CurrencyCode.MYR:
      return 'RM';
    case CurrencyCode.PHP:
      return '₱';
    case CurrencyCode.PLN:
      return 'zł';
    case CurrencyCode.RUB:
      return '₽';
    case CurrencyCode.SGD:
      return '$';
    case CurrencyCode.THB:
      return '฿';
    case CurrencyCode.TRY:
      return '₺';
    case CurrencyCode.TWD:
      return 'NT$';
    case CurrencyCode.VND:
      return '₫';
    default:
      return currencyCode;
  }
}

/**
 * 设置表格样式
 */
const setSheetStyle = (worksheet: WorkSheet, fieldList: IFieldMeta[]) => {
  worksheet['!cols'] = worksheet['!cols'] || [];
  // 根据字段字数设置列宽，最低70wpx
  fieldList.forEach(field => {
    let width = 150;
    if (field.type === FieldType.Location) {
      width = 300;
    }
    worksheet['!cols'].push({wpx: width});
  });
  worksheet['!cols'][0] = {wpx: 220};
}

/**
 * 使用excelsheet导出数据
 */
const exportExcel = async (table: ITable) => {
  const {fieldList, allRecords} = await getRawData(table);
  const data = generateRows(fieldList, allRecords);

  const worksheet = utils.json_to_sheet(data);
  setSheetStyle(worksheet, fieldList);

  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "sheet1");

  const tableName = await table.getName();
  writeFile(workbook, `${tableName}.xlsx`, { compression: true });
}

export default exportExcel;



