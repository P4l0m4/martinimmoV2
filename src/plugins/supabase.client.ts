import { createClient } from "@supabase/supabase-js";
export default defineNuxtPlugin(() => {
  const cfg = useRuntimeConfig();
  const supabase = createClient(
    cfg.public.NUXT_PUBLIC_SUPABASE_URL,
    cfg.public.NUXT_PUBLIC_SUPABASE_KEY
  );
  return { provide: { supabase } };
});
