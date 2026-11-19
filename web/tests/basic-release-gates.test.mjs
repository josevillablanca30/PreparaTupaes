import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const sql=name=>readFileSync(new URL('../supabase/migrations/'+name,import.meta.url),'utf8');
const gateway=readFileSync(new URL('../server/gateway.mjs',import.meta.url),'utf8');

test('Básica permanece cerrada en gateway hasta validación integral',()=>{
  assert.match(gateway,/basicEnabled:false/);
  assert.match(gateway,/WEB_BASIC_EDUCATIONAL_GUARDS_READY/);
  assert.match(gateway,/SERVER_VERIFIED_COMPLETION_REQUIRED/);
});

test('RPC público no puede acreditar consumo mediante UUID del cliente',()=>{
  const quota=sql('20261116193000_cachaste_basic_quota.sql');
  assert.match(quota,/if operation='consume' then raise exception 'COMPLETION_ATTESTATION_REQUIRED'/);
  assert.match(quota,/revoke all on cachaste_web\.basic_usage from public,anon,authenticated/);
});

test('Las reservas de aprendizaje requieren flag desactivado por defecto',()=>{
  const attempts=sql('20261116234000_cachaste_basic_learning_attempts.sql');
  assert.match(attempts,/learning_attempts_enabled boolean not null default false/);
  assert.match(attempts,/BASIC_ATTEMPTS_NOT_READY/);
  assert.match(attempts,/pg_advisory_xact_lock/);
  assert.match(attempts,/grant execute on function public\.cachaste_complete_basic_learning_attempt\(uuid,uuid\) to service_role/);
  assert.doesNotMatch(attempts,/grant execute on function public\.cachaste_complete_basic_learning_attempt\(uuid,uuid\) to authenticated/);
});

test('Duelos reservan al activar, no al invitar, con cupo y bloqueo por usuario',()=>{
  const duels=sql('20261116220000_cachaste_basic_duel_activation_reservations.sql');
  assert.match(duels,/old\.status is distinct from 'invited'/);
  assert.match(duels,/new\.status='active'/);
  assert.match(duels,/if used_count>=2/);
  assert.match(duels,/pg_advisory_xact_lock/);
  assert.match(duels,/not cachaste\.premium\(u\)/);
});

test('Admisión de duelos y lectura de progreso parten apagadas',()=>{
  assert.match(sql('20261116223000_cachaste_basic_duel_admission.sql'),/duel_admission_enabled boolean not null default false/);
  assert.match(sql('20261116230000_cachaste_basic_readonly_progress.sql'),/progress_snapshot_enabled boolean not null default false/);
});

test('No se habilitan cuotas por accidente en las migraciones',()=>{
  for(const name of [
    '20261116223000_cachaste_basic_duel_admission.sql',
    '20261116230000_cachaste_basic_readonly_progress.sql',
    '20261116234000_cachaste_basic_learning_attempts.sql'
  ]){
    const migration=sql(name);
    assert.doesNotMatch(migration,/update\\s+cachaste_web\\.basic_feature_flags\\s+set\\s+[\\s\\S]*?=\\s*true\\s*;/i,name);
  }
});

test('El gateway rechaza respuestas duplicadas antes de llamar a Supabase',()=>{
  assert.match(gateway,/new Set\(body\.answers\.map\(answer=>answer\.questionId\)\)\.size!==body\.answers\.length/);
  assert.match(gateway,/DUPLICATE_QUESTION_ANSWERS/);
});

test('Un diagnóstico reservado conserva su límite vitalicio aunque caduque la sesión',()=>{
 const sql=readFileSync(new URL('../supabase/migrations/20261116234000_cachaste_basic_learning_attempts.sql',import.meta.url),'utf8');
 assert.match(sql,/a\.status='reserved' and a\.kind<>'diagnostic'/);
 assert.match(sql,/basic_learning_diagnostic_once_idx/);
});

test('Gateway Basic conserva JavaScript ejecutable y no secuencias de salto literales',()=>{
 assert.equal(gateway.includes(String.raw`\n    if(new Set(body.answers`),false);
 assert.match(gateway,/\/\/ A repeated question ID[^\n]*\n\s*if\(new Set\(body\.answers/);
});

test('Historial Básica muestra solo aprendizajes finalizados, no duelos reservados',()=>{
 const migration=readFileSync(new URL('../supabase/migrations/20261117002000_cachaste_basic_verified_progress_snapshot.sql',import.meta.url),'utf8');
 assert.match(migration,/kind in \('lesson','diagnostic','expressExam'\)/);
 assert.match(migration,/limit 100/);
 assert.match(migration,/where user_id=u/);
});

test('Reanudación solo devuelve preguntas originales mediante RPC privilegiado',()=>{
 const migration=sql('20261119080000_cachaste_basic_resumable_issuance.sql');
 assert.match(migration,/add column if not exists public_questions jsonb/);
 assert.match(migration,/auth\.role\(\) is distinct from 'service_role'/);
 assert.match(migration,/a\.status<>'reserved'/);
 assert.match(migration,/p_user_id uuid,p_attempt_id uuid/);
 assert.match(migration,/revoke all on function public\.cachaste_resume_basic_question_set\(uuid,uuid\) from public,anon,authenticated/);
 assert.match(migration,/grant execute on function public\.cachaste_resume_basic_question_set\(uuid,uuid\) to service_role/);
 assert.match(gateway,/rpc\/cachaste_resume_basic_question_set/);
 assert.match(gateway,/rpc\/cachaste_store_basic_question_set/);
 assert.doesNotMatch(gateway,/rpc\/cachaste_issue_basic_question_key/);
});
