import { createRouter, createWebHistory } from 'vue-router'
import LoginPageView from '../views/LoginPageView.vue'
import RegisterPageView from '../views/RegisterPageView.vue'
import PostsPageView from '../views/PostsPageView.vue'
import PostPageView from '../views/PostPageView.vue'

const routes = [
    { path: '/', redirect: '/posts' },
    { path: '/login', component: LoginPageView },
    { path: '/register', component: RegisterPageView },
    { path: '/posts', component: PostsPageView },
    { path: '/posts/:id', component: PostPageView }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
