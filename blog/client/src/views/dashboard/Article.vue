<template>
    <div>
        <n-tabs v-model:value="tabValue" justify-content="start" type="line">
            <n-tab-pane name="list" tab="記事一覧">
                <div v-for="(blog, index) in blogListInfo" :key="index" style="margin-bottom: 15px;">
                    <n-card :title="blog.title">
                        {{ blog.content }}

                        <template #footer>
                            <n-space align="center">
                                <div>
                                    追加時間: {{ blog.create_time }}
                                </div>
                                <n-button @click="toUpdate(blog)">編集</n-button>
                                <n-button @click="toDelete(blog)">削除</n-button>
                            </n-space>
                        </template>
                    </n-card>
                </div>

                <n-space>
                    <div @click="toPage(pageNum)" v-for="(pageNum, index) in pageInfo.pageCount" :key="index"
                        :style="'cursor: pointer;'">
                        <div :style="'color:' + (pageNum == pageInfo.page ? 'blue' : '')">
                            {{ pageNum }}
                        </div>
                    </div>
                </n-space>

            </n-tab-pane>
            <n-tab-pane name="add" tab="記事追加">

                <n-form>
                    <n-form-item label="タイトル">
                        <n-input v-model:value="addArticle.title" placeholder="タイトルを入力してください" />
                    </n-form-item>

                    <n-form-item label="カテゴリ">
                        <n-select v-model:value="addArticle.categoryId" placeholder="カテゴリを選択してください"
                            :options="categoryOptions" />
                    </n-form-item>

                    <n-form-item label="内容">
                        <RichTextEditor v-model="addArticle.content" ref="editorRef" />
                    </n-form-item>

                    <n-form-item label="">
                        <n-button @click="add">追加</n-button>
                    </n-form-item>

                </n-form>

                {{ addArticle.content }}

            </n-tab-pane>
            <n-tab-pane name="update" tab="編集">
                <n-form>
                    <n-form-item label="タイトル">
                        <n-input v-model:value="updateArticle.title" placeholder="タイトルを入力してください" />
                    </n-form-item>

                    <n-form-item label="カテゴリ">
                        <n-select v-model:value="updateArticle.categoryId" placeholder="カテゴリを選択してください"
                            :options="categoryOptions" />
                    </n-form-item>

                    <n-form-item label="内容">
                        <RichTextEditor v-model="updateArticle.content" ref="editorRefUpdate" />
                    </n-form-item>

                    <n-form-item label="">
                        <n-button @click="update">更新</n-button>
                    </n-form-item>

                </n-form>

                {{ updateArticle.content }}

            </n-tab-pane>
        </n-tabs>





    </div>
</template>
<script setup>
import { AdminStore } from '../../stores/AdminStore'
import { ref, reactive, inject, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import RichTextEditor from '../../components/RichTextEditor.vue'
const router = useRouter()
const route = useRoute()

const message = inject("message")
const dialog = inject("dialog")
const axios = inject("axios")

const adminStore = AdminStore()

const editorRef = ref(null)
const editorRefUpdate = ref(null)

const addArticle = reactive({
    categoryId: null,
    title: "",
    content: ""
})

const updateArticle = reactive({
    id: 0,
    categoryId: null,
    title: "",
    content: ""
})

const categoryOptions = ref([])
const blogListInfo = ref([])
const tabValue = ref("list")

const pageInfo = reactive({
    page: 1,
    pageSize: 10,    //1ページに含まれるデータの数
    pageCount: 0,   //取得したデータの総数と、設定した1ページあたりのデータ数に基づいて、ページ数を計算する
    count: 0
})

onMounted(() => {
    loadBlogs()
    loadCategorys()
})

const loadBlogs = async () => {
    let res = await axios.get(`/blog/list?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`)
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

const loadCategorys = async () => {
    let res = await axios.get("/category/list")
    console.log(res)
    categoryOptions.value = res.data.rows.map((item) => {
        return {
            label: item.name,
            value: item.id
        }
    })
    console.log(categoryOptions.value)
}

const add = async () => {
    let res = await axios.post("/blog/_token/add", addArticle)
    if (res.data.code == 200) {
        message.info(res.data.msg)
        Object.assign(addArticle, {
            categoryId: null,
            title: "",
            content: ""
        });
        editorRef.value.clearContent();
        loadBlogs()
    } else {
        message.error(res.data.msg)
    }
}

const toPage = async (pageNum) => {
    pageInfo.page = pageNum
    loadBlogs()
}

const toUpdate = async (blog) => {
    tabValue.value = "update"

    await nextTick();

    if (editorRefUpdate.value) {
        editorRefUpdate.value.clearContent();
    } else {
        console.warn("editorRefUpdate 仍然是 null");
    }
    let res = await axios.get("/blog/detail?id=" + blog.id)
    console.log(res)
    updateArticle.id = blog.id
    updateArticle.title = res.data.rows[0].title
    updateArticle.content = res.data.rows[0].content
    updateArticle.categoryId = res.data.rows[0].category_id

    await nextTick();

    if (editorRefUpdate.value) {
        editorRefUpdate.value.setContent(updateArticle.content); // 手动设置富文本内容
    }

    console.log(updateArticle)
}

const update = async () => {
    let res = await axios.put("/blog/_token/update", updateArticle)
    if (res.data.code == 200) {
        message.info(res.data.msg)

        editorRefUpdate.value.clearContent();

        loadBlogs()

        tabValue.value = "list"

    }
    else {
        message.error(res.data.msg)
    }
}

const toDelete = async (blog) => {
    dialog.warning({
        title: '警告',
        content: '当該データを削除してもよろしいですか？',
        positiveText: 'OK',
        negativeText: 'Cancel',
        onPositiveClick: async () => {
            let res = await axios.delete("/blog/_token/delete?id=" + blog.id)
            if (res.data.code == 200) {
                message.info(res.data.msg)
                loadBlogs()
            }
            else {
                message.error(res.data.msg)
            }
        },
        onNegativeClick: () => { }
    })
}

</script>
<style scoped></style>
