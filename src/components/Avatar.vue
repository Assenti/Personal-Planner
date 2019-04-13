<template>
  <div class="avatar">
    <div @click="changing = true">
        <img class="fade-in" src="../assets/no-image-icon.png" title="Change avatar" v-if="!$store.getters.avatar && !changing">
        <img class="fade-in" :src="$store.getters.avatar" title="Change avatar" v-if="$store.getters.avatar && !changing">
        <input id="file-input" 
               type="file"
               ref="file"
               @change="selectFile"
               accept="image/jpg, image/png, image/svg" 
               v-if="changing">
        <label class="fade-in"
               v-if="changing && !file"
               for="file-input" 
               title="Upload image"><fa icon="upload"/>Choose image
        </label>
        <label class="fade-in" v-if="changing && file"><fa icon="check-circle"/>{{file.name}}</label>
    </div>
    
    <div>
        <i class="icon dark tooltip" 
                @click="changeAvatar"  
                :disabled="!file"
                v-if="changing"
                data-tooltip="Change avatar">
            <fa icon="edit"/>
        </i>
        
        <i class="icon dark tooltip" 
                @click="deleteAvatar"
                v-if="changing" 
                data-tooltip="Delete avatar">
            <fa icon="trash-alt" />
        </i>
        
        <i class="icon dark tooltip" 
                @click="cancelUploading"
                v-if="changing"
                data-tooltip="Cancel">
            <fa icon="times"/>    
        </i>
    </div>
    
  </div>
</template>

<script>
import path from 'path'
import { bus } from '@/main'

export default {
    name: 'avatar',
    data () {
        return {
        changing: false,
        file: '',
        avatar: '',
        setLoading: false,
        deleteLoading: false
        }
    },

    methods: {
        changeAvatar () {
            if(this.file) {
                let data = new FormData()
                data.append('userId', this.$store.state.user._id)
                data.append('file', this.file)
                
                this.$http.post(`/setAvatar`, data, { 
                    timeout: 5000,
                    headers: {
                        Authorization: 'Bearer ' + this.$store.state.token
                    } 
                })
                .then(response => {
                    this.$store.dispatch('setAvatar', response.data)
                    this.changing = false
                    this.file = ''
                    bus.$emit('error', '')
                })
                .catch(err => {
                    console.log(err)
                    if(err.code === 'ECONNABORTED') {
                        bus.$emit('error', 'Server not response')
                    }
                    else {
                        bus.$emit('error', 'Server Error')
                    }
                })
            }
            else {
                bus.$emit('error', 'Choose image')
            }
            
        },

        selectFile () {
            this.file = this.$refs.file.files[0]
        },

        cancelUploading () {
            this.changing = false
            this.file = ''
        },

        deleteAvatar () {
            this.$http.get(`/deleteAvatar?userId=${this.$store.state.user._id}&file=${this.$store.state.user.avatar}`,
            {
                headers: {
                    Authorization: 'Bearer ' + this.$store.state.token
                }
            })
            .then(response => {
                this.$store.dispatch('setAvatar', response.data)
                this.changing = false
                bus.$emit('error', '')
            })
            .catch(err => {
                console.log(err)
                if(err.code === 'ECONNABORTED') {
                    bus.$emit('error', 'Server not response')
                }
                else {
                    bus.$emit('error', 'Server Error')
                }
            })
        }
    }
}
</script>
