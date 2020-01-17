<template></template>
<script>
import NotificationMixin from 'Mixins/NotificationMixin'

export default {
  name: 'ErrorHandlerMixin',
  mixins: [NotificationMixin],
  methods: {
    handleAPIError(err, handler = null, handlerFields = ['code', 'message', 'defaultHandler'], formatter = null) {
      if (err.message.includes(',')) err.message = err.message.split(',')[0]
      this.registerError(err)
    },
  },
}
</script>
