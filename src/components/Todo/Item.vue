<template>
    <draggable :class="{ chosen: chosenTodoId === todo._id }" class="todo-item">
        <div class="flex align-center">
        <div class="flex align-center">
            <label class="input-checkbox-flag">
                <input type="checkbox" v-model="important" title="Important" @change="doneEdit">
                <fa :class="{red: important }" icon="flag" class="icon-sm" />
            </label>
            <label class="input-checkbox">
                <input type="checkbox" v-model="completed" title="Done" @change="doneEdit">
                <span></span>
            </label>
            <i :title="'Added on ' + createdDate" class="icon dark"><fa icon="calendar-alt" /></i>
            </div>
            <input
                id="todo-item-input"   
                type="text" 
                v-model="title" 
                v-if="editing" 
                @blur="doneEdit" 
                @keyup.enter="doneEdit" 
                @keyup.esc="cancelEdit" 
                v-focus />
            <span :class="{important: important, completed: completed }" 
                v-if="!editing" 
                @dblclick="editTodo"
                @mouseover="unchoose"
                >{{ title }}</span>
        </div>
        <span class="icon dark" @click="removeTodo" title="Remove"><fa icon="times" /></span>
    </draggable>
</template>

<script>
import Draggable from 'vuedraggable'

export default {
  name: 'item',
  components: {
    Draggable
  },
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
      date: this.todo.date 
    }
  },
  
  computed: {
    createdDate () {
      let splitted = this.date.split(/[-|,|:|T|.|Z]/)
      return splitted[0] + '/' + splitted[1] + '/' +  splitted[2]
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

    doneEdit(){
      if(this.title == ''){
        this.title = this.beforeEditCache
      }
      this.editing = false;
      this.$emit('finishedEdit', {
        '_id': this.todo._id,
        'title': this.title,
        'completed': this.completed,
        'important': this.important,
        'editing': this.editing
      })
    },

    cancelEdit() {
      this.title = this.beforeEditCache
      this.editing = false
    },

    unchoose () {
      this.$emit('unchosen')
    }
  }
}
</script>
