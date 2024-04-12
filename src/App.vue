<script setup lang="ts">
import Form from '@/components/Form.vue'
import bgImg from '@/assets/beams.jpg'
</script>

<template>
  <!-- 最底层容器 -->
  <div class=" min-h-screen bg-center bg-cover w-full p-2" :style="{backgroundImage: `url(${bgImg})`}">
    <!-- 顶部索引栏 -->
    <div class="flex justify-between w-full text-base">
      <!-- 左边 -->
      <a href="https://nd9omx5l6b.feishu.cn/docx/C6IYdCKV2ouArTxVNxWc7suXnxj?from=from_copylink" target="_blank" class="flex items-center hover:text-blue-600 hover:underline hover:cursor-pointer  underline-offset-4">
        <span class="icon-[la--link]"></span>
        <span class="text-xs">{{ $t('guide') }}</span>
      </a>
      <!-- 右边 -->
      <div class="flex gap-1">
        <el-tooltip content="github" placement="bottom" effect="light">
          <a href="https://github.com/lvcatbo/week-filter-plugin.git" target="_blank" class="icon-[mdi--github] hover:cursor-pointer hover:text-blue-600"></a>
        </el-tooltip>
        <el-tooltip :content="$t('issue')" placement="bottom" effect="light">
          <a href="https://nd9omx5l6b.feishu.cn/docx/C6IYdCKV2ouArTxVNxWc7suXnxj#part-HwxkdBIBKotLKRxJAOpc3fl9nNb" target="_blank" class="icon-[ph--question] hover:cursor-pointer hover:text-blue-600"></a>
        </el-tooltip>
        <el-tooltip :content="$t('about')" placement="bottom" effect="light">
          <a href="https://www.feishu.cn/invitation/page/add_contact/?token=55bg8056-a17f-494c-b31a-4ef2d74bfd5e&amp;unique_id=9AF0BjBpnB8owyfe0bjPpw==" target="_blank" class="icon-[mdi--about] hover:cursor-pointer hover:text-blue-600"></a>
        </el-tooltip>
      </div>
    </div>

    <main class="mt-4 w-full select-none">
      <Form></Form>
    </main>
  </div>
</template>

<style scoped></style>
