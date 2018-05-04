<template>
  <div class="wrapper">
    <div class="chart-history-wrapper">
      <div class="chart">
        <div class="extended-top-frames">
          <div>5 min</div>
          <div>1 hour</div>
        </div>
        <div id="chart"></div>
        <div class="candle-info">
          <div class="inside-candle-info">
            <p>Vol:</p>
            <p class="indication">{{ totalVol ? totalVol : 0 }}<small style="color: rgba(255, 255, 255, .65);">&nbsp;{{ tradePair }}</small></p>
          </div>
          <div class="inside-candle-info" style="color: #0bda51">
            <p>Vol.Buy:</p>
            <p class="indication">{{ buyVol ? buyVol : 0 }}<small>{{ !isNaN(buyPercent) ? `(${buyPercent}%)` : '' }}</small></p>
          </div>
          <div class="inside-candle-info" style="color: red">
            <p>Vol.Sell:</p>
            <p class="indication">{{ sellVol ? sellVol : 0 }}<small>{{ !isNaN(sellPercent) ? `(${sellPercent}%)` : '' }}</small></p>
          </div>
        </div>
      </div>
      <ordersHistory></ordersHistory>
    </div>
    <pairStat @selected="renderChart($event)" @updated="renderChart($event)"></pairStat>
  </div>
</template>

<script>
import $ from 'jquery'
import axios from 'axios'

import pairStat from './pairStat'
import ordersHistory from './ordersHistory'

const d3 = require('d3');
const d3fc = require('d3fc');

export default {
  name: 'extendedStat',
  components: {
    pairStat: pairStat,
    ordersHistory: ordersHistory
  },
  data() {
    return {
      activePair: [],
      buyVol: null,
      sellVol: null
    }
  },
  computed: {
    totalVol() {
      return (this.buyVol + this.sellVol).toFixed(2);
    },
    buyPercent() {
      return (this.buyVol / this.totalVol * 100).toFixed(2);
    },
    sellPercent() {
      return (this.sellVol / this.totalVol * 100).toFixed(2);
    },
    tradePair() {
      let active = '';
      this.activePair.length ? active = this.activePair[0].pair : active = '';
      if(active && active.indexOf('USDT') != -1) return 'USDT';
      else return 'BTC';
    }
  },
  methods: {
    showCandleInfo(event) {
      let candlestick = $(event.target).closest('g.candlestick'),
          date = $(candlestick).attr('date'),
          active = this.activePair.find(pair => pair.filldate == date);
      this.buyVol = parseFloat(active.volume.buy.toFixed(2)),
      this.sellVol = parseFloat(active.volume.sell.toFixed(2));
    },
    hideCandleInfo() {

    },
    renderChart(event) { // event - payload [] from pairStat
      this.activePair = event;
      $('g.candlestick').off('mouseenter', this.showCandleInfo);
      $('g.candlestick').off('mouseleave', this.hideCandleInfo);
      let newData = [];
      this.activePair.forEach((item) => {
        let obj = {
          high: item.price.high,
          low: item.price.low,
          open: item.price.open,
          close: item.price.close,
          date: new Date(item.filldate),
          volume: item.volume.sell + item.volume.buy
        };
        newData.push(obj);
      });
      var yExtent = d3fc.extentLinear()
        .accessors([
          function(d) { return d.high; },
          function(d) { return d.low; }
        ]);

      var xExtent = d3fc.extentDate()
        .accessors([function(d) { return new Date(d.date); }]);

      var gridlines = d3fc.annotationSvgGridline();
      var candlestick = d3fc.seriesSvgCandlestick();
      var multi = d3fc.seriesSvgMulti()
          .series([gridlines, candlestick]);

      var chart = d3fc.chartSvgCartesian(
          d3fc.scaleDiscontinuous(d3.scaleTime()),
          d3.scaleLinear()
        )
        .yDomain(yExtent(newData))
        .xDomain(xExtent(newData))
        .plotArea(multi);

      d3.select('#chart')
        .datum(newData)
        .call(chart);
      $('g.candlestick').on('mouseenter', this.showCandleInfo);
      $('g.candlestick').on('mouseleave', this.hideCandleInfo);
    }
  }
}
</script>

<style scoped lang="less">
h2, h3 { margin: 0; }
.wrapper {
  flex: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  background: #303030;
  .chart-history-wrapper {
    flex: auto;
    display: flex;
    flex-direction: column;
    .chart {
      flex: auto;
      display: flex;
      flex-direction: column;
      .extended-top-frames {
        flex: auto;
        flex-grow: 0;
        display: flex;
        flex-direction: row;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid rgba(255,255,255, .35);
        & div {
          position: relative;
          width: 100px;
          flex: auto;
          flex-grow: 0;
          color: #38B2CE;
          margin-right: 10px;
          border-bottom: 1px solid #38B2CE;
        }
      }
    }
    #chart {
      flex: auto;
      position: relative;
      background: white;
    }
    .candle-info {
      display: flex;
      flex-direction: row;
      text-align: left;
      padding-left: 15px;
      flex: auto;
      flex-grow: 0;
      position: relative;
      height: 30px;
      line-height: 30px;
      border-top: #a4d5e0;
      border-bottom: #a4d5e0;
      color: #a4d5e0;
      .inside-candle-info {
        flex: auto;
        text-align: left;
        color: white;
        font-size: 15px;
        p {
          &.indication { padding-left: 10px; }
          margin: 0;
          position: relative;
          float: left;
          text-align: left;
          letter-spacing: 1.2px;
        }
      }
    }
  }
}
</style>
