import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

import LoginPage from './views/LoginPage'
import HomePage from './views/HomePage'
Vue.use(Router);

export default new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes: [
        // {
        //   path:'/test',
        //   name:'test',
        //   component: test
        // },
        {
            path:'/',
            redirect:'/LoginPage'
        },
        {
            path:'/HomePage',
            name:'HomePage',
            component:HomePage
        },
        {
            path: '/LoginPage',
            name: 'LoginPage',
            component: LoginPage
        },

        {
            path: '/home',
            name: 'home',
            component: Home
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
        }
    ]
})
