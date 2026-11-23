import {defineConfig,devices} from '@playwright/test';
export default defineConfig({
 testDir:'./tests',testMatch:'web-public-smoke.spec.mjs',
 fullyParallel:true,retries:1,workers:2,reporter:'list',
 use:{baseURL:'http://127.0.0.1:5173',trace:'retain-on-failure',screenshot:'only-on-failure'},
 projects:[
  {name:'mobile-320',use:{...devices['Desktop Chrome'],viewport:{width:320,height:640}}},
  {name:'mobile-390',use:{...devices['Desktop Chrome'],viewport:{width:390,height:844}}},
  {name:'desktop',use:{...devices['Desktop Chrome'],viewport:{width:1366,height:768}}}
 ],
 webServer:{command:'node web/scripts/dev-server.mjs --port 5173 --host 127.0.0.1',url:'http://127.0.0.1:5173/api/config',reuseExistingServer:false,timeout:30000}
});
