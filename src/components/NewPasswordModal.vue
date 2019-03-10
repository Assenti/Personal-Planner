<template>
    <div class="modal">
        <div class="modal-header">
            <span>Change Password</span>
            <i title="Close" class="icon light" @click="closeModal"><fa icon="times"/></i>
        </div>
        <form class="form-slim" @submit.prevent="validateBefore">
            <div class="form-field relative">
                <label id="todoPriority">Current password</label>
                <fa icon="key"/>
                <input class="input" 
                    v-validate="'required'"
                    name="current"
                    type="text"
                    autocomplete="off"
                    @input="message = status = ''"
                    v-model="current">
            </div>
            <span class="form-error" v-if="errors.has('current')">Input current password</span>
            <div class="form-field relative">
                <label id="todoPriority">New password</label>
                <fa icon="key"/>
                <input class="input" 
                    type="text"
                    v-validate="'required'"
                    name="newPassword"
                    autocomplete="off"
                    @input="message = status = ''"
                    v-model="newPass">
            </div>
            <span class="form-error" v-if="errors.has('newPassword')">Input current password</span>
            <br>
            <div :class="status">{{message}}</div>
            <div class="form-controls relative">
                <button class="btn cus-green wide" 
                    style="margin: 0" 
                    type="submit" 
                    :disabled="loading">
                    <span v-if="!loading">Change</span>
                    <div class="lds-facebook" v-if="loading"><div></div><div></div><div></div></div>
                </button>
    	    </div>
        </form>
    </div>
</template>

<script>
import { bus } from '@/main'
import axios from 'axios'
import Api from '@/services/ApiService'

export default {
    name: 'new-password-modal',
    data() {
        return {
            message: '',
            status: '',
            current: '',
            newPass: '',
            loading: false,
            messageTimeout: 4000
        }
    },
    methods: {
        validateBefore() {
            this.$validator.validateAll().then((result) => {
                if (result) {
                    this.changePassword()
                    return
                }
                this.message = 'Fill in required fields'
                this.status = 'error'
            })
        },

        changePassword() {
            this.loading = true 
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
            let data = { 
                current: this.current,
                new: this.newPass,
                id: this.$store.state.user._id,
                email: this.$store.state.user.email
            }
            axios.post(`${Api.host}/api/changePassword`, data, {
                timeout: 5000
            })
            .then(response => {
                this.message = 'Password successfully changed!'
                this.status = 'success'
                setTimeout(() => { this.message = this.status = '' }, messageTimeout)   
            })
            .catch(err => {
                if(err.response.status == 401) {
                    this.message = 'Wrong current password'
                    this.status = 'error'
                }
                else if(err.code === 'ECONABORTED') {
                    this.message = 'Server not response'
                    this.status = 'error'
                    setTimeout(() => { this.message = this.status = '' }, messageTimeout)
                } 
                else {
                    this.message = 'ERROR'
                    this.status = 'error'
                    setTimeout(() => { this.message = this.status = '' }, messageTimeout)
                }
            })
            .then(() => this.loading = false)
        },
        
        closeModal() {
            bus.$emit('closeNewPasswordModal')
        }
    }
}
</script>