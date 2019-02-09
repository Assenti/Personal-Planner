<template>
    <div id="auth">
        <h1 style="text-align: center">Personal Planner</h1>
        <div class="hint">Please pass the authorization to start</div>
        <div id="auth-header">
            <span :class="{active: !login}" @click="login = false">Login</span>
            <span :class="{active: login}" @click="login = true">Register</span>
        </div>
        <login v-if="!login"/>
        <register v-if="login"/>
        <div id="todos-footer">
            <div>
            <span>
                <strong>Personal Planner</strong> by Asset Sultanov on <img src="../assets/logo.png">ue.js
            </span>
            </div>
            <p>&copy; 2019</p>
        </div>
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
