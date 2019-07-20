<template>
  <v-container grid-list-xl class="container">
    <v-layout row wrap xs12 md10 offset-md-1 align-center>
      <v-flex md5 pa-3 class="inner">
        <h3 class="headline">I have :</h3>
        <v-select
          v-model="originName"
          :items="currencyCode"
          label="Select"
          item-text="name"
          item-value="name"
          @change="getRate"
        >
          <template slot="selection" slot-scope="data">
            {{ data.item.name.split("/")[0] }}
            <v-spacer />
            <v-spacer />
            <v-spacer />
            <v-spacer />
            <v-spacer />
            <v-spacer />
            <v-spacer />
            {{ data.item.name.split("/")[1] }}
          </template>
        </v-select>
        <div class="amount">
          <v-text-field
            v-if="visible"
            v-model="currencyInput"
            :rules="inputRule"
            color="purple"
            label="ORIGINAL AMOUNT"
            height="100"
            @input="getRate"
            @blur="onBlurNumberInput"
          />
          <v-text-field
            v-if="!visible"
            v-model="currencyInput"
            :rules="inputRule"
            color="purple"
            label="ORIGINAL AMOUNT"
            height="100"
            @input="getRate"
            @focus="onFocusTextInput"
          />
        </div>
      </v-flex>
      <v-flex md2 class="text-xs-center pa-1">
        <v-btn fab large flat class="secondary" @click="swap">
          <v-icon>swap_horiz</v-icon>
        </v-btn>
      </v-flex>
      <v-flex md5 pa-3 class="inner">
        <h3 class="headline">I want :</h3>
        <v-select
          v-model="targetName"
          :items="currencyCode"
          label="Select"
          item-text="name"
          item-value="name"
          @change="getRate"
        >
          <template slot="selection" slot-scope="data">
            {{ data.item.name.split("/")[0] }}
            <v-spacer />
            <v-spacer />
            <v-spacer />
            <v-spacer />
            <v-spacer />
            <v-spacer />
            <v-spacer />
            {{ data.item.name.split("/")[1] }}
          </template>
        </v-select>
        <div class="amount">
          <v-text-field
            v-model="targetValueComma"
            label="TARGET AMOUNT"
            readonly
            color="purple"
            height="100"
          />
        </div>
      </v-flex>
      <v-flex>
        <div>
          <img
            src="https://res.cloudinary.com/coldsewoo/image/upload/v1559570449/Assets/GitHubMark_l5zaau.png"
          />

          <a
            target="_blank"
            href="https://github.com/Coldsewoo/currency_exchanger"
          >Link to Github repo</a>
        </div>
      </v-flex>

      <v-divider />
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios';
import API_URL from '@/lib/globalVar';
import currencyCode from '../assets/currCode.js';

Number.prototype.getComma = function () {
  let number = this.valueOf().toString();
  if (
    number !== '' ||
    number !== undefined ||
    number !== 0 ||
    number !== '0' ||
    number !== null
  ) {
    if (number.includes('.')) number = number.split('.');
    if (typeof number === 'string') { return number.replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
    return `${number[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${number[1]}`;
  } return number;
};

String.prototype.getValue = function () {
  return Number(this.valueOf().replace(/,/g, ''));
};

export default {
  components: {},
  data() {
    return {
      currencyInput: 1,
      originName: 'US Dollar/USD',
      targetName: 'Korean Won/KRW',
      targetValue: 0,
      inputRule: [
        v =>
          !!Number(v.toString().replace(/,/g, '')) ||
          'Input must be only Numbers!',
      ],
      visible: true,
      temp: null,
      tempTarget: null,
    };
  },
  computed: {
    currencyCode() {
      return currencyCode;
    },
    targetValueComma() {
      if (isNaN(this.targetValue)) return 0;
      return Number.prototype.getComma.call(this.targetValue);
    },
  },
  mounted() {
    this.getRate();
  },
  methods: {
    swap() {
      const temp = this.originName;
      this.originName = this.targetName;
      this.targetName = temp;

      const valueTemp = this.currencyInput;
      this.currencyInput = this.targetValue;
      this.targetValue = valueTemp;
      this.getRate();
    },
    async getRate() {
      let originCode;
      let targetCode
      for (const index in this.currencyCode) {
        if (Object.prototype.hasOwnProperty.call(this.currencyCode, index)) {
          if (!this.currencyCode[index].name) continue;
          if (this.currencyCode[index].name === this.originName) { originCode = this.currencyCode[index].code; }
          if (this.currencyCode[index].name === this.targetName) { targetCode = this.currencyCode[index].code; }
        }
      }
      try {
        const res = await axios({
          url: `${API_URL}/currency/${originCode}`,
          method: 'GET',
        });
        const rates = res.data.data.rates;
        const result =
          rates[targetCode] *
          Number(this.currencyInput.toString().replace(/,/g, ''));
        this.targetValue = result.toFixed(2);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    },
    onBlurNumberInput(e) {
      this.visible = false;
      this.temp = this.currencyInput;
      this.currencyInput = Number.prototype.getComma.call(this.currencyInput);
    },
    onFocusTextInput() {
      this.visible = true;
      this.currencyInput = String.prototype.getValue.call(this.currencyInput);
    },
  },
};
</script>

<style scoped>
  .container {
    margin-top: 150px;
    border: solid 1px purple;
    background-color: rgb(230, 230, 230);
  }

  .tit {
    margin-top: 30px;
  }
  .inner {
    background-color: white;
    border: solid 1px rgba(101, 0, 101, 0.454);
  }

  .amount >>> .v-text-field__slot input {
    color: purple;
    font-size: 30px;
    margin-top: 10px;
    margin-bottom: 5px;
    text-align: right;
    margin-right: 30px;
    z-index: 2;
    padding: 0;
  }

  a {
    text-decoration: none;
    color: purple;
    font-size: 15px;
  }
</style>
