<script setup lang="ts">
import ToolBox from "@/components/ToolBox.vue";
import {FilterInfoCondition, FilterOperator, IAddFilterConditionParams, IAddViewResult, IFilterInfo, IGridView, ViewType, } from '@lark-base-open/js-sdk';
import { onBeforeMount, ref, watch } from 'vue';
import dayjs from '@/plugins/dayjs'
import zhCN from 'ant-design-vue/es/date-picker/locale/zh_CN';
import enUS  from 'ant-design-vue/es/date-picker/locale/en_US';
import { message } from 'ant-design-vue';
import { Dayjs } from 'dayjs';
import { useI18n } from 'vue-i18n';
import { useTable } from "@/hooks/useTable";

const { t } = useI18n();
const locale = dayjs.locale();

const { cuTable, timeFieldList, hasEditPermi } = useTable();
const form = ref<FilterForm>({
  fieldId: '',
  showInNew: false,
  applySetting: false,
  filterType: 'week',
  dateRange: [0, 0],
  tipLabel: '前',
  count: 1,
})

onBeforeMount(async () => {
  const [startTime, endTime] = getRange(form.value.count, form.value.tipLabel!, form.value.filterType!);
  form.value.dateRange = [dayjs(startTime, 'YYYY-MM-DD'), dayjs(endTime, 'YYYY-MM-DD')];
});


const getRange = (count: number, tipLabel: string, filterType: 'week' | 'month' | 'year') => {
  const now = dayjs();
  let startTime = now;
  let endTime = now;
  if (count === 0) {
    startTime = now.startOf(filterType);
    endTime = now.endOf(filterType);
    return [startTime, endTime]
  }
  switch (tipLabel) {
    case '近':
      startTime = now.add(-count, filterType).startOf('d');
      endTime = now.endOf('d');
      break;
    case '前':
      startTime = now.add(-count, filterType)[count > 0 ? 'startOf' : 'endOf'](filterType);
      endTime = now.add(count > 0 ? -1 : 1, filterType)[count > 0 ? 'endOf' : 'startOf'](filterType);
      break;
    case '第':
      startTime = now.add(count, filterType).startOf(filterType);
      endTime = startTime.endOf(filterType);
      break;
  }
  if (count < 0) {
    [startTime, endTime] = [endTime, startTime]
  }
  return [startTime, endTime]
}


watch([() => form.value.tipLabel,
() => form.value.count,
() => form.value.filterType], ([tipLabel, count, filterType]) => {
  // @ts-ignore
  const [startTime, endTime] = getRange(count, tipLabel, filterType);
  form.value.dateRange = [dayjs(startTime, 'YYYY-MM-DD'), dayjs(endTime, 'YYYY-MM-DD')];
})

const createView = async () => {
  const viewNewName = form.value.tipLabel + form.value.count + form.value.filterType;
  try {
    if (form.value.showInNew) {
      const viewResult: IAddViewResult | undefined = await cuTable.value?.addView({ name: viewNewName, type: ViewType.Grid });
      if (!viewResult) {
        message.error(t('tips.createFailed'));
        return;
      }
      let targetView = await cuTable.value?.getViewById(viewResult.viewId) as IGridView;
      return targetView;
    }
  } catch (error: any) {
    message.error(error.message);
  }
}

async function updateFilter(targetView: IGridView, newConditions: FilterInfoCondition[]) {
  const filterInfo: IFilterInfo | null = await targetView.getFilterInfo();
  if (filterInfo != null && filterInfo.conditions.length > 0) {
    const delIds: any[] = filterInfo.conditions
      ?.filter(item => item.fieldId == form.value.fieldId)
      ?.map(item => item.conditionId) || [];
    if (delIds.length > 0) {
      for (let id of delIds) {
        let res = await targetView.deleteFilterCondition(id);
        !res && message.warning(t('tips.faild'))
      }
    }
  }
  try {
    for (let condition of newConditions) {
      await targetView.addFilterCondition(condition);
    }
    message.success(t('tips.filte'));
  } catch (error: any) {
    message.error(t('tips.faild'));
  }

}

const fixDateBug = (dateRange: Dayjs[]) => {
  return [dateRange[0].subtract(1, 'd').valueOf(), dateRange[1].add(1, 'd').valueOf()];
}

const onFinish = async () => {
  let targetView: IGridView | undefined = undefined;
  if (form.value.showInNew) {
    targetView = await createView();
  } else {
    targetView = await cuTable.value?.getActiveView() as IGridView;
  }
  if (!targetView) {
    message.warning(t('tips.getViewFailed'));
    return;
  }
  const [startTime, endTime] = fixDateBug(getRange(form.value.count, form.value.tipLabel!, form.value.filterType!));
  const conditions: IAddFilterConditionParams = [
    {
      fieldId: form.value.fieldId,
      operator: FilterOperator.IsGreater,
      value: startTime
    },
    {
      fieldId: form.value.fieldId,
      operator: FilterOperator.IsLess,
      value: endTime
    }
  ];
  await updateFilter(targetView, conditions);
  if (form.value.applySetting) {
    await targetView.applySetting();
  }
};

</script>

<template>
  <div class="w-full">
    <a-form :model="form" @Finish="onFinish" labelAlign="left" class="pr-10">
      <a-form-item name="fieldId" :rules="[{ required: true, message: t('tips.select') }]">
        <div class="flex items-center">
          <span class="w-24 text-nowrap">{{ $t('label.targetField') }}：</span>
          <a-select v-model:value="form.fieldId">
            <a-select-option v-for="field in timeFieldList" :value="field.id">{{ field.name }}</a-select-option>
          </a-select>
        </div>

      </a-form-item>

      <a-form-item name="showInNew">
        <span class="w-20 text-nowrap">{{ $t('label.displayMode') }}：</span>
        <a-switch v-model:checked="form.showInNew" :disabled="!hasEditPermi" :checked-children="$t('newView')"
          :un-checked-children="$t('currentView')" />
      </a-form-item>

      <a-form-item name="showInNew">
        <span class="w-20 text-nowrap"> {{ $t('label.applySetting') }}：</span>
        <a-switch v-model:checked="form.applySetting" :disabled="!hasEditPermi" :checked-children="$t('yes')"
          :un-checked-children="$t('no')" />
      </a-form-item>

      <a-form-item name="count" :rules="[{ required: true, message: '请输入整数' }]">
        <div class="flex items-center">
          <span class="w-24 text-nowrap">{{ $t('label.shortcutFilter') }}：</span>
          <a-input-number v-model:value="form.count" :precision="0">
            <template #addonBefore>
              <a-select v-model:value="form.tipLabel">
                <a-select-option value="近">{{ $t('near') }}</a-select-option>
                <a-select-option value="前">{{ $t('past') }}</a-select-option>
                <a-select-option value="第">{{ $t('the') }}</a-select-option>
              </a-select>
            </template>
            <template #addonAfter>
              <a-select v-model:value="form.filterType">
                <a-select-option value="week">{{ $t('week') }}</a-select-option>
                <a-select-option value="month">{{ $t('month') }}</a-select-option>
                <a-select-option value="year">{{ $t('year') }}</a-select-option>
              </a-select>
            </template>
          </a-input-number>
        </div>
      </a-form-item>

      <a-form-item>
        <div class="flex gap-2">
          <a-range-picker v-model:value="form.dateRange" :locale="locale == 'zh-cn'? zhCN : enUS " />
          <a-button type="primary" html-type="submit">{{ $t('comfirm') }}</a-button>
        </div>
      </a-form-item>
    </a-form>

    <a-divider />
    <ToolBox v-bind="{cuTable, hasEditPermi, autoApply: form.applySetting}" />
  </div>
</template>

<style scoped>
:deep(.ant-input-number-input) {
  text-align: center;
}
</style>
