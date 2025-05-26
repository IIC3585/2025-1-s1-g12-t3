<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        class="w-[200px] justify-between overflow-hidden"
      >
        {{ selectedValue }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[200px] p-0">
      <Command>
        <CommandInput v-model="search" placeholder="Search option..." />
        <CommandEmpty>No option found.</CommandEmpty>
        <CommandGroup :key="search">
          <CommandItem
            v-for="option in options"
            :key="option.value"
            :value="option.value"
            @select="handleSelect(option)"
          >
            {{ option.label }}
          </CommandItem>
        </CommandGroup>
      </Command>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface Option {
  label: string;
  value: string;
}

interface Props {
  selected?: Option;
  options: Option[];
}

interface Emits {
  (e: 'update:selected', value: Option): void;
}

const props = withDefaults(defineProps<Props>(), {
  selected: undefined
});

const emit = defineEmits<Emits>();

const open = ref<boolean>(false);
const search = ref<string>("");

const selected = defineModel<Option>('selected');

const selectedValue = computed(() => 
  props.options.find((f) => f.value === selected.value?.value)?.label ?? "Select a option..."
);

// We want to refocus the trigger button when the user selects
// an item from the list so users can continue navigating the
// rest of the form with the keyboard.
function closeAndFocusTrigger(triggerId: string) {
  open.value = false;
  nextTick(() => {
    document.getElementById(triggerId)?.focus();
  });
}

function handleSelect(option: Option) {
  selected.value = option;
  emit('update:selected', option);
  open.value = false;
}
</script>