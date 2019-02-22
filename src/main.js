import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { sync } from 'vuex-router-sync'
import VeeValidate from 'vee-validate'
import './assets/styles/all.scss'
import 'animate.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faKey, faEnvelope, faClipboardList,
faFlag, faSearch, faShareAlt, faTimes, faSignOutAlt,
faCalendarAlt, faTrashAlt, faCheckCircle, faPlusCircle,
faEye, faListUl, faExclamationCircle, faArrowsAlt } from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp, faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { setupCalendar, DatePicker } from 'v-calendar'
import 'v-calendar/lib/v-calendar.min.css'
import 'bulma-tooltip/dist/css/bulma-tooltip.min.css'

library.add(faWhatsapp, faUser, faKey, faEnvelope, faGithub,
faClipboardList, faFlag, faSearch, faShareAlt, faTimes,
faSignOutAlt, faCalendarAlt, faTrashAlt, faCheckCircle,
faPlusCircle, faEye, faListUl, faExclamationCircle,
faArrowsAlt)

setupCalendar({
    firstDayOfWeek: 2,  // Monday
})

export const bus = new Vue()

Vue.component('fa', FontAwesomeIcon)
Vue.component('date-picker', DatePicker)
Vue.config.productionTip = false
Vue.use(VeeValidate)


sync(store, router) 

router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.getters.loggedIn) {
            next({
            path: '/'
            })
        }
    } 
    else if (to.matched.some(record => record.meta.requiresVisitors)) {
        if (store.getters.loggedIn) {
            next({
            path: '/main'
            })
        }
    }
    next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
