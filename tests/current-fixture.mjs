import vm from 'node:vm';import{readFileSync}from'node:fs';
const ctx=vm.createContext({});vm.runInContext(readFileSync(new URL('../learning-core.js',import.meta.url),'utf8'),ctx);
export const currentSession=(bank,session)=>JSON.parse(JSON.stringify(ctx.CachasteLearning.freezeSession(session,bank)));
