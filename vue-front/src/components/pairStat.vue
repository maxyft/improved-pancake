<template>
<div class="wrapper">
  <div class="wrapper-top"><p>Last 5-min changes</p></div>
    <div class="pair-wrapper">
      <div v-for="(item, index) in pending" class="pair" @click="setActive(item.pair, $event)">
        <div class="pair-desc name" v-if="index === 0"><b>BTC</b> / USDT</div>
        <div class="pair-desc name" v-else>
          <b>{{ item.pair.substring(0, item.pair.indexOf('BTC')) }}</b>
           / {{ item.pair.substring(item.pair.indexOf('BTC')) }}
        </div>
        <div class="pair-desc price">
          <div class="main">{{ item.price.last || 0}}</div>
          <div class="alter" v-if="index > 0">
            {{ item.price.last ? (item.price.last * pending[0].price.last).toFixed(2) : 0 }}$
          </div>
        </div>
        <div class="pair-desc volume">
          <div data-text="Volume Indicator (Click to show previous indications)" class="main" @mouseenter="showInfo($event)" @mouseleave="hideInfo()">
            {{ (item.volume.sell + item.volume.buy).toFixed(2) || 0 }}
          </div>
          <div class="sep" v-if="index > 0">
            <div><p>{{ item.volume.buy.toFixed(2) }}</p></div>
            <div><p>{{ item.volume.sell.toFixed(2) }}</p></div>
          </div>
        </div>
        <div class="pair-desc orders">
          <div class="order-div">
            <p @mouseenter="showInfo($event)" @mouseleave="hideInfo()" data-text="Buy Orders Count">{{ item.orders.buy }}</p>
          </div>
          <div class="order-div">
            <p @mouseenter="showInfo($event)" @mouseleave="hideInfo()" data-text="Sell Orders Count">{{ item.orders.sell }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="help-wrapper">
      <div id="help-info"></div>
    </div>
</div>
</template>

<script>
import $ from 'jquery'
import axios from 'axios'

export default {
  name: 'pairStat',
  data () {
    return {
      pairs: [],
      pending: [],
      active: 'BTCUSDT',
      lastTimeStamp: null,
      selectedPairInfo: [],
      timers: []
    }
  },
  created() {
    this.refreshData();
    let i = setInterval(this.refreshData, 2500);
    this.timers.push(i);
  },
  beforeDestroy() {
    clearInterval(this.timers.pop());
  },
  methods: {
      refreshData() {
        axios.get('http://localhost:8000/pairs')
          .then((response) => {
            if(!response.data.db && !response.data.pending) return;

            if(response.data.db) this.pairs = response.data.db;
            if(response.data.pending) this.pending = response.data.pending;

            if(!this.active) return;

            let selectedPending = this.pending.find(item => item.pair === this.active);
            if(!this.lastTimeStamp || this.lastTimeStamp != selectedPending.filldate || this.active != this.selectedPairInfo[0].pair) {
              this.lastTimeStamp = selectedPending.filldate;
              let tempArr = [];
              this.pairs.forEach(item => {
                if(item.pair === this.active) tempArr.push(item);
              });
              tempArr.unshift(selectedPending);
              this.selectedPairInfo = tempArr;
            }
            this.selectedPairInfo.shift() // delete old pending item
            this.selectedPairInfo.unshift(selectedPending) // add new pending item
            this.$emit('updated', this.selectedPairInfo);
          })
      },
      setActive(pair, event) {
        if(this.active === pair) return;

        let target = $(event.target);
        if($(target).hasClass('p') || $(target).hasClass('v')) return;

        let active = $(target).closest('.pair-wrapper').find('.pair.active');
        $(active).each((index, item) => { $(item).removeClass('active') });
        $(target).closest('.pair').toggleClass('active');

        this.active = pair;
        let pairInfo = [];
        this.pairs.forEach(item => {
          if(item.pair === pair) pairInfo.push(item);
        });
        let pendingItem = this.pending.find(pending => pending.pair === pair);
        pairInfo.unshift(pendingItem);
        this.$emit('selected', pairInfo);
      },
      showInfo(event) {
        $('#help-info').html(event.target.dataset.text);
      },
      hideInfo() {
        $('#help-info').html('');
      }
  }
}
</script>

<style lang="less" scoped>
  @small-text: 14px;
  @medium-text: 16px;
  @large-text: 18px;
  .wrapper {
    flex: auto;
    flex-grow: 0;
    width: 30%;
    display: flex;
    flex-direction: column;
    border-left: 5px double rgba(255, 255, 255, 0.5);
  }
  .wrapper-top {
    height: 40px;
    line-height: 40px;
    flex: auto;
    flex-grow: 0;
    background: #303030;
    border-bottom: 1px solid rgba(255,255,255, .35);
    p {
      margin: 0;
      color: #a4d5e0;
      font-size: @large-text;
      font-weight: 500;
    }
  }
  .pair-wrapper {
    &::-webkit-scrollbar { width: 0; }
    flex: auto;
    overflow-y: scroll;
    overflow-x: hidden;
    background: #303030;
    -ms-overflow-style: none;
  }
  .help-wrapper {
    display: table;
    width: 100%;
    height: 50px;
    background: #303030;
    border-top: 1px solid rgba(255, 255, 255, 0.3);
    #help-info {
      color: white;
      display: table-cell;
      vertical-align: middle;
    }
  }
  .pair {
    position: relative;
    width: 100%;
    margin: auto;
    height: 45px;
    border-bottom: 1px solid rgba(255, 255, 255, .05);
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    align-items: center;
    &.active { background: #424242 }
    &:hover { background: #424242; }
  }
  .pair-desc {
    flex: 1;
    position: relative;
    text-align: center;
    font-size: 16px;
    color: white;
    &.name {
      max-width: 150px;
      text-align: left;
      padding-left: 10px;
      font-weight: 400;
      font-size: @small-text;
      color: rgba(255, 255, 255, .65);
      b {font-size: @small-text + 2px; font-weight: 500; color: white;}
    }
    &.price {
      display: flex;
      flex-direction: column;
      max-width: 185px;
      text-align: left;
      padding-left: 10px;
      padding-right: 10px;
      .main {
        flex: auto;
        font-size: @medium-text / 1.1;
      }
      .alter {
        color: rgba(255, 255, 255, 0.75);
        font-size: @small-text / 1.25;
        height: 30%;
      }
    }
    &.volume {
      display: flex;
      flex-direction: row;
      align-items: center;
      .main {
        flex: auto;
        flex-grow: 0;
        font-size: @medium-text / 1.1
      }
      .sep {
        flex: auto;
        display: flex;
        flex-direction: column;
        padding-left: 5px;
        div:first-child { color: #0bda51 }
        div {
          display: table;
          color: red;
          font-size: @small-text / 1.15;
          flex: auto;
          p {
            display: table-cell;
            vertical-align: middle;
          }
        }
      }
    }
    &.orders {
      display: flex;
      flex-wrap: nowrap;
      flex-direction: column;
      max-width: 100px;
      border-left: 1px solid rgba(255, 255, 255, .075);
    }
  }
  .top {
    font-weight: 500;
    font-size: 18px;
    color: #a4d5e0;
  }
  .order-div:first-child { color: #0bda51 }
  .order-div {
    color: red;
    flex: 1;
    position: relative;
    text-align: center;
    font-size: @small-text;
    p {
      position: relative;
      display: inline;
    }
  }
  .pair-desc > p {
    position: relative;
    display: inline;
    cursor: pointer;
  }
</style>
