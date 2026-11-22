import {mergeDocument} from '../web/shared/progress.mjs';
// Display the pre-account offline history alongside server-confirmed progress.
// This merge never writes quotas, grants access, or submits Basic progress to the server.
export function mergeLegacyProgress(canonical,legacy){
 const value=canonical==null?structuredClone(legacy):mergeDocument(null,canonical,legacy).value;
 if(value&&typeof value==='object'&&!Array.isArray(value)){
  value.session=canonical?.session??null;
  value.foundationDraft=canonical?.foundationDraft??null;
 }
 return value;
}
