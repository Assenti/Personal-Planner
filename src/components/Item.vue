<template>
    <div :class="{ chosen: chosenTodoId === todo._id }" class="todo-item">
        <div class="todo-item-inner">
            <div class="todo-item-left">
                <label data-tooltip="Mark as done" class="input-checkbox tooltip is-tooltip-right">
                    <input :id="todo._id" type="checkbox" v-model="completed" @change="setUnsetCompleted">
                    <label :for="todo._id"></label>
                </label>
                <label data-tooltip="Mark as important" class="input-checkbox-flag tooltip is-tooltip-right">
                    <input type="checkbox" v-model="important" @change="setUnsetImportant">
                    <fa :class="{red: important }" icon="flag" class="icon-sm" />
                </label>
                <i class="todo-date">EffDate: {{ dateFormat(effDate) }}</i>
                <input
                    class="todo-item-input"   
                    type="text" 
                    v-model="title" 
                    v-if="editing" 
                    @blur="doneEdit" 
                    @keyup.enter="doneEdit" 
                    @keyup.esc="cancelEdit" 
                    v-focus />
                <span :class="{important: important, completed: completed }"
                    title="Double click to edit" 
                    v-if="!editing" 
                    @dblclick="editTodo"
                    @mouseover="unchoose">
                    {{ textSegment(title) }}
                </span>
            </div>
            <i class="todo-date">ExpDate: {{ dateFormat(expDate) }}</i>
            <i class="icon dark tooltip is-tooltip-left" @click="openTodoDetails" data-tooltip="Todo Details"><fa icon="info-circle" /></i>            
            <i class="icon dark tooltip is-tooltip-left" @click="removeTodo" data-tooltip="Remove"><fa icon="trash-alt" /></i>
        </div>
        
        <div title="Drag to replace" class="todo-item-grab draggable"><fa icon="arrows-alt"/></div>
    </div>
</template>

<script>
import { bus } from '@/main'

export default {
  name: 'item',
  props: {
    todo: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    chosenTodoId: {
      type: String,
      required: true
    },
    checkAll: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      _id: this.todo._id,
      title: this.todo.title,
      completed: this.todo.completed,
      important: this.todo.important,
      editing: this.todo.editing,
      beforeEditCache: '',
      effDate: this.todo.date,
      expDate: this.todo.expDate 
    }
  },
  
  watch: {
    checkAll() {
      this.completed = this.checkAll ? true : this.todo.completed
    }
  },

  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  },
  methods: {
    removeTodo() {
      this.$emit('removedTodo', this.todo._id);
    },

    editTodo() {
      this.beforeEditCache = this.title
      this.editing = true
    },

    dateFormat(date) {
        let splitted = date.split(/[-|,|:|T|.|Z]/)
        return splitted[0] + '-' + splitted[1] + '-' +  splitted[2]
    },

    doneEdit(){
      if(this.title == ''){
        this.title = this.beforeEditCache
      }
      this.editing = false

      let data = {
        _id: this.todo._id,
        title: this.title,
        important: this.important,
        editing: this.editing
      }

      this.$emit('finishedEdit', data)
    },

    setUnsetCompleted() {
      let data = {
        _id: this.todo._id,
        completed: this.completed
      }

      this.$emit('setUnsetCompleted', data)
    },

    setUnsetImportant() {
      let data = {
        _id: this.todo._id,
        important: this.important
      }

      this.$emit('setUnsetImportant', data)
    },

    cancelEdit() {
      this.title = this.beforeEditCache
      this.editing = false
    },

    unchoose () {
      this.$emit('unchosen')
    },

    textSegment(text) {
        if(text.length >= 30) {
            return `${text.substr(0, 30)}...`
        }
        else {
            return text
        }        
    },

    openTodoDetails() {
      bus.$emit('openTodoDetails', this.todo)
    }
  }
}
</script>
