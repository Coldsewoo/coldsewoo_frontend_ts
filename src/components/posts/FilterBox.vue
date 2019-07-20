<template>
  <div class="filter-type">
    <slot></slot>
    <div
      class="img"
      :class="filter.name"
      :style="{ backgroundImage: 'url(' + image + ')' }"
      @click="selectFilter"
    ></div>
  </div>
</template>

<script>
import EventBus from '@/EventBus.js';

export default {
  name: 'FilterBox',
  props: {
    filter: {
      type: Object,
      required: true,
    },
  },
  computed: {
    image() {
      return this.$store.state.postStore.localImageURL;
    },
  },
  watch: {},
  methods: {
    selectFilter() {
      EventBus.$emit('filter-selected', { filter: this.filter.name });
    },
  },
};
</script>

<style scoped>
  .filter-type {
    background-color: white;
    width: 200px;
    display: inline-block;
    margin: 5px auto;
    padding: 5px;
  }
  .filter-type p {
    background-color: white;
    font-size: 14px;
    text-align: center;
    text-transform: capitalize;
    margin: 3px auto;
  }

  .img {
    cursor: pointer;
    width: 200px;
    height: 200px;
    background-size: cover;
    background-position: center center;
    border: solid 1px #b9b9b9;
  }
</style>
