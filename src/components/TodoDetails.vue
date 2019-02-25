<template>
    <div class="modal">
        <div class="modal-header">
            <span>Todo Details</span>
            <i title="Close" class="icon light" @click="closeModal"><fa icon="times"/></i>
        </div>
        <div class="todo-detail">
            <span>Effective Date: <strong>{{dateHandler(todo.date)}}</strong></span>
            <span>Expire Date: <strong>{{dateHandler(todo.expDate)}}</strong></span>
            <span>Priority: <strong>{{ priorityHandler(todo.important) }}</strong></span>
            <span>Todo: <strong>{{todo.title}}</strong></span>
        </div>
    </div>
</template>

<script>
import DateFormat from '@/services/DateFormat'
import { bus } from '@/main'

export default {
    name: 'todo-details',
    props: {
        todo: {
            type: Object
        }
    },
    methods: {
        closeModal() {
            bus.$emit('closeTodoDetails')
        },

        dateHandler(date) {
            return DateFormat.dateTime(date)
        },

        priorityHandler(priority) {
            if(priority) return 'High'
            else return 'Normal'
        }
    }
}
</script>
