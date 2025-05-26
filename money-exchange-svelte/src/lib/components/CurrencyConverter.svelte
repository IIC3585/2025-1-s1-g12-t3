<script>
  import { onMount } from "svelte";
  import * as Card from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import currencyService from "../../services/currencyService";
  import CurrencySelect from "$lib/components/CurrencySelect.svelte";
  import Coin from "$lib/components/Coin.svelte";
  import ComboBox from "./ComboBox.svelte";

  let { baseCurrency = $bindable(), targetCurrency = $bindable() } = $props();
  let currencies = $state([]);
  let amount = 1;
  let isLoading = false;
  let error = "";
  let isLoadingCurrencies = $state(true);
  let supportedCurrencies = $state([]);
  
  let conversionRate = $state(1);
  let result = $derived.by(() => {
    fetchConversionRate();
    if (baseCurrency && targetCurrency) {
      return amount * conversionRate;
    }
    return 0;
  });

  async function fetchConversionRate(){
    try {
      console.log("Calling currency service to get exchange rate...");
      conversionRate = await currencyService.getExchangeRate(
        baseCurrency.value, // Accede a .value solo si baseCurrency no es null
        targetCurrency.value // Accede a .value solo si targetCurrency no es null
      );
    } catch (err) {
      console.error("Error fetching conversion rate:", err);
      error = "Error al obtener la tasa de cambio. Por favor, intenta de nuevo.";
    }
  }

  onMount(async () => {
    try {
      isLoadingCurrencies = true;
      currencies = await currencyService.getSupportedCurrencies();
      baseCurrency = { value: 'USD', label: 'USD - United States Dollar' };
      targetCurrency = { value: 'CLP', label: 'CLP - Chilean Peso' };
      fetchConversionRate();
    } catch (error) {
      console.error("Error al cargar las monedas:", error);
      error = "Error al cargar las monedas. Por favor, intenta de nuevo.";
    } finally {
      isLoadingCurrencies = false;
    }
  });

  function swapCurrencies() {
    [baseCurrency, targetCurrency] = [targetCurrency, baseCurrency];
    if (result > 0 && baseCurrency && targetCurrency) {
      // convertCurrency();
    } else if (baseCurrency && targetCurrency) {
      // convertCurrency();
    }
  }
</script>

<Card.Root class="w-full max-w-lg">
  <Card.Header>
    <Card.Title>Conversor de Monedas</Card.Title>
    <Card.Description>
      Convierte entre diferentes monedas usando tasas en tiempo real
    </Card.Description>
  </Card.Header>

  <Card.Content class="space-y-4">
    <div class="grid gap-4">
      <div class="flex flex-col space-y-2">
        <label for="amount">Cantidad</label>
        <Input
          id="amount"
          type="number"
          bind:value={amount}
          min="0"
          step="0.01"
          placeholder="Ingresa la cantidad"
        />
      </div>

      <div class="grid gap-2">
        <div
          class="grid grid-cols-[theme(width.48)_auto_theme(width.48)] gap-2"
        >
          <label for="from">De</label>
          <div></div>
          <label for="to">A</label>
        </div>

        <div
          class="grid grid-cols-[theme(width.48)_auto_theme(width.48)] gap-2 items-center"
        >
          <ComboBox
            bind:selected={baseCurrency} 
            options={currencies}
          />
          <Button
            variant="outline"
            class="w-8 h-10 p-0 rounded-full"
            on:click={swapCurrencies}
            disabled={isLoadingCurrencies}
          >
            ↔
          </Button>
          <ComboBox
            bind:selected={targetCurrency} 
            options={currencies}
          />
        </div>
      </div>
    </div>

    <Button
      variant="default"
      class="w-full mt-2"
      on:click={convertCurrency}
      disabled={isLoading ||
        isLoadingCurrencies ||
        !baseCurrency ||
        !targetCurrency}
    >
      {#if isLoading}
        Convirtiendo...
      {:else}
        Convertir
      {/if}
    </Button>

    {#if error}
      <div class="text-red-500 text-sm text-center">{error}</div>
    {/if}

    {#if result > 0 && baseCurrency && targetCurrency}
      <div class="text-center pt-4">
        <p
          class="text-2xl font-semibold flex items-center justify-center gap-2"
        >
          {amount}
          {#if baseCurrency}
            <Coin text={baseCurrency.value} />
          {/if}
          ≈
          {result.toFixed(2)}
          {#if targetCurrency}
            <Coin text={targetCurrency.value} />
          {/if}
        </p>
      </div>
    {/if}
  </Card.Content>
</Card.Root>
