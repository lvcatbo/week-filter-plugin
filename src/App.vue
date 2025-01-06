<script setup lang="ts">
import { bitable } from '@lark-base-open/js-sdk';
import helpInfo from './components/helpInfo.vue'; '@/components/helpInfo.vue'
import SelectForm from './components/SelectForm.vue';


import zh from 'ant-design-vue/es/locale/zh_CN';
import en from 'ant-design-vue/es/locale/en_US';
import { ref } from 'vue';

let lang = ref(zh);;
bitable.bridge.getLanguage().then(locale => {
  lang.value = locale == 'zh' ? zh : en;
})
</script>

<template>
  <div class="w-screen h-screen bg-[url('/src/assets/beams.jpg')] bg-cover bg-center p-2 overflow-x-hidden">
    <Suspense>
      <a-config-provider :locale="lang">
        <helpInfo />
        <SelectForm />
      </a-config-provider>
    </Suspense>
  </div>
</template>

<style lang='scss' scoped></style>
