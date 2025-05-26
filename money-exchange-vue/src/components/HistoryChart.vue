<template>
  <div class="grow-7 border-2 border-gray-300 rounded-lg p-4 w-md lg:width-full flex flex-col">
    <div class="font-bold">{{ baseCurrency }} to {{ targetCurrency }}</div>
    <div 
      v-if="!fetchSuccess"
      class="flex-1 flex items-center justify-center min-h-[300px] text-red-500"
    >
      {{ unknownCurrencyHistoryMessage }}
    </div>
    <AreaChart 
      v-else
      :data="data" 
      :x-attr="xAttr" 
      :y-attr="yAttr" 
      :data-domain="dataDomain" 
      :area-color="areaColor" 
      :stroke-color="strokeColor"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import AreaChart from '@/components/AreaChart.vue';
import currencyService from '@/services/currencyService';

interface Currency {
  value: string;
  label: string;
}

interface Props {
  baseCurrency: Currency | string;
  targetCurrency: Currency | string;
  timePeriod: number;
  timeInterval: number;
}

const props = defineProps<Props>();

const getDates = (timePeriod: number, timeInterval: number): string[] => {
  const today = new Date();
  const dates: string[] = [];
  for (let i = 0; i < timePeriod; i = i + timeInterval) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
};

const areaColor = "#98d3ce";
const strokeColor = "#009689";

const dates = computed(() => {
  return getDates(props.timePeriod, props.timeInterval);
});

const xAttr = "date";
const yAttr = "rate";

const unknownCurrencyHistoryMessage = computed(() => {
  const base = typeof props.baseCurrency === 'string' ? props.baseCurrency : props.baseCurrency?.value || props.baseCurrency;
  const target = typeof props.targetCurrency === 'string' ? props.targetCurrency : props.targetCurrency?.value || props.targetCurrency;
  return `No historical data available for ${base} to ${target}.`;
});

const fetchSuccess = ref<boolean>(false);

const getRateDomain = (data: any[]): [number, number] => {
  if (data.length === 0) return [0, 1];
  const threshold = 0.25;
  let min = Math.min(...data.map((d) => d[yAttr]));
  let max = Math.max(...data.map((d) => d[yAttr]));
  const diff = max - min;
  min = min - diff * threshold;
  max = max + diff * threshold;
  return [min, max];
};

const data = ref<any[]>([]);

const dataDomain = computed(() => {
  return getRateDomain(data.value);
});

watchEffect(async () => {
  try {
    const base = typeof props.baseCurrency === 'string' ? props.baseCurrency : props.baseCurrency?.value;
    const target = typeof props.targetCurrency === 'string' ? props.targetCurrency : props.targetCurrency?.value;
    
    const response = await currencyService.getHistoricalRates(
      base,
      target,
      dates.value
    );
    data.value = response;
    fetchSuccess.value = true;
  } catch (error) {
    console.error('Error fetching historical rates:', error);
    data.value = [];
    fetchSuccess.value = false;
  }
});
</script>