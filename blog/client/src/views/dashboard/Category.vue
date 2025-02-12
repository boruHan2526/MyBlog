<template>
    <div>
        <n-button @click="showAddModel = true">カテゴリ追加</n-button>
        <n-table :bordered="false" :single-line="false">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>名称</th>
                    <th>処理</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(category, index) in categoryList" :key="index">
                    <td>{{ category.id }}</td>
                    <td>{{ category.name }}</td>
                    <td>
                        <n-space>
                            <n-button @click="toUpdate(category)">編集</n-button>
                            <n-button @click="deleteCategory(category)">削除</n-button>
                        </n-space>
                    </td>
                </tr>

            </tbody>
        </n-table>

        <n-modal v-model:show="showAddModel" preset="dialog" title="Dialog">
            <template #header>
                <div>追加</div>
            </template>
            <div>
                <n-input v-model:value="addCategory.name" type="text" placeholder="名称を入力してください" />
            </div>
            <template #action>
                <div>
                    <n-button @click="add">OK</n-button>
                </div>
            </template>
        </n-modal>

        <n-modal v-model:show="showUpdateModel" preset="dialog" title="Dialog">
            <template #header>
                <div>カテゴリ編集</div>
            </template>
            <div>
                <n-input v-model:value="updateCategory.name" type="text" placeholder="名称を入力してください" />
            </div>
            <template #action>
                <div>
                    <n-button @click="update">OK</n-button>
                </div>
            </template>
        </n-modal>


    </div>
</template>

<script setup>

import { AdminStore } from '../../stores/AdminStore'
import { ref, reactive, inject, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

const message = inject("message")
const dialog = inject("dialog")
const axios = inject("axios")

const adminStore = AdminStore()

const showAddModel = ref(false)
const showUpdateModel = ref(false)

const categoryList = ref([])
const addCategory = reactive({
    name: ""
})

const updateCategory = reactive({
    id:0,
    name: ""
})

onMounted(() => {
    loadDatas()
})

const loadDatas = async () => {
    let res = await axios.get("/category/list")
    categoryList.value = res.data.rows
}

const add = async () => {
    let res = await axios.post("/category/_token/add", { name: addCategory.name })
    if (res.data.code == 200) {
        loadDatas()
        message.info(res.data.msg)
    } else {
        message.error(res.data.msg)
    }
    showAddModel.value = false;
}

const toUpdate = async (category) =>{
    showUpdateModel.value = true 
    updateCategory.id = category.id
    updateCategory.name = category.name
}

const update = async ()=>{
    let res = await axios.put("/category/_token/update", { id:updateCategory.id, name: updateCategory.name })
    if (res.data.code == 200) {
        loadDatas()
        message.info(res.data.msg)
    } else {
        message.error(res.data.msg)
    }
    showUpdateModel.value = false;
}

const deleteCategory = async (category) => {

    dialog.warning({
        title: '警告',
        content: '当該データを削除してもよろしいですか？',
        positiveText: 'OK',
        negativeText: 'Cancel',
        onPositiveClick: async () => {
            let res = await axios.delete(`/category/_token/delete?id=${category.id}`)
            if (res.data.code == 200) {
                loadDatas()
                message.info(res.data.msg)
            } else {
                message.error(res.data.msg)
            }
        },
        onNegativeClick: () => { }
    })


}

</script>

<style lang="scss" scoped>
</style>