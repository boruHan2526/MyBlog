<template>
  <div class="container">
    <div class="nav">
      <div @click="homePage">ホーム</div>
      <n-popselect @update:value="searchByCategory" v-model:value="selectedCategory" :options="categoryOptions"
        trigger="click">
        <div>カテゴリ<span>{{ categoryName }}</span></div>
      </n-popselect>
      <div @click="dashBoard">管理システム</div>
    </div>
    <n-divider />

    <n-space class="search">
      <n-input v-model:value="pageInfo.keyword" :style="{ width: '500px' }" placeholder="キーワードを入力してください" />
      <n-button type="primary" ghost @click="loadBlogs(0)">🔍</n-button>
    </n-space>

    <div v-for="(blog, index) in blogListInfo" :key="index" style="margin-bottom: 15px; cursor: pointer;">
      <n-card :title="blog.title" @click="toDetail(blog)">
        {{ blog.content }}

        <template #footer>
          <n-space align="center">
            <div>
              追加時間: {{ blog.create_time }}
            </div>
          </n-space>
        </template>
      </n-card>
    </div>

    <n-pagination @update:page="loadBlogs" v-model:page="pageInfo.page" :page-count="pageInfo.pageCount" />

    <n-divider />
    <div class="footer">
      <div>Powered by Vue.js</div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, nextTick, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const message = inject("message")
const dialog = inject("dialog")
const axios = inject("axios")

const selectedCategory = ref(0)
const categoryOptions = ref([])
const blogListInfo = ref([])

const pageInfo = reactive({
  page: 1,
  pageSize: 10,    //1ページに含まれるデータの数
  pageCount: 0,   //取得したデータの総数と、設定した1ページあたりのデータ数に基づいて、ページ数を計算する
  count: 0,
  keyword: "",
  categoryId: 0
})

onMounted(() => {
  loadCategorys();
  loadBlogs();
})

const loadBlogs = async (page = 0) => {
  if (page != 0) {
    pageInfo.page = page
  }
  let res = await axios.get(`/blog/list?keyword=${pageInfo.keyword}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}&categoryId=${pageInfo.categoryId}`)
  // blogListInfo.value = res.data.data.rows;
  let temp_rows = res.data.data.rows
  for (let row of temp_rows) {
    row.content += "..."
    let d = new Date(row.create_time)
    row.create_time = `${d.getFullYear()}年${d.getMonth()}月${d.getDate()}日`
  }
  blogListInfo.value = temp_rows;
  pageInfo.count = res.data.data.count;
  pageInfo.pageCount = parseInt(pageInfo.count / pageInfo.pageSize) + (pageInfo.count % pageInfo.pageSize > 0 ? 1 : 0)
  console.log(res)
}

const categoryName = computed(() => {
  let selectedOption = categoryOptions.value.find(option => option.value == selectedCategory.value)

  if (selectedOption) {
    console.log(selectedOption.value);
    return selectedOption.value == 0 ? "未選択" : selectedOption.label;
  } else {
    console.log("No category selected");
    return;
  }
})

const loadCategorys = async () => {
  let res = await axios.get("/category/list")
  console.log(res)
  categoryOptions.value = res.data.rows.map((item) => {
    return {
      label: item.name,
      value: item.id
    }
  })

  categoryOptions.value.unshift({
    label: "クリア",
    value: 0,
  });
  console.log(categoryOptions.value)
}

const searchByCategory = (categoryId) => {
    pageInfo.categoryId = categoryId;
    loadBlogs()
}

const toDetail = (blog) => {
  router.push({ path: "/detail", query: { id: blog.id } })
}

const homePage = () => {
  router.push("/")
}

const dashBoard = () => {
  router.push("/login")
}

</script>

<style lang="scss" scoped>
.search {
  margin-bottom: 15px;
}

.container {
  width: 1200px;
  margin: 0 auto;
}

.nav {
  display: flex;
  font-size: 20px;
  padding-top: 20px;
  color: #64676a;

  div {
    cursor: pointer;
    margin-left: 15px;

    &:hover {
      color: rgb(109, 216, 8);
    }

    span {
      font-size: 12px;
    }
  }
}

.n-card {
  &:hover {
    ::v-deep(.n-card-header__main) {
      color: rgb(109, 216, 8);
    }
  }
}

.footer {
  text-align: center;
  line-height: 25px;
  color: #64676a;
}
</style>
