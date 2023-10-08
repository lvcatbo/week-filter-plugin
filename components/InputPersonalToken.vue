<script lang="ts" setup>
const personalToken = usePersonalBaseToken();
const inputToken = ref<string>('');
personalToken.value = localStorage.getItem("weekPlugn_personalToken") || "";

const confirmToken = () => {
  localStorage.setItem('weekPlugn_personalToken', inputToken.value);
  personalToken.value = inputToken.value;
}
</script>

<template>
  <div class="input-token">
    <span>请先输入多维表授权码：</span>
    <el-input v-model="inputToken" placeholder="请输入多维表授权码"></el-input>
    <el-button type="primary" @click="confirmToken">确认</el-button>
  </div>
</template>

<style scoped>
.input-token {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.input-token button {
  align-self: flex-end;
  width: 60px;
}
</style>
