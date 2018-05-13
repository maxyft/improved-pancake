<template>
  <div class="chart-wrapper">
    <div class="inside-chart-wrapper">
    <div class="chart-history-wrapper">
      <div class="chart">
        <div class="extended-top-frames">
          <div data-frame="5m" @click="changeTimeFrame($event)">5 min</div>
          <div data-frame="1h" @click="changeTimeFrame($event)">1 hour</div>
        </div>
        <div id="chart"></div>
        <div class="candle-info">
          <div class="inside-candle-info">
            <p>Vol:</p>
            <p class="indication">{{ totalVolume }} <small style="color: rgba(255, 255, 255, .65);"></small></p>
          </div>
          <div class="inside-candle-info" style="color: #0bda51">
            <p>Vol.Buy:</p>
            <p class="indication">{{ buyVol ? buyVol : 0 }}<small> </small></p>
          </div>
          <div class="inside-candle-info" style="color: red">
            <p>Vol.Sell:</p>
            <p class="indication">{{ sellVol ? sellVol : 0 }}<small> </small></p>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import $ from 'jquery'

const d3 = require('d3');
const d3fc = require('d3fc');

export default {
  name: 'Chart',
  props: [ 'active' ],
  data() {
    return {
      buyVol: null,
      sellVol: null,
      timeframe: null
    }
  },
  computed: {
    chartInfo() {
      return this.active;
    },
    totalVolume() {
      return (this.buyVol + this.sellVol).toFixed(2);
    }
  },
  watch: {
    chartInfo() {
      this.renderChart(this.chartInfo);
    }
  },
  methods: {
    changeTimeFrame(event) {
      let frame = event.target.dataset.frame;
      this.timeframe = frame;
    },
    showCandleInfo(event) {
      let candlestick = $(event.target).closest('g.candlestick'),
          date = $(candlestick).attr('date'),
          active = this.chartInfo.find(pair => pair.filldate == date);
      this.buyVol = parseFloat(active.volume.buy.toFixed(2)),
      this.sellVol = parseFloat(active.volume.sell.toFixed(2));
    },
    hideCandleInfo() {

    },
    renderChart() {
      $('g.candlestick').off('mouseenter', this.showCandleInfo);
      $('g.candlestick').off('mouseleave', this.hideCandleInfo);
      let newData = [];
      this.chartInfo.forEach((item) => {
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

      $('#chart').find('text').css('fill', 'white');
      $('g.candlestick').on('mouseenter', this.showCandleInfo);
      $('g.candlestick').on('mouseleave', this.hideCandleInfo);
    }
  }
}
</script>

<style scoped lang="less">

@back: #0b090f;
@primary-text: #cfd4d2;
@primary-border: #a1b176;
@primary-border-transparent: rgba(161, 177, 118, .5);
@dark-border: #586c0c;

h2, h3 { margin: 0; }
.chart-wrapper {
  grid-area: chart;
  padding: 10px 0 5px 15px;
  .inside-chart-wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    background: lighten(@back, 3.5%);
    width: 100%;
    height: 100%;
    border-radius: 15px;
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
          & div {
            position: relative;
            width: 75px;
            flex: auto;
            flex-grow: 0;
            color: @primary-text;
            margin-right: 10px;
            border-bottom: 1px solid lighten(@dark-border, 35%);
            cursor: pointer;
          }
        }
      }
      #chart {
        flex: auto;
        position: relative;
        background: @back;
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
          font-size: 1rem;
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
}
</style>
