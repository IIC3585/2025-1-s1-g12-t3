<script lang="ts">
  import AreaChart from "./AreaChart.svelte";
  import currencyService from "../../services/currencyService";
  

  let { baseCurrency = $bindable(), targetCurrency = $bindable(), timePeriod, timeInterval } = $props();
  const getDates = (timePeriod, timeInterval) => {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < timePeriod; i = i + timeInterval) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  let areaColor = "#98d3ce";
  let strokeColor = "#009689";

  let dates = $derived.by(() => {
    return getDates(timePeriod, timeInterval);
  });

  let xAttr = "date";
  let yAttr = "rate";

  let unknownCurrencyHistoryMessage = $derived.by(() => {
    return `No historical data available for ${baseCurrency} to ${targetCurrency}.`;
  });
  let fetchSuccess = $state(false);

  const getRateDomain = (data) => {
    const threshold = 0.25;
    let min = Math.min(...data.map((d) => d[yAttr]));
    let max = Math.max(...data.map((d) => d[yAttr]));
    const diff = max - min;
    min = min - diff * threshold;
    max = max + diff * threshold;
    return [min, max];
  };
  let data = $state([]);
  let dataDomain = $derived.by(() => {
    return getRateDomain(data);
  });
  $effect(() => {
    currencyService
      .getHistoricalRates(baseCurrency, targetCurrency, dates)
      .then((response) => {
        data = response;
        fetchSuccess = true;
      })
      .catch((error) => {
        console.error("Error fetching historical rates:", error);
        fetchSuccess = false;
      });
  });
</script>

<div class="grow-7 border-2 border-gray-300 rounded-lg p-4 w-md lg:width-full flex flex-col">
  <div class="font-bold">{baseCurrency} to {targetCurrency}</div>
  {#if !fetchSuccess}
    <div class="flex-1 flex items-center justify-center min-h-[300px] text-red-500">
      {unknownCurrencyHistoryMessage}
    </div>
  {:else}
      <AreaChart {data} {xAttr} {yAttr} {dataDomain} {areaColor} {strokeColor}></AreaChart>
  {/if}
</div>
