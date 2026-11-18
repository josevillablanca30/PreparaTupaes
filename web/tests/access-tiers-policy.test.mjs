import test from 'node:test';
import assert from 'node:assert/strict';
import {BASIC_LIMITS, PAES_SUBJECTS, MONTHLY_TRIAL, accessTier, basicQuota} from '../shared/access-tiers.mjs';

test('Básica: 3 lecciones diarias independientes por asignatura', () => {
  assert.equal(PAES_SUBJECTS.length, 5);
  for (const subject of PAES_SUBJECTS) {
    assert.deepEqual(basicQuota({kind:'lesson',subject,used:0}), {allowed:true,remaining:3});
    assert.deepEqual(basicQuota({kind:'lesson',subject,used:2}), {allowed:true,remaining:1});
    assert.deepEqual(basicQuota({kind:'lesson',subject,used:3}), {allowed:false,remaining:0});
  }
  assert.equal(BASIC_LIMITS.lessonsPerSubjectPerDay,3);
});

test('Básica: diagnóstico único por asignatura', () => {
  for (const subject of PAES_SUBJECTS) {
    assert.deepEqual(basicQuota({kind:'diagnostic',subject,diagnosticUsed:false}),{allowed:true,remaining:1});
    assert.deepEqual(basicQuota({kind:'diagnostic',subject,diagnosticUsed:true}),{allowed:false,remaining:0});
  }
});

test('Básica: Express 1/día, duelos 2/día y ensayo completo bloqueado', () => {
  assert.deepEqual(basicQuota({kind:'expressExam',used:1}),{allowed:false,remaining:0});
  assert.deepEqual(basicQuota({kind:'duel',used:1}),{allowed:true,remaining:1});
  assert.deepEqual(basicQuota({kind:'duel',used:2}),{allowed:false,remaining:0});
  assert.deepEqual(basicQuota({kind:'fullExam'}),{allowed:false,remaining:0});
});

test('No aceptar asignaturas, tipos o contadores inválidos', () => {
  assert.throws(()=>basicQuota({kind:'lesson',subject:'otro'}),/INVALID_SUBJECT/);
  assert.throws(()=>basicQuota({kind:'desconocido'}),/INVALID_KIND/);
  for (const used of [-1,1.5,NaN,'1']) {
    assert.throws(()=>basicQuota({kind:'duel',used}),/INVALID_USAGE/);
  }
});

test('Acceso cerrado por defecto; Premium activo tiene prioridad', () => {
  assert.equal(accessTier({}), 'unavailable');
  assert.equal(accessTier({basicEnabled:true}), 'basica');
  assert.equal(accessTier({active:true,basicEnabled:true}), 'premium');
  assert.equal(accessTier({active:false,basicEnabled:false}), 'unavailable');
  assert.deepEqual(MONTHLY_TRIAL,{days:7,renewalPlan:'mensual',renewalAmountCLP:7990});
});
