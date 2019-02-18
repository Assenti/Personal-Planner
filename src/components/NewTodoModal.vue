<template>
    <div class="modal">
        <form id="todo-form" @submit.prevent="addTodo">
            <div class="form-field">
                <label id="newtodo">What needs to be done?</label>
                <input class="input" 
                    type="text" 
                    @focus="showLabel('newtodo')" 
                    @blur="hideLabel('newtodo')" 
                    v-model="todo"
                    placeholder="What needs to be done?">
            </div>
            <div class="hint">Input the todo and press the Enter</div>
            <div class="error" v-if="error">{{ error }}</div>
        </form>
    </div>
</template>

<script>
import { bus } from '@/main'

export default {
    name: 'new-todo-modal',
    data() {
        return {
            error: '',
            todo: ''
        }
    },
    methods: {
        addTodo() {
            if(this.todo.trim().length == 0) return
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
            let data = { 
                title: this.todo,
                user: this.$store.state.user._id 
            }
            axios.post(`${Api.host}/api/createTodo`, data)
            .then(response => {
                this.todos.push(response.data)
                this.todo = ''
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
    }
}
</script>