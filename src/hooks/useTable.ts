import { DateFormatter, FieldType, IFieldMeta, ITable, OperationType, PermissionEntity, bitable } from "@lark-base-open/js-sdk";
import { onBeforeMount, onUnmounted, ref, shallowRef } from "vue";

interface Selection {
  baseId: string;
  tableId: string;
  viewId: string;
  recordId: string;
  fieldId: string;
}

export const useTable = () => {
  const base = bitable.base;
  const cuTable = shallowRef<ITable>();
  const timeFieldList = ref<IFieldMeta[]>([]);
  const hasEditPermi = ref<boolean>(false);
  onBeforeMount(async () => {
    initTable();
  })

  const initTable = async (tableId?: string) => {
    if (tableId) {
      cuTable.value = await base.getTable(tableId)
    } else {
      cuTable.value = await base.getActiveTable();
    }
    let allFields: IFieldMeta[] = await cuTable.value.getFieldMetaList();
    // 过滤掉不支持的字段
    const nosupportDateFormats = [DateFormatter.DATE_TIME, DateFormatter.DATE_TIME_WITH_HYPHEN];
    timeFieldList.value = allFields
      .filter((item) => [FieldType.DateTime, FieldType.CreatedTime, FieldType.ModifiedTime].includes(item.type)
        && !nosupportDateFormats.includes((item.property as any).dateFormat))

    // 查询是否有编辑权限
    hasEditPermi.value = await base.getPermission({
      entity: PermissionEntity.Table,
      param: { tableId: cuTable.value.id },
      type: OperationType.Editable,
    });
  }
  // @ts-ignore
  const off = base.onSelectionChange(async (event: { data: Selection }) => {
    if (event.data.tableId !== cuTable.value.id) {
      await initTable(event.data.tableId)
    }
  });

  onUnmounted(() => {
    off();
  })

  return {
    cuTable,
    timeFieldList,
    hasEditPermi
  }
}
