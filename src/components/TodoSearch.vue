<template>
    <div class="todo-search">
        <div class="todo-search-field">
            <fa icon="search" />
            <input type="text" 
                @keyup.exact="filterTodos"
                @keyup.escape="search = ''" 
                v-model="search" 
                placeholder="Search todo (start typing...)" />
        </div>
        <i title="Share" class="icon light" @click="openShareOptions"><fa icon="share-alt" /></i>
        <i title="Add Todo" class="icon light" @click="openAddTodoModal"><fa icon="plus-circle" /></i>

        <div v-if="newTodoModal">
            <div class="backdrop" @click="newTodoModal = false"></div>
            <new-todo-modal/>
        </div>
    </div>
</template>

<script>
import { bus } from '@/main'
import NewTodoModal from '@/components/NewTodoModal'

export default {
    name: 'todo-search',
    components: {
        NewTodoModal
    },
    data() {
        return {
            search: '',
            newTodoModal: false
        }
    },
    created() {
        bus.$on('closeNewTodoModal', () => {
            this.newTodoModal = false
        })
    },
    methods: {
        filterTodos() {
            console.log(this.search)
            bus.$emit('filterTodos', this.search)
        },

        openAddTodoModal() {
            this.newTodoModal = true
        },

        openShareOptions() {
            
        }
    }
}
</script>