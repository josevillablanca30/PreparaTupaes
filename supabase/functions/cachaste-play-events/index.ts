import {createClient} from 'npm:@supabase/supabase-js@2.118.0';
import {createPlayEventsHandler} from '../_shared/play-events.mjs';
Deno.serve(createPlayEventsHandler({env:(name:string)=>Deno.env.get(name),createClient}));
