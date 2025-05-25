<script>
  import CurrencyConverter from "../lib/components/CurrencyConverter.svelte";
  import HistoryChart from "../lib/components/HistoryChart.svelte";

  let timePeriod = 15;
  let timeInterval = 1;

  let baseCurrency = $state({ value: 'USD', label: 'USD - United States Dollar' });
  let targetCurrency = $state({ value: 'CLP', label: 'CLP - Chilean Peso' });
  $effect(() => {
    console.log("Base Currency:", baseCurrency.value);
    console.log("Target Currency:", targetCurrency.value);
  });
</script>

<div class="p-4 flex flex-col lg:flex-row gap-4 justify-center">
  <CurrencyConverter
    bind:baseCurrency
    bind:targetCurrency
  />
  <HistoryChart
    baseCurrency = {baseCurrency.value}
    targetCurrency = {targetCurrency.value}
    {timePeriod}
    {timeInterval}
  />
</div>
