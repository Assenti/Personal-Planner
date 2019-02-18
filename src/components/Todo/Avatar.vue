<template>
  <div id="avatar">
    <div @click="changing = true">
        <img class="fade-in" :src="computeAvatar" title="Change avatar" v-if="!changing">
        <input id="file-input" 
               type="file"
               ref="file"
               @change="selectFile"
               accept="image/jpg, image/png, image/svg" 
               v-if="changing">
        <label class="fas fa-upload fade-in"
               v-if="changing && !file"
               for="file-input" 
               title="Upload image">
        </label>
        <label class="fas fa-check fade-in" v-if="changing && file"></label>
    </div>
    <div class="fade-in" v-if="!changing">Welcome, {{ $store.state.user.firstname }}</div>
    
    <button class="fade-in btn primary relative w-70" 
            @click="changeAvatar" 
            v-if="changing" 
            :disabled="setLoading || !file"
            title="Send changes">
        <span v-if="!setLoading">Change</span>
        <div class="lds-facebook" v-if="setLoading"><div></div><div></div><div></div></div>
    </button>
    
    <button class="fade-in btn red relative w-70" 
            @click="deleteAvatar"
            :disabled="deleteLoading" 
            v-if="changing"
            title="Send changes">
        <span v-if="!deleteLoading">Delete</span>
        <div class="lds-facebook" v-if="deleteLoading"><div></div><div></div><div></div></div>
    </button>
    
    <button class="fade-in btn secondary w-70" 
            v-if="changing && !setLoading && !deleteLoading" 
            @click="cancelUploading"
            title="Cancel">Cancel</button>
  </div>
</template>

<script>
import axios from 'axios'
import path from 'path'
import Api from '@/services/ApiService'

export default {
    name: 'avatar',
    data () {
        return {
        changing: false,
        file: '',
        avatar: '',
        setLoading: false,
        deleteLoading: false
        }
    },

    computed: {
        computeAvatar () {
            return this.$store.getters.avatar ? this.$store.getters.avatar : path.resolve(__dirname, '/src/assets/user.svg')
        } 
    },

    methods: {
        changeAvatar () {
            this.setLoading = true
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token

            let data = new FormData()
            data.append('userId', this.$store.state.user._id)
            data.append('file', this.file)
            
            axios.post(`${Api.host}/api/user/setavatar`, data)
            .then(response => {
                this.$store.dispatch('setAvatar', response.data)
                this.changing = false
            })
            .catch(err => console.log(err))
            .then(() => {
                this.setLoading = false
            })
        },

        selectFile () {
            this.file = this.$refs.file.files[0]
        },

        cancelUploading () {
            this.changing = false
            this.file = ''
        },

        deleteAvatar () {
            this.deleteLoading = true
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
            let data = { userId: this.$store.state.user._id }
            axios.put(`${Api.host}/api/user/deleteavatar`, data)
            .then(response => {
                this.$store.dispatch('setAvatar', response.data)
                this.changing = false
            })
            .catch(err => console.log(err))
            .then(() => {
                this.deleteLoading = false
            })
        }
    }
}
</script>
