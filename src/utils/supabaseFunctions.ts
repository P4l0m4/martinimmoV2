// import { createClient } from "@supabase/supabase-js";

// import type { Address } from "@/utils/types";

// const supabase = createClient(
//   import.meta.env.NUXT_PUBLIC_SUPABASE_URL as string,
//   import.meta.env.NUXT_PUBLIC_SUPABASE_KEY as string
// );

// export async function insertAddressInDB(address: Address) {
//   const { data, error } = await supabase
//     .from("info_from_estimation")
//     .insert([{ address: address }])
//     .select();

//   if (error) {
//     throw new Error("Failed to insert address into the database.");
//   } else {
//     console.log("Address inserted successfully");
//     return data;
//   }
// }
