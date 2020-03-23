<template>
  <v-container class="edit-container">
    <v-card>
      <v-layout wrap pa-3 align-content-space-around>
        <v-flex xs12 md6 class="leftView">
          <v-card-text>
            <v-treeview
              :items="categories"
              :active.sync="active"
              activatable
              active-class="primary--text"
              class="tree grey lighten-5"
            >
              <template v-slot:prepend="{ item, active }">
                <v-icon v-if="active" :color="active ? 'primary' : ''"
                  >turned_in</v-icon
                >
                <v-icon v-if="!active" :color="active ? 'primary' : ''"
                  >turned_in_not</v-icon
                >
              </template>
            </v-treeview>
            <div class="add">
              <v-dialog v-model="dialogs.addDialog" width="500">
                <template v-slot:activator="{ on }">
                  <v-btn flat dark class="purple darken-1" v-on="on">ADD</v-btn>
                </template>

                <v-card>
                  <v-card-title class="headline grey lighten-2" primary-title
                    >Add category</v-card-title
                  >
                  <v-alert
                    :value="!valid.newCategory.alert"
                    type="warning"
                    transition="scale-transition"
                    @click="resetValid"
                    >The category name already exists!</v-alert
                  >

                  <v-card-text class="treeselect">
                    <Treeselect
                      v-model="value"
                      :multiple="false"
                      :options="categories"
                      :close-on-select="true"
                      :open-on-click="true"
                      :disable-branch-nodes="false"
                      placeholder="Categories"
                    />
                    <p>{{ value }}</p>
                    <v-form
                      ref="newForm"
                      v-model="valid.newCategory.form"
                      class="addField"
                    >
                      <v-text-field
                        v-model="newCategoryName"
                        :label="newCategoryNameLabel"
                        :rules="categoryNameRule"
                      />
                    </v-form>
                  </v-card-text>

                  <v-divider />

                  <v-card-actions>
                    <v-spacer />
                    <v-btn color="error" flat @click="closeDialog('addDialog')"
                      >Cancel</v-btn
                    >
                    <v-btn
                      :disabled="!valid.newCategory.form"
                      color="primary"
                      flat
                      @click="addCategory"
                      >Add</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </v-card-text>
        </v-flex>
        <v-flex xs12 md6 text-xs-center>
          <v-card-text class="rightView">
            <div class="categoryText">
              <p v-if="selectedCategory">
                <strong>SELECTED</strong>
              </p>
              <p>
                {{ selectedCategory ? selectedCategory : 'Select a category' }}
              </p>
            </div>
            <div
              v-if="selectedCategory"
              :class="{
                innerButtons:
                  true != $vuetify.breakpoint.sm &&
                  true != $vuetify.breakpoint.xs,
              }"
            >
              <v-dialog v-model="dialogs.changeDialog" width="500">
                <template v-slot:activator="{ on }">
                  <v-btn flat dark class="blue darken-2" v-on="on"
                    >Change Name</v-btn
                  >
                </template>

                <v-card>
                  <v-card-title class="headline grey lighten-2" primary-title
                    >Edit category name</v-card-title
                  >
                  <v-alert
                    :value="!valid.changeCategory.alert"
                    type="warning"
                    transition="scale-transition"
                    @click="resetValid"
                    >The category name already exists!</v-alert
                  >
                  <v-card-text>
                    <v-form ref="form" v-model="valid.changeCategory.form">
                      <v-text-field
                        v-model="changeCategoryName"
                        :rules="categoryNameRule"
                        label="Change category name"
                      />
                    </v-form>
                  </v-card-text>

                  <v-divider />

                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      color="error"
                      flat
                      @click="closeDialog('changeDialog')"
                      >Cancel</v-btn
                    >
                    <v-btn
                      :disabled="!valid.changeCategory.form"
                      color="primary"
                      flat
                      @click="changeCategory"
                      >Edit</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogs.deleteDialog" width="500">
                <template v-slot:activator="{ on }">
                  <v-btn flat dark class="red darken-1" v-on="on">Delete</v-btn>
                </template>

                <v-card>
                  <v-card-title class="headline grey lighten-2" primary-title
                    >Delete category</v-card-title
                  >

                  <v-card-text class="dialogText">
                    <p>Do you want to remove this category?</p>
                    <p>Articles here will be categorized into Main category.</p>
                  </v-card-text>

                  <v-divider />

                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      color="error"
                      flat
                      @click="closeDialog('deleteDialog')"
                      >Cancel</v-btn
                    >
                    <v-btn color="primary" flat @click="deleteCategory"
                      >Delete</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </v-card-text>
        </v-flex>
      </v-layout>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn flat dark class="blue darken-2" @click="goBlogHome"
          >Cancel</v-btn
        >
        <v-btn dark color="green darken-1" @click.prevent="saveCategoryChanged">
          <v-icon small>save</v-icon>Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
// import the component
import Treeselect from '@riophae/vue-treeselect'

// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import BaseBlogComponent from './BaseBlogComponent'

export default {
  components: {
    Treeselect,
  },
  extends: BaseBlogComponent,
  metaInfo() {
    return {
      title: 'Edit Category',
      titleTemplate: '%s | Coldsewoo - a blog',
      author: 'coldsewoo',
      description: 'Blog - Edit Category list',
    }
  },
  data() {
    return {
      categories: [],
      active: [],
      dialogs: {
        changeDialog: false,
        deleteDialog: false,
        addDialog: false,
      },
      value: null,
      categoryAddList: [],
      newCategoryName: '',
      changeCategoryName: '',
      Promises: [],
      categoryNameRule: [
        v => !!v || 'Please Enter Category Name',
        v => !v.includes('/') || '/ is not allowed',
      ],
      valid: {
        changeCategory: {
          alert: true,
          form: true,
          message: '',
        },
        newCategory: {
          alert: true,
          form: true,
          message: '',
        },
      },
    }
  },
  computed: {
    selectedCategory() {
      if (!this.active.length) return undefined
      return this.active[0].split('/').join('  -  ')
    },
    categoriesList() {
      return this.$store.getters['blogStore/categoriesList']
    },
    newCategoryNameLabel() {
      return this.value ? 'Category Name' : 'Tab name'
    },
  },
  watch: {
    categoriesList(newVal, oldVal) {
      this.categories = newVal.slice()
    },
    categories: {
      handler(newVal, oldval) {
        this.active = []
      },
      deep: true,
    },
    active(newVal, oldVal) {
      if (!newVal.length) this.value = null
      else {
        const splitVal = newVal[0].split('/')
        if (splitVal.length === 3) {
          splitVal.pop()
          this.value = splitVal.join('/')
        } else this.value = splitVal.join('/')
      }
    },
  },
  mounted() {
    this.getCategories()
  },
  methods: {
    getCategories() {
      this.$store.dispatch('blogStore/getCategories')
    },
    selectTab(i) {
      this.currentTab = i
    },
    selectMenu(n) {
      this.currentMenu = n
    },
    selectSubmenu(submenu) {
      this.currentSubmenu = submenu
    },
    closeDialog(name) {
      switch (name) {
        case 'addDialog':
          this.dialogs.addDialog = false
          this.newCategoryName = ''
          break
        case 'changeDialog':
          this.dialogs.changeDialog = false
          this.newCategoryName = ''
          break
        case 'deleteDialog':
          this.dialogs.deleteDialog = false
          break
        default:
          break
      }
    },
    changeCategory() {
      const items = this.active[0].split('/')
      const level = items.length
      let path
      let parent
      let mainIndex
      switch (level) {
        case 1:
          path = this.categories.filter(e => {
            return e.name === items[0]
          })[0]
          parent = this.categories
          if (
            parent.filter(e => e.name === this.changeCategoryName).length > 0
          ) {
            this.valid.changeCategory.alert = false
            return
          }
          for (const menu of path.children) {
            const menuId = menu.id.replace(
              `${path.name}`,
              `${this.changeCategoryName}`
            )
            for (const submenu of menu.children) {
              const submenuId = submenu.id.replace(
                `${path.name}`,
                `${this.changeCategoryName}`
              )
              parent = menu.children
              const index = parent.indexOf(submenu)
              index > -1 &&
                parent.splice(index, 1, {
                  id: submenuId,
                  name: submenu.name,
                  label: submenu.label,
                })
            }
            parent = path.children
            const mainIndex = parent.indexOf(menu)
            mainIndex > -1 &&
              parent.splice(mainIndex, 1, {
                id: menuId,
                name: menu.name,
                label: menu.label,
                children: menu.children,
              })
          }
          parent = this.categories

          mainIndex = parent.indexOf(path)
          mainIndex > -1 &&
            parent.splice(mainIndex, 1, {
              id: this.changeCategoryName,
              name: this.changeCategoryName,
              label: this.changeCategoryName,
              children: path.children,
            })
          break
        case 2:
          path = this.categories
            .filter(e => {
              return e.name === items[0]
            })[0]
            .children.filter(e => {
              return e.name === items[1]
            })[0]
          parent = this.categories.filter(e => {
            return e.name === items[0]
          })[0].children
          if (
            parent.filter(e => e.name === this.changeCategoryName).length > 0
          ) {
            this.valid.changeCategory.alert = false
            return
          }
          for (const submenu of path.children) {
            const submenuId = submenu.id.replace(
              `${path.name}`,
              `${this.changeCategoryName}`
            )
            parent = path.children
            const index = parent.indexOf(submenu)
            index > -1 &&
              parent.splice(index, 1, {
                id: submenuId,
                name: submenu.name,
                label: submenu.label,
                isDisabled: true,
              })
          }
          parent = this.categories.filter(e => {
            return e.name === items[0]
          })[0].children
          mainIndex = parent.indexOf(path)
          mainIndex > -1 &&
            parent.splice(mainIndex, 1, {
              id: `${items[0]}/${this.changeCategoryName}`,
              name: this.changeCategoryName,
              label: this.changeCategoryName,
              children: path.children,
            })
          break
        case 3:
          parent = this.categories
            .filter(e => {
              return e.name === items[0]
            })[0]
            .children.filter(e => {
              return e.name === items[1]
            })[0].children
          if (
            parent.filter(e => e.name === this.changeCategoryName).length > 0
          ) {
            this.valid.changeCategory.alert = false
            return
          }
          mainIndex = parent.indexOf(
            parent.filter(e => {
              return e.name === items[2]
            })[0]
          )
          mainIndex > -1 &&
            parent.splice(mainIndex, 1, {
              id: `${items[0]}/${items[1]}/${this.changeCategoryName}`,
              name: this.changeCategoryName,
              label: this.changeCategoryName,
              isDisabled: true,
            })
          break
        default:
          break
      }
      this.Promises.push({
        type: 'edit',
        origin: this.active[0],
        name: this.changeCategoryName,
        label: this.changeCategoryName,
      })
      this.dialogs.changeDialog = false
      this.changeCategoryName = ''
    },
    addCategory() {
      let level
      let items
      let obj
      let parent
      if (!this.value) level = 0
      else {
        items = this.value.split('/')
        level = items.length
      }
      switch (level) {
        case 0:
          parent = this.categories
          if (parent.filter(e => e.name === this.newCategoryName).length > 0) {
            this.valid.newCategory.alert = false
            return
          }
          obj = {
            id: this.newCategoryName,
            name: this.newCategoryName,
            label: this.newCategoryName,
            children: [],
          }
          this.categories.push(obj)
          break
        case 1:
          parent = this.categories.filter(e => {
            return e.name === items[0]
          })[0].children
          if (parent.filter(e => e.name === this.newCategoryName).length > 0) {
            this.valid.newCategory.alert = false
            return
          }
          obj = {
            id: `${this.value}/${this.newCategoryName}`,
            name: this.newCategoryName,
            label: this.newCategoryName,
            children: [],
          }
          this.categories.filter(e => e.name === items[0])[0].children.push(obj)
          break
        case 2:
          parent = this.categories
            .filter(e => {
              return e.name === items[0]
            })[0]
            .children.filter(e => {
              return e.name === items[1]
            })[0].children
          if (parent.filter(e => e.name === this.newCategoryName).length > 0) {
            this.valid.newCategory.alert = false
            return
          }
          obj = {
            id: `${this.value}/${this.newCategoryName}`,
            name: this.newCategoryName,
            isDisabled: true,
            label: this.newCategoryName,
          }
          this.categories
            .filter(e => e.name === items[0])[0]
            .children.filter(e => e.name === items[1])[0]
            .children.push(obj)
          break
        default:
          break
      }
      this.Promises.push({
        type: 'add',
        origin: this.value,
        name: this.newCategoryName,
        label: this.newCategoryName,
      })
      this.dialogs.addDialog = false
      this.newCategoryName = ''
      this.value = null
    },
    deleteCategory() {
      const items = this.active[0].split('/')
      const level = items.length
      let parent
      let path
      let index
      switch (level) {
        case 1:
          parent = this.categories
          path = this.categories.filter(e => e.name === items[0])[0]
          index = parent.indexOf(path)
          index > -1 && parent.splice(index, 1)
          break
        case 2:
          parent = this.categories.filter(e => e.name === items[0])[0].children
          path = parent.filter(e => e.name === items[1])[0]
          index = parent.indexOf(path)
          index > -1 && parent.splice(index, 1)
          break
        case 3:
          parent = this.categories
            .filter(e => e.name === items[0])[0]
            .children.filter(e => e.name === items[1])[0].children
          path = parent.filter(e => e.name === items[2])[0]
          index = parent.indexOf(path)
          index > -1 && parent.splice(index, 1)
          break
        default:
          break
      }
      this.Promises.push({
        type: 'delete',
        origin: this.active[0],
        name: path.name,
        label: path.label,
      })
      this.dialogs.deleteDialog = false
    },
    saveCategoryChanged() {
      this.$store.dispatch('blogStore/saveCategoryChanged', this.Promises)
    },
    goBlogHome() {
      this.Promises = []
      this.categories = this.categoriesList
      this.$router.push('/blog')
    },
    resetValid() {
      this.valid = {
        changeCategory: {
          alert: true,
          status: true,
          message: '',
        },
        newCategory: {
          alert: true,
          status: true,
          message: '',
        },
      }
    },
  },
}
</script>

<style lang="scss">
.edit-container {
  margin-top: 30px;
}
.tree {
  min-height: 350px !important;
}
.leftView {
  border-right: solid 1px rgba(0, 0, 0, 0.12);

  .add {
    margin: 0px auto;
    text-align: center;
  }
}

.treeselect {
  min-height: 320px !important;
  p {
    font-size: 20px;
    margin-left: 5px;
    color: purple;
  }
  .addField {
    width: 100%;
    height: 100%;
    top: 150px;
    margin: 0 auto;
    position: relative;
  }
}

.dialogText {
  p {
    font-size: 20px;
  }
}

.rightView {
  height: 100%;
  .innerButtons {
    width: 100%;
    height: 100%;
    top: 50%;
    margin: 0 auto;
    position: relative;
    button {
      margin: 5px 4px;
    }
  }
  .categoryText {
    width: 100%;
    margin: auto;

    p {
      font-size: 20px;
      margin-bottom: 35px;
    }
  }
}
</style>
