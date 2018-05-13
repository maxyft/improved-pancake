<template>
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
</template>

<script>
export default {
  name: 'OrderList'
}
</script>

<style lang="less" scoped>

@back: #0b090f;
@primary-text: #cfd4d2;
@primary-border-transparent: rgba(161, 177, 118, .2);

.history-wrapper {
  background: @back;
  .orders-top {
    height: 30px;
    background: @back;
    color: @primary-text;
    font-size: 1.1rem;
    line-height: 30px;
  }
  .table-wrapper {
    .orders-table {
      width: 100%;
      border-collapse: collapse;
      thead {
        th {
          background: lighten(@back, 2.5%);
          color: white;
          font-weight: 500;
          font-size: 1.1rem;
        }
      }
      tbody {
        width: 100%;
        tr {
          width: 100%;
          height: 25px;
          border-bottom: 1px solid @primary-border-transparent;
          color: @primary-text;
          font-size: 0.9rem;
        }
        tr:hover {
          background: lighten(@back, 2.5%);
        }
      }
    }
  }
}
</style>
