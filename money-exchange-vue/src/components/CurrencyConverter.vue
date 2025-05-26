<template>
  <Card class="w-full max-w-lg">
    <CardHeader>
      <CardTitle>Conversor de Monedas</CardTitle>
      <CardDescription>
        Convierte entre diferentes monedas usando tasas en tiempo real
      </CardDescription>
    </CardHeader>

    <CardContent class="space-y-4">
      <div class="grid gap-4">
        <div class="flex flex-col space-y-2">
          <label for="amount">Cantidad</label>
          <Input
            id="amount"
            v-model="amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="Ingresa la cantidad"
          />
        </div>

        <div class="grid gap-2">
          <div class="grid grid-cols-[theme(width.48)_auto_theme(width.48)] gap-2">
            <label for="from">De</label>
            <div></div>
            <label for="to">A</label>
          </div>

          <div class="flex flex-row items-center justify-between gap-2">
            <ComboBox
              v-model:selected="baseCurrency"
              :options="currencies"
            />
            
            <Button
              variant="outline"
              class="w-8 h-10 p-0 rounded-full"
              :disabled="isLoadingCurrencies"
              @click="swapCurrencies"
            >
              ↔
            </Button>
            
            <ComboBox
              v-model:selected="targetCurrency"
              :options="currencies"
            />
          </div>
        </div>
      </div>

      <div v-if="error" class="text-red-500 text-sm text-center">
        {{ error }}
      </div>

      <div v-if="result > 0 && baseCurrency && targetCurrency" class="text-center pt-4">
        <p class="text-2xl font-semibold flex items-center justify-center gap-2">
          {{ amount }}
          <Coin v-if="baseCurrency" :text="baseCurrency.value" />
          ≈
          {{ result.toFixed(numberOfDecimals) }}
          <Coin v-if="targetCurrency" :text="targetCurrency.value" />
        </p>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import currencyService from '@/services/currencyService';
import ComboBox from '@/components/ComboBox.vue';
import Coin from '@/components/Coin.vue';

interface Currency {
  value: string;
  label: string;
}

interface Props {
  baseCurrency?: Currency;
  targetCurrency?: Currency;
}

interface Emits {
  (e: 'update:baseCurrency', value: Currency): void;
  (e: 'update:targetCurrency', value: Currency): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const currencies = ref<Currency[]>([]);
const amount = ref<number>(1);
const error = ref<string | null>(null);
const isLoadingCurrencies = ref<boolean>(true);
const conversionRate = ref<number>(1);

const baseCurrency = defineModel<Currency>('baseCurrency');
const targetCurrency = defineModel<Currency>('targetCurrency');

const result = computed(() => {
  fetchConversionRate();
  if (baseCurrency.value && targetCurrency.value) {
    return amount.value * conversionRate.value;
  }
  return 0;
});

const numberOfDecimals = computed(() => {
  if (result.value > 1) {
    return 2; // For amounts greater than 1, show 2 decimal places
  } else {
    return 4; // For amounts less than or equal to 1, show 4 decimal places
  }
});

async function fetchConversionRate() {
  if (!baseCurrency.value || !targetCurrency.value) return;
  
  console.log("Fetching conversion rate for:", baseCurrency.value.value, targetCurrency.value.value);
  try {
    conversionRate.value = await currencyService.getExchangeRate(
      baseCurrency.value.value,
      targetCurrency.value.value
    );
  } catch (err) {
    console.error("Error fetching conversion rate:", err);
    error.value = "Error al obtener la tasa de cambio. Por favor, intenta de nuevo.";
  }
}

onMounted(async () => {
  try {
    isLoadingCurrencies.value = true;
    currencies.value = await currencyService.getSupportedCurrencies();
    baseCurrency.value = { value: 'USD', label: 'USD - United States Dollar' };
    targetCurrency.value = { value: 'CLP', label: 'CLP - Chilean Peso' };
    fetchConversionRate();
  } catch (err) {
    console.error("Error al cargar las monedas:", err);
    error.value = "Error al cargar las monedas. Por favor, intenta de nuevo.";
  } finally {
    isLoadingCurrencies.value = false;
  }
});

function swapCurrencies() {
  const temp = baseCurrency.value;
  baseCurrency.value = targetCurrency.value;
  targetCurrency.value = temp;
}

// Watch for currency changes to trigger rate fetching
watch([baseCurrency, targetCurrency], () => {
  if (baseCurrency.value && targetCurrency.value) {
    fetchConversionRate();
  }
}, { deep: true });
</script>