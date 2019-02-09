import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { sync } from 'vuex-router-sync'
import VeeValidate from 'vee-validate'
import './assets/styles/all.scss'
import 'animate.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faKey, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp, faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faWhatsapp, faUser, faKey, faEnvelope, faGithub,
        )

Vue.component('fa', FontAwesomeIcon)
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
            path: '/todo'
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
