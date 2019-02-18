<template>
    <div class="todos-total">
        <div class="input-checkbox light" title="Check All">
            <input type="checkbox" :checked="!anyRemaining" @change="allChecked">
            <span></span>
        </div>
        <div id="todo-counts" title="Remaining">
            <fa icon="clipboard-list" />
            <span>{{ remaining }}</span>
        </div>
        <div class="flex align-center">
            <div class="filter-btn" :class="{active: filter === 'all'}" @click="filterTodos('all')">All</div>
            <div class="filter-btn" :class="{active: filter === 'active'}" @click="filterTodos('active')">Active</div>
            <i title="Show completed" class="icon light" :class="{active: filter === 'completed'}" @click="filterTodos('completed')"><fa icon="check-circle"/></i>
            <i title="Show importants" class="icon light" :class="{active: filter === 'important'}" @click="filterTodos('important')"><fa icon="flag"/></i>
        </div>
        <i id="deleteComp" title="Delete completed" class="icon light" v-if="isCompletedExists" @click="deleteCompleted"><fa icon="trash-alt" /></i>
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
        allChecked() {
            this.$emit('checkAllChanged', this.anyRemaining)
        },

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
