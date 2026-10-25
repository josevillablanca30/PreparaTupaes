// Exact, web-only adapter: the Android entry file and build remain untouched.
export function adaptCompetitionClient(source) {
  const original = "createClient(config.supabaseUrl,config.publishableKey,{auth:{storage,persistSession:true,autoRefreshToken:true,detectSessionInUrl:typeof window!=='undefined',storageKey:'cachaste-auth-v1'}})";
  if (!source.includes(original) || !source.includes("import {createClient} from '@supabase/supabase-js';")) throw Error('REVIEW_COMPETITION_AUTH_ADAPTER');
  return source.replace("import {createClient} from '@supabase/supabase-js';", "import {getWebClient} from './web/client/auth.mjs';").replace(original, 'getWebClient(config,storage)');
}
