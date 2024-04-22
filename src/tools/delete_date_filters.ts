/**
 * 删除所有时间字段相关的过滤器
 */

import { FieldType, IGridView, ITable, ToastType, bitable } from "@lark-base-open/js-sdk";

export const deleteDateFilter = async (table: ITable, t: any) => {
  // 定义时间字段类型数组
  const timeFields: Number[] = [FieldType.DateTime, FieldType.CreatedTime, FieldType.ModifiedTime];

  // 获取活动视图，并断言为 IGridView 类型
  const view: IGridView = await table.getActiveView() as IGridView;

  // 获取过滤信息
  const filterInfo = await view.getFilterInfo();

  // 检查过滤信息是否存在且条件非空
  if(filterInfo && filterInfo.conditions.length > 0) {

    // 仅保留时间相关的过滤条件的 ID
    const ids = filterInfo.conditions
      .filter(condition => timeFields.includes(condition.fieldType))
      .map(condition => condition.conditionId);

    // 遍历所有 ID 并尝试删除过滤条件
    const promises = ids.map(id => view.deleteFilterCondition(id));
    try {
      const results = await Promise.all(promises);
      if (results.includes(false)) {
        throw new Error(t('tips.faild'));
      }
      bitable.ui.showToast({
        toastType: ToastType.success,
        message: t('tips.success')
      })
    }
    catch (error) {
      await bitable.ui.showToast({
        toastType: ToastType.error,
        message: 'faild'
      })
    }
  }
  else {
    bitable.ui.showToast({
      toastType: ToastType.info,
      message: 'no filter conditions found'
    })
  }
}

export default deleteDateFilter;