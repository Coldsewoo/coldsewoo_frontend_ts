<template>
  <v-container text-xs-center>
    <v-layout align-center>
      <v-flex d-flex xs12>
        <v-item-group v-model="window" class="shrink mr-4" mandatory tag="v-flex">
          <div class="btn-group">
            <v-btn fab flat @click="changeWindow(-1)">
              <v-icon>keyboard_arrow_up</v-icon>
            </v-btn>
            <v-item v-for="n in itemsLength" :key="n">
              <div slot-scope="{ active, toggle }">
                <v-btn :input-value="active" class="btn-item" small icon @click="toggle" />
              </div>
            </v-item>
            <v-btn fab flat @click="changeWindow(1)">
              <v-icon>keyboard_arrow_down</v-icon>
            </v-btn>
          </div>
        </v-item-group>
        <v-window v-model="window" class="elevation-1 text-xs-center" vertical>
          <v-window-item v-for="(item, index) in items" :key="index">
            <v-card class="pa-2">
              <v-img :src="item.img" aspect-ratio="2.5" max-width="400" />
              <v-divider />
              <v-card-title primary-title>
                <h2 class="text-xs-center headline mb-4">{{ item.title }}</h2>
              </v-card-title>
              <v-card-text>
                <p>{{ item.content }}</p>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn :to="item.src" flat class="primary">Explore</v-btn>
                <v-btn
                  v-if="item.repo"
                  :href="item.repo"
                  flat
                  class="grey darken-4"
                  color="white"
                  target="_blank"
                >Github</v-btn>
              </v-card-actions>
            </v-card>
          </v-window-item>
        </v-window>
      </v-flex>
    </v-layout>
    <!-- <v-layout row wrap>
      <v-flex xs12 md4>
        <v-card>
          <v-img
            src="https://res.cloudinary.com/coldsewoo/image/upload/v1559532126/Assets/image_dlca9b.png"
            aspect-ratio="2.5"
          ></v-img>
          <v-divider></v-divider>
          <v-card-title primary-title>
            <div>
              <h2 class="headline mb-4">Vuestagram</h2>
              <div>
                Vuestagram clone with backend
              </div>
            </div>
          </v-card-title>

          <v-card-actions>
            <v-btn flat color="orange" to="/vuestagram">Explore</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 md4>
        <v-card>
          <v-img
            src="https://res.cloudinary.com/coldsewoo/image/upload/v1559616359/Assets/nick-morrison-325805-unsplash_nh1g6h.jpg"
            aspect-ratio="2.5"
          ></v-img>
          <v-divider></v-divider>
          <v-card-title primary-title>
            <div>
              <h2 class="headline mb-4">Blog</h2>
              <div>
                Blog with backend
              </div>
            </div>
          </v-card-title>

          <v-card-actions>
            <v-btn flat color="orange" to="/blog/home">Explore</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 md4>
        <v-card>
          <v-img
            src="https://res.cloudinary.com/coldsewoo/image/upload/c_scale,w_857/v1559616649/Assets/markus-spiske-1615805-unsplash_jikekj.jpg"
            aspect-ratio="2.5"
          ></v-img>
          <v-divider></v-divider>
          <v-card-title primary-title>
            <div>
              <h2 class="headline mb-4">Currency</h2>
              <div>
                Simple Currency exchanger
              </div>
            </div>
          </v-card-title>

          <v-card-actions>
            <v-btn flat color="orange" to="/currency">Explore</v-btn>
            <v-btn
              flat
              color="black"
              target="_blank"
              href="https://github.com/Coldsewoo/currency_exchanger"
              >Github</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 md4>
        <v-card dark color="purple">
          <v-card-text>text</v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 md4>
        <v-card dark color="purple">
          <v-card-text>text</v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 md4>
        <v-card dark color="purple">
          <v-card-text>text</v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 md4>
        <v-card dark color="purple">
          <v-card-text>text</v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 md4>
        <v-card dark color="purple">
          <v-card-text>text</v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 md4>
        <v-card dark color="purple">
          <v-card-text>text</v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 md4>
        <v-card dark color="purple">
          <v-card-text>text</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>-->
  </v-container>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      window: 0,
      items: [
        {
          title: 'Vuestagram',
          content: 'VuestaGram clone with backend',
          img:
            'https://res.cloudinary.com/coldsewoo/image/upload/v1559532126/Assets/image_dlca9b.png',
          src: '/vuestagram',
        },
        {
          title: 'Blog',
          content: 'Blog with backend',
          img:
            'https://res.cloudinary.com/coldsewoo/image/upload/v1559616359/Assets/nick-morrison-325805-unsplash_nh1g6h.jpg',
          src: '/blog/home',
        },
        {
          title: 'Currency Exchanger',
          content: 'Simple Currency exchanger',
          img:
            'https://res.cloudinary.com/coldsewoo/image/upload/c_scale,w_857/v1559616649/Assets/markus-spiske-1615805-unsplash_jikekj.jpg',
          src: '/currency',
          repo: 'https://github.com/Coldsewoo/currency_exchanger',
        },
      ],
    };
  },
  computed: {
    itemsLength() {
      return this.items.length;
    },
  },
  methods: {
    changeWindow(num) {
      this.window += num;
      if (this.window < 0) this.window += this.length;
      else if (this.window >= this.length) this.window -= this.length;
    },
  },
};
</script>

<style lang="scss" scoped>
  .v-item-group {
    display: flex;
    position: absolute;
    align-items: center;
    z-index: 1;
    top: 25%;
    opacity: 0.5;

    button {
      max-width: 30px !important;
      max-height: 30px !important;
    }
    .btn-group {
      .btn-item {
        color: #e1bee7;
        background-color: #e1bee7;
      }
      .v-item--active button {
        opacity: 1;
        color: #ab47bc !important;
        background-color: #ab47bc !important;
      }
    }
  }

  .v-window {
    margin-top: 10px;
    height: 80vh !important;
    background-color: white;
    .v-window__container {
      height: 80vh !important;
      .v-window-item {
        height: 80vh !important;
        padding-left: 50px !important;
        overflow-y: scroll;
        display: flex;
        align-items: center;
        .v-card {
          height: 80vh !important;
          width: 100%;
          border: solid 1px purple;
          .v-image {
            margin: 0 auto;
          }
        }
      }
    }
  }
</style>
