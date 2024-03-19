<script setup lang="ts">
import Form from '@/components/Form.vue'
</script>

<template>
  <!-- 最底层容器 -->
  <div class=" min-h-screen bg-center bg-cover w-full p-2" style="background-image: url('/src/assets/beams.jpg');">
    <!-- 顶部索引栏 -->
    <div class="flex justify-between w-full text-base">
      <!-- 左边 -->
      <a href="https://raotv7asrln.feishu.cn/docx/Rk2xdAHOio7ctuxzyzQc6x7RnSd?from=from_copylink" target="_blank" class="flex items-center hover:text-blue-600 hover:underline hover:cursor-pointer  underline-offset-4">
        <span class="icon-[la--link]"></span>
        <span class="text-xs">{{ $t('guide') }}</span>
      </a>
      <!-- 右边 -->
      <div class="flex gap-1">
        <el-tooltip content="github" placement="bottom" effect="light">
          <a href="https://github.com/lvcatbo/week-filter-plugin.git" target="_blank" class="icon-[mdi--github] hover:cursor-pointer hover:text-blue-600"></a>
        </el-tooltip>
        <el-tooltip :content="$t('issue')" placement="bottom" effect="light">
          <a href="https://raotv7asrln.feishu.cn/docx/Rk2xdAHOio7ctuxzyzQc6x7RnSd#part-LKdCdgdpmoCxa2x3w4ZcQAc9nGf" target="_blank" class="icon-[ph--question] hover:cursor-pointer hover:text-blue-600"></a>
        </el-tooltip>
        <el-tooltip :content="$t('about')" placement="bottom" effect="light">
          <a href="https://www.feishu.cn/invitation/page/add_contact/?token=526gf4fb-907e-4cef-9f05-384c4cc01ca4&amp;unique_id=4lhYlIfqi1aWTVpMMk1w_g==" target="_blank" class="icon-[mdi--about] hover:cursor-pointer hover:text-blue-600"></a>
        </el-tooltip>
      </div>
    </div>

    <main class="mt-4 w-full select-none">
      <Form></Form>
    </main>
  </div>
</template>

<style scoped></style>
