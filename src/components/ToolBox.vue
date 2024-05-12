<script setup lang="ts">
import deleteDateFilter from '@/tools/delete_date_filters';
import exportExcel from '@/tools/excel_export';
import { ITable } from '@lark-base-open/js-sdk';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  cuTable: ITable;
  hasEditPermi: boolean;
  autoApply: boolean;
}>();

const exportData = () => {
  exportExcel(props.cuTable);
}

const clearFilter = async (ref: any) => {
  await deleteDateFilter(props.cuTable, t)
  if (props.hasEditPermi && props.autoApply) {
    const activeView = await props.cuTable.getActiveView();
    await activeView?.applySetting();
  }
}
</script>

<template>
  <div class="">
    <div class="title">{{ $t('tools') }}</div>
    <div class="flex gap-2 text-nowrap">
      <div class="flex items-center mt-2 text-sm w-35 btn-base excel-btn" @click="exportData">
        <span class="icon-ecel icon-[file-icons--microsoft-excel] text-green-200 mr-1  "
          style="width: 1.2em; height: 1.2em;"></span>
        <span>{{ $t('export') }}</span>
      </div>

      <a-tooltip  :title="$t('tips.clearFilter')" color="#2db7f5" placement="bottomLeft">
        <div @click="clearFilter" class="flex items-center mt-2 text-sm w-35 btn-base clear-btn"
        >
          <span class="icon icon-[ant-design--clear-outlined] mr-1" style="width: 1.2em; height: 1.2em;"></span>
          <span>{{ $t('clearFilter') }}</span>
        </div>
      </a-tooltip>
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

.excel-btn:hover .icon-ecel {
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
