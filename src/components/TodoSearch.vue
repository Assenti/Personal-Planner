<template>
    <div class="todo-search relative">
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
            <i class="animated fadeIn" @click="search = ''" v-if="search"><fa icon="times" /></i>
        </div>

        <i data-tooltip="Share" class="tooltip icon dark" @click="shareMenu = !shareMenu"><fa icon="share-alt" /></i>
        <i data-tooltip="Add Todo" class="tooltip icon dark" @click="openAddTodoModal"><fa icon="plus-circle" /></i>
        
        <div v-if="shareMenu">
            <div class="backdrop-transparent" @click="shareMenu = false"></div>
            <div class="share-menu">
                <div></div>
                <li @click="openWhatsapp">Send to WhatsApp</li>
                <li @click="sendViaEmail">Send to Email</li>
                <li><excel name="todos.xls" 
                    :data="todos" 
                    :fields="todosFields" 
                    @click="shareMenu = false">Download as XLS</excel></li>
            </div>
        </div>
        
        <div class="modal-wrapper" v-if="newTodoModal">
            <div class="backdrop" @click="newTodoModal = false"></div>
            <new-todo-modal class="animated fadeInDown fast"/>
        </div>

        <div class="modal-wrapper" v-if="toWhatsapp">
            <div class="backdrop" @click="toWhatsapp = false"></div>
            <div class="modal">
                <div class="modal-header">
                    <span>Send via WhatsApp</span>
                    <i title="Close" class="icon light" @click="toWhatsapp = false"><fa icon="times"/></i>
                </div>
                <div class="form-slim">
                    <div class="form-field">
                        <label style="opacity: 1">Input phone number (10 digits, without '8' or '+7')</label>
                        <fa :icon="['fab', 'whatsapp']"/>
                        <masked-input class="input"
                            v-focus
                            mask="\+7\ (111) 111-11-11" 
                            v-model="phone"
                            placeholder="Input phone number" 
                            @input="rawVal = arguments[1]" 
                            required />
                    </div>
                    <div class="form-controls">
                        <button :disabled="rawVal.length < 10" class="btn cus-green">
                            <a :disabled="rawVal.length < 10" :href="whatsAppApi">Send</a>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { bus } from '@/main'
import axios from 'axios'
import Api from '@/services/ApiService'
import NewTodoModal from '@/components/NewTodoModal'
import DateFormat from '@/services/DateFormat'
import MaskedInput from 'vue-masked-input' 

export default {
    name: 'todo-search',
    components: {
        NewTodoModal,
        MaskedInput
    },
    props: {
        anyRemaining: {
            type: Boolean,
            required: true
        }
    },
    directives: {
        focus: {
            inserted: function (el) {
                el.focus()
            }
        }
    },
    data() {
        return {
            todos: this.$store.state.todos,
            todosFields: {
                "Todo": "title",
                "EffDate": {
                    field: "date",
                    callback: (date) => {
                        return DateFormat.dateTime(date)
                    }
                },
                "ExpDate": {
                    field: "expDate",
                    callback: (date) => {
                        return DateFormat.dateTime(date)
                    }
                } 
            },
            search: '',
            newTodoModal: false,
            shareMenu: false,
            toWhatsapp: false,
            sendData: true,
            message: '',
            status: '',
            phone: '',
            rawVal: ''
        }
    },
    created() {
        bus.$on('setTodos', (todos) => {
            this.todos = todos
        })

        bus.$on('closeNewTodoModal', () => {
            this.newTodoModal = false
        })
    },
    computed: {
        whatsAppApi () {
            return 'https://api.whatsapp.com/send?phone=7' + this.rawVal + '&text=' + this.todoList
        },

        todoList () {
            let raw = ''
            for(let i = 0; i < this.$store.state.todos.length; i++){
                raw += i+1 + ') ' + this.$store.state.todos[i].title + '; '
            }
            return raw
        }
    },
    methods: {
        filterTodos() {
            console.log(this.search)
            bus.$emit('filterTodos', this.search)
        },

        openAddTodoModal() {
            this.newTodoModal = true
        },

        openWhatsapp() {
            this.toWhatsapp = true
            this.shareMenu = false
        },

        allChecked() {
            this.$emit('checkAllChanged', this.anyRemaining)
        },

        sendViaEmail() {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.token
            let data = { 
                title: this.todo,
                priority: this.todoPriority,
                expDate: this.todoDate,
                user: this.$store.state.user._id,
                order: this.$store.state.todos.length + 1 
            }
            axios.post(`${Api.host}/api/sendToEmail`, data, {
                timeout: 5000
            })
            .then(response => {
                this.message = 'SENT'
                this.status = 'success'
                setTimeout(() => {
                    this.message = ''
                    this.status = ''
                }, 3000)
            })
            .catch(err => {

            })
        }
    }
}
</script>
