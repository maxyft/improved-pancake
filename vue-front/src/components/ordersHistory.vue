<template>
  <div class="orders-wrapper">
    <div class="new-orders-wrapper">
      <div class="orders-top">Create Order</div>
      <div class="order-create">
        <div class="unselected"> << Select Pair >> </div>
      </div>
    </div>
    <div class="history-wrapper">
      <div class="orders-top">Orders</div>
      <div class="table-wrapper">
        <table class="orders-table">
          <thead>
            <th>Pair</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Sum</th>
            <th>Date</th>
            <th>State</th>
          </thead>
          <tbody>
            <tr>
              <td>ETH-BTC</td>
              <td>0.00005478</td>
              <td>500</td>
              <td>150$</td>
              <td>06.04.2018 20:18</td>
              <td>Opened</td>
            </tr>
            <tr>
              <td>ETH-BTC</td>
              <td>0.00005478</td>
              <td>500</td>
              <td>150$</td>
              <td>06.04.2018 20:18</td>
              <td>Opened</td>
            </tr>
            <tr>
              <td>ETH-BTC</td>
              <td>0.00005478</td>
              <td>500</td>
              <td>150$</td>
              <td>06.04.2018 20:18</td>
              <td>Opened</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ordersHistory',
    data() {
      return {

      }
    }
}
</script>
<style lang='less' scoped>
@textNavs: #a4d5e0;
@navsDark: #424242;
.orders-wrapper {
  flex: auto;
  flex-grow: 0;
  display: flex;
  flex-direction: column;
  height: 35%;
}
.new-orders-wrapper {
  flex: auto;
  flex-grow: 0;
  height: 35%;
  background: #303030;
  display: flex;
  flex-direction: column;
  .orders-top {
    flex: auto;
    flex-grow: 0;
    height: 30px;
    background: @navsDark;
    color: @textNavs;
    font-size: 19px;
    line-height: 30px;
  }
  .order-create {
    display: table;
    width: 100%;
    height: calc(100% - 30px);
  }
}
.history-wrapper {
  flex: auto;
  background: #303030;
  .orders-top {
    flex: auto;
    flex-grow: 0;
    height: 30px;
    background: @navsDark;
    color: @textNavs;
    font-size: 19px;
    line-height: 30px;
  }
}
.table-wrapper {
  overflow-y: auto;
  .orders-table {
    width: 100%;
    border-collapse: collapse;
    thead {
      th {
        background: #707070;
        color: white;
        font-weight: 500;
      }
    }
    tbody {
      width: 100%;
      tr {
        width: 100%;
        height: 25px;
        border-bottom: 1px solid #707070;
        color: @textNavs;
      }
      tr:hover {
        background: @navsDark;
      }
    }
  }
}
.unselected {
  display: table-cell;
  vertical-align: middle;
  color: white;
  border-top: 1px solid rgba(255, 255, 255, .35);
  border-bottom: 1px solid rgba(255, 255, 255, .35);
}
</style>
