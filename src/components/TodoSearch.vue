<template>
    <div class="todo-search">
        <div class="input-checkbox tooltip is-tooltip-right" data-tooltip="Mark all todos as done">
            <input id="allChecked" type="checkbox" :checked="!anyRemaining" @change="allChecked">
            <label for="allChecked"></label>
        </div>
        <div class="todo-search-field">
            <fa icon="search" />
            <input type="text" 
                @keyup.exact="filterTodos"
                @keyup.escape="search = ''" 
                v-model="search" 
                placeholder="Search todo (start typing...)" />
        </div>
        <i data-tooltip="Share" class="tooltip icon dark" @click="openShareOptions"><fa icon="share-alt" /></i>
        <i data-tooltip="Add Todo" class="tooltip icon dark" @click="openAddTodoModal"><fa icon="plus-circle" /></i>

        <div class="modal-wrapper" v-if="newTodoModal">
            <div class="backdrop" @click="newTodoModal = false"></div>
            <new-todo-modal class="animated fadeInDown fast"/>
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
    props: {
        anyRemaining: {
            type: Boolean,
            required: true
        }
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
            
        },

        allChecked() {
            this.$emit('checkAllChanged', this.anyRemaining)
        }
    }
}
</script>
