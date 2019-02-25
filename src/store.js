import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
		user: JSON.parse(localStorage.getItem('user')) || null,
		todos: null
	},
	getters: {
		loggedIn (state) {
			return state.user !== null
		},
		avatar (state) {
			if(state.user) {
				return state.user.avatar || null
			}
		}
	},
	mutations: {
		setSession(state, data) {
			state.user = data
        },
        setTodos(state, data) {
            state.todos = data
		},
		setAvatar(state, data) {
			state.user = data
		}
	},
	actions: {
		setSession(context, credentials) {
			localStorage.setItem('user', JSON.stringify(credentials))
			context.commit('setSession', credentials)
		},

		unsetSession(context) {
			localStorage.removeItem('user')
			context.commit('setSession', null)
        },
        
        setTodos(context, credentials) {
            context.commit('setTodos', credentials)
		},
		
		setAvatar(context, credentials) {
			let user = JSON.parse(localStorage.getItem('user'))
			user.avatar = credentials
			localStorage.setItem('user', JSON.stringify(user))
			context.commit('setAvatar', user)
		}
	}
})
