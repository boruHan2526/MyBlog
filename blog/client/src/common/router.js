import {createRouter, createWebHistory} from "vue-router"

let routes = [
    {path: "/test", component: () => import("../views/Test.vue")},
    {path: "/login", component: () => import("../views/Login.vue")}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export {router}