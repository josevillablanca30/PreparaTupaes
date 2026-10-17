import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const root = new URL('../', import.meta.url);
export function loadBanks() {
  const context = vm.createContext({ window: { scrollTo() {} }, document: { getElementById() { return { innerHTML: '' }; } }, localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} } });
  for (const file of ['learning-core.js', 'm1-teaching.js', 'science-bank.js', 'reading-bank.js', 'history-bank.js', 'm2-bank.js']) vm.runInContext(readFileSync(new URL(file, root), 'utf8'), context, { filename: file });
  const html = readFileSync(new URL('index.html', root), 'utf8');
  vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], context, { filename: 'index.html' });
  return { M1: vm.runInContext('catalog', context), Ciencias: context.window.SCIENCE_BANK, Lectura: context.window.READING_QUESTIONS, M2: context.window.CACHASTE_M2, Historia: context.window.CACHASTE_HISTORIA, texts: context.window.READING_PASSAGES };
}
if (process.argv[1]?.endsWith('load-banks.mjs')) {
  const banks = loadBanks();
  const [name, start = 0, end = 999] = process.argv.slice(2);
  if (!name) console.log(Object.fromEntries(Object.entries(banks).map(([k, v]) => [k, v.length])));
  else for (const q of banks[name].slice(+start, +end)) console.log(JSON.stringify(q));
}
