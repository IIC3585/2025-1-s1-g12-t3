<script>
  import CurrencyConverter from "../lib/components/CurrencyConverter.svelte";
  import HistoryChart from "../lib/components/HistoryChart.svelte";

  let baseCurrency = "USD";
  let targetCurrency = "CLP";
  let timePeriod = 15;
  let timeInterval = 1;
</script>

<div class="container mx-auto p-4">
  <CurrencyConverter />
  <HistoryChart
    {baseCurrency}
    {targetCurrency}
    {timePeriod}
    {timeInterval}
  />
</div>
