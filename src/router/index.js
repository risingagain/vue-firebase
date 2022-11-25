import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import {firebaseAuth} from "@/utils/firebase"

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard'),
        redirect: {name: 'dashboard.news'},
        children: [
            {
                path: 'news',
                name: 'dashboard.news',
                component: () => import(/* webpackChunkName: "dashboard-news" */ '../views/dashboard/NewsPage'),
            },
            {
                path: 'tasks',
                name: 'Tasks Page',
                component: () => import(/* webpackChunkName: "dashboard-tasks" */ '../views/dashboard/TasksPage'),
            },
            {
                path: 'resources',
                name: 'Resources Page',
                component: () => import(/* webpackChunkName: "dashboard-resources" */ '../views/dashboard/ResourcesPage'),
                redirect: {name: 'dashboard.resources.clinics'},
                children: [
                    {
                        path: 'clinics',
                        name: 'dashboard.resources.clinics',
                        component: () => import(/* webpackChunkName: "dashboard-resources-clinics" */ '../views/dashboard/ClinicsPage'),
                    },
                    {
                        path: 'attornies',
                        name: 'Attorney Page',
                        component: () => import(/* webpackChunkName: "dashboard-resources-attorney" */ '../views/dashboard/AttorneyPage'),
                    },
                    {
                        path: 'services',
                        name: 'Services Page',
                        component: () => import(/* webpackChunkName: "dashboard-resources-services" */ '../views/dashboard/ServicesPage'),
                    },
                    {
                        path: 'benefits',
                        name: 'Benefits Page',
                        component: () => import(/* webpackChunkName: "dashboard-resources-benefits" */ '../views/dashboard/BenefitsPage'),
                    },
                    {
                        path: 'job-opportunities',
                        name: 'dashboard.resource.job.opportunities',
                        component: () => import(/* webpackChunkName: "dashboard-resources-job-opportunities" */ '../views/dashboard/JobOpportunitiesPage'),
                    },
                    {
                        path: 'general-information',
                        name: 'General Information Page',
                        component: () => import(/* webpackChunkName: "dashboard-resources-general-info" */ '../views/dashboard/GeneralInformationPage'),
                    },
                ]
            },
            {
                path: 'members',
                name: 'Members Page',
                component: () => import(/* webpackChunkName: "dashboard-members" */ '../views/dashboard/MembersPage'),
            },
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})
router.beforeEach((to, from, next) => {
    if (to.name !== 'login' && !firebaseAuth.currentUser) {
        next({name: 'login'})
    } else {
        next()
    }
})

export default router
