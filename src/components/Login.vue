<template>
    <div class="auth-block animated fadeIn">
        <div class="auth-block__title">Login</div>
        <form class="form-slim" @submit.prevent="validateBeforeSubmit">
            <div class="form-field">
                <label id="email">Email</label>
                <fa icon="envelope" />
                <input :class="{ 'input-error': errors.has('email')}"
                v-validate="'required|email'"
                class="input" 
                type="text" 
                name="email" 
                @blur="labelHide('email')" 
                @focus="labelShow('email')" 
                v-model="email" 
                placeholder="Input Email...">
            </div>
            <span class="animated shake form-error">{{errors.first('email')}}</span>
            <div class="form-field" v-if="!resetPasswordMenu">
                <label id="password">Password</label>
                <fa icon="key" />
                <input class="input"
                :class="{'input-error':errors.has('password')}" 
                type="password"
                name="password" 
                @blur="labelHide('password')" 
                @focus="labelShow('password')" 
                v-model="password" 
                placeholder="Input password..."
                v-validate="'required'">
                
            </div>
            <span class="animated shake form-error">{{errors.first('password')}}</span>
            
            <div v-if="!resetPasswordMenu" class="flex align-center space-between">
                <label class="input-rememberme">Remember me
                    <input type="checkbox" v-model="rememberme"><span></span>
                </label>
                <div class="link" @click="resetPasswordMenu = true">Forgot your password?</div>
            </div>
            
            <div class="error" v-if="error">{{error}}</div>
            <div class="success" v-else-if="success">{{success}}</div>

            <div class="form-controls relative">
                <button v-if="!resetPasswordMenu" class="btn cus-green wide" style="margin: 0" type="submit" :disabled="loading">
                    <span v-if="!loading">Login</span>
                    <div class="lds-facebook" v-if="loading"><div></div><div></div><div></div></div>
                </button>
                <button v-else-if="resetPasswordMenu" 
                    class="btn cus-green wide" 
                    style="margin: 0" 
                    @click.prevent="resetPassword" 
                    :disabled="!email || loading">
                    <span v-if="!loading">Reset</span>
                    <div class="lds-facebook" v-if="loading"><div></div><div></div><div></div></div>
                </button>
    	    </div>
        </form>
        <div class="link centered" v-if="!resetPasswordMenu" @click="goToRegister">Not registered yet?</div>
        <div class="link centered" v-if="resetPasswordMenu" @click="resetPasswordMenu = false">Go back</div>

        <div id="todos-footer">
            <div>
                <span>Personal Planner by Asset Sultanov</span>
            </div>
            <p>&copy; 2019</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import Api from '@/services/ApiService'

export default {
  name: 'login',
  data () {
    return {
        email: '',
        password: '',
        error: '',
        success: '',
        loading: false,
        rememberme: false,
        resetPasswordMenu: false
    }
  },
  methods: {
    validateBeforeSubmit() {
        this.$validator.validateAll().then((result) => {
            if (result) {
                this.login()
                return
            }
            this.error = 'Fill in the correct data, please'
        })
    },

    login() {
        this.loading = true

        let data = {
            email: this.email,
            password: this.password,
            rememberme: this.rememberme
        }

        axios.post(`${Api.host}/api/signin`, data, { timeout: 5000 })
        .then(response => {
            this.$store.dispatch('setSession', response.data)
            this.$router.push('/main')
        })
        .catch(err => {
            console.log(err)
            if(err.response.status == 401) {
                this.error = 'WRONG LOGIN OR PASSWORD'
            }
            else if(err.code === 'ECONNABORTED') {
                this.error = 'SERVER NOT RESPONSE'
            }
            else {
                this.error = 'SERVER ERROR'
            }
            setTimeout(() => {
                this.error = ''
            }, 4000)
        })
        .finally(() => {
            this.loading = false
        })
    },

    resetPassword() {
        this.loading = true
        axios.get(`${Api.host}/api/resetPassword?email=${this.email}`)
        .then(response => {
            console.log(response.data)
            this.success = 'Password restored! Check your email!'
        })
        .catch(err => {
            console.log(err)
            if(err.response.status == 406) {
                this.error = 'Wrong Email address'
                setTimeout(() => { this.error = '' }, 4000)
            }
            else {
                this.error = 'Server error'
                setTimeout(() => { this.error = '' }, 4000)
            }
        })
        .then(() => this.loading = false)
    },

    labelShow(id) {
        document.getElementById(id).style.opacity = '1';
    },

    labelHide(id) {
        document.getElementById(id).style.opacity = '0';
    },

    goToRegister() {
        this.$emit('toRegister')
    }

  }
}
</script>
