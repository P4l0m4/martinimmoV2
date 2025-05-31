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
      surfaceHabitable: number | undefined;
      rooms: number | undefined;
      expectedRenovationDiscount: number;
      typeLocal: string | undefined;
      DPE?: string | undefined;
      localAge?: string | undefined;
      equipments: string[];
      discalifications: string[];
      groundFloor: boolean;
      land: number;
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
  rooms: undefined as number | undefined,
  expectedRenovationDiscount: undefined as number | undefined,
  typeLocal: undefined as string | undefined,
  DPE: undefined as string | undefined,
  ...checkboxOptions.reduce(
    (acc: any, o: { key: any }) => ({ ...acc, [o.key]: false }),
    {}
  ),
  localAge: undefined as string | undefined,
  groundFloor: false as Boolean,
  land: null as number | null,
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
  rooms: { required, integer, minValue: minValue(1), maxValue: maxValue(12) },
  expectedRenovationDiscount: {
    numeric,
    minValue: minValue(0),
    maxValue: maxValue(20),
  },

  typeLocal: { required },
  DPE: { required },
  localAge: { required },
  land: { numeric, minValue: minValue(0) },
};

const v$ = useVuelidate(rules, form);

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

const roomsErrors = computed(() => {
  const e: string[] = [];
  if (!v$.value.rooms.$dirty) return e;
  if (v$.value.rooms.required.$invalid) e.push("Indiquez le nombre de pièces");
  if (v$.value.rooms.integer.$invalid)
    e.push("Le nombre de pièces doit être un nombre entier");
  if (v$.value.rooms.minValue.$invalid) e.push("Au moins 1 pièce");
  if (v$.value.rooms.maxValue.$invalid) e.push("Maximum 12 pièces");
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

const localAgeErrors = computed(() => {
  const e: string[] = [];
  if (!v$.value.localAge.$dirty) return e;
  if (v$.value.localAge.required.$invalid)
    e.push("Sélectionnez l'ancienneté du bien");
  return e;
});

const landErrors = computed(() => {
  const e: string[] = [];
  if (!v$.value.land.$dirty) return e;
  if (v$.value.land.numeric.$invalid)
    e.push("La surface terrain doit être numérique");
  if (v$.value.land.minValue.$invalid) e.push("Surface minimale : 0 m²");
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
    v$.value.expectedRenovationDiscount.$validate(),
    v$.value.land.$validate(),
  ]);

  const areFieldsValid = !(
    v$.value.typeLocal.$invalid ||
    v$.value.expectedRenovationDiscount.$invalid ||
    v$.value.land.$invalid
  );

  if (areFieldsValid) {
    step.value = 1;
  } else {
    v$.value.typeLocal.$touch();
    v$.value.expectedRenovationDiscount.$touch();
    v$.value.land.$touch();
  }
}

async function handleSubmit() {
  if (!(await v$.value.$validate())) return;

  emit("submit", {
    surface: form.surface ? Number(form.surface) : undefined,
    surfaceHabitable: form.surfaceHabitable
      ? Number(form.surfaceHabitable)
      : undefined,
    rooms: form.rooms ? Number(form.rooms) : undefined,
    expectedRenovationDiscount: form.expectedRenovationDiscount,
    typeLocal: form.typeLocal,
    DPE: form.DPE,
    localAge: form.localAge,
    equipments: selectedEquipments.value,
    discalifications: selectedDiscalifications.value,
    groundFloor: form.groundFloor,
    land: form.land,
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

    <CheckboxField
      v-if="form.typeLocal === 'Appartement'"
      id="groundFloor"
      name="groundFloor"
      label="Situé en rez-de-chaussée"
      v-model="form.groundFloor"
    />

    <InputField
      v-if="form.typeLocal === 'Maison'"
      id="land"
      name="land"
      label="Surface du terrain"
      placeholder="Surface du terrain en m²"
      type="number"
      v-model="form.land"
      :error="landErrors[0]"
      icon="farm"
    />

    <PrimaryButton
      variant="primary-color"
      icon="arrow_right"
      @click="checkStep0Validation"
      @keydown.enter="checkStep0Validation"
      @keydown.space="checkStep0Validation"
      style="margin-top: auto"
    >
      Étape suivante
    </PrimaryButton>

    <div
      class="errors"
      v-if="expectedRenovationDiscountErrors[0] || typeLocalErrors[0]"
    >
      <span v-for="e in expectedRenovationDiscountErrors" :key="e">{{
        e
      }}</span>
      <span v-for="e in typeLocalErrors" :key="e">{{ e }}</span>
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
      id="rooms"
      name="pieces"
      label="Pièces"
      placeholder="Nombre de pièces"
      type="number"
      v-model="form.rooms"
      :error="roomsErrors[0]"
      icon="door_open_fill"
    />

    <SelectField
      id="localAge"
      name="anciennete"
      label="Ancienneté du bien"
      v-model="form.localAge"
      :error="localAgeErrors[0]"
      :options="[
        'Neuf',
        '1 à 5 ans',
        '5 à 10 ans',
        '10 à 20 ans',
        'Plus de 20 ans',
      ]"
      defaultLabel="Ancienneté du bien"
      icon="calendar_dots"
    />

    <SelectField
      id="DPE"
      name="DPE"
      label="DPE"
      v-model="form.DPE"
      :error="DPEErrors[0]"
      :options="['A', 'B', 'C', 'D', 'E', 'F', 'G']"
      defaultLabel="DPE"
      icon="thermometer_simple_bold"
    />

    <PrimaryButton
      variant="primary-color"
      @click="handleSubmit"
      @keydown.enter.prevent="handleSubmit"
      @keydown.space.prevent="handleSubmit"
      icon="calculator"
      style="margin-top: auto"
    >
      Lancer l'estimation
    </PrimaryButton>
    <button
      class="estimation-form__previous-step-button"
      @click="step = 0"
      @keydown.enter.prevent="step = 0"
      @keydown.space.prevent="step = 0"
    >
      Revenir à l'étape précédente
    </button>

    <div
      class="errors"
      v-if="
        surfaceErrors[0] || roomsErrors[0] || localAgeErrors[0] || DPEErrors[0]
      "
    >
      <span v-for="e in surfaceErrors" :key="e">{{ e }}</span>
      <span v-for="e in roomsErrors" :key="e">{{ e }}</span>
      <span v-for="e in DPEErrors" :key="e">{{ e }}</span>
      <span v-for="e in localAgeErrors" :key="e">{{ e }}</span>
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
  border: 1px solid $accent-color-faded;

  @media (min-width: $tablet-screen) {
    max-width: 550px;
  }

  @media (min-width: $big-tablet-screen) {
    max-width: 350px;
    padding: 1.5rem;
    gap: 1.5rem;
    min-height: 100%;
  }

  &__checkboxes {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.5rem;
    margin-top: -1rem;
  }

  &__discalification-checkboxes {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: -1rem;
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
