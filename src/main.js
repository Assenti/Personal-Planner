import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { sync } from 'vuex-router-sync'
import VeeValidate from 'vee-validate'
import './assets/styles/all.scss'
import 'animate.css'
import axios from 'axios'
import 'preloader-js/assets/css/preloader.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faKey, faEnvelope, faClipboardList,
faFlag, faSearch, faShareAlt, faTimes, faSignOutAlt,
faCalendarAlt, faTrashAlt, faCheckCircle, faPlusCircle,
faEye, faListUl, faExclamationCircle, faArrowsAlt,
faChevronRight, faInfoCircle, faEdit, faUpload, faSyncAlt} from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { setupCalendar, DatePicker } from 'v-calendar'
import 'v-calendar/lib/v-calendar.min.css'
import 'bulma-tooltip/dist/css/bulma-tooltip.min.css'
import JsonExcel from 'vue-json-excel'
 
library.add(faWhatsapp, faUser, faKey, faEnvelope, faGithub,
faClipboardList, faFlag, faSearch, faShareAlt, faTimes,
faSignOutAlt, faCalendarAlt, faTrashAlt, faCheckCircle,
faPlusCircle, faEye, faListUl, faExclamationCircle, faEdit,
faArrowsAlt, faChevronRight, faLinkedin, faInfoCircle,
faUpload, faSyncAlt)

setupCalendar({
    firstDayOfWeek: 2,  // Monday
})

const instance = axios.create({
    // baseURL: 'http://localhost:3000/api',
    baseURL: '/api',
})

export const bus = new Vue()

Vue.component('excel', JsonExcel)
Vue.component('fa', FontAwesomeIcon)
Vue.component('date-picker', DatePicker)
Vue.config.productionTip = false
Vue.use(VeeValidate)
Vue.prototype.$http = instance


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
