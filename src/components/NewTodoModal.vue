<template>
    <div class="modal">
        <div class="modal-header">
            <span>New Todo</span>
            <i title="Close" class="icon light" @click="closeModal"><fa icon="times"/></i>
        </div>
        <form class="form-slim" @submit.prevent="validateBefore">
            <div class="form-field">
                <label id="newtodo">What needs to be done?</label>
                <fa icon="list-ul"/>
                <input class="input" 
                    type="text" 
                    :class="{ 'input-error': errors.has('newTodo')}"
                    v-validate="'required'"
                    name="newTodo" 
                    v-model="todo"
                    placeholder="What needs to be done?">
            </div>
            <span class="animated shake form-error">{{errors.first('newTodo')}}</span>
            <div class="form-field">
                <label id="dateTodo">When needs to be done?</label>
                <fa icon="calendar-alt"/>
                <date-picker class="input"
                    mode="single"
                    popover-visibility="focus" 
                    v-model="todoDate"
                    placeholder="What needs to be done?" />
            </div>

            <div class="form-field relative">
                <label id="todoPriority">Priority of todo?</label>
                <fa icon="exclamation-circle"/>
                <input class="input cursor-pointer" 
                    type="text"
                    readonly
                    @click="priorityMenu = !priorityMenu" 
                    v-model="todoPriority">
                <div class="dropdown" v-if="priorityMenu">
                    <li @click="choosePriority('High')">High</li>
                    <li @click="choosePriority('Normal')">Normal</li>
                </div>
            </div>

            <br>
            <div :class="status">{{message}}</div>
            <div class="form-controls relative">
                <button class="btn cus-green wide" style="margin: 0" type="submit" :disabled="loading">
                    <span v-if="!loading"><fa icon="plus-circle"/> Add</span>
                    <div class="lds-facebook" v-if="loading"><div></div><div></div><div></div></div>
                </button>
    	    </div>
        </form>
    </div>
</template>

<script>
import { bus } from '@/main'

export default {
    name: 'new-todo-modal',
    data() {
        return {
            message: '',
            status: '',
            todo: '',
            todoDate: new Date(),
            loading: false,
            priorityMenu: false,
            todoPriority: 'Normal'
        }
    },
    methods: {
        validateBefore() {
            this.$validator.validateAll().then((result) => {
                if (result) {
                    this.addTodo()
                    return
                }
            })
        },
        addTodo() {
            if(this.todo.trim().length == 0) return
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
            let data = { 
                title: this.todo,
                priority: this.todoPriority,
                date: this.todoDate,
                user: this.$store.state.user._id 
            }
            axios.post(`${Api.host}/api/createTodo`, data)
            .then(response => {
                 this.message = 'ADDED'
                 this.status = 'success'
                 setTimeout(() => {
                     this.message = ''
                     this.status = ''
                 }, 3000)
            })
            .catch(err => {
                if(err.response.status == 403) {
                    this.authError = err.response.data
                    this.$store.dispatch('unsetSession')
                } 
                else {
                    this.message = 'ERROR'
                    this.status = 'error'
                    setTimeout(() => {
                        this.message = ''
                        this.status = ''
                    }, 3000)
                }
            })
        },
        
        closeModal() {
            bus.$emit('closeNewTodoModal')
        },

        choosePriority(priority) {
            this.todoPriority = priority
            this.priorityMenu = false
        }
    }
}
</script>