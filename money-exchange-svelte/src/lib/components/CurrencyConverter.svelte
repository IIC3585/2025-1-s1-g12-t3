<script>
  import { onMount } from "svelte";
  import * as Card from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import currencyService from "../../services/currencyService";
  import CurrencySelect from "$lib/components/CurrencySelect.svelte";
  import Coin from "$lib/components/Coin.svelte";

  let currencies = [];
  let fromCurrency = null;
  let toCurrency = null;
  let amount = 1;
  let result = 0;
  let isLoading = false;
  let error = "";
  let isLoadingCurrencies = true;

  onMount(async () => {
    try {
      const supportedCurrencies =
        await currencyService.getSupportedCurrencies();

      currencies = supportedCurrencies; // currencyService devuelve el formato { value, label }

      // Asignar monedas por defecto o la primera si no se encuentran
      fromCurrency =
        currencies.find((c) => c.value === "USD") || currencies[0] || null;
      toCurrency =
        currencies.find((c) => c.value === "CLP") || currencies[1] || null;
    } catch (err) {
      console.error("Error al cargar las monedas:", err);
      error = "Error al cargar las monedas. Por favor, intenta de nuevo.";
    } finally {
      isLoadingCurrencies = false;
    }
  });

  async function convertCurrency() {
    error = "";
    isLoading = true;

    if (!fromCurrency || !toCurrency) {
      error = "Por favor, selecciona ambos tipos de monedas.";
      isLoading = false;
      return;
    }

    try {
      const rate = await currencyService.getExchangeRate(
        fromCurrency.value, // Accede a .value solo si fromCurrency no es null
        toCurrency.value // Accede a .value solo si toCurrency no es null
      );
      result = amount * rate;
    } catch (err) {
      console.error("Error en la conversión:", err);
      error = "Error en la conversión. Por favor, intenta de nuevo.";
      result = 0;
    } finally {
      isLoading = false;
    }
  }

  function swapCurrencies() {
    [fromCurrency, toCurrency] = [toCurrency, fromCurrency];
    if (result > 0 && fromCurrency && toCurrency) {
      convertCurrency();
    } else if (fromCurrency && toCurrency) {
      convertCurrency();
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
          <CurrencySelect
            id="from"
            bind:selected={fromCurrency}
            {currencies}
            isLoading={isLoadingCurrencies}
            placeholder="Selecciona moneda"
          />

          <Button
            variant="outline"
            class="w-8 h-10 p-0 rounded-full"
            on:click={swapCurrencies}
            disabled={isLoadingCurrencies}
          >
            ↔
          </Button>

          <CurrencySelect
            id="to"
            bind:selected={toCurrency}
            {currencies}
            isLoading={isLoadingCurrencies}
            placeholder="Selecciona moneda"
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
        !fromCurrency ||
        !toCurrency}
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

    {#if result > 0 && fromCurrency && toCurrency}
      <div class="text-center pt-4">
        <p
          class="text-2xl font-semibold flex items-center justify-center gap-2"
        >
          {amount}
          {#if fromCurrency}
            <Coin text={fromCurrency.value} />
          {/if}
          ≈
          {result.toFixed(2)}
          {#if toCurrency}
            <Coin text={toCurrency.value} />
          {/if}
        </p>
      </div>
    {/if}
  </Card.Content>
</Card.Root>
