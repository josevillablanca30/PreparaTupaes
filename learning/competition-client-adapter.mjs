export function installLearningCompetition(CompetitionClient,errors){
const connect=CompetitionClient.prototype.connect,call=CompetitionClient.prototype.call;
CompetitionClient.prototype.connect=async function(){
 const state=await connect.call(this);this.basic=false;
 if(typeof window!=='undefined'&&location.origin!=='https://appassets.androidplatform.net'&&window.CachasteWebBootstrap?.originalEngineEnabled!==true)return state;
 if(!this.user)return state;
 const {data,error}=await this.sdk.rpc('cachaste_learning_access');
 if(!error&&data?.userId===this.user.id){
  // Existing web subscriptions/tester benefits take precedence even if a legacy competition response is stale.
  this.premium=data.tier==='premium';this.basic=data.tier==='basica';
  if(this.premium||this.basic){const {data:session}=await this.sdk.auth.getSession();try{await this.nativeAccess('verify',session.session.access_token);}catch{this.nativeAccessUnavailable=true;}}
 }
 return {...state,premium:this.premium,basic:this.basic};
};
const d2=new Set(['dashboard','duel_history','create_duel','join_code','accept','decline','random','cancel_queue','duel','start','attempt','answer','forfeit','review','rematch','rankings']);
CompetitionClient.prototype.call=async function(operation,payload={}){
 if(!this.basic)return call.call(this,operation,payload);
 if(operation==='rankings'){const {data,error}=await this.sdk.rpc('cachaste_basic_rankings',{payload});if(error)throw error;return data;}
 if(d2.has(operation)){
  const {data,error}=await this.sdk.rpc('cachaste_duels2',{operation,payload});if(error)throw error;return data;
 }
 // Legacy full competitive exams remain Premium-only in the database.
 return call.call(this,operation,payload);
};
errors.BASIC_DUEL_LIMIT_REACHED='¡Vas súper bien! Completaste tus dos duelos gratuitos de hoy. Vuelve mañana para seguir compitiendo.';
}
