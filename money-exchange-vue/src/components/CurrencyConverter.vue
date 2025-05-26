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

          <div class="grid grid-cols-[theme(width.48)_auto_theme(width.48)] gap-2 items-center">
            <CurrencySelect
              id="from"
              v-model:selected="fromCurrency"
              :currencies="currencies"
              :is-loading="isLoadingCurrencies"
              placeholder="Selecciona moneda"
            />

            <Button
              variant="outline"
              class="w-8 h-10 p-0 rounded-full"
              :disabled="isLoadingCurrencies"
              @click="swapCurrencies"
            >
              ↔
            </Button>

            <CurrencySelect
              id="to"
              v-model:selected="toCurrency"
              :currencies="currencies"
              :is-loading="isLoadingCurrencies"
              placeholder="Selecciona moneda"
            />
          </div>
        </div>
      </div>

      <Button
        variant="default"
        class="w-full mt-2"
        :disabled="isLoading || isLoadingCurrencies || !fromCurrency || !toCurrency"
        @click="convertCurrency"
      >
        {{ isLoading ? 'Convirtiendo...' : 'Convertir' }}
      </Button>

      <div v-if="error" class="text-red-500 text-sm text-center">
        {{ error }}
      </div>

      <div v-if="result > 0 && fromCurrency && toCurrency" class="text-center pt-4">
        <p class="text-2xl font-semibold flex items-center justify-center gap-2">
          {{ amount }}
          <Coin v-if="fromCurrency" :text="fromCurrency.value" />
          ≈
          {{ result.toFixed(2) }}
          <Coin v-if="toCurrency" :text="toCurrency.value" />
        </p>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import currencyService from '@/services/currencyService';
import CurrencySelect from '@/components/CurrencySelect.vue';
import Coin from '@/components/Coin.vue';

interface Currency {
  value: string;
  label: string;
}

const currencies = ref<Currency[]>([]);
const fromCurrency = ref<Currency | null>(null);
const toCurrency = ref<Currency | null>(null);
const amount = ref<number>(1);
const result = ref<number>(0);
const isLoading = ref<boolean>(false);
const error = ref<string>("");
const isLoadingCurrencies = ref<boolean>(true);

onMounted(async () => {
  try {
    const supportedCurrencies = await currencyService.getSupportedCurrencies();
    
    currencies.value = supportedCurrencies; // currencyService devuelve el formato { value, label }
    
    // Asignar monedas por defecto o la primera si no se encuentran
    fromCurrency.value = 
      currencies.value.find((c) => c.value === "USD") || currencies.value[0] || null;
    toCurrency.value = 
      currencies.value.find((c) => c.value === "CLP") || currencies.value[1] || null;
  } catch (err) {
    console.error("Error al cargar las monedas:", err);
    error.value = "Error al cargar las monedas. Por favor, intenta de nuevo.";
  } finally {
    isLoadingCurrencies.value = false;
  }
});

async function convertCurrency() {
  error.value = "";
  isLoading.value = true;

  if (!fromCurrency.value || !toCurrency.value) {
    error.value = "Por favor, selecciona ambos tipos de monedas.";
    isLoading.value = false;
    return;
  }

  try {
    const rate = await currencyService.getExchangeRate(
      fromCurrency.value.value, // Accede a .value solo si fromCurrency no es null
      toCurrency.value.value // Accede a .value solo si toCurrency no es null
    );
    result.value = amount.value * rate;
  } catch (err) {
    console.error("Error en la conversión:", err);
    error.value = "Error en la conversión. Por favor, intenta de nuevo.";
    result.value = 0;
  } finally {
    isLoading.value = false;
  }
}

function swapCurrencies() {
  [fromCurrency.value, toCurrency.value] = [toCurrency.value, fromCurrency.value];
  if (result.value > 0 && fromCurrency.value && toCurrency.value) {
    convertCurrency();
  } else if (fromCurrency.value && toCurrency.value) {
    convertCurrency();
  }
}
</script>