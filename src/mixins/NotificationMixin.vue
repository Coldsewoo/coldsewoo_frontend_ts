<template></template>

<script>
export default {
  name: 'NotificationMixin',
  methods: {
    registerError(err) {
      const message = err.response ? err.response.message : err.message
      this.$store.commit('addError', message)
    },
  },
}
</script>
