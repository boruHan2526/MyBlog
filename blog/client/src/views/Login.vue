<template>
  <div class="login-panel">
    <n-card title="バックエンド管理システムログイン">
      <n-form :rules="rules" :model="admin">
        <n-form-item path="account" label="アカウント">
            <n-input v-model:value="admin.account" placeholder="アカウントを入力してください"/>
        </n-form-item>
        <n-form-item path="password" label="パスワード">
            <n-input v-model:value="admin.password" placeholder="パスワードを入力してください" type="password"/>
        </n-form-item>
      </n-form>
      <template #footer>
        <n-checkbox v-model:value="admin.rember" label="ログイン情報を保存する" :checked="admin.rember"/>
        <n-button @click="login">ログイン</n-button>
      </template>
    </n-card>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue';

// Data
let rules = {
  account: [
    { required: true, message: "アカウントを入力してください", trigger: "blur" },
    { min: 3, max: 12, message: "アカウントの長さは3文字以上12文字以下で入力してください", trigger: "blur" }
  ],
  password: [
    { required: true, message: "パスワードを入力してください", trigger: "blur" },
    { min: 6, max: 18, message: "パスワードの長さは3文字以上12文字以下で入力してください", trigger: "blur" }
  ],
}

const admin = reactive({
  account: "",
  password: "",
  rember: false
})

// Methods
const login = () => {
  console.log(admin.rember); // 打印值，看看是否更新
}


</script>
<style lang="scss" scoped>
.login-panel {
  width: 500px;
  margin: 0 auto;
  margin-top: 130px;
}
</style>
