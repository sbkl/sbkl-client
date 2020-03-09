<template>
    <span class="w-6 h-6 flex flex-col justify-around" :class="{'is-cross' : opened}" @click.prevent="clicked">
          <span class="bg-gray-600 block bar1 w-full" style="height: 1px"/>
          <span class="bg-gray-600 block bar2 w-full" style="height: 1px"/>
          <span class="bg-gray-600 block bar3 w-full" style="height: 1px"/>
    </span>
</template>
<script>
export default {
    name:'Hamburger',
    props: ['open'],
    watch: {
        open(value) {
            this.opened = value
        }
    },
    data() {
        return {
            opened: false
        }
    },
    methods: {
        clicked() {
                this.opened = !this.opened;
                this.$emit('clicked', this.opened);
        }
    }
    }
</script>
<style>   
    .bar1, .bar2, .bar3
    {
        transition: 0.4s;
    }

    /* Rotate first bar */
    .is-cross .bar1
    {
        right: 0;
        -webkit-transform: rotate(-45deg) translate(-5px, 4px);
        transform: rotate(-45deg) translate(-5px, 4px);
    }

    /* Fade out the second bar */
    .is-cross .bar2
    {
        opacity: 0;
    }

    /* Rotate last bar */
    .is-cross .bar3
    {
        -webkit-transform: rotate(45deg) translate(-7px, -6px);
        transform: rotate(45deg) translate(-7px, -6px);
    }
</style>