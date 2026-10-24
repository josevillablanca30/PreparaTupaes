const common=new Set(['check','next','start','startExam','discardMath','requestDiscardMath','finishExam','requestHint','resumeMathDiagnosis','resumeSavedExam','reviewErrors','reviewPending','startVariant','toggleExamFlag','toggleExamOverview','verifyLearning','examMove','jumpExamQuestion','mathPast','navigate','readingAdvance','readingBack','readingBegin','readingCheck','readingChoose','readingDiscard','readingExamAction','readingExamJump','readingExplanation','readingHint','readingPast','readingResume','answer','backHome','changeMode','chooseTrack','copyNotes','discard','examAction','examAdvance','examJump','exportNotes','hint','progress','resume','reviewToggle','saveNote','sciencePast','setup']);
export function parseLegacyAction(input){
 const text=String(input||'').trim();let m;
 if((m=/^choice=([0-5]);draw\(\)$/.exec(text)))return{type:'math-choice',choice:Number(m[1])};
 if((m=/^choice=([0-5]);examAnswers\[i\]=\1;persistExam\(\);draw\(\)$/.exec(text)))return{type:'math-exam-choice',choice:Number(m[1])};
 if((m=/^mode='(steps|easy|example)';draw\(\)$/.exec(text)))return{type:'math-mode',mode:m[1]};
 if(text==='examConfirming=false;examOverviewOpen=true;draw()')return{type:'math-overview'};
 if(text==='examConfirming=true;examOverviewOpen=false;draw()')return{type:'math-confirm'};
 m=/^([A-Za-z][A-Za-z0-9]*)\((.*)\)$/.exec(text);if(!m||!common.has(m[1]))throw Error('UNSUPPORTED_LEGACY_ACTION');
 const raw=m[2].trim();let value;if(raw==='')return{type:'call',name:m[1],args:[]};
 if(/^-?\d{1,5}$/.test(raw))value=Number(raw);
 else if(raw==='true'||raw==='false')value=raw==='true';
 else if(/^"(?:[^"\\]|\\["\\/bfnrt]|\\u[\da-fA-F]{4})*"$/.test(raw))value=JSON.parse(raw);
 else if(/^'[^'\\\r\n]{0,200}'$/.test(raw))value=raw.slice(1,-1);
 else throw Error('UNSUPPORTED_LEGACY_ACTION');
 if(typeof value==='string'&&value.length>200)throw Error('UNSUPPORTED_LEGACY_ACTION');
 return{type:'call',name:m[1],args:[value]};
}
export const adaptLegacyActions=source=>source.replaceAll('onclick=','data-web-legacy=');
