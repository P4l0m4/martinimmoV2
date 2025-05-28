import type { Address, estimationFormInfo } from "@/utils/types";

export async function insertAddressInDB(address: Address) {
  const { $supabase } = useNuxtApp();

  const { data: existing, error: selectErr } = await $supabase
    .from("info_from_estimation")
    .select("id")
    .limit(1)
    .eq("address->properties->>id", address.properties.id);

  if (selectErr) throw selectErr;

  // Si l'adresse n'existe pas, on l'insère
  const { data, error } = await $supabase
    .from("info_from_estimation")
    .insert([{ address }]) // colonne jsonb
    .select();

  if (error) throw error;

  return data;
}

export async function getAllDataFromDB() {
  const { $supabase } = useNuxtApp();
  // @ts-ignore
  const { data, error } = await $supabase
    .from("info_from_estimation")
    .select("*");

  if (error) {
    throw new Error("Failed to fetch data from the database.");
  } else {
    return data;
  }
}

//met à jour les infos dans la ligne correspondant à l'adresse indiquée
export async function updateEstimationFormInfo(
  address: Address,
  payload: estimationFormInfo
) {
  const { $supabase } = useNuxtApp();

  const { error, data } = await $supabase
    .from("info_from_estimation")
    .update({
      surface_batie: payload.surface_batie ?? null,
      surface_habitable: payload.surface_habitable ?? null,
      rooms: payload.rooms ?? null,
      renovation_discount: payload.renovation_discount ?? null,
      type_local: payload.type_local ?? null,
      DPE: payload.DPE ?? null,
      ground_floor: payload.ground_floor,
      equipments: payload.equipments ?? null,
      disqualifications: payload.discalifications ?? null,
    })

    .filter("address->properties->>id", "eq", address.properties.id)
    .select();

  if (error) {
    throw error;
  }
  return data;
}

export async function incrementAmountOfTrials(address: Address) {
  const { $supabase } = useNuxtApp();

  const { error, data } = await $supabase.rpc("increment_trials_by_address", {
    prop_id: address.properties.id,
    delta: 1,
  });

  if (error) {
    throw error;
  } else {
    console.log("Increment ok", data);
  }
  return data;
}

export async function updateEstimate(address: Address, estimate: number) {
  const { $supabase } = useNuxtApp();

  const { data, error } = await $supabase
    .from("info_from_estimation")
    .update({ estimate })
    .filter("address->properties->>id", "eq", address.properties.id)
    .select();

  if (error) throw error;

  return data;
}

export async function updateOffer(address: Address, offer: number) {
  const { $supabase } = useNuxtApp();

  const { data, error } = await $supabase
    .from("info_from_estimation")
    .update({ offer })
    .filter("address->properties->>id", "eq", address.properties.id)
    .select();

  if (error) throw error;

  return data;
}

export async function updateClickedOnVisit(
  address: Address,
  clicked_on_visit: boolean
) {
  const { $supabase } = useNuxtApp();

  const { data, error } = await $supabase
    .from("info_from_estimation")
    .update({ clicked_on_visit })
    .filter("address->properties->>id", "eq", address.properties.id)
    .select();

  if (error) throw error;

  return data;
}

export async function updateClickedOnAgent(
  address: Address,
  clicked_on_agent: boolean
) {
  const { $supabase } = useNuxtApp();

  const { data, error } = await $supabase
    .from("info_from_estimation")
    .update({ clicked_on_agent })
    .filter("address->properties->>id", "eq", address.properties.id)
    .select();

  if (error) throw error;

  return data;
}
