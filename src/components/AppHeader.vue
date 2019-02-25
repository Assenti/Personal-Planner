<template>
    <div class="header">
        <div class="header-title">Personal Planner</div>
        <span class="header-item">
            <i class="icon light" title="Authorization" @click="authMenu = !authMenu"><fa icon="user"/></i>
            <transition name="animations"
                    enter-active-class="animated slideInRight faster"
                    leave-active-class="animated slideOutRight faster">
                <div class="header-dropdown" v-if="authMenu">
                    <div title="Close" class="header-dropdown-closer" @click="authMenu = false">
                        <fa icon="chevron-right"/>
                    </div>
                    <div class="header-dropdown-content">
                        <div>
                            <div class="header-dropdown-title">Hey, {{user}}</div>
                            <div class="header-dropdown-avatar">
                                <avatar />
                            </div>
                            <div class="error" v-if="error">{{error}}</div>
                            <ul class="header-dropdown-list">
                                <li @click="logout"><fa icon="sign-out-alt"/> Logout</li>
                            </ul>
                        </div>
                        <div class="header-dropdown-footer">
                            <div>
                                <a href="mailto: asset.sultan@gmail.com">
                                    <i class="tooltip icon light" data-tooltip="Email me"><fa icon="envelope" /></i>
                                </a>
                                <a href="https://github.com/Assenti" target="_blank">
                                    <i class="icon light tooltip" data-tooltip="I'm on Github"><fa :icon="['fab', 'github']"/></i>
                                </a>
                                <a href="https://linkedin.com/in/asset-sultanov-developer/" target="_blank">
                                    <i class="icon light tooltip" data-tooltip="I'm on LinkedIn"><fa :icon="['fab', 'linkedin']"/></i>
                                </a>
                            </div>
                            <div>Personal Planner by Asset Sultanov<br>&copy; 2019</div>
                        </div>
                    </div>
                </div>
            </transition>
        </span>
    </div>
</template>

<script>
import Avatar from '@/components/Avatar'
import { bus } from '@/main'
import axios from 'axios'
import Api from '@/services/ApiService'

export default {
    name: 'app-header',
    components: {
        Avatar
    },
    data() {
        return {
            authMenu: false,
            user: this.$store.state.user.firstname,
            error: ''
        }
    },
    created() {
        bus.$on('error', (error) => {
            this.error = error
        })
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