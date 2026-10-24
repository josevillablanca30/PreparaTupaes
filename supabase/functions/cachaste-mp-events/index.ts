import{createClient}from'npm:@supabase/supabase-js@2.118.0';
import{createMercadoPagoHandlers}from'../_shared/mercadopago-handler.mjs';
Deno.serve(createMercadoPagoHandlers({env:(name:string)=>Deno.env.get(name),createClient}).webhook);
