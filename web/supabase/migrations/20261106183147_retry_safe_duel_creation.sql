-- A second simultaneous retry may have read before the first invitation committed.
-- Recheck its UUID after the existing per-caller rate lock, before the pair guard.
-- No changes to Auth, access, question verification, scoring or active-pair rules.
begin;
do $migration$
declare source text; anchor text;
begin
 source:=pg_get_functiondef('cachaste.dispatch_before_community(text,jsonb)'::regprocedure);
 anchor:=$old$if nullif(p->>'nickname','')is not null then$old$;
 if position('Recheck request after caller lock' in source)>0 then return;end if;
 if (length(source)-length(replace(source,anchor,'')))/length(anchor)<>1 then raise exception 'Unexpected invitation dispatcher';end if;
 source:=replace(source,anchor,$new$-- Recheck request after caller lock: a concurrent retry returns the original duel.
  select id into did from cachaste.duels where id=rid and creator=u;
  if did is not null then return cachaste.duel_view(did,u);end if;
  if nullif(p->>'nickname','')is not null then$new$);
 execute source;
end $migration$;
commit;
