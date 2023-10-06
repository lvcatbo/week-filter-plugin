<script setup lang="ts">
import { ref, onMounted } from "vue";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import { weekOptions, monthOptions } from "./utils";
import { TimeType } from "@/types/types";
import "dayjs/locale/zh-cn";
import {
  bitable,
  IFieldMeta,
  Selection,
  FieldType,
  IWidgetTable,
} from "@lark-base-open/js-sdk";

const { t, locale } = useI18n();
bitable.bridge.getLanguage().then((lang) => {
  locale.value = ["zh", "zh-TW", "zh-HK"].includes(lang) ? "zh" : "en";
});
dayjs.locale("zh-cn");
dayjs.extend(weekday);

const selection = ref<Selection>();
let cuTableInstance: IWidgetTable | undefined = undefined;
const timeFieldList = ref<IFieldMeta[]>([]);

onMounted(async () => {
  selection.value = await bitable.base.getSelection();
  await initFieldOption();
});

const initFieldOption = async () => {
  cuTableInstance = await bitable.base.getTableById(selection.value?.tableId!);
  const allFieldList = await cuTableInstance.getFieldMetaList();
  timeFieldList.value = allFieldList.filter(
    (item) => item.type === FieldType.DateTime
  );
};

const form = ref({
  fieldId: "",
  showInNew: false,
});
const newViewId = ref<string>("");

const handleFilter = async (type: TimeType) => {
  if (!selection.value) {
    ElMessage.error(t("errors.getTableInfoFailed"));
    return;
  }
  const { monday, sunday, view_name } = getDays(type);
  if (form.value.showInNew) {
    let creatResult = await createView(view_name);
    newViewId.value = creatResult?.value?.data?.view?.view_id || '';
  } else {
    newViewId.value = selection.value.viewId!;
  }
  let viewInfo = await getView(newViewId.value);
  setWeek(monday, sunday, viewInfo);
};
const getView = async (viewId: string) => {
  try {
    const { data } = await useFetch("/getView", {
      query: {
        tableId: selection.value?.tableId,
        viewId: viewId,
      },
      method: "get",
    });
    if (data.value?.code !== 0) {
      console.error(t("errors.getViewFailed") + data.value?.msg);
    }
    return data.value?.data?.view;
  } catch (error) {
    console.log(t("errors.getViewFailed"), error);
  }
};
const createView = async (view_name: string) => {
  try {
    const { data } = await useFetch("/createView", {
      query: {
        tableId: selection.value?.tableId,
      },
      method: "post",
      body: {
        view_name,
        view_type: "grid",
      },
    });
    if (data.value?.code !== 0) {
      console.error(t("errors.createViewFailed") + data.value?.msg);
    }
    return data;
  } catch (error) {
    console.log(t("errors.createViewFailed"), error);
  }
};

const setWeek = async (
  monday: number | string,
  sunday: number | string,
  viewInfo: any
) => {
  try {
    const { data } = await useFetch("/setWeek", {
      method: "post",
      query: {
        tableId: selection.value?.tableId,
      },
      body: {
        field_id: form.value.fieldId,
        viewInfo,
        monday,
        sunday,

      },
    });
    if (data.value?.code !== 0) {
      ElMessage.error(data.value?.msg || t("errors.operationFailed"));
      return;
    }
    ElMessage.success(`${t("errors.filteredData")}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getDays = (type: TimeType) => {
  let monday: number = 0;
  let sunday: number = 0;
  let view_name = "";

  if (type === weekOptions.lastWeek.value) {
    monday = dayjs().weekday(-7).valueOf();
    sunday = dayjs().weekday(-1).valueOf();
    view_name = t("weekNames.lastWeek");
  } else if (type === weekOptions.nextWeek.value) {
    monday = dayjs().weekday(7).valueOf();
    sunday = dayjs().weekday(13).valueOf();
    view_name = t("weekNames.nextWeek");
  } else if (type === weekOptions.thisWeek.value) {
    monday = dayjs().weekday(0).valueOf();
    sunday = dayjs().weekday(6).valueOf();
    view_name = t("weekNames.thisWeek");
  } else if (type === monthOptions.lastMonth.value) {
    monday = dayjs().subtract(1, "month").startOf("month").valueOf();
    sunday = dayjs().subtract(1, "month").endOf("month").valueOf();
    view_name = t("monthNames.lastMonth");
  } else if (type === monthOptions.nextMonth.value) {
    monday = dayjs().add(1, "month").startOf("month").valueOf();
    sunday = dayjs().add(1, "month").endOf("month").valueOf();
    view_name = t("monthNames.nextMonth");
  } else if (type === monthOptions.thisMonth.value) {
    monday = dayjs().startOf("month").valueOf();
    sunday = dayjs().endOf("month").valueOf();
    view_name = t("monthNames.thisMonth");
  }
  return { monday, sunday, view_name };
};

const off = bitable.base.onSelectionChange(async ({ data }) => {
  if (data.tableId !== selection.value?.tableId) {
    selection.value = { ...data };
    await initFieldOption();
  } else if (data.viewId !== selection.value?.viewId) {
    selection.value.viewId = data.viewId;
  }
});

const minWidth = ref("300px");
watchEffect(() => {
  minWidth.value = locale.value == "zh" ? "300px" : "400px";
});

onUnmounted(() => {
  off();
});
</script>

<template>
  <div class="user-form">
    <el-form v-model="form" label-width="auto">
      <el-form-item :label="$t('labels.targetField')">
        <el-select v-model="form.fieldId">
          <el-option
            v-for="item in timeFieldList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('labels.displayMode')">
        <el-switch
          v-model="form.showInNew"
          inline-prompt
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          :active-text="$t('switchTexts.newView')"
          :inactive-text="$t('switchTexts.currentView')"
        />
      </el-form-item>
      <el-form-item :label="$t('labels.weekFilter')">
        <div class="btns">
          <el-button
            v-for="item in weekOptions"
            :key="item.value"
            :type="item.color"
            :disabled="form.fieldId == ''"
            @click="handleFilter(item.value)"
            >{{ $t(item.label) }}</el-button
          >
        </div>
      </el-form-item>

      <el-form-item :label="$t('labels.monthFilter')">
        <div class="btns">
          <el-button
            v-for="item in monthOptions"
            :key="item.value"
            :type="item.color"
            :disabled="form.fieldId == ''"
            @click="handleFilter(item.value)"
            >{{ $t(item.label) }}</el-button
          >
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.user-form {
  width: 100%;
  min-width: v-bind("minWidth");
  margin: 0 auto;
}
</style>
