<script setup lang="ts">
import { reactive, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  integer,
  minValue,
  maxValue,
  numeric,
} from "@vuelidate/validators";

const emit = defineEmits<{
  submit: [
    {
      surface: number | undefined;
      pieces: number | undefined;
      expectedRenovationDiscount: number;
      typeLocal: string | undefined;
      DPE?: string | undefined;
      equipments: string[];
    }
  ];
}>();

const checkboxOptions = [
  { key: "terrasse", label: "Terrasse", belongsTo: ["Appartement", "Maison"] },
  { key: "balcon", label: "Balcon", belongsTo: ["Appartement"] },
  { key: "jardin", label: "Jardin", belongsTo: ["Maison"] },
  { key: "cave", label: "Cave", belongsTo: ["Appartement", "Maison"] },
  { key: "garage", label: "Garage", belongsTo: ["Appartement", "Maison"] },
  { key: "piscine", label: "Piscine", belongsTo: ["Appartement", "Maison"] },
  { key: "ascenseur", label: "Ascenseur", belongsTo: ["Appartement"] },
  { key: "interphone", label: "Interphone", belongsTo: ["Appartement"] },
  { key: "alarme", label: "Alarme", belongsTo: ["Maison"] },
  {
    key: "climatisation",
    label: "Climatisation",
    belongsTo: ["Appartement", "Maison"],
  },
  {
    key: "exposition",
    label: "Exposition Sud",
    belongsTo: ["Appartement", "Maison"],
  },
  {
    key: "tennis",
    label: "Court de tennis",
    belongsTo: ["Appartement", "Maison"],
  },
  { key: "parking", label: "Parking", belongsTo: ["Appartement", "Maison"] },
];

const isPerksOpen = ref(false);

const form = reactive({
  surface: undefined as number | undefined,
  pieces: undefined as number | undefined,
  expectedRenovationDiscount: undefined as number | undefined,
  typeLocal: undefined as string | undefined,
  DPE: undefined as string | undefined,
  ...checkboxOptions.reduce(
    (acc: any, o: { key: any }) => ({ ...acc, [o.key]: false }),
    {}
  ),
});

const rules = {
  surface: {
    required,
    integer,
    minValue: minValue(10),
    maxValue: maxValue(140),
  },
  pieces: { required, integer, minValue: minValue(1), maxValue: maxValue(12) },
  expectedRenovationDiscount: {
    numeric,
    minValue: minValue(0),
    maxValue: maxValue(20),
  },

  typeLocal: { required },
  DPE: { required },
};

const v$ = useVuelidate(rules, form);
const isValid = computed(() => !v$.value.$error);

/* ------------------ tableaux d’erreurs custom --------------------- */
const surfaceErrors = computed(() => {
  const e: string[] = [];
  if (!v$.value.surface.$dirty) return e;
  if (v$.value.surface.required.$invalid) e.push("Ajoutez la surface du bien");
  if (v$.value.surface.integer.$invalid)
    e.push("La surface doit être un nombre entier");
  if (v$.value.surface.minValue.$invalid) e.push("Surface minimale : 10 m²");
  if (v$.value.surface.maxValue.$invalid) e.push("Surface maximale : 140 m²");
  return e;
});

const piecesErrors = computed(() => {
  const e: string[] = [];
  if (!v$.value.pieces.$dirty) return e;
  if (v$.value.pieces.required.$invalid) e.push("Indiquez le nombre de pièces");
  if (v$.value.pieces.integer.$invalid)
    e.push("Le nombre de pièces doit être un nombre entier");
  if (v$.value.pieces.minValue.$invalid) e.push("Au moins 1 pièce");
  if (v$.value.pieces.maxValue.$invalid) e.push("Maximum 12 pièces");
  return e;
});

const expectedRenovationDiscountErrors = computed(() => {
  const e: string[] = [];
  if (!v$.value.expectedRenovationDiscount.$dirty) return e;
  if (v$.value.expectedRenovationDiscount.numeric.$invalid)
    e.push("Le montant doit être numérique");
  if (v$.value.expectedRenovationDiscount.minValue.$invalid)
    e.push("Montant négatif interdit");
  if (v$.value.expectedRenovationDiscount.maxValue.$invalid)
    e.push("Max travaux : 3");
  return e;
});

const typeLocalErrors = computed(() => {
  const e: string[] = [];
  if (!v$.value.typeLocal.$dirty) return e;
  if (v$.value.typeLocal.required.$invalid)
    e.push("Sélectionnez un type de bien");
  return e;
});

const DPEErrors = computed(() => {
  const e: string[] = [];
  if (!v$.value.DPE.$dirty) return e;
  if (v$.value.DPE.required.$invalid) e.push("Sélectionnez un DPE");
  return e;
});

const visibleCheckboxes = computed(() =>
  checkboxOptions.filter(
    (o) => !form.typeLocal || o.belongsTo.includes(form.typeLocal)
  )
);

const selectedEquipments = computed(() => {
  return visibleCheckboxes.value
    .filter((opt) => form[opt.key])
    .map((opt) => opt.key);
});

async function handleSubmit() {
  if (!(await v$.value.$validate())) return;

  emit("submit", {
    surface: form.surface ? Number(form.surface) : undefined,
    pieces: form.pieces ? Number(form.pieces) : undefined,
    expectedRenovationDiscount: form.expectedRenovationDiscount,
    typeLocal: form.typeLocal,
    DPE: form.DPE,
    equipments: selectedEquipments.value,
  });
}
</script>

<template>
  <form class="estimation-form" @submit.prevent="handleSubmit">
    <InputField
      id="surface"
      name="surface"
      label="Surface"
      placeholder="Surface en m²"
      type="number"
      v-model="form.surface"
      :error="surfaceErrors[0]"
    />

    <InputField
      id="pieces"
      name="pieces"
      label="Pièces"
      placeholder="Nombre de pièces"
      type="number"
      v-model="form.pieces"
      :error="piecesErrors[0]"
    />

    <RenovationDifficulty v-model="form.expectedRenovationDiscount" />

    <SelectField
      id="DPE"
      name="DPE"
      label="DPE"
      v-model="form.DPE"
      :error="DPEErrors[0]"
      :options="['A', 'B', 'C', 'D', 'E', 'F', 'G']"
      defaultLabel="Sélectionnez le DPE"
    />

    <SwitchInput
      id="typeLocal"
      name="typeLocal"
      label="Type de bien"
      v-model="form.typeLocal"
      :error="typeLocalErrors[0]"
      :options="[
        { label: 'Appartement', icon: 'building-apartment' },
        { label: 'Maison', icon: 'house-line' },
      ]"
    />
    <DropDown label="Avantages" :number="selectedEquipments.length">
      <div class="estimation-form__checkboxes">
        <CheckboxField
          v-for="opt in visibleCheckboxes"
          :key="opt.key"
          :id="opt.key"
          :name="opt.key"
          :label="opt.label"
          v-model="form[opt.key]"
        /></div
    ></DropDown>

    <PrimaryButton variant="accent-color" @click="handleSubmit">
      Lancer l'estimation
    </PrimaryButton>

    <div
      class="errors"
      v-if="
        surfaceErrors[0] ||
        piecesErrors[0] ||
        expectedRenovationDiscountErrors[0] ||
        typeLocalErrors[0] ||
        DPEErrors[0]
      "
    >
      <span v-for="e in surfaceErrors" :key="e">{{ e }}</span>
      <span v-for="e in piecesErrors" :key="e">{{ e }}</span>
      <span v-for="e in expectedRenovationDiscountErrors" :key="e">{{
        e
      }}</span>
      <span v-for="e in typeLocalErrors" :key="e">{{ e }}</span>
      <span v-for="e in DPEErrors" :key="e">{{ e }}</span>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.estimation-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  background-color: $accent-color-faded;
  padding: 1rem;
  border-radius: $radius;

  @media (min-width: $big-tablet-screen) {
    max-width: 350px;
    padding: 1.5rem;
    gap: 1.5rem;
  }

  &__checkboxes {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.5rem;
  }
}

.errors {
  color: $error-color;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
}
</style>
