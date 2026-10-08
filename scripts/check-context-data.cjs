const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const storage = new Map();
const window = {localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},dispatchEvent:()=>{}};
function load(path, requireFn=require) {
  const exports={};
  const code=ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  vm.runInNewContext(code,{exports,require:requireFn,window,CustomEvent:class{},console,Date});
  return exports;
}
const auth=load('src/shared/auth/auth-storage.ts');
auth.setStoredAuthSession({accessToken:'test',accountType:'real_estate_consultant',activeRole:'real_estate_consultant',role:'real_estate_consultant',mobile:'',expiresAt:null,userId:'7',roles:[{id:'1',name:'Consultant',slug:'real_estate_consultant'},{id:'2',name:'Agency',slug:'real_estate_manager'}],managerPermissions:{manage_consultants:true},contextPermissions:{real_estate_manager:{manage_credits:true},real_estate_consultant:{manage_consultants:true}}});
const keys=load('src/shared/api/query-keys.ts',()=>auth).queryKeys;
const before=JSON.stringify(keys.agencies.consultants({page:1,perPage:20}));
auth.setStoredActiveRole('real_estate_manager');
assert.equal(auth.getStoredAuthSession().managerPermissions.manage_credits,true);
assert.notEqual(before,JSON.stringify(keys.agencies.consultants({page:1,perPage:20})));
auth.setStoredActiveRole('user');
assert.equal(auth.getStoredAuthSession().managerPermissions,undefined);
const agency=fs.readFileSync('src/features/agencies/api/agency.service.ts','utf8');
assert(!agency.includes('me/agency/consultants'));
assert(agency.includes('consultant_id:'));
const requests=fs.readFileSync('src/features/property-requests/api/property-request.service.ts','utf8');
assert(!requests.includes('v1Path'));
assert(requests.includes('scope.apiVersion === "v1" ? {owner_type:'));
console.log('Context permission switching, scoped cache keys, consultant/request mappings passed');
