import test from 'node:test';import assert from 'node:assert/strict';import {PGlite} from '@electric-sql/pglite';
import {competitionRows} from '../scripts/competition-catalog.mjs';import {contextCorrectionSql,observedPriorHashes} from '../scripts/context-correction-sql.mjs';
test('La corrección del servidor actualiza cuatro cuerpos, conserva claves/resultados y rechaza conflictos de forma atómica',async()=>{
 const db=new PGlite();try{
  await db.exec('create schema cachaste;create table cachaste.questions(key text primary key,assessment_hash text,answer int,body jsonb);create table cachaste.answers(id int primary key,question_key text,choice int,correct boolean);');
  const rows=competitionRows().filter(q=>observedPriorHashes[q.key]);
  for(const q of rows)await db.query('insert into cachaste.questions values($1,$2,$3,$4)',[q.key,observedPriorHashes[q.key],q.answer,JSON.stringify({...q.body,easy:'Versión anterior'})]);
  await db.exec("insert into cachaste.questions values('unchanged','fixed',1,'{\"options\":[\"a\",\"b\"]}');insert into cachaste.answers values(1,'M1:TR-M1-007',2,true);");
  const old=await db.query('select * from cachaste.answers');await db.exec(contextCorrectionSql());await db.exec(contextCorrectionSql());
  for(const q of rows){const actual=(await db.query('select * from cachaste.questions where key=$1',[q.key])).rows[0];assert.equal(actual.assessment_hash,q.hash);assert.equal(actual.answer,q.answer);assert.deepEqual(actual.body,JSON.parse(JSON.stringify(q.body)));}
  assert.deepEqual((await db.query('select * from cachaste.answers')).rows,old.rows);assert.equal((await db.query("select assessment_hash from cachaste.questions where key='unchanged'")).rows[0].assessment_hash,'fixed');
  await db.query('update cachaste.questions set assessment_hash=$1 where key=$2',['unexpected',rows.at(-1).key]);
  await db.exec("update cachaste.questions set body=jsonb_set(body,'{easy}','\"Must survive rollback\"') where key='M1:TR-M1-007'");
  await assert.rejects(db.exec(contextCorrectionSql()),/CONTEXT_REVIEW_CONFLICT/);await db.exec('rollback');
  assert.equal((await db.query("select body->>'easy' as easy from cachaste.questions where key='M1:TR-M1-007'")).rows[0].easy,'Must survive rollback');
 }finally{await db.close();}
});
