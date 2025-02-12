<template>
  <div class="login-panel">
    <n-card title="バックエンド管理システムログイン">
      <n-form :rules="rules" :model="admin">
        <n-form-item path="account" label="アカウント">
          <n-input v-model:value="admin.account" placeholder="アカウントを入力してください" />
        </n-form-item>
        <n-form-item path="password" label="パスワード">
          <n-input v-model:value="admin.password" placeholder="パスワードを入力してください" type="password" />
        </n-form-item>
      </n-form>
      <template #footer>
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
          <n-checkbox v-model:checked="admin.rember" label="ログイン情報を保存する" />
          <n-button @click="login">ログイン</n-button>
        </div>
      </template>
    </n-card>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, inject } from 'vue';
import { AdminStore } from '../stores/AdminStore';

import { useRouter, useRoute } from 'vue-router';
const router = useRouter()
const route = useRoute()

const message = inject("message")
const axios = inject("axios")
const adminStore = AdminStore()



// Data
let rules = {
  account: [
    { required: true, message: "アカウントを入力してください", trigger: "blur" },
    { min: 3, max: 12, message: "アカウントの長さは3文字以上12文字以下で入力してください", trigger: "blur" }
  ],
  password: [
    { required: true, message: "パスワードを入力してください", trigger: "blur" },
    { min: 3, max: 18, message: "パスワードの長さは3文字以上12文字以下で入力してください", trigger: "blur" }
  ],
}

const admin = reactive({
  account: localStorage.getItem("account") || "",
  password: localStorage.getItem("password") || "",
  rember: localStorage.getItem("rember") == 1 || false
})

const login = async () => {
  let result = await axios.post("/admin/login", {
    account: admin.account,
    password: admin.password
  });
  console.log(result)
  if (result.data.code == 200) {
    adminStore.token = result.data.data.token
    adminStore.account = result.data.data.account
    adminStore.id = result.data.data.id

    if (admin.rember) {
      localStorage.setItem("account", admin.account)
      localStorage.setItem("password", admin.password)
      localStorage.setItem("rember", admin.rember ? 1 : 0)
    }

    router.push("/dashboard")
    message.success("SUCCESS")
  }
  else {
    message.error("ERROR")
  }
}


</script>
<style lang="scss" scoped>
.login-panel {
  width: 500px;
  margin: 0 auto;
  margin-top: 130px;
}
</style>
