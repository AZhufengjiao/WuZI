import { createRouter, createWebHashHistory } from "vue-router";
// import  Home from '../views/home/HomePage.vue'

const routes = [
    {
        path:'/',
        redirect: "/login"
    },
    {
        path: "/login",
        name: "Login",
        component: () => import("../views/login/LoginPage.vue"),
    },
    {
        path:'/home',
        name: "Home",
        redirect: "/home/main",
        component: () => import("../views/home/HomePage.vue"),
        meta:{title:'首页'},
        children: [
            {
                path: "/home/main",
                name: {
                    name:"HomeMain",
                    index:'1'
                },
                component: () => import("../components/HomeECharts/index.vue"),
                meta:{title:'admin'},
            },
            {
                path: "/home/user",
                name: "User",
                redirect: "/home/user/userList",
                component: () => import("../components/Users/index.vue"),
                meta:{title:'用户管理'},
                children:[
                    {
                        path: "/home/user/userList",
                        name: {
                            name:"UserList",
                            index:'2-1'
                        },
                        component: () => import("../components/Users/components/UserList/index.vue"),
                        meta:{title:'用户列表'},
                    },
                    {
                        path: "/home/user/userDonate",
                        name: {
                            name:"UserDonate",
                            index:'2-2'
                        },
                        component: () => import("../components/Users/components/UserDonate/index.vue"),
                        meta:{title:'用户捐赠'},
                    }
                ]
            },
            {
                path:'/home/material',
                name:'Material',
                meta:{title:'物资管理'},
                redirect: '/home/Materials/Together',
                component: () => import("../components/Materials/index.vue"),
                children:[
                    {
                        path: "/home/materials/together",
                        name: {
                            name:"MaterialsTogether",
                            index:'3-1'
                        },
                        component: () => import("../components/Materials/MaterialsTogether/index.vue"),
                        meta:{title:'结伴管理'},
                    },
                    {
                        path: "/home/material/count",
                        name: {
                            name:"MaterialCount",
                            index:'3-2'
                        },
                        component: () => import("../components/Materials/MaterialsTotal/index.vue"),
                        meta:{title:'总物资'},
                    }, {
                        path: "/home/material/scarcity",
                        name: {
                            name:"MaterialScarcity",
                            index:'3-3'
                        },
                        component: () => import("../components/Materials/MaterialScarcity/index.vue"),
                        meta:{title:'稀缺物资'},
                    }
                ]
            },

        ]
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    // scrollBehavior() {
    //     0;
    // },
    routes,
});

export default router;
