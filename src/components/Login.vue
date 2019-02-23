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
            <div class="form-field">
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
            
            <div>
                <label class="input-rememberme">Remember me
                    <input type="checkbox" v-model="rememberme"><span></span>
                </label>
            </div>
            
            <div class="error" v-if="error">{{error}}</div>
            <div class="form-controls relative">
                <button class="btn cus-green wide" style="margin: 0" type="submit" :disabled="loading">
                    <span v-if="!loading">Login</span>
                    <div class="lds-facebook" v-if="loading"><div></div><div></div><div></div></div>
                </button>
    	    </div>
        </form>
        <div class="hint">Please pass the authorization to start</div>
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
        loading: false,
        rememberme: false
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
            else if(err.code === 'ECONABORTED') {
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

    labelShow(id) {
        document.getElementById(id).style.opacity = '1';
    },

    labelHide(id) {
        document.getElementById(id).style.opacity = '0';
    }

  }
}
</script>
