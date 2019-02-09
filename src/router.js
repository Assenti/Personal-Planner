import Vue from 'vue'
import Router from 'vue-router'
import Auth from './views/Auth.vue'
import Main from './views/Main.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'auth',
            component: Auth,
            meta: {
                title: 'Authorization | Personal Planner',
                requiresVisitors: true
            }
        },
        {
            path: '/main',
            name: 'main',
            component: Main,
            meta: {
                title: 'Main | Personal Planner',
                requiresAuth: true
            }
        }
    ]
})
