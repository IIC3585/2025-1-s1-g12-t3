<script lang="ts">
  import AreaChart from "./AreaChart.svelte";
  import currencyService from "../../services/currencyService";
  let data = [
    { x: 1, y: 2 },
    { x: 2, y: 3 },
    { x: 3, y: 4 },
    { x: 4, y: 5 },
    { x: 5, y: 6 }
  ];
  let xAttr = "x";
  let yAttr = "y";
  let areaColor = "blue";
  let strokeColor = "purple";
  let baseCurrency = "USD";
  let targetCurrency = "CLP";
  let date = "2025-05-01";
  let endDate = "2025-05-10";
  $effect(() => {
    currencyService.getHistoricalRates(baseCurrency, targetCurrency, date, endDate).then((response) => {
      console.log(response);
    });
  });
</script>

<AreaChart {data} {xAttr} {yAttr} {areaColor} {strokeColor}></AreaChart>