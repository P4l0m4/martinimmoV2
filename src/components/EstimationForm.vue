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
import SegmentedControl from "./SegmentedControl.vue";

const emit = defineEmits<{
  submit: [
    {
      surface: number | undefined;
      surfaceHabitable: number | undefined;
      pieces: number | undefined;
      expectedRenovationDiscount: number;
      typeLocal: string | undefined;
      DPE?: string | undefined;
      equipments: string[];
      discalifications?: string[];
    }
  ];
}>();

const step = ref(0);

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

const discalificationCheckboxOptions = [
  {
    key: "ESN",
    label: "Espace Naturel Sensible",
  },
  {
    key: "AMH",
    label: "Abords de Monuments Historiques",
  },
  {
    key: "monument",
    label: "Monument Historique",
  },
  {
    key: "ZIRed",
    label: "Zone Inondable (PPRI rouge)",
  },
  {
    key: "ZIBlue",
    label: "Zone Inondable (PPRI bleu foncé)",
  },
];

const form = reactive({
  surface: undefined as number | undefined,
  surfaceHabitable: undefined as number | undefined,
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
    maxValue: maxValue(600),
  },
  surfaceHabitable: {
    required,
    integer,
    minValue: minValue(10),
    maxValue: maxValue(600),
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
  if (v$.value.surface.maxValue.$invalid) e.push("Surface maximale : 600 m²");
  return e;
});

const surfaceHabitableErrors = computed(() => {
  const e: string[] = [];
  if (!v$.value.surfaceHabitable.$dirty) return e;
  if (v$.value.surfaceHabitable.required.$invalid)
    e.push("Ajoutez la surface du bien");
  if (v$.value.surfaceHabitable.integer.$invalid)
    e.push("La surface doit être un nombre entier");
  if (v$.value.surfaceHabitable.minValue.$invalid)
    e.push("Surface minimale : 10 m²");
  if (v$.value.surfaceHabitable.maxValue.$invalid)
    e.push("Surface maximale : 600 m²");
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

const selectedDiscalifications = computed(() => {
  return discalificationCheckboxOptions
    .filter((opt) => form[opt.key])
    .map((opt) => opt.key);
});

async function checkStep0Validation() {
  await Promise.all([
    v$.value.typeLocal.$validate(),
    v$.value.DPE.$validate(),
    v$.value.expectedRenovationDiscount.$validate(),
  ]);

  const areFieldsValid = !(
    v$.value.typeLocal.$invalid ||
    v$.value.DPE.$invalid ||
    v$.value.expectedRenovationDiscount.$invalid
  );

  if (areFieldsValid) {
    step.value = 1;
  } else {
    v$.value.typeLocal.$touch();
    v$.value.DPE.$touch();
    v$.value.expectedRenovationDiscount.$touch();
  }
}

async function handleSubmit() {
  if (!(await v$.value.$validate())) return;

  emit("submit", {
    surface: form.surface ? Number(form.surface) : undefined,
    surfaceHabitable: form.surfaceHabitable
      ? Number(form.surfaceHabitable)
      : undefined,
    pieces: form.pieces ? Number(form.pieces) : undefined,
    expectedRenovationDiscount: form.expectedRenovationDiscount,
    typeLocal: form.typeLocal,
    DPE: form.DPE,
    equipments: selectedEquipments.value,
    discalifications: selectedDiscalifications.value,
  });
}
</script>

<template>
  <form
    class="estimation-form"
    @submit.prevent="handleSubmit"
    v-show="step === 0"
  >
    <SegmentedControl
      id="typeLocal"
      name="typeLocal"
      label="Type de bien"
      v-model="form.typeLocal"
      :error="typeLocalErrors[0]"
      :options="[
        { label: 'Appartement', icon: 'building_apartment' },
        { label: 'Maison', icon: 'house_line' },
      ]"
    />
    <DropDown
      label="Avantages"
      :number="selectedEquipments.length"
      icon="trophy_fill"
    >
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

    <DropDown
      label="Particularités"
      :number="selectedDiscalifications.length"
      icon="hand_waving_fill"
    >
      <div class="estimation-form__discalification-checkboxes">
        <CheckboxField
          v-for="opt in discalificationCheckboxOptions"
          :key="opt.key"
          :id="opt.key"
          :name="opt.key"
          :label="opt.label"
          v-model="form[opt.key]"
        /></div
    ></DropDown>
    <RenovationDifficulty v-model="form.expectedRenovationDiscount" />
    <SelectField
      id="DPE"
      name="DPE"
      label="DPE"
      v-model="form.DPE"
      :error="DPEErrors[0]"
      :options="['A', 'B', 'C', 'D', 'E', 'F', 'G']"
      defaultLabel="DPE"
      icon="thermometer_simple_bold"
      :split="true"
    />

    <PrimaryButton
      variant="primary-color"
      icon="arrow_right"
      @click="checkStep0Validation"
    >
      Étape suivante
    </PrimaryButton>

    <div
      class="errors"
      v-if="
        expectedRenovationDiscountErrors[0] ||
        typeLocalErrors[0] ||
        DPEErrors[0]
      "
    >
      <span v-for="e in expectedRenovationDiscountErrors" :key="e">{{
        e
      }}</span>
      <span v-for="e in typeLocalErrors" :key="e">{{ e }}</span>
      <span v-for="e in DPEErrors" :key="e">{{ e }}</span>
    </div>
  </form>
  <form
    class="estimation-form"
    @submit.prevent="handleSubmit"
    v-show="step === 1"
  >
    <InputField
      id="surface"
      name="surface"
      label="Surface"
      placeholder="Surface bâtie réelle en m²"
      type="number"
      v-model="form.surface"
      :error="surfaceErrors[0]"
      icon="square_half_bold"
    />
    <InputField
      id="surfaceHabitable"
      name="surfaceHabitable"
      label="Surface habitable"
      placeholder="Surface habitable en m² (loi Carrez)"
      type="number"
      v-model="form.surfaceHabitable"
      :error="surfaceHabitableErrors[0]"
      icon="square_logo_fill"
    />

    <InputField
      id="pieces"
      name="pieces"
      label="Pièces"
      placeholder="Nombre de pièces"
      type="number"
      v-model="form.pieces"
      :error="piecesErrors[0]"
      icon="door_open_fill"
    />

    <PrimaryButton
      variant="primary-color"
      @click="handleSubmit"
      icon="calculator"
    >
      Lancer l'estimation
    </PrimaryButton>
    <button class="estimation-form__previous-step-button" @click="step = 0">
      Revenir à l'étape précédente
    </button>

    <div class="errors" v-if="surfaceErrors[0] || piecesErrors[0]">
      <span v-for="e in surfaceErrors" :key="e">{{ e }}</span>
      <span v-for="e in piecesErrors" :key="e">{{ e }}</span>
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

  &__discalification-checkboxes {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__previous-step-button {
    text-decoration: underline;
    font-size: $small-text;
    color: $text-color-alt;
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
