import {createClient} from 'npm:@supabase/supabase-js@2.118.0';
import {createPlayHandler} from '../_shared/play-handler.mjs';
Deno.serve(createPlayHandler({env:(name:string)=>Deno.env.get(name),createClient}));
