<template>
  <v-container>
    <div class="title-container">
      <p class="title">QR Code Generator</p>
    </div>
    <v-card>
      <v-layout row wrap px-4 class="qr-container" justify-space-between>
        <v-flex xs12 sm7 pa-3 class="input-container">
          <v-flex xs12 class="input-title">
            <v-layout row wrap>
              <v-flex xs12>
                <v-btn-toggle v-model="btnToggled" class="transparent">
                  <v-btn
                    flat
                    small
                    v-for="btn in btnArr"
                    :key="btn.name"
                    :value="btn.name"
                  >
                    <v-icon>{{ btn.icon }}</v-icon>
                    {{ btn.name }}
                  </v-btn>
                </v-btn-toggle>
                <div class="divider"></div>
              </v-flex>
            </v-layout>
          </v-flex>

          <v-flex d-flex xs12 class="input-field">
            <v-textarea
              no-resize
              v-model="qrcodeString"
              @input="generateQRCode"
              :placeholder="placeholderMessage"
              class="pa-2"
              rows="8"
            />
          </v-flex>

          <v-flex xs12 class="color-selector">
            <v-menu :close-on-content-click="false" offset-y>
              <template v-slot:activator="{ on }">
                <v-btn small color="white" v-on="on">
                  <v-icon color="darken-1">colorize</v-icon>
                  <span class="color-text">Color</span>
                </v-btn>
              </template>
              <v-list>
                <v-card max-width="450">
                  <chrome-picker
                    v-model="color"
                    class="color-picker"
                    @input="generateQRCode"
                  />
                </v-card>
              </v-list>
            </v-menu>
          </v-flex>
        </v-flex>
        <v-flex xs12 sm1 class="arrow" text-xs-center>
          <v-icon flat large color="purple">{{ arrowIcon }}</v-icon>
        </v-flex>
        <v-flex xs12 sm4 class="result-container">
          <v-layout row wrap>
            <v-flex xs12 class="result-canvas-wrapper">
              <canvas
                ref="canvas"
                width="160"
                height="160"
                :style="{ border: borderStyle }"
              />
            </v-flex>
            <v-flex xs12 class="result-button-wrapper">
              <v-btn @click="savePNG" round color="primary darken-1" small
                ><v-icon>save</v-icon><span>PNG</span></v-btn
              >
              <v-btn @click="saveSVG" round color="secondary darken-3" small
                ><v-icon>save</v-icon><span>SVG</span></v-btn
              >
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card>
    <div>
      <a ref="png" class="png" v-show="false" />
      <a ref="svg" class="svg" v-show="false" />
    </div>
  </v-container>
</template>

<script>
import QRCode from 'qrcode'
import { Sketch } from 'vue-color'

export default {
  components: {
    chromePicker: Sketch,
  },
  data() {
    return {
      qrcodeImg: '',
      qrcodeString: '',
      btnArr: [
        {
          icon: 'post_add',
          name: 'URL',
          message:
            'Enter your website \n(QR Code will be generated automatically)',
        },
        {
          icon: 'text_format',
          name: 'TEXT',
          message:
            'Enter your text \n(QR Code will be generated automatically)',
        },
      ],
      btnToggled: '',
      placeholderMessage: '',
      color: {
        hex: '#9575CD',
        rgba: {
          r: 149,
          g: 117,
          b: 205,
          a: 1,
        },
      },
    }
  },
  mounted() {
    this.btnToggled = 'URL'
    this.placeholderMessage =
      'Enter your website \n(QR Code will be generated automatically)'
    QRCode.toCanvas(
      this.$refs.canvas,
      'https://coldsewoo.com',
      {
        errorCorrectionLevel: 'M',
        color: {
          dark: this.color.hex,
          light: '#0000',
        },
        width: 160,
        height: 160,
      },
      error => {}
    )
  },
  watch: {
    btnToggled(curr) {
      const self = this
      switch (curr) {
        case 'URL':
          self.placeholderMessage =
            'Enter your website \n(QR Code will be generated automatically)'
          break
        case 'TEXT':
          self.placeholderMessage =
            'Enter your text \n(QR Code will be generated automatically)'
          break
        default:
          self.placeholderMessage =
            'Enter your website \n(QR Code will be generated automatically)'
      }
    },
  },
  computed: {
    arrowIcon() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 'keyboard_arrow_down'
        default:
          return 'arrow_forward_ios'
      }
    },
    borderStyle() {
      const { r, g, b, a } = this.color.rgba
      return `solid 1px rgba(${r},${g},${b},0.3)`
    },
  },
  methods: {
    generateQRCode() {
      const str = this.qrcodeString || 'https://coldsewoo.com'
      const self = this
      QRCode.toCanvas(
        self.$refs.canvas,
        str,
        {
          errorCorrectionLevel: 'M',
          color: {
            dark: self.color.hex,
            light: '#0000',
          },
          width: 174,
          height: 174,
        },
        error => {
          if (error) console.error(error)
        }
      )
    },
    savePNG() {
      const str = this.qrcodeString || 'https://coldsewoo.com'
      const self = this
      QRCode.toDataURL(
        str,
        {
          type: 'image/png',
          color: {
            dark: self.color.hex,
            light: '#0000',
          },
          width: 174,
          height: 174,
        },
        (error, string) => {
          if (error) return
          const link = self.$refs.png
          link.addEventListener(
            'click',
            e => {
              link.href = string
              link.download = 'QRCode.png'
            },
            false
          )
          link.click()
        }
      )
    },
    saveSVG() {
      const str = this.qrcodeString || 'https://coldsewoo.com'
      const self = this
      QRCode.toString(
        str,
        {
          type: 'svg',
          color: {
            dark: self.color.hex,
            light: '#0000',
          },
          width: 174,
          height: 174,
        },
        (error, string) => {
          if (error) return
          const stringEncoded = encodeURIComponent(string)
          const url = `data:image/svg+xml;charset=utf-8,${stringEncoded}`
          const link = self.$refs.svg
          link.addEventListener(
            'click',
            e => {
              link.href = url
              link.download = 'QRCode.svg'
            },
            false
          )
          link.click()
        }
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.title-container {
  display: flex;
  justify-content: center;
  margin-bottom: 35px;

  .title {
    font-size: 2rem !important;
    display: inline;
  }
}

.divider {
  margin: 15px 18px 15px 5px;
  border: solid 1px rgba(0, 0, 0, 0.3);
}

.transparent {
  border: none;
}

.qr-container {
  padding: 10px;

  .input-container {
    border: solid 2px black;
    border-radius: 6px;
    display: grid;
    grid-template-rows: repeat(5, 1fr);

    .input-title {
      grid-row-start: 1;
      grid-row-end: 2;
      display: flex;
      align-items: center;
    }

    .input-field {
      grid-row-start: 2;
      grid-row-end: 5;
    }
    .color-selector {
      grid-row-start: 5;
      grid-row-end: 6;

      span {
        margin-left: 2px;
      }
    }
  }

  .result-container {
    border: solid 2px black;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;

    .result-canvas-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 180px;
    }

    .result-button-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 15px;
      span {
        margin-left: 5px;
      }
    }
  }

  .arrow {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
