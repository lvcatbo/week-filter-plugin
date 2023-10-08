<script setup lang="ts">
const personalToken = usePersonalBaseToken();

const changeToken = () => {
  personalToken.value = '';
  localStorage.removeItem('weekPlugn_personalToken');
}


</script>

<template>
  <div class="app-container">
    <ClientOnly>
      <div class="hasToken" v-if="personalToken != ''">
        <user-form />
        <el-button text type="primary" @click="changeToken">更新授权码</el-button>
      </div>
      <div class="noToken" v-else>
        <input-personal-token />
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped>
.app-container {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 20px;
}
</style>
