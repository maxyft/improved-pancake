<template>
<div class="list-wrapper">
  <div class="inside-list-wrapper">
  <div class="wrapper-top"><p>Last changes</p></div>
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
          <div data-text="Current Volume" class="main" @mouseenter="showInfo($event)" @mouseleave="hideInfo()">
            <div class="inside-main--centered" v-if="index === 0">
              {{ ((item.volume.sell + item.volume.buy) / 1000).toFixed(2) || 0 }} k
            </div>
            <div class="inside-main--centered" v-else>
              {{ (item.volume.sell + item.volume.buy).toFixed(2) || 0 }}
            </div>
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
</div>
</template>

<script>
import $ from 'jquery'
import axios from 'axios'

export default {
  name: 'PairList',
  props: ['timeframe'],
  data () {
    return {
      pairs: [],
      pending: [],
      active: null
    }
  },
  watch: {
    timeframe(val) {
      this.frame = val;
    }
  },
  created() {
    this.refreshData();
    setInterval(this.refreshData, 2500);
  },
  methods: {
      refreshData() {
        axios.get('http://localhost:8000/pairs')
          .then((response) => {
            if(!response.data.db && !response.data.pending) return;
            if(response.data.db) this.pairs = response.data.db;
            if(response.data.pending) this.pending = response.data.pending;
          })
          .then(() => {
            if(this.active) {
              let tempArr = this.pairs.filter(item => item.pair === this.active);
              let pending = this.pending.find(item => item.pair === this.active);
              tempArr.unshift(pending);
              this.$emit('updated', tempArr);
            } else return;
          });
      },
      createHourStat() { // rebuild
        let pairs = this.pairs.slice().reverse();
        let namesArr = [];
        let tmpArr = [];
        pairs.forEach(item => {
          if(namesArr.indexOf(item.pair) === -1) {
            namesArr.push(item.pair);
          } else return;
        });
        namesArr.forEach(item => {
          let currentPairs = pairs.filter(p => p.pair === item);
          let closeTime = currentPairs[0].filldate + 3300000; // open + 55 min
          let stat = this.getNewStat();
          let prices = [];
          currentPairs.forEach((item, index) => {
            stat.pair = item.pair;
            prices.push(item.price.high);
            prices.push(item.price.low);

            if(!stat.price.open) stat.price.open = item.price.open;

            if(!stat.filldate) stat.filldate = closeTime;

            if(item.filldate > closeTime) {
              stat.price.close = item.price.close;
              stat.price.last = item.price.last;
              this.hourStat.push(stat);
              prices = [];
              stat = this.getNewStat();
              closeTime = item.filldate + 3300000;
            }

            stat.orders.buy += item.orders.buy;
            stat.orders.sell += item.orders.sell;
            stat.volume.buy += item.volume.buy;
            stat.volume.sell += item.volume.sell;
            stat.price.high = Math.max(...prices);
            stat.price.low = Math.min(...prices);
          });
        });
      },
      getNewStat() {
        return {
          pair: '',
          filldate: 0,
          price: { open: 0, close: 0, last: 0, high: 0, low: 0 },
          orders: { buy: 0, sell: 0 },
          volume: { buy: 0, sell: 0 }
        };
      },
      setActive(pair, event) {
        if(this.active === pair) return;

        let target = $(event.target);
        if($(target).hasClass('p') || $(target).hasClass('v')) return;

        let active = $(target).closest('.pair-wrapper').find('.pair.active');
        $(active).each((index, item) => { $(item).removeClass('active') });
        $(target).closest('.pair').toggleClass('active');

        this.active = pair;
        let tempArr = this.pairs.filter(item => item.pair === this.active);
        let pending = this.pending.find(item => item.pair === this.active);
        tempArr.unshift(pending);
        this.$emit('updated', tempArr);
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
  @back: #0b090f;
  @primary-text: #cfd4d2;
  @primary-border: #a1b176;
  @primary-border-transparent: rgba(161, 177, 118, .5);
  @dark-border: #586c0c;

  .list-wrapper {
    grid-area: list;
    padding: 10px 5px 10px 15px;
    overflow: hidden;
    .inside-list-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border-radius: 20px;
    }
  }
  .wrapper-top {
    height: 45px;
    line-height: 45px;
    flex-grow: 0;
    background: lighten(@back, 3.5%);
    p {
      display: inline-block;
      position: relative;
      margin: 0;
      color: lighten(@primary-text, 10%);
      font-size: 1.2rem;
      &::after {
        content: '';
        position: absolute;
        bottom: 10px;
        left: 0;
        width: 100%;
        height: 1px;
        background: lighten(@dark-border, 30%);
      }
    }
  }
  .pair-wrapper {
    &::-webkit-scrollbar { width: 0; }
    flex: auto;
    background: @back;
    overflow-y: scroll;
    border-left: 1px solid @primary-border;
  }
  .help-wrapper {
    flex-grow: 0;
    display: table;
    width: 100%;
    height: 50px;
    background: lighten(@back, 3.5%);;
    #help-info {
      color: white;
      display: table-cell;
      vertical-align: middle;
    }
  }
  .pair {
    height: 45px;
    border-bottom: 1px solid @primary-border-transparent;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    align-items: center;
    &.active { background: #424242 }
    &:hover { background: #424242; }
  }
  .pair-desc {
    flex: 1;
    text-align: center;
    color: @primary-text;
    &.name {
      text-align: left;
      padding-left: 10px;
      font-weight: 400;
      font-size: 0.8rem;
      color: rgba(255, 255, 255, .65);
      b { font-size: 0.95rem; font-weight: 500; color: white;}
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
        font-size: 0.85rem;
      }
      .alter {
        color: rgba(255, 255, 255, 0.75);
        font-size: 0.75rem;
        height: 30%;
      }
    }
    &.volume {
      display: flex;
      flex-direction: row;
      align-items: center;
      word-break: keep-all;
      .main {
        flex: auto;
        font-size: 0.9rem;
        display: table;
        .inside-main--centered {
          display: table-cell;
          vertical-align: middle;
        }
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
          font-size: 0.7rem;
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
      max-width: 75px;
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
    font-size: 0.85rem;
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
