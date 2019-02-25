<template>
  <div id="currency">
    <div>Currency rates on {{ currentDate }}</div>
    <div><i class="fa fa-dollar-sign"></i>1</div>
    <div>= <i class="fa fa-euro-sign"></i>{{ currency.rates.EUR | currencyShort }}</div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
    name: "currency",
    data () {
        return {
        currency: ''
        }
    },

    computed: {
        currentDate () {
            let date = new Date()
            return date.toDateString()
        }
    },

    filters: {
        currencyShort (value) {
            return value.toFixed(2)
        }
    },

    mounted () {
        axios.get('https://api.exchangeratesapi.io/latest', {params: {
            base: 'USD',
            symbols: 'EUR'
        }})
        .then(response => { 
            this.currency = response.data
        })
        .catch(err => console.log(err))
    }
}
</script>
