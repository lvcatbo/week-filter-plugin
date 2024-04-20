<script setup lang="ts">
import { bitable, IFieldMeta, ITable, FieldType, ViewType, IAddViewResult, IGridView, IAddFilterConditionParams, FilterOperator, FilterInfoCondition, IFilterInfo, OperationType, PermissionEntity, ToastType, Selection } from "@lark-base-open/js-sdk";
import { useI18n } from "vue-i18n";
import { ElMessage, FormInstance } from "element-plus";
import { weekOptions, monthOptions, FilterType } from '@/types/types'
import shortcutsFn from "@/types/shortcuts";
import exportExcel from '@/tools/excel_export'

import dayjs from 'dayjs'
import weekday from "dayjs/plugin/weekday";
import "dayjs/locale/zh-cn";
dayjs.extend(weekday);
dayjs.locale("zh-cn");

interface userForm {
  fieldId: string,
  showInNew: boolean,
  startTime: number,
  endTime: number,
  applySetting: boolean,
}

const base = bitable.base;
const cuTable = shallowRef<ITable>();
const timeFieldList = ref<IFieldMeta[]>([]);
const { t } = useI18n();
const shortcuts = ref();
const hasEditPermi = ref<boolean>(false);
watchEffect(() => {
  shortcuts.value = shortcutsFn(t);
});

/**
 * 在组建挂载前进行数据准备
 * 1. 获取当前 @Table 对象，（一切操作都要从Table对象开始）
 * 2. 获取字段列表
 * 3. 筛选出日期相关的字段 （因为此插件只对日期字段进行操作）
 * 4. 查询权限是否可编辑， 禁用相关按钮
 */
onBeforeMount(async () => {
  cuTable.value = await base.getActiveTable();
  let allFields: IFieldMeta[] = await cuTable.value.getFieldMetaList();
  timeFieldList.value = allFields.filter(
    (item) => [FieldType.DateTime, FieldType.CreatedTime, FieldType.ModifiedTime].includes(item.type)
  );
  hasEditPermi.value = await base.getPermission({
    entity: PermissionEntity.Table,
    param: { tableId: cuTable.value.id },
    type: OperationType.Editable,
  })
});



/**
 * 构建表单变量
 * @formRef : 表单ref
 * @userForm : 用户提交的表单内容
 * @loading : 处理状态（正在处理中）
 * @rules : 表单规则
 * @onSubmit : 处理表单方法，执行筛选操作
 */
const formRef = ref<FormInstance>();
const userForm = ref<userForm>({
  fieldId: '',
  showInNew: false,
  startTime: 0,
  endTime: 0,
  applySetting: false
})
const rules = ref({
  fieldId: [
    { required: true, message: '不能为空', trigger: "blur" },
  ],
});
const loading = ref(false);
const dateRange = ref<number[]>([]);
const handleDateChange = (val: any) => {
  userForm.value.startTime = dayjs(val[0]).subtract(1, 'day').valueOf();
  userForm.value.endTime = dayjs(val[1]).add(1, 'day').valueOf();
};
const onSubmit = async (filterType: FilterType, formEl: FormInstance | undefined) => {
  if (!formEl) return;

  await formEl.validate(async (valid) => {
    if (!valid) return;
    loading.value = true;

    /**
     * 构建筛选参数 @conditions
     */
    let viewNewName = '';
    if (filterType != 'custom') {
      let { startTime, endTime, viewName }: { startTime: number, endTime: number, viewName: string } = set_time_viewName(filterType);
      userForm.value.startTime = startTime;
      userForm.value.endTime = endTime
      viewNewName = viewName
    }
    const conditions: IAddFilterConditionParams = [
      {
        fieldId: userForm.value.fieldId,
        operator: FilterOperator.IsGreater,
        value: userForm.value.startTime
      },
      {
        fieldId: userForm.value.fieldId,
        operator: FilterOperator.IsLess,
        value: userForm.value.endTime
      }
    ];

    /**
     * 确定目标视图
     * @targetView 为当前视图 or 新视图
     */
    let targetView: IGridView | undefined = undefined;
    try {
      if (userForm.value.showInNew) {
        const viewResult: IAddViewResult | undefined = await cuTable.value?.addView({ name: viewNewName, type: ViewType.Grid });
        if (!viewResult) {
          ElMessage.error('faild');
          return;
        }
        targetView = await cuTable.value?.getViewById(viewResult.viewId) as IGridView;
      }
      else {
        targetView = await cuTable.value?.getActiveView() as IGridView;
      }

      if (targetView) {
        await updateFilter(targetView, conditions);
        if (userForm.value.applySetting) {
          await targetView.applySetting();
        }
      }
    } catch (err: any) {
      await bitable.ui.showToast({
        toastType: ToastType.error,
        message: JSON.stringify(err.message)
      })
    }
    loading.value = false;
  })
};


/**
 * 更新日期筛选条件
 * 1. 获取筛选条件
 * 2. 删除选中列已有的筛选条件
 * 3. 添加新的筛选条件
 * @targetView 目标视图对象
 * @newConditions 新的筛选条件
 */
async function updateFilter(targetView: IGridView, newConditions: FilterInfoCondition[]) {
  const filterInfo: IFilterInfo | null = await targetView.getFilterInfo();
  if (filterInfo != null && filterInfo.conditions.length > 0) {
    const delIds: any[] = filterInfo.conditions.map(item => {
      if (item.fieldId == userForm.value.fieldId) return item.conditionId
    });
    if (delIds.length > 0) {
      for (let id of delIds) {
        let res = await targetView.deleteFilterCondition(id);
        !res && ElMessage.warning('操作失败')
      }
    }
  }
  for (let condition of newConditions) {
    await targetView.addFilterCondition(condition);
  }
}


/**
 * 根据筛选类型，设置时间范围, 以及新视图名称
 * @param filterType: 筛选类型
 * @return {startTime, endTime, viewName} 早于startTime, 晚于endTimem
 */
function set_time_viewName(filterType: FilterType) {
  let dateRange: { startTime: number; endTime: number };
  let viewName = '';
  switch (filterType) {
    case weekOptions.lastWeek.value:
      dateRange = calculateWeekRange(-8, 0);
      viewName = t("weekNames.lastWeek");
      break;
    case weekOptions.nextWeek.value:
      dateRange = calculateWeekRange(6, 14);
      viewName = t("weekNames.nextWeek");
      break;
    case weekOptions.thisWeek.value:
      dateRange = calculateWeekRange(-1, 7);
      viewName = t("weekNames.thisWeek");
      break;
    case monthOptions.lastMonth.value:
      dateRange = calculateMonthRange(-1);
      viewName = t("monthNames.lastMonth");
      break;
    case monthOptions.nextMonth.value:
      dateRange = calculateMonthRange(1);
      viewName = t("monthNames.nextMonth");
      break;
    case monthOptions.thisMonth.value:
      dateRange = calculateMonthRange(0);
      viewName = t("monthNames.thisMonth");
      break;
    default:
      throw new Error(`Unsupported filter type: ${filterType}`);
  }
  return { ...dateRange, viewName }
}

const calculateWeekRange = (startDay: number, endDay: number) => {
  return {
    startTime: dayjs().weekday(startDay).valueOf(),
    endTime: dayjs().weekday(endDay).valueOf(),
  };
};

const calculateMonthRange = (monthOffset: number) => {
  return {
    startTime: dayjs().add(monthOffset, "month").startOf("month").subtract(1, 'day').valueOf(),
    endTime: dayjs().add(monthOffset, "month").endOf("month").add(1, 'day').valueOf(),
  };
};

const selection = ref<Selection>();
onMounted(async () => {
  selection.value = await bitable.base.getSelection();
});
const off = bitable.base.onSelectionChange(async ({ data }) => {
  if (data.tableId !== selection.value?.tableId) {
    selection.value = { ...data };
    await initFieldOption();
  } else if (data.viewId !== selection.value?.viewId) {
    selection.value.viewId = data.viewId;
  }
});

const initFieldOption = async () => {
  cuTable.value = await bitable.base.getTableById(selection.value?.tableId!);
  const allFieldList = await cuTable.value.getFieldMetaList();
  timeFieldList.value = allFieldList.filter(
    (item) => [FieldType.DateTime, FieldType.CreatedTime, FieldType.ModifiedTime].includes(item.type)
  );
};

/**
 * 导出数据
 */
const exportData = () => {
  exportExcel(cuTable.value);
}

onUnmounted(() => {
  off();
});

</script>

<template>
  <div class="filter-form w-full">
    <el-form :model="userForm" ref="formRef" :rules="rules" label-width="auto" v-loading="loading">
      <el-form-item :label="$t('labels.targetField')" prop="fieldId" class="w-10/12">
        <el-select v-model="userForm.fieldId">
          <el-option v-for="item in timeFieldList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('labels.displayMode')">
        <el-switch v-model="userForm.showInNew" inline-prompt
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          :active-text="$t('switchTexts.newView')" :inactive-text="$t('switchTexts.currentView')"
          :disabled="!hasEditPermi" />
      </el-form-item>

      <el-form-item :label="$t('labels.applySetting')">
        <el-switch v-model="userForm.applySetting" inline-prompt
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" :active-text="$t('switchTexts.yes')"
          :inactive-text="$t('switchTexts.no')" :disabled="!hasEditPermi" />
      </el-form-item>

      <el-form-item :label="$t('labels.weekFilter')">
        <div class="flex gap-2">
          <div class="btns">
            <el-button v-for="item in weekOptions" :key="item.value" :type="item.color"
              @click="onSubmit(item.value, formRef)">{{ $t(item.label) }}</el-button>
          </div>
        </div>
      </el-form-item>

      <el-form-item :label="$t('labels.monthFilter')">
        <div class="btns">
          <el-button v-for="item in monthOptions" :key="item.value" :type="item.color"
            @click="onSubmit(item.value, formRef)">{{ $t(item.label) }}</el-button>
        </div>
      </el-form-item>
      <el-form-item :label="$t('labels.custom')">
        <div class="flex gap-1 w-10/12">
          <el-date-picker v-model="dateRange" type="daterange" start-placeholder="Start date" end-placeholder="End date"
            range-separator="-" value-format="x" unlink-panels @change="handleDateChange" :shortcuts="shortcuts"
            size="small" :popper-options="{
              placement: 'top',
            }" />
          <el-button size="small" type="primary" @click="onSubmit('custom', formRef)">{{ $t("button.confirm")
            }}</el-button>
        </div>
      </el-form-item>
    </el-form>
    <div class="border-t border-gray-300 my-4"></div>
    <!-- 更多工具 -->
    <div class="">
      <div class="title">{{ $t('tools') }}</div>
      <div class="flex gap-2 text-nowrap">
        <div class="w-35 btn-base excel-btn flex items-center mt-2 text-sm">
          <span class="icon-ecel icon-[file-icons--microsoft-excel] text-green-200 mr-1  " style="width: 1.2em; height: 1.2em;"></span>
          <span @click="exportData">{{ $t('button.export') }}</span>
        </div>
        <!-- <div class="w-35 btn-base mt-2 text-sm flex items-center clear-btn">
          <span class="icon icon-[ant-design--clear-outlined] mr-1" style="width: 1.2em; height: 1.2em;"></span>
          <span>清空日期筛选</span>
        </div> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.excel-btn {
  background-color: #89d8d3;
  background-image: linear-gradient(315deg, #89d8d3 0%, #03c8a8 74%);
  border: none;
  z-index: 1;
}
.clear-btn {
  background-color: #f0ecfc;
  background-image: linear-gradient(315deg, #ef87fb 0%, #f5576c 100%);
  border: none;
  z-index: 1;
}
.btn-base:after {
  position: absolute;
  content: "";
  width: 100%;
  height: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  border-radius: 5px;
  box-shadow:
    -7px -7px 20px 0px #fff9,
    -4px -4px 5px 0px #fff9,
    7px 7px 20px 0px #0002,
    4px 4px 5px 0px #0001;
  transition: all 0.3s ease;
}

.btn-base:hover:after {
  top: 0;
  height: 100%;
}
.excel-btn:hover .icon-ecel{
  color: #10b465;
}

.btn-base:active {
  top: 2px;
}

.excel-btn:after {
  background-color: #4dccc6;
  background-image: linear-gradient(315deg, #4dccc6 0%, #96e4df 74%);
}
.clear-btn:after {
  background-color: #da8be3;
  background-image: linear-gradient(315deg, #f7acff 0%, #f3697b 100%);
}

.title {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
  border-left: 4px solid #3498db;

}
</style>