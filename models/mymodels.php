<?php
/**
 * The session connects a cookie to a user.
 * A few important notes:
 * 
 * <ol>
 *   <li>permissions are based on native php sessions</li>
 *   <li>session has a user, who has roles, which have access permissions</li>
 *   <li>most methods are for other servicemodels conveniences</li>
 *   <li>the retrieved session can only be the current session</li>
 *   <li>as an FCF_Exception special permissions may allow for retrieval and modification of other sessions</li>
 * </ol>
 * 
 * importent properties are
 * <ul>
 * <li>ssid - the session id value</li>
 * <li>userid - the user who is logged into this session</li>
 * <li>chall - the random challenge for login encryption</li>
 * <li>challTime - chall is valid limited amount of time</li>
 * </ul>
 */
class Model_Misc extends FCF_RedBean_SimpleModel{
    public function getAll(){
        
        
        
        
        $ret = new stdClass();
        
        $book = R::find("book");
        $comment = R::find("comment");
        $location = R::find("location");
        $review = R::find("review");
        $user = R::find("user");
        $question = R::find("question");
        $tag = R::find("tag");
        
        // todo verschillende sets afh van rol
        
        
        $ret->book = R::exportAll($book);
        $ret->comment = R::exportAll($comment);
        $ret->location = R::exportAll($location);
        $ret->review = R::exportAll($review);
        $ret->user = R::exportAll($user);
        $ret->tag = R::exportAll($tag);
        
        
        
        
        // filter only the relevant front end values
        // and wathc out for secret information
        // and of lists only take the ID
        $flt = new stdClass();
        $flt->book = array("id","sharedUser");
        $flt->comment = array("body","header","id","ownLocation","time","sharedReview","sharedUser");
        $flt->location = array("Ma","Na","time","id");
        $flt->review = array("body","header","id","ownLocation","time","sharedUser");
        $flt->user = array("id","ownLocation","screenName","time","loginName");
        $flt->tag = array("id","description","tag");
        if(Model_Session::hasLoggedInUserForOneOfRoles(array(
                Model_Role::getRoleIdForName(Model_Role::$ROLE_NAME_SYSADMIN),
                Model_Role::getRoleIdForName(Model_Role::$ROLE_NAME_MODERATOR))
        )){
            $flt->user[] = 'mail';
            $ret->question = R::exportAll($question);
            $flt->question = array('id','question','answer');
        }
        // TODO dit is een handige algemeen bruikbare functie die in het framework moet
        foreach($ret as $type => $expBeans){
            $expFilt = $flt->$type;
            foreach($expBeans as $ebi => $expBean){
                $delete = array();
                $rewrite = array();
                foreach($expBean as $prop => $val){
                    if(!(in_array($prop, $expFilt))){
                        $delete[] = $prop;
                    }else if(is_array($val) || is_object($val)){
                        $replaceIDOnly = array();
                        foreach($val as $valp => $valv){
                            $replaceIDOnly[$valp] = array("id" => $valv["id"]);
                        }
                        $expBean[$prop] = $replaceIDOnly;
                    }
                }
                foreach($delete as $delProp){
                    unset($expBean[$delProp]);
                }
                $expBeans[$ebi] = $expBean;
                $b = 0;
            }
            $ret->{$type} = $expBeans;
            $b = 0;
        }
        return $ret;
    }
}
class Model_Review extends FCF_RedBean_SimpleModel {
    private $reviewOwner;
    public function update(){
        if(!($user = Model_Session::getLoggedInUser())) throw new Exception ("you need to login first");
        if(!(isset($this->reviewOwner))) $this->reviewOwner = $user;
    }
    public function after_update(){
        if(isset($this->reviewOwner)){
            R::associate($this->reviewOwner,$this->bean);
            unset($this->reviewOwner);
        }
    }
    public function dispense() {
        $this->bean->pending = true;
        $this->bean->time = time();
    }
    public function delete() {
        if(false === ($user = Model_Session::getLoggedInUser())) throw new Exception("comment delete fail 1");
        if(Model_Session::hasLoggedInUserForOneOfRoles(array(
                Model_Role::getRoleIdForName(Model_Role::$ROLE_NAME_SYSADMIN),
                Model_Role::getRoleIdForName(Model_Role::$ROLE_NAME_MODERATOR))
        )){
            return true;
        }
        if ( ! ( array_key_exists ( $user->id , R::related($this->bean, 'user') ) ) ) throw new Exception("comment delete fail 2");
    }
}
class Model_Comment extends FCF_RedBean_SimpleModel {
    private $relatedEntityType;
    private $relatedEntityId;
    private $owner;
    public function update() {
        if(!($user = Model_Session::getLoggedInUser())) throw new Exception ("you need to login first");
        // comment submission only allowed for users who added review(s) first
        $ownersReviews = R::related($user, 'review');
        if(count($ownersReviews) == 0) throw new Exception("No comments allowed without review!");
        // 
        if(!(isset($this->owner))) $this->owner = $user;
        if($this->commentedEntityId){ 
            $this->relatedEntityId = $this->commentedEntityId;
            $this->relatedEntityType = $this->commentedEntityType;
            $this->bean->removeProperty("commentedEntityType");
            $this->bean->removeProperty("commentedEntityId");
        }
    }     
    public function after_update() {
            if($this->relatedEntityType && $this->relatedEntityId){
                $commented = R::load($this->relatedEntityType,$this->relatedEntityId);
                R::associate($this->bean, $commented);
            }
            if(isset($this->owner)){
                R::associate($this->owner,$this->bean);
                unset($this->owner);
            }
        }
    public function open() {
        //throw new FCF_Exception('not implemented');
    }
    public function delete() {
        if(false === ($user = Model_Session::getLoggedInUser())) throw new Exception("comment delete fail 1");
        if(Model_Session::hasLoggedInUserForOneOfRoles(array(
                Model_Role::getRoleIdForName(Model_Role::$ROLE_NAME_SYSADMIN),
                Model_Role::getRoleIdForName(Model_Role::$ROLE_NAME_MODERATOR))
        )){
            return true;
        }
        if ( ! ( array_key_exists ( $user->id , R::related($this->bean, 'user') ) ) ) throw new Exception("comment delete fail 2");
    }
    public function after_delete() {
        //throw new FCF_Exception('not implemented');
    }
    public function dispense() {
        $this->bean->pending = true;
        $this->bean->time = time();
    }
}
class Model_Book extends FCF_RedBean_SimpleModel {
    public function update() {
        if(Model_Session::hasLoggedInUserForOneOfRoles(array(
            Model_Role::getRoleIdForName(Model_Role::$ROLE_NAME_MODERATOR),
            Model_Role::getRoleIdForName(Model_Role::$ROLE_NAME_SYSADMIN),
        ))){
            return true;
        }else{
            throw new Exception("book update fail 1");
        }
    }
    public function after_update() {
        //throw new FCF_Exception('not implemented');
    }
    public function open() {
        
    }
    public function delete() {
        throw new FCF_Exception('not implemented');
    }
    public function after_delete() {
        throw new FCF_Exception('not implemented');
    }
    public function dispense() {
        $this->bean->pending = true;
        $this->bean->time = time();
    }
}
class Model_Tag extends FCF_RedBean_SimpleModel{
    public function update() {
        if(Model_Session::hasLoggedInUserForOneOfRoles(array(
            Model_Role::getRoleIdForName(Model_Role::$ROLE_NAME_MODERATOR),
            Model_Role::getRoleIdForName(Model_Role::$ROLE_NAME_SYSADMIN),
        ))){
            return true;
        }else{
            throw new Exception("tag update fail 1");
        }
    }
	public function delete() {
        throw new FCF_Exception('not implemented');
    }
	public function after_delete() {
        throw new FCF_Exception('not implemented');
    }
    public function dispense() {
        $this->bean->pending = true;
        $this->bean->time = time();
    }
} 
class Model_Question extends FCF_RedBean_SimpleModel{
    public function update() {
        if(Model_Session::hasLoggedInUserForOneOfRoles(array(
            Model_Role::getRoleIdForName(Model_Role::$ROLE_NAME_MODERATOR),
            Model_Role::getRoleIdForName(Model_Role::$ROLE_NAME_SYSADMIN),
        ))){
            return true;
        }else{
            throw new Exception("book update fail 1");
        }
    }
	public function after_update() {
        //throw new FCF_Exception('not implemented');
    }
    public function open() {
        // TODO zorg dat de antwoorden niet meekomen
    }
    public function loadRandom(){
        $q = R::find('question');
        $random = rand(0,count($q)-1);
        $inc = 0;
        $sq;
        foreach($q as $id => $qq){
            if($inc == $random){
                $sq = $qq;
                break;
            }$inc++;
        }
        $ret = new stdClass();
        $ret->id = $sq->id;
        $ret->question = $sq->question;
        return $ret;
    }
    public function answer($args){
        //
        // answer correct?
        //
        $question = R::load('question', $args["questionId"]);
        if(!(strtoupper($question->answer) == strtoupper($args["answer"]))){
            throw new Exception("answer incorrect");
        }
        //
        // book code correct?
        //
        $bookUnique = $args["bookUnique"];
        $book = MM::allowOne(R::find('book', ' bookUnique = ?',array($bookUnique)),"book not found for code");
        //
        // mail adress not already registered?
        //
        $user = R::find('user', ' mail = ?', array($args["userMail"]));
        if(count($user) > 0) throw new Exception("mail address exists");
        //
        // we are OK
        //
        // CREATE INVITE
        $userinvite = R::dispense('userinvite');
        // ADD ROLE AND MAIL TO INVITE
        $role = R::load('role', Model_Role::getRoleIdForName(Model_Role::$ROLE_NAME_REGISTERED_USER));
        $userinvite->sharedRole[] = $role;
        $userinvite->mail = $args["userMail"];
        // ADD PERMISSION TO STORE THIS USERINVITE & STORE
        parent::addPermission(new FCF_Permission(FCF_Permission::$QUERY_TYPE_WRITE, 1329256606, $userinvite));
        R::store($userinvite);
        // ASSOCIATE THIS ANSWER TO THIS INVITE AND THIS BOOK AND STORE IT
        $answer = R::dispense('answer');
        $answer->correct = 1;
        R::store($answer);
        R::associate($answer, $userinvite);
        R::associate($answer, $book);
        // RETURN A SUCCESS MESSAGE
        return $this->success();
    }
	public function delete() {
        throw new FCF_Exception('not implemented');
    }
	public function after_delete() {
        throw new FCF_Exception('not implemented');
    }
    public function dispense() {
        $this->bean->pending = true;
        $this->bean->time = time();
    }
} 
?>