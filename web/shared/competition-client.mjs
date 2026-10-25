// Exact, web-only adapter: the Android entry file and build remain untouched.
export function adaptCompetitionClient(source) {
  const original = "createClient(config.supabaseUrl,config.publishableKey,{auth:{storage,persistSession:true,autoRefreshToken:true,detectSessionInUrl:typeof window!=='undefined',storageKey:'cachaste-auth-v1'}})";
  if (!source.includes(original) || !source.includes("import {createClient} from '@supabase/supabase-js';")) throw Error('REVIEW_COMPETITION_AUTH_ADAPTER');
  return source.replace("import {createClient} from '@supabase/supabase-js';", "import {getWebClient} from './web/client/auth.mjs';").replace(original, 'getWebClient(config,storage)').replace('export const errors={',"export const errors={REAUTHENTICATION_REQUIRED:'Confirma nuevamente tu acceso con Google desde Mi cuenta y vuelve a Perfil para eliminar la cuenta.',");
}
