<template>
    <div id="main">
        <app-header />
        <todo />
    </div>
</template>

<script>
import Todo from '@/components/Todo/Index.vue'
import AppHeader from '@/components/AppHeader.vue'

export default {
    name: 'main-page',
    components: {
        Todo,
        AppHeader
    }
}
</script>
