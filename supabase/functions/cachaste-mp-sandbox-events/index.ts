import {createClient} from 'npm:@supabase/supabase-js@2.118.0';
import {createSandboxHandlers} from '../_shared/mercadopago-sandbox.mjs';
Deno.serve(createSandboxHandlers({env:key=>Deno.env.get(key),createClient}).webhook);
