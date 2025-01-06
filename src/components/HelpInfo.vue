<script setup lang="ts">

</script>

<template>
  <div class="flex justify-between w-full gap-2 pr-1 mb-4">
    <div class="mr-auto text-sm hover:text-blue-600 hover:underline">
      <a href="https://nd9omx5l6b.feishu.cn/docx/C6IYdCKV2ouArTxVNxWc7suXnxj?from=from_copylink" target="_blank"
        class="inline-flex items-center">
        <span class="icon-[la--link]"></span>
        <span>{{ $t('guide') }}</span>
      </a>
    </div>
    <div class="flex items-center gap-2">
      <a-tooltip title="github" color="#2db7f5">
        <a href="https://github.com/lvcatbo/week-filter-plugin.git" target="_blank" class="icon-[ant-design--github-filled] hover:text-blue-600"></a>
      </a-tooltip>
      <a-tooltip :title="$t('issue')" color="#2db7f5">
        <a  class="icon-[ant-design--question-circle-outlined] hover:text-blue-600" href="https://nd9omx5l6b.feishu.cn/docx/C6IYdCKV2ouArTxVNxWc7suXnxj#part-HwxkdBIBKotLKRxJAOpc3fl9nNb" target="_blank"></a>
      </a-tooltip>
      <a-tooltip :title="$t('about')" color="#2db7f5" placement="topLeft">
        <a href="https://www.feishu.cn/invitation/page/add_contact/?token=55bg8056-a17f-494c-b31a-4ef2d74bfd5e&amp;unique_id=9AF0BjBpnB8owyfe0bjPpw==" target="_blank" class="icon-[ant-design--info-circle-outlined] hover:text-blue-600" ></a>
      </a-tooltip>
    </div>
  </div>
</template>
