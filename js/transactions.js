if(typeof drp == "undefined") var drp = {};
if(typeof drp.tr == "undefined") drp.tr = {};
if(typeof drp.tr.comm == "undefined") drp.tr.comm = {};
if(typeof drp.tr.tr == "undefined") drp.tr.tr = {};
if(typeof drp.tr.sys == "undefined") drp.tr.sys = {};
/**
 * 
 * 
 * SYSTEM
 * 
 * 
 */
drp.tr.sys.nuke = function(actionId,callback){
	jQuery.post("?",{"sys":actionId,"comm":"nuke"},callback);
}
/**
 * 
 * 
 * COMMANDS
 * 
 * 
 */
drp.tr.comm.comm = function(method,params){
	return { jsonrpc:"2.0", id:method, method:method, params:params};
}
// algemene command
drp.tr.comm.generic = function(type,method,params){
    return drp.tr.comm.comm(type+":"+method,params);
}
// genereer een challenge om mee in te loggen
drp.tr.comm.SessionGenerateChallenge = function(){
	return drp.tr.comm.comm("session:generateChallenge",[]);
}
// log in met gebruikers login naam en response
drp.tr.comm.SessionLoginForLoginNameAndResponse = function(loginName, response){
	return drp.tr.comm.comm("session:submitResponse",[loginName,response]);
}
// password reset mail opvragen
drp.tr.comm.UserResetPasswd = function(mail){
	return drp.tr.comm.comm("user:resetPassword",[mail]);
}
// password reset mail opvragen
drp.tr.comm.UserResetEmail = function(email){
	return drp.tr.comm.comm("user:resetEmail",[email]);
}
// gebruikersnaam voor password reset token opvragen
drp.tr.comm.GetUserNameForPasswordReset = function(token){
	return drp.tr.comm.comm("userinvite:userNameForToken",[token]);
}
drp.tr.comm.GetUserNameForEmailReset = function(token){
	return drp.tr.comm.comm("userinvite:userNameForToken",[token]);
}
drp.tr.comm.SubmitNewPassword = function(token,passwdhash){
	return drp.tr.comm.comm("userinvite:resetPassword",[token,passwdhash]);
}
// uitloggen
drp.tr.comm.logout = function(){
    return drp.tr.comm.comm("session:destroy",[]);
}
// nodig een gebruiker uit voor een rol door zijn mail adres in te typen
drp.tr.comm.UserInvite = function(userMail, roleId, sendMail){
        return drp.tr.comm.comm("userinvite:store",[{"mail":userMail,"sharedRole":[roleId],"sendMail":sendMail}])
}
// gooi de hele database leeg
drp.tr.comm.SessionNukeDataBase = function(){
	return drp.tr.comm.comm("session:nukeDataBase",[]);
}
// voeg een moderator toe
// ---stap 1: rol id ophalen voor moderator
drp.tr.comm.RoleReadForRoleName = function(roleName){
	return drp.tr.comm.comm("role:find",[["id","name"],[{name:roleName}]]);
}
drp.tr.comm.mailAdresForUid = function(uid){
    return drp.tr.comm.comm("user:load",[uid]);
}
drp.tr.comm.addBook = function (bookUnique){
    return drp.tr.comm.comm("book:store",[{"pending":0,"bookUnique":bookUnique}]);
}
//
// voeg een vraag toe
drp.tr.comm.addQuestion = function (q,a){
    return drp.tr.comm.comm("question:store",[{question:q,answer:a}]);
}
// voeg een tag toe
drp.tr.comm.addTag = function(tag, description){
    return drp.tr.comm.comm("tag:store",[{tag:tag,description:description}]);
}
// krijg een vraag
drp.tr.comm.getQuestion  = function(){
    return drp.tr.comm.comm("question:loadRandom",[]);
}
drp.tr.comm.submitAnswer = function(answer,questionId,bookUnique,userMail){
    return drp.tr.comm.comm("question:answer",[{answer:answer,questionId:questionId,bookUnique:bookUnique,userMail:userMail}]);
}
drp.tr.comm.submitLocation = function(our_location){
    return drp.tr.comm.comm("location:store",[our_location]);
}
drp.tr.comm.submitUser = function(user){
    return drp.tr.comm.comm("user:store",[user]);
}
drp.tr.comm.submitReview = function(rev){
    return drp.tr.comm.comm("review:store",[rev]);
}
drp.tr.comm.submitComment = function(cmm){
    return drp.tr.comm.comm("comment:store",[cmm]);
}
drp.tr.comm.getData = function(){
    return drp.tr.comm.comm("misc:getAll",[]);
}
drp.tr.comm.checkUser = function(){
    return drp.tr.comm.comm("session:getUser",[]);
}
drp.tr.comm.DeleteEntity = function(type,id){
    return drp.tr.comm.comm(type+":trash",[id]);
}
drp.tr.comm.hasUserReviewed = function(uid){
    return drp.tr.comm.comm("user:hasReviewed", [uid]);
}
drp.tr.comm.doesUserHaveBook = function(uid){
    return drp.tr.comm.comm("user:hasBook", [uid]);
}
var exampleCreateBookQuestion = 
{
	"action":
	{
		"actionId" : "myId", /*-- een database onafhankelijk veld om de actie in de front end te identificeren --*/
		"commands" : /*-- zullen in volgorde worden afgewerkt tot het eind of tot error --*/
	 	[
			
			{
				"jsonrpc":"2.0", /*-- dit moet erbij volgens het protocol van bean can server --*/
				"id":"question_store", /*-- een database onafhankelijk veld om de actie in de front end te identificeren --*/
				"method":"question:store", /*-- object:methode. Standaardmethodes zijn load, store en trash. Custom kan ook.--*/
				"params": /*-- deze moeten overeenstemmen met de database velden en/of de red bean php ORM api --*/
				[
					{
						"ownUser":"1"
					}
				]
			},
			{
				"jsonrpc":"2.0", /*-- dit moet erbij volgens het protocol van bean can server --*/
				"id":"question_store", /*-- een database onafhankelijk veld om de actie in de front end te identificeren --*/
				"method":"question:store", /*-- object:methode. Standaardmethodes zijn load, store en trash. Custom kan ook.--*/
				"params": /*-- deze moeten overeenstemmen met de database velden en/of de red bean php ORM api --*/
				[
					{
						"ownUser":"1"
					}
				]
			}
		]
	}
};