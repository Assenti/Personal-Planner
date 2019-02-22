<template>
    <div class="todo">

        <div class="error" v-if="error">{{ error }}</div>

        <todo-search :anyRemaining="anyRemaining"
                    @checkAllChanged="checkAllTodos" />
        
        <div class="todo-content">
            <fa class="todo-content-bg" icon="clipboard-list"/>
            <draggable v-model="todosFiltered"
                    :options="{animation: 200, handle: '.todo-item-grab'}" 
                    @start="drag=true" 
                    @end="drag=false">
                <item v-for="(todo, index) in todosFiltered"
                    :key="todo._id" 
                    :todo="todo" 
                    :index="index"
                    :chosenTodoId="chosenTodoId"
                    @unchosen="unchooseTodo"
                    @removedTodo="removeTodo"
                    @finishedEdit="finishedEdit"
                    :checkAll="!anyRemaining" />
            </draggable>
        </div>

        <total :anyRemaining="anyRemaining" 
            :remaining="remaining"
            :isCompletedExists="isCompletedExists"
            :filter="filter"
            @filtered="setFilter"
            @deleteAllCompleted="deleteCompleted"
            @checkAllChanged="checkAllTodos" />

        <div class="backdrop" v-if="authError">
            <div class="backdrop-inner">
            <div class="error">{{ authError }}</div>
                <div class="form-controls">
                <button class="btn primary" @click="navigateTo('/')">Login</button>
                </div>
            </div>
        </div>    
    </div>
</template>

<script>
import Item from './Item'
import Topnav from './Topnav'
import Total from './Total'
import axios from 'axios'
import Api from '@/services/ApiService'
import Draggable from 'vuedraggable'
import TodoSearch from '@/components/TodoSearch'
import { bus } from '@/main'

export default {
    name: 'todo',
    components: {
        Item,
        Topnav,
        Total,
        Draggable,
        TodoSearch
    },  
    data () {
        return {
            todo: '',
            todos: [],
            beforeEditCache: '',
            filter: 'all',
            error: '',
            authError: '',
            search: '',
            chosenTodoId: '',
            attrs: [
                {
                    key: 'today',
                    highlight: {
                        backgroundColor: '#ffd300',
                        // Other properties are available too, like `height` & `borderRadius`
                    },
                    contentStyle: {
                        color: '#4d4d4d',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    },
                    popover: {
                        label: 'You just hovered over today\'s date!',
                    },
                    dates: new Date()
                }
            ],
        }
    },

    created() {
        bus.$on('filterTodos', (data) => {
            this.filter = data
        })

        bus.$on('updateTodos', (data) => {
            this.todos = data
        })

    },

    mounted () {
        this.getTodos()
    },

    computed: {
        loggedIn () {
            return this.$store.getters.loggedIn
        },

        year() {
            let date = new Date()
            return date.getFullYear()
        },

        remaining () {
            return this.todos.filter(todo => !todo.completed).length
        },

        anyRemaining () {
            return this.remaining != 0
        },

        todosFiltered: {
            get() {
                if(this.filter === 'all'){
                    return this.todos
                } 
                else if(this.filter === 'active'){
                    return this.todos.filter(todo => !todo.completed)
                } 
                else if(this.filter === 'completed'){
                    return this.todos.filter(todo => todo.completed)
                } 
                else if(this.filter === 'important'){
                    return this.todos.filter(todo => todo.important)
                } 
                else {
                    return this.todos.filter(todo => {
                        return todo.title.toLowerCase().includes(this.filter.toLowerCase())
                    })
                }
            },

            set(newTodos) {
                this.todos = newTodos
            }
        },

        isCompletedExists() {
            return this.todos.filter(todo => todo.completed).length > 0
        }
    },

  methods: {
      getTodos() {
          if(this.$store.getters.loggedIn) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
            axios.get(`${Api.host}/api/getTodos?userId=${this.$store.state.user._id}`)
            .then(response => {
                this.todos = response.data
                this.$store.dispatch('setTodos', response.data)
            })
            .catch(err => {
                console.log(err)
            })
        } 
      },

    navigateTo(path) {
      this.$router.push(path)
    },

    setFilter (prop) {
      this.filter = prop
    },

    removeTodo(id) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        
        axios.delete(`${Api.host}/api/deleteTodo?todoId=${id}`)
        .then(reponse => {
            this.todos = this.todos.filter(todo => {
                return todo._id !== id
            })
            this.error = ''
        })
        .catch(err => {
            if(err.response.status == 403) {
                this.authError = err.response.data
                this.$store.dispatch('unsetSession')
            } 
            else {
                this.error = 'ERROR'
                setTimeout(() => {
                    this.error = ''
                }, 3000)
            }
        })
    },

    finishedEdit (data) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
        let editingData = {
            _id: data._id,
            title: data.title,
            completed: data.completed,
            important: data.important
        }
        axios.put(`${Api.host}/api/editTodo`, editingData)
        .then(response => {
            const index = this.todos.findIndex((todo) => todo._id == data._id)
            this.todos.splice(index, 1, response.data)
            this.error = ''
        })
        .catch(err => {
            if(err.response.status == 403) {
                this.authError = err.response.data
                this.$store.dispatch('unsetSession')
            } 
            else this.error = err.response.data
        })
    },

    checkAllTodos(checked) {
      this.todos.forEach((todo) => todo.completed = event.target.checked)
    },

    async deleteCompleted() {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
      axios.put(`${Api.host}/api/todo/deletecompleted`, {
        todos: this.todos.filter(todo => todo.completed)
      })
      .then(response => {
        if(response.status == 200) {
          this.todos = this.todos.filter(todo => !todo.completed)
          this.error = ''
        }
      })
      .catch(err => {
        if(err.response.status == 403) {
          this.authError = err.response.data
          this.$store.dispatch('unsetSession')
        } 
        else this.error = err.response.data
      })
    },

    showLabel (id) {
      document.getElementById(id).style.opacity = '1';
    },

    hideLabel (id) {
      document.getElementById(id).style.opacity = '0';
    },

    chooseTodo (id) {
      this.chosenTodoId = id
    },

    unchooseTodo () {
      this.chosenTodoId = ''
    }
  }
}
</script>
    