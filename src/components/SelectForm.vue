<script setup lang="ts">
import { IFieldMeta } from '@lark-base-open/js-sdk';
import { off } from 'process';
import { ref } from 'vue';


const form = ref<FilterForm>({
  fieldId: '',
  showInNew: false,
  applySetting: false,
  startTime: 0,
  endTime: 0,
})

const fileds = ref<IFieldMeta[]>([])

const onFinish = (values: FilterForm) => {
  console.log('Received values:', values);
};

</script>

<template>
  <div class="w-full">
    <a-form :model="form" @onFinish="onFinish" labelAlign="left" class="pr-16">
      <a-form-item name="fieldId" :rules="[{ required: true, message: '请选择' }]">
        <div class="flex items-center">
          <span class="text-nowrap">展示方式：</span>
          <a-select v-model:value="form.fieldId">
            <a-select-option value="jack">Jack</a-select-option>
          </a-select>
        </div>

      </a-form-item>

      <a-form-item name="showInNew">
        <a-switch v-model:checked="form.showInNew" checked-children="新视图" un-checked-children="当前视图" />
      </a-form-item>
    </a-form>
  </div>
</template>
