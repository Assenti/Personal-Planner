<template>
    <div class="header">
        <div class="header-title">Personal Planner</div>
        <span class="header-item">
            <i class="icon light" title="Authorization" @click="authMenu = !authMenu"><fa icon="user"/></i>
            <transition name="animations"
                    enter-active-class="animated slideInRight faster"
                    leave-active-class="animated slideOutRight faster">
                <div class="header-dropdown" v-if="authMenu">
                    <div class="header-dropdown-title">Hey, {{user}}</div>
                    <div class="header-dropdown-avatar">
                        <img src="../assets/glenn-carstens-peters-190592-unsplash.jpg" alt="">
                    </div>
                    <ul class="header-dropdown-list">
                        <li><fa icon="sign-out-alt" @click="logout" /> Logout</li>
                    </ul>
                </div>
            </transition>
        </span>
    </div>
</template>

<script>
import { bus } from '@/main'

export default {
    name: 'app-header',
    data() {
        return {
            authMenu: false,
            user: this.$store.state.user.firstname
        }
    },
    methods: {
        logout () {
            this.authMenu = false
            axios.get(`${Api.host}/api/logout`)
            .then(response => {
                console.log(response.data)
            })
            .catch(err => {
                console.log(err)
            })
            .then(() => {
                this.$store.dispatch('unsetSession')
                this.$router.push('/')
            })
        }
    }
}
</script>