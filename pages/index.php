<!DOCTYPE html>
<!--[if lte IE 8]>
<style type="text/css" media="screen">
html {filter:gray;}
body {margin-top:0;}
#browseSad {background:#000;border-bottom:10px solid #fff;left:0;top:0;width:100%;position:absolute;z-index:1100;}
#browseSad * {color:#fff;text-align:center;}
#browseSad div {margin:24px 48px;}
#browseSad h1 {font-size:21px;margin:0 0 5px;}
#browseSad h2 {font-size:16px;margin:0 0 10px;}
#browseSad p {font-size:14px;margin:0;}
#browseSad a {font-weight:bold;text-decoration:underline;}
</style>
<div id="browseSad"><div>
<h1>O Dear, it seems you are using an out of date browser.</h1>
<h2>This website works best with one of the following browsers:</h2>
<p><a href="http://www.google.com/chrome" target="_blank">Google Chrome</a></p>
<p><a href="http://mozilla.org/firefox" target="_blank">Mozilla Firefox</a></p>
<p><a href="http://microsoft.com/internetexplorer" target="_blank">Internet Explorer 9</a></p>
</div></div>
<![endif]-->
<html>
    <head>
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

        <link rel="StyleSheet" href="app/css/styles.css" type="text/css">
        <link type="text/css" href="app/css/jquery.jscrollpane.css" rel="stylesheet" media="all" />

        <!-- voor de dialogen van jquery ui -->
        <link rel="stylesheet" type="text/css" href="app/css/lefrog.css" />

        <title>urbantranslations</title>
        <script type="text/javascript">var whatToDoBart = "<?php if (isset($_GET["check"])) {
    echo $_GET["check"];
} else {
    echo "none";
} ?>";</script>
        <script type="text/javascript">var fakeItBart = "<?php if (isset($_GET["fake"])) {
    echo $_GET["fake"];
} else {
    echo "none";
} ?>";</script>
        <!-- JSON -->
        <script type="text/javascript" src="app/js/ext/json2.js"></script>
        <!-- PTT -->
        <script type="text/javascript" src="app/js/ext/prototype.js"></script>
        <!-- GGL -->
        <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=true"></script>
        <script type="text/javascript" src="app/js/ext/infobox.js"></script>
        <script type="text/javascript" src="app/js/ext/markerwithlabel.js"></script>
        <script type="text/javascript" src="app/js/ext/v3_epoly_proj.js"></script>
        <!-- JQR -->
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
        <script type="text/javascript" src="app/js/ext/jquery-ui.js"></script>
        <script src="app/js/ext/jsrender.js" type="text/javascript"></script>
        <script type="text/javascript" src="app/js/ext/jquery.mousewheel.js"></script>
        <script type="text/javascript" src="app/js/ext/jquery.jscrollpane.min.js"></script>
        <!-- MCL -->
        <script type="text/javascript" src="app/js/ext/sha.js"></script>
        <!-- :-) -->
        <script type="text/javascript">jQuery.noConflict();</script>
        <script type="text/javascript" src="app/js/transactions.js"></script>
        <script src="app/js/speedrpan.js" type="text/javascript"></script>
        <script type="text/javascript" src="app/js/vdvw_m.js"></script>


        <script type="text/javascript" src="app/js/ext/ckeditor/ckeditor_source.js"></script>
        <script type="text/javascript" src="app/js/ext/ckeditor/adapters/jquery.js"></script>
        <!--<script type="text/javascript">CKEDITOR.timestamp = (new Date()).toString() ;</script>-->
        <script type="text/javascript">
            /*$(document).ready(function() {
                $('#contentpane').jScrollPane();
        });*/
        </script>

        <!-- breadcrumb elements -->
        <!-- breadcrumb elements -->
        <!-- breadcrumb elements -->
        <script id="allBooks" type="text/x-jquery-tmpl">
        <p>In the beginning, twenty publications of "DETROIT: BACK TO THE FUTURE/ARCHIVE OF IMPRESSIONS" were sent all over the earth's surface....</p>
    </script>
    <script id="bookTraceFirst" type="text/x-jquery-tmpl">
        <p><span class="icon"><img src="app/images/site/stop_icon8.png"/></span> Expodium Foundation sent <span class="fcf-click" id="fcf-{{=type}}-{{=id}}">book {{=id}}</span> to <span class="fcf-click" id="fcf-{{=ownerType}}-{{=ownerId}}">{{=ownerName}}</span>.</p>
    </script>
    <script id="bookTrace" type="text/x-jquery-tmpl">
        <p><span class="bookPrintId klk">Book {{=hId}}</span> was then sent to <span class="bookPrintOwnerName klk">{{=ownerName}}</span>. <span class="time">({{=hTime}})</span></p>
    </script>
    <script id="bookTraceLast" type="text/x-jquery-tmpl">
        <p><span class="icon"><img src="app/images/site/stop_icon8.png"/></span> <span class="fcf-click" id="fcf-{{=type}}-{{=id}}">Book {{=id}}</span> is currently residing with <span class="fcf-click" id="fcf-{{=ownerType}}-{{=ownerId}}">{{=ownerName}}</span>...</p>
    </script>
    <script id="bookWithUser" type="text/x-jquery-tmpl">
        <p><span class="bookPrintId klk">BookPrint no. {{=hId}}</span> currently stays with <img src="app/images/site/stop_icon8.png"/><span class="bookPrintOwnerName klk">{{=ownerName}}</span> at <span class="bookPrintOwnerLocation klk">Lat {{=Ma}}, Long {{=Na}}</span>.</p>
    </script>
    <script id="bookStop" type="text/x-jquery-tmpl">
        <p><span class="bookPrintId klk">BookPrint no. {{=hId}}</span> also stayed with <img src="app/images/site/stop_icon8.png"/><span class="bookPrintOwnerName klk">{{=ownerName}}</span> at <span class="bookPrintOwnerLocation klk">Lat {{=Ma}}, Long {{=Na}}</span>.</p>
    </script>
    <script id="currentBookReview" type="text/x-jquery-tmpl">
        <p><span class="icon"><img src="app/images/site/stop_icon8.png"/></span> <span class="fcf-click" id="fcf-{{=ownerType}}-{{=ownerId}}">{{=ownerName}}</span> posted: "<span class="fcf-click" id="fcf-{{=type}}-{{=id}}">{{=head}}</span>".</p>
    </script>
    <script id="commentByUser" type="text/x-jquery-tmpl">
        <p><span class="icon"><img src="app/images/site/stop_icon8.png"/></span> <span class="fcf-click" id="fcf-{{=ownerType}}-{{=ownerId}}">{{=ownerName}}</span>, when he saw: "<span class="fcf-click" id="fcf-{{=commentedEntityType}}-{{=commentedEntityId}}">{{=commentedEntityHead}}</span>", had this to say: "<span class="fcf-click" id="fcf-{{=type}}-{{=id}}">{{=head}}</span>".</p>
    </script>
    <!-- content pane elements -->
    <!-- content pane elements -->
    <!-- content pane elements -->
    <script id="reviewExpanded" type="text/x-jquery-tmpl">
        <div class='reviewExp' id="fcf-{{=type}}-{{=id}}">
            <div>
                <span class="reviewHead">
                    <span class="pane-icon">
                        <img src="app/images/site/review_inverted.png"/>
                    </span>
                    {{=head}}
                </span>
                <span class="reviewOwnerName fcf-click" id="fcf-{{=ownerType}}-{{=ownerId}}"></br>by {{=ownerName}}</span>
            </div>
            <div>
                <span class="add-comment-button" onclick="vdvw.c.onAddCommentClick({{=id}})">add comment</span>
                <span class="vdvw-delete-button" onclick="vdvw.c.onDeleteClick('{{=type}}',{{=id}},'{{=head}}')">delete</span>
                <span id="reviewId" style="display:none" >{{=id}}</span>
            </div>
            <div>
                <div class="reviewBody">{{=content!}}</div>
            </div>
            <div class="commentsContainer">
            </div>
        </div>
    </script>
    <script id="commentExpanded" type="text/x-jquery-tmpl">
        <div class='commentExp' id="fcf-{{=type}}-{{=id}}">
            <div>
                <span class="commentHead">
                    <span class="pane-icon">
                        <img src="app/images/site/comment_inverted.png"/>
                    </span>
                    {{=head}}
                </span>
                <span class="commentOwnerName fcf-click" id="fcf-{{=ownerType}}-{{=ownerId}}"></br>by {{=ownerName}}</span> 
                in reaction to 
                <span class="commentedHead fcf-click" id="fcf-{{=commentedEntityType}}-{{=commentedEntityId}}">{{=commentedEntityHead}}</span>
            </div>
            <div>
                <span class="vdvw-delete-button" onclick="vdvw.c.onDeleteClick('{{=type}}',{{=id}},'{{=head}}')">delete</span>
            </div>
            <div>
                <div class="commentBody">{{=content!}}</div>
            </div>
        </div>
    </script>
    <!-- panel templates -->	
    <!-- panel templates -->	
    <!-- panel templates -->
    <script id="cmsPanelTPL" type="text/x-jquery-tmpl">
        <div title="lasagna management system"  id="cms-panel" class="drpPanel" style="width: 1000px">
            <div id="cms-mainMenu">
                <ul>
                    <li><a>book</a></li>
                    <li><a>question</a></li>
                    <li><a>user</a></li>
                    <li><a>review</a></li>
                    <li><a>comment</a></li>
                    <li><a>tag</a></li>
                </ul>
            </div>
            <div id="cms-itemsList" style="height: 500px; overflow:auto;">
                <p>click a type to show items</p>
            </div>
            <div id="cms-fieldsList" style="height: 400px; display: none; overflow:auto;">
                <p>items list (empty)</p>
            </div>
            <div id="cms-commands" style="display: none">
                <p>available commands</p>
                <fieldset>
                    <button>edit</button>
                </fieldset>
            </div>
        </div>
    </script>
    <!-- dialog templates -->	
    <!-- dialog templates -->	
    <!-- dialog templates -->	
    <script id="drpNukeTPL" type="text/x-jquery-tmpl">
        <div title="nuke the database"  class="drpDialog">
            <fieldset id="nukeForm">
                <p class="formExplain">In fluid mode you can clear the entire database with one click of a button!</p>
                <button id="nukeButton">NUKE</button>
            </fieldset>
        </div>
    </script>
    <script id="drpLoginTPL" type="text/x-jquery-tmpl">
        <div title="<div style='width:230px;'>login...<div style='float:right'><a style='text-decoration:underline;' class='help' id='safariUsersVersionAlert'>NOTE ABOUT SAFARI</a></div></div>" class="drpDialog" style="width:280px;">
            <fieldset class="drpLoginForm">
                <div class="errorText"></div>
                <p>Enter your login-name and password:</p>
                <input 	id="loginName" 	type="text" 	title="loginName"	class="send"	/>
                <input 	id="password" 	type="password" title="password"	class="noSend"	/>
                <input 	id="challenge" 	type="hidden" 	title="challenge"	class="noSend"	/>
                <input 	id="response"	type="hidden"	title="response"	class="send"	/>
                <button id="doLogin">LOGIN</button>
                <br>
                <button id="forgotLoginData">I FORGOT</button>
            </fieldset>
        </div>
    </script>
    <script id="drpResetPasswordTPL" type="text/x-jquery-tmpl">
        <div title="forgot login data" class="drpDialog">
            <fieldset class="drpResetPasswordForm">
                <div class="errorText"></div>
                <p>No worries. We will send you a link. Then you can reset your password. Your email address please:</p>
                <input 	id="email" 	type="text" 	title="email"	class="send"	/>
                <button id="requestResetLink">REQUEST RESET LINK</button>
            </fieldset>
        </div>
    </script>
    <script id="drpMailSentForResetPasswordDialogTPL" type="text/x-jquery-tmpl">
        <div title="great success" class="drpDialog">
            <fieldset class="drpMailSentForResetPasswordDialogForm">
                <span>An email has been sent. You can now click the link in the email to reset your password. If you think the mail did not come, check your spam box.</span><br/>
            </fieldset>
        </div>
    </script>
    <script id="drpPasswordResetSuccessDialogTPL" type="text/x-jquery-tmpl">
        <div title="now login" class="drpDialog">
            <fieldset class="drpPasswordResetSuccessDialogForm">
                <span>OK {{=username}}, your password was reset. You may now login using your new password.</span><br/>
            </fieldset>
        </div>
    </script>
    <script id="drpSubmitNewPasswordTPL" type="text/x-jquery-tmpl" >
        <div title="Welcome to password reset" class="drpDialog">
            <span>Your username is: {{=username}}. You may now reset your password. Please remember your username and password.</span>
            <fieldset class="drpSubmitNewPasswordForm">
                <span>new password: </span></br>
                <input 	id="password" 	type="text" 	title="newPassword"        class="send"	/>
                <input 	id="token" 	type="hidden" 	title="token"        class="send"       />
                <button id="submitNewPassword">RESET</button>
            </fieldset>
        </div>
    </script>
    <script id="drpLogoutTPL" type="text/x-jquery-tmpl">
        <div title="logout" class="drpDialog">
            <fieldset class="drpLogoutForm">
                <p>You're sure?</p>
                <button id="logout">REALLY</button>
            </fieldset>
        </div>
    </script>
    <script id="drpAddModeratorTPL" type="text/x-jquery-tmpl">
        <div title="add a moderator" class="drpDialog">
            <fieldset class="drpAddModeratorForm">
                <span>email:</span>
                <input 	id="email" 	type="text" 	title="email"           class="send"	/>
                <span>notify new user by email:</span>
                <input  id="sendMail"   type="checkbox" title="send mail"       name="vehicle" value="" checked="yes" />
                <button id="sendInvite">INVITE</button>
            </fieldset>
        </div>
    </script>
    <script id="drpAddBookTPL" type="text/x-jquery-tmpl">
        <div title="add a book" class="drpDialog">
            <fieldset class="drpAddBookForm">
                <span>What is the unique code written on this book:</span>
                <input 	id="bookUnique" 	type="text" 	title="bookUnique"      class="send"	/>  
                <button id="addBook">ADD BOOK</button>
            </fieldset>
        </div>
    </script>
    <script id="drpAddQuestionTPL" type="text/x-jquery-tmpl">
        <div title="add a question" class="drpDialog">
            <fieldset class="drpAddQuestionForm">
                <span>Enter a specific question that applies to all books:</span>
                <input 	id="question" 	type="text" 	title="question"      class="send"	/>
                <span>unambiguous answer to question:</span>
                <input 	id="answer" 	type="text" 	title="answer"        class="send"	/>
                <button id="addQuestion">SAVE QUESTION</button>
            </fieldset>
        </div>
    </script>
    <script id="drpAddTagTPL" type="text/x-jquery-tmpl">
        <div title="add a tag" class="drpDialog">
            <fieldset class="drpAddTagForm">
                <span>The tag (one word):</span><br />
                <input 	id="tag" 	type="text" 	title="tag"      class="send"	/><br />
                <span>The description (a multitude of words):</span><br />
                <input 	id="description" 	type="text" 	title="description"        class="send"	/>
                <button id="addTag">SAVE TAG</button>
            </fieldset>
        </div>
    </script>
    <script id="drpGetQuestionTPL" type="text/x-jquery-tmpl">
        <div title="you received a book, now what?" class="drpDialog">
            <fieldset class="drpGetQuestionForm">
                <span>Because a friend sent you our publication, we invite you to become part of our network. To verify that you actually have the book at hand, we require you to answer a question about it. Make sure you have the book at hand and proceed when ready...</span>
                <button id="getQuestion">BRING IT ON</button>
            </fieldset>
        </div>
    </script>
    <script id="drpPoseQuestionTPL" type="text/x-jquery-tmpl">
        <div title="please answer accurately about the book:" class="drpDialog">
            <fieldset class="drpPoseQuestionForm">
                <div class="errorText"></div>
                <p>
                    <span>Question: <span id="question">{{=question}}</span></span><br/>
                    <span>Your answer: </span></br>
                    <input 	id="answer" 	type="text" 	title="answer"        class="send"	/><br/>
                    If you have trouble answering this question, you may switch to another one.<br/>
                    <button id="tryOtherQuestion">SWITCH</button>
                </p>
                <p>
                    <span>Please identify your book by entering the two-digit number following 'DBA_IDURLL' on the back: </span></br>
                    <input 	id="bookUnique" 	type="text" 	title="bookUnique"        class="send"	/>
                </p>
                <p>
                    <span>Enter your valid and working email address so we can invite you: </span></br>
                    <input 	id="userMail" 	type="text" 	title="userMail"        class="send"	/>
                </p>
                <input 	id="questionId" 	type="hidden" 	title="questionId"        class="send"      value="{{=questionId}}"	/>
                <button id="submitAnswer">SUBMIT</button>
            </fieldset>
        </div>
    </script>
    <script id="drpMailSentForRegisterDialogTPL" type="text/x-jquery-tmpl">
        <div title="great success" class="drpDialog">
            <fieldset class="drpMailSentForRegisterDialogForm">
                <span>You have been sent an email. Please click the link in the email to complete your registration. If you think the mail did not come, check your spam box.</span><br/>
            </fieldset>
        </div>
    </script>
    <script id="drpRegisterSuccessDialogDialogTPL" type="text/x-jquery-tmpl">
        <div title="welcome to the club" class="drpDialog">
            <fieldset class="drpMailSentForRegisterDialogForm">
                <span>You are now part of our network and you are logged in to our site where you can add associated content. After you click OKAY, you will see the book appear on the map at your location. You may then start by clicking "add review".</span><br/>
                <button id="ok">OKAY</button>
            </fieldset>
        </div>
    </script>
    <script id="drpReviewSuccessDialogDialogTPL" type="text/x-jquery-tmpl">
        <div title="great success" class="drpDialog">
            <fieldset class="drpReviewSuccessDialogDialogForm">
                <span>Thank you for adding material to our discussion! Click OK to see it appear on the map..</span><br/>
                <button id="ok">OKAY</button>
            </fieldset>
        </div>
    </script>
    <script id="drpCommentSuccessDialogDialogTPL" type="text/x-jquery-tmpl">
        <div title="great success" class="drpDialog">
            <fieldset class="drpCommentSuccessDialogDialogForm">
                <span>Thank you for adding material to our discussion! Click OK to see it appear on the map..</span><br/>
                <button id="ok">OKAY</button>
            </fieldset>
        </div>
    </script>
    <script id="drpCreateSubscriptionTPL" type="text/x-jquery-tmpl" >
        <div title="<div style='width:950px'>You were successfull. You may now create an account.<div style='float:right'><a style='text-decoration:underline;' class='help' id='safariUsersVersionAlert'>NOTE ABOUT SAFARI</a>  <a style='text-decoration:underline;' class='help' id='whatAboutPrivacy'>HELP & ABOUT PRIVACY</a></div></div>" class="drpDialog" style="width: 1000px">
            <div class="formWrap">
                <span>type your address below (street, city, country) and press find</span>
                <div class="errorText"></div>
                <div>
                    <input id="address" type="textbox" value="Streetname, Cityname, Countryname" style="width: 450px" onfocus="this.select()" onblur="this.value=!this.value?'Streetname, Cityname, Countryname':this.value;" value="Streetname, Cityname, Countryname">
                    <input type="button" value="find" onclick="drp.test.codeAddress('subscription')">
                </div>
                <div id="drpPlacePicker" style="width: 500px"></div>
                <div id="drpMapCanvas" style="width: 508px; height: 300px"></div>
                <div id="drpPlacePickerText"></div>
                <div class="errorText2"></div>
            </div>
            <div class='formWrap' style="width:450px; height: auto;">
                <fieldset class="drpCreateSubscriptionForm">
                    <span>login name:<br/>(alphanumeric, e.g. 'cdarwin')</span></br>
                    <input 	id="loginName" 	type="text" 	title="loginName"        class="send"	/></br></br>
                    <span>e-mail:<br/>(to verify your subscription)</span><br/>
                    <input 	id="mail" 	type="text" 	title="mail"        class="send"	/></br></br>
                    <span>full name:<br/>(e.g. 'Charles Darwin')</span><br/>
                    <input 	id="userName" 	type="text" 	title="userName"        class="send"	/></br></br>
                    <span>password:<br/>(will be encrypted / secured)</span></br>
                    <input 	id="password" 	type="text" 	title="password"        class="send"	/></br></br>
                    <input 	id="locMa" 	type="hidden" 	title="locMa"        class="send"       />
                    <input 	id="locNa" 	type="hidden" 	title="locNa"        class="send"       />
                    <input 	id="token" 	type="hidden" 	title="token"        class="send"       />
                    <button id="submitSubscription">CREATE ACCOUNT</button>
                </fieldset>
            </div>
        </div>
    </script>
    <!-- ernstcommit2 -->
    <script id="drpNoMoreReviewsAllowedTPL" type="text/x-jquery-tmpl">
        <div title="want to add a review?" class="drpDialog">
            <fieldset class="drpNoMoreReviewsAllowedForm">
                <span>Your book is with someone else now. You cannot add reviews anymore. Nevertheless: you can still participate by commenting.</span>
                <button id="ok">OK</button>
            </fieldset>
        </div>
    </script>
    <script id="drpAddReviewTPL" type="text/x-jquery-tmpl">
        <div title="<div style='width:950px'>participate in our discussion:<a style='float:right; text-decoration:underline;' class='help' id='whatCanIDoHere'>HELP</a></div>" class="drpDialog" style="width: 1000px">
            <table width="100%" class="drpAddReviewForm">
                <tr>
                    <td colspan="2">Feel free to add content through this form. 
                        The content can be related to urban development subjects such as 
                        described in our research work (which you received). You can react 
                        on subjects by describing related phenomena that you have seen. 
                        It is interesting that the same principles may apply on different 
                        locations. Therefore you are encouraged to use the map to locate 
                        the phenomena that you will describe. In the future we will add 
                        tagging options to further associate all the different developments. 
                        You will also get better options for audio, video and images. 
                        You may further engage in this urban development expertise 
                        discussion by commenting on other's reactions.
                        <div class="errorText" style="width: 380px">Enter the location your review relates to:</div>
                    </td>
                </tr>
                <tr>
                    <td style="padding-top: 10px; padding-bottom: 10px;">
                        <div>
                            <input id="address" type="textbox" value="Streetname, Cityname, Countryname" style="width: 350px" onfocus="this.select()" onblur="this.value=!this.value?'Streetname, Cityname, Countryname':this.value;" value="Streetname, Cityname, Countryname">
                            <input type="button" value="find" onclick="drp.test.codeAddress('review')">
                        </div>
                    </td>
                    <td style="padding-top: 6px; padding-bottom: 10px;">
                        <span>Title: </span><input 	style="width: 400px;" id="reviewHeader"          type="text"     title="reviewHeader"        class="send"	/></br>
                    </td>
                </tr>
                <tr>
                    <td >
                        <div id="drpPlacePicker" style="width: 350px;"></div>
                        <div id="drpMapCanvas" style="width: 420px; height: 300px;  top:6px"></div>
                    </td>
                    <td style="vertical-align: top">
                        <fieldset>  
                            <textarea 	id="reviewBody"            type="text"     title="reviewBody"         class="send texteditor basic" style="height:280px; width: 450px"	/>
                            <input 	id="locMa" 	type="hidden" 	title="locMa"        class="send"       />
                            <input 	id="locNa" 	type="hidden" 	title="locNa"        class="send"       />
                        </fieldset>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="text-align: right; padding-bottom: 15px;"><div class="errorText2"></div><button id="submitReview" style="margin-right:12px;">SUBMIT REVIEW</button></td>
                </tr>
            </table>
        </div>
    </script>
    <script id="drpFirstReviewTPL" type="text/x-jquery-tmpl">
        <div title="want to add something?" class="drpDialog">
            <fieldset class="drpFirstReviewForm">
                <span>Please add a review first.</span>
                <button id="ok">OK</button>
            </fieldset>
        </div>
    </script>
    <script id="drpAddCommentTPL" type="text/x-jquery-tmpl">
        <div title="comment on this review:" class="drpDialog" style="width: 1000px">
            <div class="formWrap">
                <div class="errorText" style="width:380px">Enter the location your comment relates to:</div>
                <div>
                    <input id="address" type="textbox" value="Streetname, Cityname, Countryname" style="width: 350px" onfocus="this.select()" onblur="this.value=!this.value?'Streetname, Cityname, Countryname':this.value;" value="Streetname, Cityname, Countryname">
                    <input type="button" value="find" onclick="drp.test.codeAddress('comment')">
                </div>
                <div id="drpPlacePicker" style="width: 350px"></div>
                <div id="drpMapCanvas" style="width: 420px; height: 300px"></div>
            </div>
            <div class="formWrap">
                <fieldset class="drpAddCommentForm">
                    <span>Title: </span><input 	id="commentHeader"          type="text"     title="commentHeader"        class="send"	/>
                    <span>Text: </span><textarea 	id="commentBody"            type="text"     title="commentBody"         class="send texteditor basic"	style="height:280px; width: 560px"/>
                    <input 	id="commentedEntityId"      type="hidden"   title="commentedEntityId"   class="send"    value="{{=commentedEntityId}}"	/>
                    <input 	id="commentedEntityType"    type="hidden"   title="commentedEntityType" class="send"    value="{{=commentedEntityType}}"	/>
                    <input 	id="locMa" 	type="hidden" 	title="locMa"        class="send"       />
                    <input 	id="locNa" 	type="hidden" 	title="locNa"        class="send"       />
                    <p><span class="errorText2"></span></p>
                    <button id="submitComment">SUBMIT COMMENT</button>
                </fieldset>
            </div>
        </div>
    </script>
    <script id="drpDeleteAreYouSureDialogTPL" type="text/x-jquery-tmpl">
        <div title="delete" class="drpDialog">
            <fieldset class="drpDeleteForm">
                <p>Sure to delete "{{=descr}}"?</p>
                <button id="delete">YES</button>
            </fieldset>
        </div>
    </script>
    <script id="drpDeleteSuccessDialogTPL" type="text/x-jquery-tmpl">
        <div title="delete success" class="drpDialog">
            <fieldset class="drpDeleteSuccessForm">
                <p>You successfully deleted "{{=descr}}"!</p>
                <button id="nice">NICE</button>
            </fieldset>
        </div>
    </script>
    <script id="drpUserSettingsDialogTPL" type="text/x-jquery-tmpl">
        <div id="tabsWrap" title="user settings" style="width: 1000px">
            <div id="tabs">
                <ul>
                    <li><a href="#tabs-1">personal data</a></li>
                    <li><a href="#tabs-2">reviews</a></li>
                    <li><a href="#tabs-3">comments</a></li>
                </ul>
                <div id="tabs-1">
                    <table>
                        <colgroup>
                            <col width="200">
                            <col width="200">
                            <col width="400">
                        </colgroup>
                        <tr>
                            <td><span>full name</span></td>
                            <td><span>{{=userName}}</span></td>
                            <td><span>This is how others see your name.</span></td>
                        </tr>
                        <tr>
                            <td><span>login name</span></td>
                            <td><span>{{=loginName}}</span></td>
                            <td><span>Use it to log in.</span></td>
                        </tr>
                        <tr>
                            <td><span>e-mail</span></td>
                            <td><span><a>show email</a></span></td>
                            <td><span>Use it when you forgot your password or username.</span></td>
                        </tr>
                    </table>
                </div>
                <div id="tabs-2">
                    <p>to do.</p>
                </div>
                <div id="tabs-3">
                    <p>to do.</p>
                </div>
            </div>
        </div>
    </script>
    <script id="loginNameTPL" type="text/x-jquery-tmpl">
        <span>settings for {{=name}}</span>
    </script>



    <script type="text/javascript">
        var RunAfterInit = [];
<?php if (isset($_GET['userInvite'])): ?>
                            RunAfterInit.push({func: drp.test.createSubscriptionDialog, args:["<?php echo $_GET['userInvite']; ?>"]});
<?php elseif (isset($_GET['userInviteResetPassword'])): ?>
                            RunAfterInit.push({func: drp.test.submitNewPasswordDialog, args:["<?php echo $_GET['userInviteResetPassword']; ?>"]});
<?php endif; ?>
    </script>










    <!-- test buttons (tmp)-->	
    <!-- test buttons (tmp)-->	
    <!-- test buttons (tmp)-->	

</head>
<body onload="new vdvw.c.Startup()">

<?php if (!(isset($_GET["testbuttons"]))) echo "<!--"; ?>   
    <div style="left: 400px; position: relative; z-index: 50000">
        <button id="nukeDialog"               onclick="drp.test.nukeDialog()">TEST NUKE</button>
        <button id="loginDialog"              onclick="drp.test.loginDialog()">TEST LOGIN</button>
        <button id="createModerator"          onclick="drp.test.createModeratorDialog()">CREATE MODERATOR</button>
        <br/>
        <button id="addBook"                  onclick="drp.test.addBookDialog()">ADD BOOK</button>
        <button id="addQuestion"              onclick="drp.test.addQuestionDialog()">ADD QUESTION</button>
        <button id="receivedBook"             onclick="drp.test.receivedBookDialog()">RECEIVED BOOK</button>
        <button id="testAccountSubscription"  onclick="drp.test.poseQuestionDialog('What is your favourite green colour?',1)">TEST BOOK QUESTION</button>
        <br/>
        <button id="createSubscription"       onclick="drp.test.createSubscriptionDialog()">TEST ACCOUNT SUBSCRIPTION</button>
        <button id="addReview"                onclick="drp.test.addReviewDialog(1)">TEST ADD REVIEW</button>
        <button id="addComment"               onclick="drp.test.addCommentDialog('review',1)">TEST ADD COMMENT</button>
        <br/>
        <button id="explainSendBook"          onclick="drp.test.explainSendBook()">EXPLAIN SEND BOOK</button>
        <button id="sendBook"                 onclick="drp.test.sendBook()">SEND BOOK</button>
        <button id="addTag"                   onclick="drp.test.addTagDialog()">ADD TAG</button>
    </div><?php if (!(isset($_GET["testbuttons"]))) echo "-->"; ?>   


</body>
</html>
