<template>
  <div id="todo-topnav">
    <!-- <currency /> -->
    <div class="flex align-center space-between">
       <div>
         <!-- <h2 class="left">Todo list mini-app</h2> -->
       </div>
       <div id="todo-topnav-items">
         <fa icon="search" class="icon" v-if="!searchTool" @click="startSearch" />
         <fa icon="times" class="icon" v-if="searchTool" @click="endSearch" /> 
         <fa icon="share-alt" class="icon" @click="share = !share" title="Share" />
         <fa icon="sign-out-alt" class="icon" title="Log out" @click="logout" />
         <div class="share-items" v-if="share">
           <i class="fab fa-whatsapp" title="send to whatsapp" @click="toWhatsApp = !toWhatsApp"></i>
           <i class="far fa-envelope" title="send to email" @click="toEmail = !toEmail"></i>
           <i class="fas fa-download" title="download as pdf" @click="createPdf"></i>
         </div>
       </div>
    </div>

     <!-- <div id="searchbox" class="form-field" v-if="searchTool">
       <label id="search-label">Search todo (start typing)</label>
       <input class="input" 
              type="text" 
              v-focus
              @keyup.exact="filterTodos"
              @keyup.escape="endSearch" 
              @focus="showLabel('search-label')" 
              @blur="hideLabel('search-label')" 
              v-model="search" 
              placeholder="Search todo..." /> -->
       <!-- <div id="searchbox-results" v-if="results.length > 0">
         <span v-for="result in results" :key="result._id" @click="choose(result._id)">{{ result.title }}</span>
       </div> -->
     <!-- </div> -->

    <div class="backdrop" v-if="toEmail">
     <div class="backdrop-inner">
       <div>{{ messageEmail }}</div>
        <div class="form-controls relative">
          <button class="btn cus-green" @click="sendViaEmail" v-if="!sendData && !success">Send</button>
          <button class="btn secondary" @click="cancelSending" v-if="!sendData && !success">Cancel</button>
          <button class="btn cus-green" v-if="success" @click="cancelSending">Ok</button>
          <span class="spinner" v-if="sendData"></span>
        </div>
     </div>
   </div>

   <div class="backdrop" v-if="toWhatsApp">
     <div class="backdrop-inner">
       <div>{{ messageWhatsApp }}</div>
       <div class="form-field">
         <label>Input phone (10 digits, without '8' or '+7')</label>
         <masked-input class="input"
                       v-focus
                       mask="\+7\ (111) 111-11-11" 
                       v-model="phone"
                       placeholder="Input phone" 
                       @input="rawVal = arguments[1]" 
                       required />
       </div>
        <div class="form-controls relative">
          <button class="btn cus-green"><a :href="whatsAppApi">Send</a></button>
          <button class="btn secondary" @click="cancelSending">Cancel</button>
        </div>
     </div>
   </div>

   <div class="backdrop" v-if="authError">
     <div class="backdrop-inner">
       <div class="error">{{ authError }}</div>
        <div class="form-controls">
          <router-link tag="buttton" class="btn primary" to="/">Login</router-link>
        </div>
     </div>
   </div>

   </div>
</template>

<script>
import Currency from './Currency'
import Avatar from './Avatar'
import axios from 'axios'
import Api from '@/services/ApiService'
import _ from 'lodash'
import MaskedInput from 'vue-masked-input' 
// import jsPDF from 'jspdf'
// require('jspdf-autotable')


export default {
    name: 'topnav',
    components: {
        Currency,
        Avatar,
        MaskedInput
    },
    props: {
        todos: {
            type: Array,
            required: true
        }
    },
    directives: {
        focus: {
            inserted: function (el) {
                el.focus()
            }
        }
    },
    data () {
        return {
        share: false,
        searchTool: false,
        search: '',
        results: [],
        toEmail: false,
        toWhatsApp: false,
        sendData: false,
        authError: '',
        success: false,
        messageEmail: 'Send your todo list to your email?',
        messageWhatsApp: 'Send your todo list to whatsapp?',
        phone: '',
        rawVal: ''
        }
    },

    computed: {
        whatsAppApi () {
            return 'https://api.whatsapp.com/send?phone=7' + this.rawVal + '&text=' + this.todoList
        },

        todoList () {
            let raw = ''
            for(let i = 0; i < this.todos.length; i++){
                if(!this.todos[i].completed){
                raw += i+1 + ') ' + this.todos[i].title + '; '
                }
            }
            return raw
        }
    },

    methods: {
        logout () {
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
        },

        sendViaEmail () {
            this.sendData = true
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token

            let data = { userId: this.$store.state.user._id }
            axios.post(`${Api.host}/api/user/sendtoemail`, data)
            .then(response => {
                this.success = true
                this.messageEmail = response.data
            })
            .catch(err => {
                if(err.response.status == 403) {
                    this.authError = err.response.data
                    this.$store.dispatch('unsetSession')
                } 
            })
            .then(() => {
                this.sendData = false        
            }) 
        },

        startSearch () {
            this.searchTool = true
        },

    endSearch () {
        let el = document.getElementById('searchbox')
        el.style.animationName = 'slidingUp'
        this.search = ''
        setTimeout(() => this.searchTool = false, 500);
    },

    showLabel (id) {
        document.getElementById(id).style.opacity = '1';
    },

    hideLabel (id) {
        document.getElementById(id).style.opacity = '0';
    },

    cancelSending () {
        this.toWhatsApp = false
        this.toEmail = false
        this.phone = ''
        this.share = false
    },

    choose (id) {
        this.$emit('chosen', id)
        this.endSearch()
    },

    createPdf () {
        let columns = [
            {title: '#', dataKey: 'number'},
            {title: 'Todo title', dataKey: 'title'},
            {title: 'Important', dataKey: 'important'},
            {title: 'Todo created Date', dataKey: 'date'}
        ]

        let raws = []
        for(let i = 0; i < this.todos.length; i++){
            let splitted = this.todos[i].date.split(/[-|,|:|T|.|Z]/)
            let shortDate = splitted[0] + '/' + splitted[1] + '/' +  splitted[2]
            let important = this.todos[i].important ? 'Important' : 'Not'

            raws.push({
                number: i+1,
                title: this.todos[i].title,
                date: shortDate,
                important: important 
            })
        }
        let currentDate = new Date()
        let doc = new jsPDF('p', 'pt')
        doc.autoTable(columns, raws, {
            theme: 'grid',
            margin: {top: 60},
            addPageContent: function(data) {
                doc.text(`Todo List on ${ currentDate.toDateString() }`, 40, 30);
            }
        })
        doc.save('todos.pdf')
        this.share = false
    },

    navigateTo (route) {
        this.$router.push(route)
    },

    filterTodos () {
        this.$emit('searched', this.search)
    }
  },
  
  // For searching from server
  // watch: {
  //   search: _.debounce(async function(value) {
  //     const route = {
  //       name: 'todo'
  //     }
  //     if(this.search !== ''){
  //       route.query = {
  //         search: this.search
  //       }
  //     }
  //     this.$router.push(route)
  //   }, 700),

  //   '$route.query.search': {
  //     immediate: true,
  //     async handler(value) {
  //       this.search = value
  //       if(this.$store.state.token && this.$store.state.user) {
  //         try {
  //           let response = await axios.get('http://localhost:3000/api/todo/search', { params: {
  //             search: this.search,
  //             userId: this.$store.state.user._id
  //           }})
  //           this.results = response.data
  //         } catch(err) {
  //           console.log(err.response.data)
  //         }
  //       }
  //     }
  //   }
  // }

}
</script>
