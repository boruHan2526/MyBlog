<template>
  <div class="main-panel">
    <div class="menus">
      <div v-for="(menu, index) in menus" :key="index" @click="toPage(menu)">
        {{ menu.name }}
      </div>
    </div>
    <div style="padding: 20px; width: 100%;">
      <router-view></router-view>
    </div>
  </div>
  <div class="title">管理者システム</div>
</template>

<script setup>
import { AdminStore } from '../../stores/AdminStore'
import { ref, reactive, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter();
const route = useRoute();

const message = inject("message");
const axios = inject("axios")

const adminStore = AdminStore()

//menu
let menus = [
  { name: "記事管理", href: "/dashboard/article" },
  { name: "カテゴリ管理", href: "/dashboard/category" },
  { name: "ログアウト", href: "logout" },
]

//ルート遷移
const toPage = (menu) => {
  if (menu.href == 'logout') {
    router.push("/login")
  }
  else {
    router.push(menu.href)
  }
}

</script>

<style lang="scss" scoped>
.main-panel {
  display: flex;
  color: #64676a;
  max-width: 2500px;
  margin: 0 auto;
}

.menus {
  padding: 20px 0;
  box-sizing: border-box;
  line-height: 55px;
  text-align: center;
  width: 180px;
  height: 95vh;
  border-right: 1px solid #dadada;

  div {
    cursor: pointer;

    &:hover {
      color: #fd760e;
    }
  }
}

.title {
  font-size: 65px;
  font-weight: bold;
  text-align: right;
  position: fixed;
  color: rgba(0, 0, 0, 20%);
  right: 5vw;
  bottom: 5vh;
}
</style>
