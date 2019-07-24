<template>
  <v-container>
    <editorEdit status="new" />
  </v-container>
</template>

<script>
import editorEdit from '@/components/blog/editorEdit.vue'

export default {
  components: {
    editorEdit,
  },
  beforeDestroy() {
    this.$store.commit('blogStore/setCurrentArticle', 'reset')
  },
};
</script>

<style lang="scss" scoped>
  .menubar {
    justify-content: center;
    display: flex;
    flex-flow: row wrap;
    position: sticky;
    top: 65px;
    border: solid 1px rgb(254, 246, 255);
  }
  .menubar__button {
    border: solid 1px gray !important;
    background-color: white !important;
    margin: 2px;
    padding: 1px;
    color: black !important;
    min-width: 45px !important;
    min-height: 45px !important;
    width: 45px !important;
    height: 45px !important;
  }

  .editor {
    width: 100%;
  }

  .editor__content {
    border: solid 2px black;
    padding: 8px;
    margin-top: 20px;
  }

  * {
    .is-active {
      background-color: rgb(255, 224, 254);
    }
    :focus {
      outline: none;
    }
  }

  .v-btn {
    opacity: 1 !important;
  }

  .v-btn--active:before,
  .v-btn:hover:before,
  .v-btn:focus:before {
    background-color: white;
  }

  .line_break {
    flex-basis: 100%;
    width: 0px;
    height: 30px;
    overflow: hidden;
  }
  .vc-chrome {
    align-items: center;
  }

  .categories {
    background-color: #fafafa;
    z-index: 3;
    padding: 8px;
    width: 100%;
    margin-left: 5px;
    div {
      border: solid 1px black;
      width: 100%;
    }
    pre {
      font-size: 13px;
      color: blue;
      padding-left: 1px;
    }
  }

  .input-photo {
    display: none;
  }
  .input-center {
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);

    i {
      color: black;
    }
  }
</style>
