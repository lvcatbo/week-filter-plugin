<script setup lang="ts">
import { ref, onMounted } from "vue";
import dayjs from "dayjs";
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
import type { FormInstance, FormRules } from "element-plus";

const { t, locale } = useI18n();
const formRef = ref<FormInstance>();
const rules = ref<FormRules>({
  fieldId: [
    { required: true, message: t("errors.fieldIdInvalid"), trigger: "blur" },
  ],
});

const personalToken = usePersonalBaseToken();

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
  fieldId: undefined,
  showInNew: false,
  startTime: 0,
  endTime: 0,
});
const newViewId = ref<string>("");
const loading = ref<boolean>(false);
const handleFilter = async (
  type: TimeType,
  formEl: FormInstance | undefined
) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    debugger
    if (valid) {
      let monday = 0;
      let sunday = 0;
      let view_name = "";
      loading.value = true;
      if (!selection.value) {
        ElMessage.error(t("errors.getTableInfoFailed"));
        return;
      }
      if (type === "custom") {
        monday = form.value.startTime;
        sunday = form.value.endTime;
        view_name = "newView";
        debugger;
      } else {
        let res = getDays(type);
        monday = res.monday;
        sunday = res.sunday;
        view_name = res.view_name;
      }
      if (form.value.showInNew) {
        let creatResult = await createView(view_name);
        let nvid = creatResult?.value?.data?.view?.view_id;
        if (!nvid) {
          loading.value = false;
          return;
        }
        newViewId.value = nvid;
      } else {
        newViewId.value = selection.value.viewId!;
      }
      let viewInfo = await getView(newViewId.value);
      await setWeek(monday, sunday, viewInfo);
      loading.value = false;
    }
  });
};
const getView = async (viewId: string) => {
  try {
    const { data } = await useFetch("/getView", {
      query: {
        appToken: selection.value?.baseId,
        personalToken: personalToken.value,
        tableId: selection.value?.tableId,
        viewId: viewId,
      },
      method: "get",
    });
    if (data.value?.code !== 0) {
      if (data.value?.code === 1011) {
        ElMessage.error(t("errors.tokenInvalid"));
        localStorage.removeItem("weekPlugn_personalToken");
        personalToken.value = "";
        return;
      }
      console.error(`${t("errors.getViewFailed")}, ${data.value?.msg}`);
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
        appToken: selection.value?.baseId,
        personalToken: personalToken.value,
        tableId: selection.value?.tableId,
      },
      method: "post",
      body: {
        view_name,
        view_type: "grid",
      },
    });
    if (data.value?.code !== 0) {
      if (data.value?.code == 1254020) {
        ElMessage.error(t("errors.viewNameExist"));
        return;
      }
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
        appToken: selection.value?.baseId,
        personalToken: personalToken.value,
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
    <el-form :model="form" label-width="auto" :rules="rules" ref="formRef">
      <el-form-item :label="$t('labels.targetField')" prop="fieldId">
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
      <div
        class="btn-groups"
        v-loading="loading"
        :element-loading-text="$t('tips.handling')"
      >
        <el-form-item :label="$t('labels.weekFilter')">
          <div class="btns">
            <el-button
              v-for="item in weekOptions"
              :key="item.value"
              :type="item.color"
              @click="handleFilter(item.value, formRef)"
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
              @click="handleFilter(item.value, formRef)"
              >{{ $t(item.label) }}</el-button
            >
          </div>
        </el-form-item>

        <el-form-item :label="$t('labels.custom')">
          <div class="daterange">
            <el-date-picker
              v-model="form.startTime"
              type="date"
              start-placeholder="Start date"
              end-placeholder="End date"
              value-format="x"
              size="small"
              :popper-options="{
                placement: 'top',
              }"
            />-
            <el-date-picker
              v-model="form.endTime"
              type="date"
              start-placeholder="Start date"
              end-placeholder="End date"
              value-format="x"
              size="small"
              :popper-options="{
                placement: 'top',
              }"
            />
            <el-button
              size="small"
              type="primary"
              @click="handleFilter('custom', formRef)"
              >{{ $t("button.confirm") }}</el-button
            >
          </div>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<style scoped>
.user-form {
  width: 100%;
  min-width: v-bind("minWidth");
  margin: 0 auto;
  bottom: 10px;
}
.daterange {
  width: 100%;
  display: flex;
  gap: 3px;
  align-items: center;
}
</style>
