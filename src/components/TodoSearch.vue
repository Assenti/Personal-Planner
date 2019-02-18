<template>
    <div class="todo-search">
        <div class="todo-search-field">
            <fa icon="search" />
            <input type="text" 
                @keyup="filterTodos"
                 
                v-model="search" 
                placeholder="Search todo (start typing...)" />
        </div>
    </div>
</template>

<script>
import { bus } from '@/main'

export default {
    name: 'todo-search',
    data() {
        return {
            filterTodos: '',
            search: ''
        }
    },
    methods: {
        filterTodos() {
            console.log(search)
            bus.$emit('filterTodos', search)
        }
    }
}
</script>
