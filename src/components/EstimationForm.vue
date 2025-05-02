<script setup lang="ts">
import { reactive, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, integer, minValue, maxValue } from "@vuelidate/validators";

const emit = defineEmits<{
  submit: [
    {
      surface: number | undefined;
      pieces: number | undefined;
      travaux: number | undefined;
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

const form = reactive({
  surface: undefined as number | undefined,
  pieces: undefined as number | undefined,
  travaux: undefined as number | undefined,
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
  travaux: { integer, minValue: minValue(0), maxValue: maxValue(100_000) },
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

const travauxErrors = computed(() => {
  const e: string[] = [];
  if (!v$.value.travaux.$dirty) return e;
  if (v$.value.travaux.integer.$invalid)
    e.push("Le montant doit être numérique");
  if (v$.value.travaux.minValue.$invalid) e.push("Montant négatif interdit");
  if (v$.value.travaux.maxValue.$invalid)
    e.push(
      "Nous ne prenons pas en charge les biens à rénover à plus de 100 000 €"
    );
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

async function handleSubmit() {
  if (!(await v$.value.$validate())) return;

  /* récupère UNIQUEMENT les équipements qui
     – appartiennent au type choisi (visibleCheckboxes)
     – sont cochés dans form */
  const equipments = visibleCheckboxes.value
    .filter((opt) => form[opt.key]) // case cochée
    .map((opt) => opt.key); // ['terrasse', 'jardin', …]

  emit("submit", {
    surface: form.surface ? Number(form.surface) : undefined,
    pieces: form.pieces ? Number(form.pieces) : undefined,
    travaux: form.travaux ? Number(form.travaux) : undefined,
    typeLocal: form.typeLocal,
    DPE: form.DPE,
    equipments,
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

    <InputField
      id="travaux"
      name="travaux"
      label="Montant des travaux"
      placeholder="Montant des travaux à réaliser (€)"
      type="number"
      v-model="form.travaux"
      :error="travauxErrors[0]"
    />

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

    <div class="estimation-form__checkboxes">
      <CheckboxField
        v-for="opt in visibleCheckboxes"
        :key="opt.key"
        :id="opt.key"
        :name="opt.key"
        :label="opt.label"
        v-model="form[opt.key]"
      />
    </div>

    <PrimaryButton variant="accent-color" @click="handleSubmit">
      Lancer l'estimation
    </PrimaryButton>

    <div
      class="errors"
      v-if="
        surfaceErrors[0] ||
        piecesErrors[0] ||
        travauxErrors[0] ||
        typeLocalErrors[0] ||
        DPEErrors[0]
      "
    >
      <span v-for="e in surfaceErrors" :key="e">{{ e }}</span>
      <span v-for="e in piecesErrors" :key="e">{{ e }}</span>
      <span v-for="e in travauxErrors" :key="e">{{ e }}</span>
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
  color: red;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
}
</style>
