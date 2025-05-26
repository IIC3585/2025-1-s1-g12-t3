<template>
  <div class="flex flex-col space-y-2">
    <Select :model-value="selectedValue" @update:model-value="handleSelect">
      <SelectTrigger :id="id" class="w-40 h-10">
        <SelectValue :placeholder="placeholder" />
      </SelectTrigger>
      <SelectContent class="max-h-[200px] overflow-y-auto">
        <div v-if="isLoading" class="p-2 text-center text-gray-500">
          Cargando monedas...
        </div>
        <SelectItem
          v-else
          v-for="currency in currencies"
          :key="currency.value"
          :value="currency.value"
        >
          {{ currency.label }}
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface Currency {
  value: string;
  label: string;
}

interface Props {
  currencies?: Currency[];
  selected?: Currency | null;
  placeholder?: string;
  id?: string;
  isLoading?: boolean;
}

interface Emits {
  (e: 'select', value: Currency): void;
  (e: 'update:selected', value: Currency | null): void;
}

const props = withDefaults(defineProps<Props>(), {
  currencies: () => [],
  selected: null,
  placeholder: "Selecciona moneda",
  id: "",
  isLoading: false
});

const emit = defineEmits<Emits>();

// Convert Currency object to string value for the Select component
const selectedValue = computed(() => props.selected?.value || null);

function handleSelect(value: unknown) {
  // Handle all possible AcceptableValue types (string, number, boolean, null, undefined)
  if (value === null || value === undefined) {
    emit('update:selected', null);
    return;
  }
  
  // Convert to string to match our currency values
  const stringValue = String(value);
  const selectedCurrency = props.currencies.find(currency => currency.value === stringValue) || null;
  
  if (selectedCurrency) {
    emit('select', selectedCurrency);
  }
  emit('update:selected', selectedCurrency);
}
</script>