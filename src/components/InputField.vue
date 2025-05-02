<script setup lang="ts">
import { ref } from "vue";

interface Props {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  icon?: string;
  required?: boolean;
  autofocus?: boolean;
  error?: string;
  name: string;
  autocomplete?: "on" | "off";
}

withDefaults(defineProps<Props>(), {
  type: "text",
  required: true,
  autofocus: false,
  autocomplete: "on",
});

const model = defineModel<string | number>();
const inputRef = ref<HTMLInputElement | null>(null);

const showPassword = ref(false);

function toggleShowPassword() {
  showPassword.value = !showPassword.value;
}
</script>
<template>
  <div class="input-field" :class="{ shake: error }">
    <label class="input-field__label sr-only" :for="id">
      {{ label }}
    </label>
    <IconComponent
      v-if="icon"
      :icon="icon"
      class="input-field__icon"
      color="#232323"
    />

    <input
      v-model="model"
      ref="inputRef"
      :id="id"
      class="input-field__input"
      :type="type === 'password' && showPassword ? 'text' : type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :autofocus="autofocus"
      :aria-label="label"
      :aria-labelledby="label"
      :title="label"
      :aria-placeholder="placeholder"
      :name="name"
      :value="model"
    />

    <IconComponent
      icon="eye"
      class="input-field__icon"
      style="cursor: pointer"
      v-if="type === 'password' && showPassword"
      @click="toggleShowPassword"
    />
    <IconComponent
      icon="eye-off"
      class="input-field__icon"
      style="cursor: pointer"
      v-if="type === 'password' && !showPassword"
      @click="toggleShowPassword"
    />
  </div>
  <!-- <span class="input-error" v-if="error"></span> -->
</template>
<style lang="scss" scoped>
.input-field {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  align-items: center;
  background-color: $base-color;
  border-radius: calc($radius/2);
  padding: 0 0.75rem;
  box-shadow: $shadow-black;
  overflow: hidden;
  position: relative;
  height: 44px;

  &__label {
    font-size: $small-text;
    font-weight: $regular;
    white-space: nowrap;
    width: fit-content;
    margin-left: 0.75rem;
  }

  &__icon {
    opacity: 0.6;
  }

  input {
    font-size: 1rem;
    padding: 0.65rem 0;
    padding-top: 0.75rem;
    border: none;
    color: $text-color;
    background-color: $base-color;
    width: 100% !important;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    &::placeholder {
      color: $text-color-faded;
      font-size: 1rem;
      font-weight: $regular;
    }

    &[type="search"] {
      max-width: 100%;
    }
    &[type="datetime-local"] {
      width: 100%;
      max-width: 400px;
      min-width: 300px;
      position: absolute;
      // top: 0px;
      opacity: 0;
    }
    &[type="number"] {
      // background-color: $base-color !important;
      // border-radius: 0 !important;
    }
  }
}
</style>
