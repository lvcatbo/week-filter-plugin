<script setup lang="ts">
import ToolBox from './ToolBox.vue';
import { bitable, FilterOperator, FieldType, ViewType, PermissionEntity, OperationType } from '@lark-base-open/js-sdk'
import type { ITable, Selection, IFieldMeta, IView, IGridView } from '@lark-base-open/js-sdk';
import { message, Modal } from 'ant-design-vue';
import { ref, shallowRef } from 'vue'
import dayjs from '@/plugins/dayjs';
import { Dayjs } from 'dayjs';

import { useI18n } from 'vue-i18n';

const { t } = useI18n();

/**
 * 思路：
 * 1. 数据定义：获取表格视图，权限等
 * 3. 提交表单后，解析用户提交的数据
 * 4. 调用接口筛选数据
 */

/**
 * 一、数据定义：获取表格视图，权限等
 *  1. base: 多维表API主入口
 *  2. table, view, 动态更新当前的视图和表
 *  3. 其他表单数据
 */
const base = bitable.base;

const table = shallowRef<ITable>(await base.getActiveTable());

const view = shallowRef<IView>(await table.value.getActiveView());
if (!table.value && !view.value) {
  message.error(t('notgetTableAndView'));
  throw Error('没有获取到表格 和 视图，请刷新重试');
}

/** 编辑权限 */
const hasEditPermi = ref<boolean>(await hasPermi(table.value.id));

let viewType = await view.value.getType();

/* 监视视图的改变 */
const off = base.onSelectionChange(async (event: { data: Selection }) => {
  if (table.value.id != event.data.tableId) {
    table.value = await base.getTableById(event.data.tableId);
    view.value = await table.value.getActiveView();
    viewType = await view.value.getType();
    hasEditPermi.value = await hasPermi(table.value.id)
  }
  else if (view.value.id != event.data.viewId) {
    view.value = await table.value.getViewById(event.data.viewId);
    viewType = await view.value.getType();
    hasEditPermi.value = await hasPermi(table.value.id)
  }
})

/** 目标字段ID */
const fieldId = ref<string>('');
/** 开始时间 */
const startTime = ref<Dayjs>();
/**结束时间 */
const endTime = ref<Dayjs>();
/** 是否同步给所有人 */
const ifAsync = ref<boolean>(false);
/** 是否在新视图上显示 */
const isNew = ref<boolean>(false);

/** 过去还是未来 */
const timego = ref<'past' | 'future'>('past');
/** 时间单位 */
const timeUnit = ref<'day' | 'month'>('day');
/** 时间数量 */
const num = ref<number>(0);

// 筛选日期字段的字段
const dateFields = ref<IFieldMeta[]>(await view.value.getFieldMetaList());
dateFields.value = dateFields.value.filter(field => [FieldType.CreatedTime, FieldType.DateTime, FieldType.ModifiedTime].includes(field.type));

let viewName: string = '';

/**
 * 提交表单
 * 1. 校验参数
 * 2. 判断是否要新建视图
 * 3. 删除旧筛选，再新增筛选
 */
async function submit() {

  // 1. 参数校验

  if (!isGridView(view.value)) {
    message.error(t('tips.viewTypeError'))
    return
  };
  let gridView = view.value as IGridView;
  if (!fieldId.value) {
    message.error(t('tips.selectField'));
    return;
  }
  else if (!startTime.value || !endTime.value) {
    message.error(t('tips.selectTimeRange'));
    return;
  }

  // 2. 是否新增视图
  if (isNew.value) {
    try {
      let res = await table.value.addView({ type: viewType, name: viewName });
      gridView = await table.value.getViewById(res.viewId) as IGridView;
    } catch (error) {
      if (error.code == 10215995) {
        let viewLsit = await table.value.getViewMetaList();
        let viewId = '';
        viewLsit.forEach(view => {
          if (view.name == viewName) {
            viewId = view.id;
          }
        });

       await new Promise<void>((resolve) => {
          Modal.confirm({
            content: t('tips.viewNameError'),
            okText: t('confirm'),
            cancelText: t('cancel'),
            onOk: async () => {
              gridView = await table.value.getViewById(viewId) as IGridView;
              resolve();
            },
            onCancel: async () => {
              let num = 0;
              const regex = new RegExp(`^${viewName}(\\d*|\\(\\d+\\))$`);
              viewLsit.forEach(view => {
                if (regex.test(view.name)) num++;
              });
              viewName += `(${num})`;
              let res = await table.value.addView({ type: viewType, name: viewName });
              gridView = await table.value.getViewById(res.viewId) as IGridView;
              resolve();
            },
          });
        });
      }
    }
  }


  // 3. 删除旧筛选，再新增筛选条件
  try {
    let filterInfo = await gridView.getFilterInfo();
    filterInfo && filterInfo.conditions.forEach(async element => {
      if (element.fieldId == fieldId.value)
        await gridView.deleteFilterCondition(element.conditionId);
    });

    await gridView.addFilterCondition({
      value: startTime.value.startOf('day').subtract(1, 'second').valueOf(),
      fieldId: fieldId.value,
      operator: FilterOperator.IsGreater,

    });

    await gridView.addFilterCondition({
      fieldId: fieldId.value,
      value: endTime.value.endOf('day').add(1, 'second').valueOf(),
      operator: FilterOperator.IsLess
    });

    ifAsync.value && gridView.applySetting();
  } catch (error) {
    message.error(error.message || error)
  }
}

/**
 * 按钮事件，更新开始和结束时间，并触发submit函数
 * @param timeType 筛选时间的类型
 */
function updateTime(timeType: string) {
  switch (timeType) {
    case 'lastWeek':
      startTime.value = dayjs().subtract(1, 'week').startOf('week');
      endTime.value = dayjs().subtract(1, 'week').endOf('week');
      break;
    case 'nextWeek':
      startTime.value = dayjs().add(1, 'week').startOf('week');
      endTime.value = dayjs().add(1, 'week').endOf('week');
      break;
    case 'thisWeek':
      startTime.value = dayjs().startOf('week');
      endTime.value = dayjs().endOf('week');
      break;
    case 'lastMonth':
      startTime.value = dayjs().subtract(1, 'month').startOf('month');
      endTime.value = dayjs().subtract(1, 'month').endOf('month');
      break;
    case 'nextMonth':
      startTime.value = dayjs().add(1, 'month').startOf('month');
      endTime.value = dayjs().add(1, 'month').endOf('month');
      break;
    case 'thisMonth':
      startTime.value = dayjs().startOf('month');
      endTime.value = dayjs().endOf('month');
      break;
    case 'thisYear':
      startTime.value = dayjs().startOf('year');
      endTime.value = dayjs().endOf('year');
      break;
    case 'lastYear':
      startTime.value = dayjs().subtract(1, 'year').startOf('year');
      endTime.value = dayjs().subtract(1, 'year').endOf('year');
      break;
    case 'nextYear':
      startTime.value = dayjs().add(1, 'year').startOf('year');
      endTime.value = dayjs().add(1, 'year').endOf('year');
      break;
    case 'Q1':
      startTime.value = dayjs().month(0).startOf('month');
      endTime.value = dayjs().month(2).endOf('month');
      break;
    case 'Q2':
      startTime.value = dayjs().month(3).startOf('month');
      endTime.value = dayjs().month(5).endOf('month');
      break;
    case 'Q3':
      startTime.value = dayjs().month(6).startOf('month');
      endTime.value = dayjs().month(8).endOf('month');
      break;
    case 'Q4':
      startTime.value = dayjs().month(9).startOf('month');
      endTime.value = dayjs().month(11).endOf('month');
      break;
    default:
      throw new Error('Invalid timeType');
  }
  viewName = t(timeType);
  submit();
}


/**
 * 获取未来（过去）n 天的开始时间和结束时间
 * @param direction 过去还是未来
 * @param amount 数量
 * @param unit 时间单位::day | month
 */
function updateTime2(direction: 'past' | 'future', amount: number, unit: 'day' | 'month') {

  const isPast = direction === 'past';

  startTime.value = isPast
    ? dayjs().subtract(amount, unit).startOf(unit)
    : dayjs().startOf(unit);

  endTime.value = isPast
    ? dayjs().endOf(unit)
    : dayjs().add(amount, unit).endOf(unit);

  viewName = t(direction) + ' ' + num.value + ' ' + t(unit);
}

/**
 * 查询是否有表格编辑权限
 * @param tableId 表格id
 */
async function hasPermi(tableId: string): Promise<boolean> {
  let hasEditPermi = await base.getPermission({
    entity: PermissionEntity.Table,
    param: { tableId: table.value.id },
    type: OperationType.Editable,
  });
  return hasEditPermi;
}

/* 类型断言 */
function isGridView(view: IView) {
  return [ViewType.Grid, ViewType.Kanban, ViewType.Gallery, ViewType.Gantt, ViewType.Calendar].includes(viewType);
}

</script>

<template>
  <div class="w-full pr-4">
    <a-form class="fixed-form">
      <a-form-item :label="$t('targetField')" required>
        <div class="form-item-control">
          <a-select v-model:value="fieldId" :placeholder="$t('selectField')">
            <a-select-option v-for="field in dateFields" :key="field.id" :value="field.id">{{ field.name
              }}</a-select-option>
          </a-select>
        </div>

      </a-form-item>

      <a-form-item :label="$t('currentSelection')">
        <a-space-compact block class="form-item-control">
          <a-date-picker v-model:value="startTime" />
          <a-date-picker v-model:value="endTime" />
        </a-space-compact>
      </a-form-item>

      <a-form-item :label="$t('selectByDay')">
        <div class="form-item-control">
          <a-space-compact block>
            <a-select v-model:value="timego" @change="val => updateTime2(val, num, timeUnit)" size="small">
              <a-select-option value="past">{{ $t('past') }}</a-select-option>
              <a-select-option value="future">{{ $t('future') }}</a-select-option>
            </a-select>
            <a-input-number v-model:value="num" @change="val => updateTime2(timego, val, timeUnit)" :min="0"
              style="width: 100%;"></a-input-number>
            <a-select v-model:value="timeUnit" @change="val => updateTime2(timego, num, val)" size="small">
              <a-select-option value="day">{{ $t('day') }}</a-select-option>
              <a-select-option value="month">{{ $t('month') }}</a-select-option>
            </a-select>
          </a-space-compact>
        </div>
      </a-form-item>

      <a-form-item>
        <div class="form-item-control">
          <a-switch v-model:checked="ifAsync" :disabled="!hasEditPermi" :checked-children="$t('syncForAll')"
            :un-checked-children="$t('nosyncForAll')" />
          <a-switch v-model:checked="isNew" :disabled="!hasEditPermi" :checked-children="$t('newView')"
            :un-checked-children="$t('currentView')" />
          <a-button type="primary" @click="submit" class="ml-1">{{ $t('startFilter') }}</a-button>
        </div>
      </a-form-item>

      <a-divider></a-divider>

      <a-form-item :label="$t('filterByWeek')">
        <div class="form-item-control">
          <a-button type="primary" @click="updateTime('lastWeek')" class="bg-yellow-500 hover:!bg-yellow-400">{{
            $t('lastWeek') }}</a-button>
          <a-button type="primary" @click="updateTime('thisWeek')">{{ $t('thisWeek') }}</a-button>
          <a-button type="primary" @click="updateTime('nextWeek')" class="bg-green-600 hover:!bg-green-500">{{
            $t('nextWeek') }}</a-button>
        </div>
      </a-form-item>

      <a-form-item :label="$t('filterByMonth')">
        <div class="form-item-control">
          <a-button type="primary" @click="updateTime('lastMonth')" class="bg-yellow-500 hover:!bg-yellow-400">{{
            $t('lastMonth') }}</a-button>
          <a-button type="primary" @click="updateTime('thisMonth')">{{ $t('thisMonth') }}</a-button>
          <a-button type="primary" @click="updateTime('nextMonth')" class="bg-green-600 hover:!bg-green-500">{{
            $t('nextMonth') }}</a-button>
        </div>
      </a-form-item>

      <a-form-item :label="$t('filterByYear')">
        <div class="form-item-control">
          <a-button type="primary" @click="updateTime('lastYear')" class="bg-yellow-500 hover:!bg-yellow-400">{{
            $t('lastYear') }}</a-button>
          <a-button type="primary" @click="updateTime('thisYear')">{{ $t('thisYear') }}</a-button>
          <a-button type="primary" @click="updateTime('nextYear')" class="bg-green-600 hover:!bg-green-500">{{
            $t('nextYear') }}</a-button>
        </div>
      </a-form-item>

      <a-form-item :label="$t('filterByQuarter')">
        <div class="form-item-control">
          <a-button type="primary" @click="updateTime('Q1')" class="bg-yellow-500 hover:!bg-yellow-400">Q1</a-button>
          <a-button type="primary" @click="updateTime('Q2')">Q2</a-button>
          <a-button type="primary" @click="updateTime('Q3')" class="bg-green-600 hover:!bg-green-500">Q3</a-button>
          <a-button type="primary" @click="updateTime('Q4')" class="bg-purple-500 hover:!bg-purple-400">Q4</a-button>
        </div>
      </a-form-item>

      <a-divider></a-divider>


    </a-form>

    <ToolBox v-bind="{ cuTable: table, hasEditPermi, autoApply: ifAsync }" />
  </div>
</template>

<style lang='scss' scoped>
:deep(.ant-form-item-label) {
  flex: 0 0 70px !important;
}

:deep(.ant-form-item-control) {
  flex: 1 !important;
}

.form-item-control {
  width: 97%;
  max-width: 330px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
