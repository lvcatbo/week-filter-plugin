<script setup lang="ts">
import { Icon } from "@iconify/vue";
const personalToken = usePersonalBaseToken();

const changeToken = () => {
  personalToken.value = "";
  localStorage.removeItem("weekPlugn_personalToken");
};
</script>

<template>
  <div class="app-container">
    <ClientOnly>
      <div class="hasToken" v-if="personalToken != ''">
        <div class="help">
          <div>{{ $t('tips.help1') }}</div>
          <div>
            <span style="white-space: nowrap;">{{ $t('tips.help2') }}</span>
            <Icon icon="heroicons-solid:arrow-sm-right" color="#00a6ed"/>
            <a
              href="https://raotv7asrln.feishu.cn/docx/Rk2xdAHOio7ctuxzyzQc6x7RnSd?from=from_copylink"
              target="_blank"
            >
            {{ $t('tips.help3') }}
            </a>
          </div>
        </div>
        <div class="top">
          <el-popconfirm
            width="220"
            :confirm-button-text="$t('button.confirm')"
            :cancel-button-text="$t('button.cancel')"
            icon-color="#626AEF"
            :title="$t('tips.updateKey')"
            :hide-after="0"
            @confirm="changeToken"
          >
            <template #reference>
              <el-button type="primary" size="small" round class="popconfirm"
                ><Icon icon="grommet-icons:connect" color="#fff" width="1em"
              /></el-button>
            </template>
          </el-popconfirm>
        </div>
        <user-form />
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
  padding: 25px 20px 0;
  position: relative;
}

.top {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-bottom: 5px;
  position: absolute;
  top: -3px;
  right: 0;
}
.help > * {
  color: #727474;
  font-size: 12px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
}
/* 引文样式 */
.help {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  background-color: #f5f5f5;
  color: #727474;
  font-size: 12px;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
a {
  color: #2170f8;
  text-decoration: none;
}
</style>
