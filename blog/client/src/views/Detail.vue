<template>
    <div class="container">
        <n-button type="primary" strong secondary @click="back" class="back-button-float">
            ← 戻る
        </n-button>


        <!-- title -->
        <n-h1>
            {{ blogInfo.title }}
        </n-h1>
        <n-divider />
        <!-- content -->
        <div class="blog-content">
            <div v-html="blogInfo.content">

            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, nextTick, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const blogInfo = ref([])

const axios = inject("axios")

onMounted(() => {
    loadBlog()
})

const loadBlog = async () => {
    let res = await axios.get("/blog/detail?id=" + route.query.id)
    blogInfo.value = res.data.rows[0]
    // updateArticle.title = res.data.rows[0].title
    // updateArticle.content = res.data.rows[0].content
    // updateArticle.categoryId = res.data.rows[0].category_id
}

const back = () => {
    router.push("/")
}

</script>

<!-- 
    現在のコンポーネントとは、この .vue ファイル自体の <template> 内の内容を指し、
    外部コンポーネントとは、他の .vue コンポーネントや、v-html で解析された動的な HTML コンテンツを指します。
-->


<style>
/* グローバルスタイル：v-html で動的にレンダリングされる内容（例：.blog-content img）に適用される */
.blog-content img {
    max-width: 100% !important;
}
</style>

<style lang="scss" scoped>
/* Scoped スタイルは、現在のコンポーネントの UI デザインに適用されます。（例：.container、.back-button-float） */
.container {
    width: 1200px;
    margin: 0 auto;
}

.back-button-float {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  font-size: 16px;
  padding: 8px 16px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}


img {
    max-width: 100% !important;
}
</style>
