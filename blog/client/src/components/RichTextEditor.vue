<template>
    <div>
        <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode"
            style="border-bottom: 1px solid #ccc" />
        <Editor :defaultConfig="editorConfig" :mode="mode" v-model="valueHtml" style="height: 400px; overflow-y: hidden"
            @onCreated="handleCreated" @onChange="handleChange" />
    </div>
</template>
<script setup>
import '@wangeditor/editor/dist/css/style.css';
import { ref, reactive, inject, onMounted, shallowRef, onBeforeUnmount } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

const server_url = inject("server_url")
const editorRef = shallowRef();
const toolbarConfig = { excludeKeys: ["uploadVideo"] };
const mode = ref("default")
const editorConfig = { placeholder: '内容を入力してください...' };
editorConfig.MENU_CONF = {}
editorConfig.MENU_CONF['uploadImage'] = {
    base64LimitSize: 10 * 1024, // 10kb
    server: server_url + '/upload/rich_editor_upload',
}
editorConfig.MENU_CONF['insertImage'] = {
    parseImageSrc: (src) => {
        if (src.indexOf("http") !== 0) {
            console.log(`${server_url}${src}`)
            return `${server_url}${src}`
        }
        console.log(`${server_url}${src}`)
        return src
    }
}

const valueHtml = ref("")

const props = defineProps({
    modelValue: {
        type: String,
        defaukt: ""
    }
})

const emit = defineEmits(["update:model-value"])
let initFinished = false

/**
 * この場合、コンポーネントがマウントされた後に10ミリ秒遅れて 
 * valueHtml.value = props.modelValue と initFinished = true を実行する目的は、
 * 親コンポーネントのデータ（props.modelValue）が正常に渡され、利用可能であることを確認するためです。
 * この方法を使うことで、子コンポーネントは親コンポーネントのデータが準備完了した後に、初期化操作を実行することができる
 */
onMounted(() => {
    setTimeout(() => {
        valueHtml.value = props.modelValue
        initFinished = true;
    }, 10)
})

onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;

    editor.destroy();
});

const handleCreated = (editor) => {
    console.log('created', editor);
    editorRef.value = editor;
};

const handleChange = (editor) => {
    // console.log('change:', editor.getHtml());
    if (initFinished) {
        emit("update:model-value", valueHtml.value)
    }
};

const clearContent = () => {
    valueHtml.value = "";
};

const setContent = (content) => {
    valueHtml.value = content
}

defineExpose({
    clearContent,
    setContent
});

</script>
<style scoped></style>
