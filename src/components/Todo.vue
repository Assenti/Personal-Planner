<template>
    <div class="todo">

        <todo-search :anyRemaining="anyRemaining"
                    @checkAllChanged="checkAllTodos" />
        
        <div class="todo-content">
            <div class="error" v-if="error && !loading && todos.length == 0">{{ error }}</div>
            <div class="form-controls relative" v-if="error && loading && todos.length == 0">
                <div class="lds-facebook">
                    <div style="background: #527a7a"></div>
                    <div style="background: #527a7a"></div>
                    <div style="background: #527a7a"></div>
                </div>
            </div>
            <div class="form-controls" v-if="error && !loading && todos.length == 0">
                <i class="icon dark" title="Refresh" @click="getTodos()"><fa icon="sync-alt"/></i>
            </div>
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
                    @setUnsetCompleted="setUnsetCompleted"
                    @setUnsetImportant="setUnsetImportant"
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

        <div class="modal-wrapper" v-if="todoDetails">
            <div class="backdrop" @click="todoDetails = false"></div>
            <todo-details class="animated fadeInDown fast" :todo="todoDetail" />
        </div>

    </div>
</template>

<script>
import Item from '@/components/Item'
import Total from '@/components/Total'
import axios from 'axios'
import Api from '@/services/ApiService'
import Draggable from 'vuedraggable'
import TodoSearch from '@/components/TodoSearch'
import TodoDetails from '@/components/TodoDetails'
import { bus } from '@/main'

export default {
    name: 'todo',
    components: {
        Item,
        Total,
        Draggable,
        TodoSearch,
        TodoDetails
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
            todoDetails: false,
            todoDetail: '',
            loading: false
        }
    },

    created() {
        bus.$on('filterTodos', (data) => {
            this.filter = data
        })

        bus.$on('openTodoDetails', (todo) => {
            this.todoDetails = true
            this.todoDetail = todo
        })

        bus.$on('closeTodoDetails', () => {
            this.todoDetails = false
        })

        bus.$on('updateTodos', (newTodos) => {
            this.todosFiltered = newTodos
            this.$store.dispatch('setTodos', newTodos)
        })

        bus.$on('addTodo', (newTodo) => {
            this.todosFiltered.push(newTodo)
            this.$store.dispatch('setTodos', this.todosFiltered)
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
                this.loading = true
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
                axios.get(`${Api.host}/api/getTodos?userId=${this.$store.state.user._id}`,
                {timeout: 5000 })
                .then(response => {
                    console.log(response.data)
                    this.todos = response.data
                    this.$store.dispatch('setTodos', response.data)
                })
                .catch(err => {
                    console.log(err)
                    if(err.code === 'ECONNABORTED') {
                        this.error = 'Server not response'
                    }
                })
                .then(() => this.loading = false)
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

        setUnsetCompleted(data) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
            let editingData = {
                _id: data._id,
                completed: data.completed
            }

            axios.get(`${Api.host}/api/setUnsetCompleted?_id=${data._id}&completed=${data.completed}`)
            .then(response => {
                console.log(response.data)
                let index = this.todos.findIndex((todo) => todo._id == data._id)
                this.todos.splice(index, 1, response.data)
                this.error = ''
            })
            .catch(err => {
                if(err.response.status == 403) {
                    this.authError = err.response.data
                    this.$store.dispatch('unsetSession')
                } 
                else this.error = 'ERROR'
            })
        },

        setUnsetImportant(data) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
            axios.get(`${Api.host}/api/setUnsetImportant?_id=${data._id}&important=${data.important}`)
            .then(response => {
                console.log(response.data)
                let index = this.todos.findIndex((todo) => todo._id == data._id)
                this.todos.splice(index, 1, response.data)
                this.error = ''
            })
            .catch(err => {
                if(err.response.status == 403) {
                    this.authError = err.response.data
                    this.$store.dispatch('unsetSession')
                } 
                else this.error = 'ERROR'
            })
        },

        finishedEdit (data) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
            let editingData = {
                _id: data._id,
                title: data.title
            }

            axios.put(`${Api.host}/api/editTodo`, editingData)
            .then(response => {
                console.log(response.data)
                let index = this.todos.findIndex((todo) => todo._id == data._id)
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

        deleteCompleted() {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
            axios.put(`${Api.host}/api/deleteCompleted`, {
                todos: this.todos.filter(todo => todo.completed)
            })
            .then(response => {
                this.todos = this.todos.filter(todo => !todo.completed)
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
        