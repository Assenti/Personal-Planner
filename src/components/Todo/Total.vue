<template>
    <div class="todos-total">
        <div class="todo-counts tooltip" data-tooltip="Remaining todos">{{ remaining }}</div>
        <div class="flex align-center">
            <div class="filter-btn tooltip" 
                data-tooltip="Show All todos" 
                :class="{active: filter === 'all'}" 
                @click="filterTodos('all')">All</div>
            <div class="filter-btn tooltip" 
                data-tooltip="Show Active todos" 
                :class="{active: filter === 'active'}"
                @click="filterTodos('active')">Active</div>
            <div class="filter-btn tooltip" 
                data-tooltip="Show Compeleted todos"
                :class="{active: filter === 'completed'}" 
                @click="filterTodos('completed')">Completed</div>
            <div class="filter-btn tooltip"
                data-tooltip="Show Important todos"
                :class="{active: filter === 'important'}"
                @click="filterTodos('important')">Important</div>
        </div>
        <i data-tooltip="Delete completed" class="tooltip icon light" v-if="isCompletedExists" @click="deleteCompleted"><fa icon="trash-alt" /></i>
    </div>
</template>

<script>
export default {
    name: 'total',
    props: {
        anyRemaining: {
            type: Boolean,
            required: true
        },
        remaining: {
            type: Number,
            required: true
        },
        isCompletedExists: {
            type: Boolean,
            required: true
        },
        filter: {
            type: String,
            required: true
        }
    },
  
    methods: {
        filterTodos (prop) {
            this.$emit('filtered', prop)
        },

        deleteCompleted() {
            let el = document.getElementById('deleteComp')
            el.style.animationName = 'slide-left';
            this.$emit('deleteAllCompleted')
        },

        showLabel(id) {
            document.getElementById(id).style.opacity = '1';
        },

        hideLabel(id) {
            document.getElementById(id).style.opacity = '0';
        }
    }
}
</script>
