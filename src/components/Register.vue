<template>
  <div class="auth-block animated fadeIn">
    <div class="auth-block__title">Registration</div>
    <div class="error" v-if="error">{{ error }}</div>
    <div class="success" v-if="success">{{ success}}</div>
    <form class="form-slim" @submit.prevent="validateBeforeSubmit">
    	<div class="form-field">
    		<label id="firstname">Firstname* (letters only)</label>
            <fa icon="user" />
    		<input class="input" 
               :class="{'input-error': errors.has('firstname')}" 
               type="text" 
               @focus="labelShow('firstname')" 
               @blur="labelHide('firstname')" 
               v-model="firstname"
               name="firstname"
               autocomplete="off" 
               placeholder="Input firstname" 
               v-validate="'required|alpha'">
    	  <span class="form-error">{{ errors.first('firstname')}}</span>
      </div>
    	<div class="form-field">
    		<label id="lastname">Lastname* (letters only)</label>
            <fa icon="user" />
    		<input class="input"
               :class="{ 'input-error': errors.has('lastname') }" 
               type="text"
               name="lastname"
               autocomplete="off" 
               @focus="labelShow('lastname')" 
               @blur="labelHide('lastname')" 
               v-model="lastname" 
               placeholder="Input lastname..." 
               v-validate="'required|alpha'">
    	  <span class="form-error">{{errors.first('lastname')}}</span>
      </div>
    	<div class="form-field">
    		<label id="email-register">Email* (not forget about '@' sign and domain zone)</label>
            <fa icon="envelope" />
    		<input class="input"
               :class="{'input-error':errors.has('email')}" 
               type="text" 
               @focus="labelShow('email-register')" 
               @blur="labelHide('email-register')" 
               v-model="email"
               name="email"
               autocomplete="off" 
               placeholder="Input Email..." 
               v-validate="'required|email'">
    	  <span class="form-error">{{errors.first('email')}}</span>
      </div>
    	<div class="form-field">
    		<label id="password-register">Password* (min 4 characters)</label>
            <fa icon="key"/>
    		<div class="relative">
    			<input class="input"
                 :class="{'input-error':errors.has('password')}" 
                 :type="passwordType" 
                 v-model="password"
                 name="password"
                 autocomplete="off" 
                 @focus="labelShow('password-register')" 
                 @blur="labelHide('password-register')" 
                 placeholder="Create a password..." 
                 v-validate="'required|min:4'">
    			<i class="fa fa-eye icon input-hint" v-if="password.length > 0" @click="passwordVisible"></i>
    		</div>
        <span class="form-error">{{errors.first('password')}}</span>
    	</div>
    	<div class="form-controls relative">
    		<button class="btn cus-green wide " type="submit" :disabled="loading">
          <span v-if="!loading">Register</span>
          <div class="lds-facebook" v-if="loading"><div></div><div></div><div></div></div>
          </button>
    	</div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import Api from '@/services/ApiService'

export default {
  name: 'register',
  data () {
    return {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        passwordType: 'password',
        loading: false,
        error: '',
        success: ''
    }
  },
  methods: {
    validateBeforeSubmit() {
        this.$validator.validateAll().then((result) => {
            if (result) {
                this.register()
                return
            }
            this.error = 'Fill in the correct data, please'
        })
    },

    register() {
        let self = this
        this.loading = true
        let data = {
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
            password: this.password
        }
        axios.post(`${Api.host}/api/register`, data)
        .then((response) => {
            self.success = response.data
            self.error = ''
        })
        .catch((err) => {
            console.log(err)
            if(err.response.status == 406) {
                self.error = err.response.data
            }  
        })
        .finally(() => {
            self.loading = false
        })
    },

    passwordVisible() {
    	if(this.passwordType === 'password') this.passwordType = 'text'
    	else this.passwordType = 'password'
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