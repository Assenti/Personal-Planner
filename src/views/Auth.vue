<template>
    <div>
        <div class="auth-page">
            <div class="auth-header">Personal Planner</div>
            <div class="auth">
                
                <div id="auth-header">
                    <span :class="{active: !login}" @click="login = false">Login</span>
                    <span :class="{active: login}" @click="login = true">Register</span>
                </div>
                <login v-if="!login"/>
                <register v-if="login"/>
            </div>
        </div>
        <!-- <div class="auth-page-backdrop"></div> -->
    </div>
</template>

<script>
import Login from '@/components/Login'
import Register from '@/components/Register'

export default {
    name: 'auth',
    components: {
  	    Login,
  	    Register
    },
    data () {
        return {
            login: false
        }
    },
    computed: {
        loggedIn () {
            return this.$store.getters.loggedIn
        }
    }
}
</script>
