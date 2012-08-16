if(typeof drp == "undefined") var drp = {};
drp.debugPost = false;
drp.geocoder = function(){
    return new google.maps.Geocoder;
}
var map;
var marker;
var marker_image;
   
var expodiumStyle2 = [
{
    featureType: "administrative.country",
    stylers: [
    {
        visibility: "simplified"
    }
    ]
},{
/*featureType: "administrative.province",
                                                    stylers: [
                                                      {visibility: "off"}
                                                    ]*/
},{
/*featureType: "administrative.locality",
                                                    stylers: [
                                                      {visibility: "on"}
                                                    ]*/
},{
/*featureType: "administrative.neighborhood",
                                                    stylers: [
                                                      {visibility: "off"}
                                                    ]*/
},{
/*featureType: "administrative.land_parcel",
                                                    stylers: [
                                                      {visibility: "off"}
                                                    ]*/
},{
    featureType: "landscape",
    stylers: [
    {
        hue: "#0055ff"
    },

    {
        saturation: 23
    },

    {
        lightness: -32
    }
    ]
},{
/*featureType: "poi",
                                                    stylers: [
                                                      {visibility: "off"}
                                                    ]*/
},{
    featureType: "road",
    elementType: "geometry",
    stylers: [
    /*{visibility: "simplified"},*/
    {
        hue: "#00fff7"
    },

    {
        saturation: -100
    },

    {
        lightness: -42
    }
    ]
},{
    featureType: "road"/*,
                                                    elementType: "labels",
                                                    stylers: [
                                                      {visibility: "off"}
                                                    ]*/
},{
    featureType: "water",
    stylers: [
    {
        visibility: "simplified"
    },

    {
        lightness: 100
    }
    ]
}
];
var expodiumMapType2 = new google.maps.StyledMapType(expodiumStyle2,
{
    name: "expodium2"
});
var myOptions = {
    zoom: 1,
    center: new google.maps.LatLng( 45.95919025, -66.640351 ),
    backgroundColor: 'white',
    mapTypeControl: false,
    //mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeId: 'roadmap',
    /*mapTypeControlOptions: {
                    mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'expodium2']
            },*/
    panControl: false,
    zoomControl: true,
    zoomControlOptions: {
        style: google.maps.ZoomControlStyle.LARGE,
        position: google.maps.ControlPosition.LEFT_CENTER
    },
    streetViewControl: false

};

jQuery.extend(jQuery.ui.dialog.prototype.options, {
    resizable: false,
    modal: true,
    show: 'fade',
    autoOpen: true
});

drp.postTR = function(transaction, callback, userErrorCallback){
    /*
         * The first parameter of call is the value to be set as this; 
         * subsequent parameters are passed on to the function as normal parameters.
         */
    var postobj = {};
    postobj["tr"] = transaction.id;
    jQuery.each(transaction.comm, function(index, value) { 
        postobj["comm"+index] =  JSON.stringify(value);
    });
    if(drp.debugPost) alert("POST TRANSACTION " + JSON.stringify(postobj));
    var parsteTransactionResult = function(dataString){
        if(drp.debugPost) alert(dataString);
        var responseObject = null;
        try{
            responseObject = JSON.parse(dataString);
        }catch(error){
            alert("error ('" + error.message + "') parsing: " + dataString);
        }
        if(!(responseObject.hasOwnProperty(transaction.id))){
            alert("no property '" + transaction.id + "' in response: " + dataString);
        }
        if(responseObject[transaction.id].hasOwnProperty("error")){
            if(typeof userErrorCallback == "undefined" || userErrorCallback == null){
                alert(dataString);
            }else{
                var code = responseObject[transaction.id].error.code;
                var message = responseObject[transaction.id].error.message;
                userErrorCallback(message,code);
            }
        }else{
            callback(responseObject);
        }
    };
    jQuery.post("?",postobj,parsteTransactionResult);
}
/**
 * NUKE - clear the entire database (in fluid mode)
 */


/**
 * examples how to create the forms
 */
if(drp.test== undefined) drp.test = {};
drp.test.nukeDialog = function(){
    var dl = drp.createDialog(jQuery('#drpNukeTPL').render({}));
    jQuery("#nukeButton").click(function(e){
        drp.tr.sys.nuke("nuke",function(d){
            var rsp = JSON.parse(d);
            if('id' in rsp){
                if(rsp.id == "nuke"){
                    jQuery(dl).dialog('close');
                    window.location = window.location;
                    return;
                }
            }
            alert(d);
            jQuery(dl).dialog('close');
        });
    });
}
drp.test.loginDialog = function(){
    var dl = drp.createDialog(jQuery('#drpLoginTPL').render({}));
    jQuery(".drpLoginForm .errorText").hide();
    jQuery(".drpLoginForm #doLogin").click(function(e){
        drp.postTR(
        {
            id:"getChall",
            comm:[drp.tr.comm.SessionGenerateChallenge()]
        }, 
        function(rsp){
            jQuery(".drpLoginForm #challenge").val(rsp.getChall.result);
            var passwd = jQuery(".drpLoginForm #password").val();
            var passwdhash = new jsSHA(passwd, "ASCII").getHash("SHA-512", "HEX");
            jQuery(".drpLoginForm #password").val("");
            jQuery(".drpLoginForm #response").val(new jsSHA(jQuery(".drpLoginForm #challenge").val()+passwdhash, "ASCII").getHash("SHA-512", "HEX"));
            var un = jQuery(".drpLoginForm #loginName").val();
            var rp = jQuery(".drpLoginForm #response").val();
            var arg = {
                id:"login",
                comm:[drp.tr.comm.SessionLoginForLoginNameAndResponse(un,rp)]
                };
            drp.postTR(arg,function(rsp){
                // login succesful
                jQuery(dl).dialog('close');
                //remove login btn
                jQuery("#login-link").hide();
                jQuery("#now-what").hide();
                // add logout btn
                jQuery("#logout-link").show();
                var userName = rsp.login.result.userScreenName;
                var uid = rsp.login.result.userId;
                vdvw.m.Session.setUid(uid);
                //console.log(userName);
                jQuery("#login-name").html(jQuery("#loginNameTPL").render({name:userName}));
                jQuery("#login-name").show();
                var showCMSButton = false;
                $H(rsp.login.result.userRoles).each(function(pair){
                    if(pair.value == "moderator" || pair.value == "sysadmin"){
                        showCMSButton = true;
                        throw $break;
                    }
                });
                if(showCMSButton){
                    vdvw.c.InitCmsPanel();
                    jQuery("#cms-link").show();
                    vdvw.c.dataRefresh(xpd.User.EntityName(), rsp.login.result.userId);
                }else{
                    vdvw.c.DestroyCmsPanel();
                    jQuery("#cms-link").hide();
                    vdvw.c.click(xpd.User.EntityName(),rsp.login.result.userId);
                }
            },
            function(errorMessage, errorCode){
                var hMess = null;
                if(errorMessage == "0-auth fail 4"){
                    hMess = "unknown user";
                }else if(errorMessage == "0-auth fail 6"){
                    hMess = "wrong password";
                }
                jQuery('.drpLoginForm .errorText').fadeOut('fast', function() {
                    jQuery(".drpLoginForm .errorText").fadeIn();
                });                 
                jQuery(".drpLoginForm .errorText").empty();
                jQuery(".drpLoginForm .errorText").append(hMess == null ? errorMessage : hMess);
                jQuery(".drpLoginForm .forgotPassword").fadeIn();
            });
        });
    });
    jQuery(".drpLoginForm #forgotLoginData").click(function(e){
        jQuery(dl).dialog('close');
        drp.test.resetPasswordDialog();
    });
}
drp.test.resetPasswordDialog = function(){
    var dl = drp.createDialog(jQuery('#drpResetPasswordTPL').render({}));
    jQuery(".errorText").hide();
    jQuery(".errorText").empty();
    jQuery(".drpResetPasswordForm #requestResetLink").click(function(e){
        var mail = jQuery(".drpResetPasswordForm #email").val();
        drp.postTR({
            id:"resetPasswd",
            comm:[drp.tr.comm.UserResetPasswd(mail)]
            }, 
            function(rsp){
                jQuery(dl).dialog('close');
                var dl = drp.createDialog(jQuery('#drpMailSentForResetPasswordDialogTPL').render({}));
            }
        );
    });
}
drp.test.submitNewPasswordDialog = function(token){
    drp.postTR(
        {
            id:"getUserNameForPasswordReset",
            comm:[drp.tr.comm.GetUserNameForPasswordReset(token)]
        }, 
        function(rsp){
            var username = rsp.getUserNameForPasswordReset.result;
            var dl = drp.createDialog(jQuery('#drpSubmitNewPasswordTPL').render({
                username:username
            }));
            jQuery(".drpSubmitNewPasswordForm #token").val(token);
            jQuery(".drpSubmitNewPasswordForm #submitNewPassword").click(function(e){
                var passwd = jQuery(".drpSubmitNewPasswordForm #password").val();
                var passwdhash = new jsSHA(passwd, "ASCII").getHash("SHA-512", "HEX");
                jQuery(".drpSubmitNewPasswordForm #password").val("secured: "+passwdhash);
                drp.postTR(
                    {
                        id:"submitNewPassword",
                        comm:[drp.tr.comm.SubmitNewPassword(token,passwdhash)]
                    }, 
                    function(rsp){
                        jQuery(dl).dialog('close');
                        var dl = drp.createDialog(jQuery('#drpPasswordResetSuccessDialogTPL').render({
                            username:username
                        }));
                    }
                );
            }
        );
    });
}
drp.test.submitNewEmailDialog = function(token){
    drp.postTR(
        {
            id:"getUserNameForEmailReset",
            comm:[drp.tr.comm.GetUserNameForEmailReset(token)]
        }, 
        function(rsp){
            var username = rsp.getUserNameForEmailReset.result;
            var dl = drp.createDialog(jQuery('#drpSubmitNewEmailTPL').render({ }));
            jQuery(".drpSubmitNewEmailForm #submit").click(function(e){
                jQuery(dl).dialog('close');
            }
        );
    });
}
drp.test.createLogoutDialog = function(){
    var dl = drp.createDialog(jQuery('#drpLogoutTPL').render({}));
    jQuery(".drpLogoutForm #logout").click(function(e){
        drp.postTR(
            {
                id:"logout",
                comm:[drp.tr.comm.logout()]
            },
            function(rsp){
                vdvw.m.Session.setUid("-1");
                jQuery(dl).dialog('close');
                jQuery("#logout-link").hide();
                jQuery("#login-link").show();
                jQuery("#login-name").hide();
                jQuery("#cms-link").hide();
                vdvw.c.dataRefresh();
            }
        );
    });
}
drp.test.tagsDialog = function(){
    var dl = drp.createDialog(jQuery('#drpTagsListTPL').render({}));
    var tab = dl.find("#tagsTable");
    if(!xpd.db.table(xpd.Tag.EntityName())){
        alert("no table for " + xpd.Tag.EntityName() + " in database.")
    }
    var tags = xpd.db.table(xpd.Tag.EntityName()).records;
    $H(tags).each(function(v){
        tab.append(jQuery('#drpTagTableRowTPL').render(v.value));
    });
    tab.find("input[type=button]").click(function(event){
        jQuery(dl).dialog('close');
        vdvw.c.onClick.call(event.target,event);
    });
}
drp.test.cmsPanel = function(panelDiv){
    var dl = drp.createPanel(panelDiv);
}
drp.test.createModeratorDialog = function(){
    var dl = drp.createDialog(jQuery('#drpAddModeratorTPL').render({}));
    jQuery(".drpAddModeratorForm #sendInvite").click(function(e){
        drp.postTR(
            {
                id:"getModeratorRoleId",
                comm:[drp.tr.comm.RoleReadForRoleName('moderator')]
            },
            function(rsp){
                var roleId = rsp.getModeratorRoleId.result[0].id;
                var userMail = jQuery(".drpAddModeratorForm #email").val();
                var sendMail = jQuery(".drpAddModeratorForm #sendMail").attr("checked") == "checked" ? 1 : 0;
                drp.postTR(
                {
                    id:"inviteModerator",
                    comm:[drp.tr.comm.UserInvite(userMail, roleId, sendMail)]
                },
                function(rsp){
                    var userInviteId = rsp.inviteModerator.result.id;
                    jQuery(dl).dialog('close');
                }
            );
        });
    });
}
drp.test.addBookDialog = function(){
    var dl = drp.createDialog(jQuery('#drpAddBookTPL').render({}));
    jQuery(".drpAddBookForm #addBook").click(function(e){
        var bookUnique = jQuery(".drpAddBookForm #bookUnique").val();
        drp.postTR(
        {
            id:"addBook",
            comm:[drp.tr.comm.addBook(bookUnique)]
        },
        function(rsp){
            jQuery(dl).dialog('close');
        });
    });
}
drp.test.addQuestionDialog = function(){
    var dl = drp.createDialog(jQuery('#drpAddQuestionTPL').render({}));
    jQuery(".drpAddQuestionForm #addQuestion").click(function(e){
        var comm = drp.tr.comm.addQuestion(jQuery(".drpAddQuestionForm #question").val(),jQuery(".drpAddQuestionForm #answer").val());
        drp.postTR(
        {
            id:"addQuestion",
            comm:[comm]
        },
        function(rsp){
            jQuery(dl).dialog('close');
        });
    });
}
drp.test.addTagDialog = function(){
    var dl = drp.createDialog(jQuery('#drpAddTagTPL').render({}));
    jQuery(".drpAddTagForm #addTag").click(function(e){
        var comm = drp.tr.comm.addTag(jQuery(".drpAddTagForm #tag").val(),jQuery(".drpAddTagForm #description").val());
        drp.postTR(
        {
            id:"addTag",
            comm:[comm]
        },
        function(rsp){
            jQuery(dl).dialog('close');
        });
    });
}
drp.test.receivedBookDialog = function(){
    var dl = drp.createDialog(jQuery('#drpGetQuestionTPL').render({}));
    jQuery(".drpGetQuestionForm #getQuestion").click(function(e){
        drp.postTR(
            {
                id:"getQuestion",
                comm:[drp.tr.comm.getQuestion()]
            }, 
            function(rsp){
                var question = rsp.getQuestion.result.question;
                var questionId = rsp.getQuestion.result.id;
                jQuery(dl).dialog('close');
                drp.test.poseQuestionDialog(question, questionId, "");
            }
        );
    });
}
drp.test.poseQuestionDialog = function(question, questionId, errorText){
    jQuery(".errorText").empty();
    jQuery(".errorText").hide();
    if(errorText != ""){
        drp.postTR(
            {
                id:"getQuestion",
                comm:[drp.tr.comm.getQuestion()]
            }, 
            function(rsp){
                var question2 = rsp.getQuestion.result.question;
                var questionId2 = rsp.getQuestion.result.id;
                question = question2;
                questionId = questionId2;
                drp.test.nowReallyPoseQuestionDialog(question, questionId, errorText);
            }
        );
    }else{
        drp.test.nowReallyPoseQuestionDialog(question, questionId, errorText);
    }
}
drp.test.nowReallyPoseQuestionDialog = function(question, questionId, errorText){
    var dl = drp.createDialog(jQuery('#drpPoseQuestionTPL').render({
        questionId:questionId, 
        question:question
    }));
    jQuery(".errorText").empty();
    jQuery(".errorText").hide();
    if(errorText != ""){
        jQuery(".errorText").empty();
        jQuery(".errorText").hide();
        jQuery(".errorText").append(errorText);
        jQuery(".errorText").fadeIn();
    }
    jQuery(".drpPoseQuestionForm #submitAnswer").click(function(e){
        var answer = jQuery(".drpPoseQuestionForm #answer").val();
        var questionId = jQuery(".drpPoseQuestionForm #questionId").val();
        var bookUnique = jQuery(".drpPoseQuestionForm #bookUnique").val();
        var userMail = jQuery(".drpPoseQuestionForm #userMail").val();
        drp.postTR(
            {
                id:"submitAnswer",
                comm:[drp.tr.comm.submitAnswer(answer,questionId,bookUnique,userMail)]
            }, 
            function(rsp){
                jQuery(dl).dialog('close');
                drp.test.mailSentForRegisterDialog();
            },
            function(errorMessage){
                var dialogText = "";
                if(errorMessage == "0-answer incorrect"){
                    dialogText = "I'm afraid that is not the correct answer, please try again";
                }
                if(errorMessage == "0-no result: book not found for code"){
                    dialogText = "The code you entered does not seem to be valid, please try again";
                }
                if(errorMessage == "0-mail address exists"){
                    dialogText = "That email address is taken";
                }
                if(dialogText == ""){
                    alert(errorMessageText);
                }else{
                    jQuery(dl).dialog('close');
                    drp.test.poseQuestionDialog(question, questionId, dialogText);
                }
            }
        );
    });
    jQuery(".drpPoseQuestionForm #tryOtherQuestion").click(function(e){
        drp.postTR(
            {
                id:"getQuestion",
                comm:[drp.tr.comm.getQuestion()]
            }, 
            function(rsp){
                var question3 = rsp.getQuestion.result.question;
                var questionId3 = rsp.getQuestion.result.id;
                jQuery(".drpPoseQuestionForm #question").html(question3);
                jQuery(".drpPoseQuestionForm #questionId").val(questionId3);
            }
        );
    });
}
drp.test.mailSentForRegisterDialog = function(){
    var dl = drp.createDialog(jQuery('#drpMailSentForRegisterDialogTPL').render({}));
} 
drp.test.createSubscriptionDialog = function(token){
    var dl = drp.createDialog(jQuery('#drpCreateSubscriptionTPL').render({}));
    jQuery(".errorText").hide();
    jQuery(".errorText2").hide();
    jQuery(".drpCreateSubscriptionForm #token").val(token);
    // Initialize Google Map
    map = new google.maps.Map(jQuery( '#drpMapCanvas' )[0], myOptions);
    map.mapTypes.set('expodium2', expodiumMapType2);    
    jQuery(".drpCreateSubscriptionForm #submitSubscription").click(function(e){
        if(jQuery(".drpCreateSubscriptionForm #locMa").val() == "" || jQuery(".drpCreateSubscriptionForm #locNa").val() == ""){
            //alert("you need to pick a location for your residence to create an account");
            
            jQuery(".errorText").empty();
            jQuery(".errorText").hide();
            jQuery(".errorText").append('You need to pick a location for your residence to create an account');
            jQuery(".errorText").fadeIn();
            
        }
        if(jQuery(".drpCreateSubscriptionForm #loginName").val() == "" || jQuery(".drpCreateSubscriptionForm #mail").val() == "" || jQuery(".drpCreateSubscriptionForm #userName").val() == "" || jQuery(".drpCreateSubscriptionForm #password").val() == ""){
            //alert("complete all fields fool");
            jQuery(".errorText2").empty();
            jQuery(".errorText2").hide();
            jQuery(".errorText2").append('You need to complete all fields');
            jQuery(".errorText2").fadeIn();
        }else{
            jQuery(".errorText").hide();
            jQuery(".errorText2").hide();
            var location = {
                Ma: jQuery(".drpCreateSubscriptionForm #locMa").val(),
                Na: jQuery(".drpCreateSubscriptionForm #locNa").val()
            };
            var passwd = jQuery(".drpCreateSubscriptionForm #password").val();
            var passwdhash = new jsSHA(passwd, "ASCII").getHash("SHA-512", "HEX");
            jQuery(".drpCreateSubscriptionForm #password").val("secured: "+passwdhash);
            var user = {
                loginName: jQuery(".drpCreateSubscriptionForm #loginName").val(),
                screenName: jQuery(".drpCreateSubscriptionForm #userName").val(),
                password: passwdhash,
                mail: jQuery(".drpCreateSubscriptionForm #mail").val(),
                invite: jQuery(".drpCreateSubscriptionForm #token").val()
            }
            var locComm = drp.tr.comm.submitLocation(location);
            drp.postTR(
                {
                    id:"submitLocation",
                    comm:[locComm]
                }, 
                function(rsp){
                    user.ownLocation = [rsp.submitLocation.result];
                    var userComm = drp.tr.comm.submitUser(user);
                    drp.postTR(
                        {
                            id:"submitUser",
                            comm:[userComm]
                        }, 
                        function(rsp){
                            if(rsp.submitUser.result){
                                jQuery(dl).dialog('close');
                                vdvw.m.Session.setUid(rsp.submitUser.result);
                                drp.test.registerSuccessDialog(rsp.submitUser.result);
                                jQuery("#login-link").hide();
                                jQuery("#now-what").hide();
                                jQuery("#logout-link").show();
                                jQuery("#login-name").html(jQuery("#loginNameTPL").render({name:user.screenName}));
                                jQuery("#login-name").show();
                            }
                        }
                    );
                }
            );
        }
    });
};
drp.test.registerSuccessDialog = function(id){
    var dl = drp.createDialog(jQuery('#drpRegisterSuccessDialogDialogTPL').render({}));
    jQuery(".drpMailSentForRegisterDialogForm #ok").click(function(e){
        jQuery(dl).dialog('close');
        vdvw.c.dataRefresh('user',id);
    });
}
drp.test.reviewSuccessDialog = function(newReviewId){
    var dl = drp.createDialog(jQuery('#drpReviewSuccessDialogDialogTPL').render({}));
    jQuery('.drpReviewSuccessDialogDialogForm #ok').click(function(e){
        jQuery(dl).dialog('close');
        vdvw.c.dataRefresh('review',newReviewId);
    });
}
drp.test.commentSuccessDialog = function(newCommentId){
    var dl = drp.createDialog(jQuery('#drpCommentSuccessDialogDialogTPL').render({}));
    jQuery('.drpCommentSuccessDialogDialogForm #ok').click(function(e){
        jQuery(dl).dialog('close');
        vdvw.c.dataRefresh('comment',newCommentId);
    });
}
drp.test.addReviewDialog = function(reviewedBookId){
    // a user must be logged in
    var cmd = drp.tr.comm.checkUser();
    drp.postTR(
        {
            id:"checkUser",
            comm:[cmd]
        }, 
        function(rsp){
            if(!(rsp.checkUser.result.hasOwnProperty("id"))){
                drp.test.loginDialog();
                return;
            }else{
                if(rsp.checkUser.result.id < 0){
                    drp.test.loginDialog();
                    return;
                }else{
                    var cmd = drp.tr.comm.doesUserHaveBook(rsp.checkUser.result.id);
                    drp.postTR(
                        {
                            id:"doesUserHaveBook",
                            comm:[cmd]
                        }, 
                        function(rsp)
                        {
                            if(rsp.doesUserHaveBook.result.numBooks != 1){
                                var dl = drp.createDialog(jQuery("#drpNoMoreReviewsAllowedTPL").render({}));
                                jQuery(".errorText").hide();
                                jQuery(".errorText2").hide();
                                jQuery(".drpNoMoreReviewsAllowedForm #ok").click(function(e){
                                    jQuery(dl).dialog('close');
                                });
                                return;
                            }else{
                                var dl = drp.createDialog(jQuery('#drpAddReviewTPL').render({
                                    reviewedBookId:reviewedBookId
                                }));
                                var JQ_tagsCont = dl.find("#tagsContainer");
                                var tagTab = xpd.db.table(xpd.Tag.EntityName());
                                if(tagTab){
                                    $H(tagTab.records).each(function(r){
                                        var JQ_tagCont = jQuery("<span class='xpd-tag'></span>");
                                        JQ_tagCont.text(r.value.tag);
                                        JQ_tagCont.attr("title",r.value.description);
                                        var JQ_checkbox = jQuery("<input type='checkbox'></input>");
                                        JQ_checkbox.attr("id",r.value.id);
                                        JQ_tagCont.prepend(JQ_checkbox);
                                        JQ_tagsCont.append(JQ_tagCont);
                                    });
                                }
                                JQ_tagsCont.find("input").click(function(event){
                                    if(JQ_tagsCont.find("input:checked").length > 3){
                                        alert("Maximum of tags per item is three. You must uncheck another tag first.");
                                        jQuery(event.target).removeAttr("checked");
                                    }
                                });
                                jQuery(".errorText").hide();
                                jQuery(".errorText2").hide();
                                map = new google.maps.Map(jQuery( '#drpMapCanvas' )[0], myOptions);
                                map.mapTypes.set('expodium2', expodiumMapType2);
                                jQuery(".drpAddReviewForm #submitReview").click(function(e){
                                    if(jQuery(".drpAddReviewForm #locMa").val() == "" || jQuery(".drpAddReviewForm #locNa").val() == ""){
                                        // maybe the user entered a location but did not click the find button 
                                        if(!(jQuery(".drpAddReviewForm #address").val() == "Streetname, Cityname, Countryname")){
                                            drp.test.codeAddress('review');
                                            jQuery(".errorText").empty();
                                            jQuery(".errorText").hide();
                                            jQuery(".errorText").append("Look at the map to verify the location of the phenomenon you described and then click SUBMIT again");
                                            jQuery(".errorText").fadeIn();
                                            return;
                                        }else{
                                            jQuery(".errorText").empty();
                                            jQuery(".errorText").hide();
                                            jQuery(".errorText").append("Please enter a location your review relates to...");
                                            jQuery(".errorText").fadeIn();
                                        }
                                    }else{
                                        var loc = {
                                            Ma : jQuery(".drpAddReviewForm #locMa").val(),
                                            Na : jQuery(".drpAddReviewForm #locNa").val()
                                        };
                                        // are all fields filled out?
                                        if(jQuery(".drpAddReviewForm #reviewHeader").val() == "" || jQuery(".drpAddReviewForm #reviewBody").val() == ""){
                                            jQuery(".errorText2").empty();
                                            jQuery(".errorText2").hide();
                                            jQuery(".errorText2").append("One of the textfields above is empty!");
                                            jQuery(".errorText2").fadeIn();
                                        }else {
                                            var rev = {
                                                header : jQuery(".drpAddReviewForm #reviewHeader").val(),
                                                body : jQuery(".drpAddReviewForm #reviewBody").val()
                                            };
                                            rev.sharedTag = [];
                                            var selectedTags = jQuery(".drpAddReviewForm .xpd-tag input:checked");
                                            selectedTags.each(function(k,v){
                                                rev.sharedTag.push(jQuery(v).attr("id"));
                                            });
                                            var locComm = drp.tr.comm.submitLocation(loc);
                                            drp.postTR(
                                                {
                                                    id:"submitLocation",
                                                    comm:[locComm]
                                                }, 
                                                function(rsp){
                                                    rev.ownLocation = [rsp.submitLocation.result];
                                                    var revComm = drp.tr.comm.submitReview(rev);
                                                    drp.postTR(
                                                        {
                                                            id:"submitReview",
                                                            comm:[revComm]
                                                    }, 
                                                    function(rsp){
                                                        if(rsp.submitReview.result){
                                                            jQuery(dl).dialog('close');
                                                            drp.test.reviewSuccessDialog(rsp.submitReview.result);
                                                        }
                                                    },
                                                    function(errorMessage){
                                                        alert(errorMessage);
                                                        if(errorMessage == "0-you need to login first"){
                                                            drp.test.loginDialog();
                                                        }
                                                    }
                                                );
                                            }
                                        );
                                    }
                                }
                            }
                        );
                        return;
                    }
                });
            }
        }
    });
}
drp.test.informFirstReviewDialog = function(){
    var dl = drp.createDialog(jQuery('#drpFirstReviewTPL').render({}));
    jQuery(".drpFirstReviewForm #ok").click(function(e){
        jQuery(dl).dialog('close');
    });
}
drp.test.addCommentDialog = function(commentedEntityId, commentedEntityType){
    // a user must be logged in
    var cmd = drp.tr.comm.checkUser();
    drp.postTR(
        {
            id:"checkUser",
            comm:[cmd]
        }, 
        function(rsp){
            if(!(rsp.checkUser.result.hasOwnProperty("id"))){
                drp.test.loginDialog();
                return;
            }else{
                if(rsp.checkUser.result.id < 0){
                    drp.test.loginDialog();
                    return;
                }else{
                    // the user must have already submitted a erview
                    var cmd2 = drp.tr.comm.hasUserReviewed(rsp.checkUser.result.id);
                    drp.postTR(
                        {
                            id:"hasReviewed",
                            comm:[cmd2]
                        }, 
                        function(rsp){
                            if(rsp.hasReviewed.result.numReviews == 0){
                                drp.test.informFirstReviewDialog();
                                return;
                            }
                            var dl = drp.createDialog(jQuery('#drpAddCommentTPL').render({
                                commentedEntityId:commentedEntityId, 
                                commentedEntityType:commentedEntityType
                            }));
                            var JQ_tagsCont = dl.find("#tagsContainer");
                            var tagTab = xpd.db.table(xpd.Tag.EntityName());
                            $H(tagTab.records).each(function(r){
                                var JQ_tagCont = jQuery("<span class='xpd-tag'></span>");
                                JQ_tagCont.text(r.value.tag);
                                JQ_tagCont.attr("title",r.value.description);
                                var JQ_checkbox = jQuery("<input type='checkbox'></input>");
                                JQ_checkbox.attr("id",r.value.id);
                                JQ_tagCont.prepend(JQ_checkbox);
                                JQ_tagsCont.append(JQ_tagCont);
                            });
                            JQ_tagsCont.find("input").click(function(event){
                                if(JQ_tagsCont.find("input:checked").length > 3){
                                    alert("Maximum of tags per item is three. You must uncheck another tag first.");
                                    jQuery(event.target).removeAttr("checked");
                                }
                            });
                            jQuery(".errorText").hide();
                            jQuery(".errorText2").hide();
                            map = new google.maps.Map(jQuery( '#drpMapCanvas' )[0], myOptions);
                            map.mapTypes.set('expodium2', expodiumMapType2);
                            jQuery(dl).find("#submitComment").click(function(e){
                                if(jQuery(".drpAddCommentForm #locMa").val() == "" || jQuery(".drpAddCommentForm #locNa").val() == ""){
                                    //alert("What on earth are you writing about? Pick a location so we can show it on the map.");
                                    jQuery(".errorText").hide();
                                    jQuery(".errorText").empty();
                                    jQuery(".errorText").append("Please enter a location your comment relates to and click 'find'...");
                                    jQuery(".errorText").fadeIn();
                                }else{
                                    var loc = {
                                        Ma : jQuery(".drpAddCommentForm #locMa").val(),
                                        Na : jQuery(".drpAddCommentForm #locNa").val()
                                    };
                                    // are all fields filled out?
                                    if(jQuery(dl).find("#commentHeader").val() == "" || jQuery(".drpAddCommentForm #commentBody").val() == ""){

                                        jQuery(".errorText2").empty();
                                        jQuery(".errorText2").hide();
                                        jQuery(".errorText2").append("One of the textfields above is empty!");
                                        jQuery(".errorText2").fadeIn();
                                    } else {
                                        var comment = {
                                            header : jQuery(dl).find("#commentHeader").val(),
                                            body : jQuery(".drpAddCommentForm #commentBody").val(),
                                            commentedEntityType : jQuery(".drpAddCommentForm #commentedEntityType").val(),
                                            commentedEntityId: jQuery(".drpAddCommentForm #commentedEntityId").val()
                                        };
                                        comment.sharedTag = [];
                                        var selectedTags = jQuery(dl).find(".xpd-tag input:checked");
                                        selectedTags.each(function(k,v){
                                            comment.sharedTag.push(jQuery(v).attr("id"));
                                        });
                                        var locComm = drp.tr.comm.submitLocation(loc);
                                        drp.postTR(
                                            {
                                                id:"submitLocation",
                                                comm:[locComm]
                                            }, 
                                            function(rsp){
                                                comment.ownLocation = [rsp.submitLocation.result];
                                                var revComm = drp.tr.comm.submitComment(comment);
                                                drp.postTR(
                                                    {
                                                        id:"submitComment",
                                                        comm:[revComm]
                                                    }, 
                                                    function(rsp){
                                                        if(rsp.submitComment.result){
                                                            jQuery(dl).dialog('close');
                                                            drp.test.commentSuccessDialog(rsp.submitComment.result);
                                                        }
                                                    }
                                                );
                                            }
                                        );
                                    }
                                }
                            }
                        );
                    return;
                });
            }
        }
    });
}
// end ernstcommit
/**
 * obj with keyvals for
 * type
 * id
 * descr
 */
drp.test.deleteDialog = function(obj){
    // TODO er is een mechanisme voor errors wat in de traffic functie moet komen
    var dl = drp.createDialog(jQuery('#drpDeleteAreYouSureDialogTPL').render(obj));
    jQuery('.drpDeleteForm #delete').click(function(e){
        jQuery(dl).dialog('close');
        var arg = {
            id:"delete",
            comm:[drp.tr.comm.DeleteEntity(obj.type, obj.id)]
            };
        drp.postTR(
            arg,
            function(rsp){
                var dl2 = drp.createDialog(jQuery('#drpDeleteSuccessDialogTPL').render(obj));
                jQuery(".drpDeleteSuccessForm #nice").click(function(e){
                    jQuery(dl2).dialog('close');
                    vdvw.c.removeFromContentPane(obj.type, obj.id);
                    vdvw.c.dataRefresh();
                });
            },
            function(message){
                var containsIndex = message.indexOf(" delete fail ");
                if(-1 == containsIndex) alert("ERROR " + message);
                else{
                    var errorNR = message.substr(containsIndex + 13);
                    if(errorNR == "1") alert("not logged in");
                    else if(errorNR == "2") alert("no ownership");
                    else(alert("ERROR " + message));
                }
            }
        );
    });
}
drp.test.changeEmailAddressDialog = function(uid,mailAddress){
    var dl = drp.createDialog(jQuery('#drpResetEmailTPL').render({oldAddress:mailAddress,uid:uid}));
    jQuery(".errorText").hide();
    jQuery(".errorText").empty();
    jQuery(".drpResetEmailForm #submit").click(function(e){
        var newmail = jQuery(".drpResetEmailForm #newEmailAddress").val();
        var comm = drp.tr.comm.UserResetEmail(newmail);
        jQuery(dl).dialog('close');
        drp.postTR({
            id:"resetEmail",
            comm:[comm]
            }, 
            function(rsp){
                var dl = drp.createDialog(jQuery('#drpMailSentForResetEmailDialogTPL').render({}));
            }
        );
    });
}
drp.test.settingsDialog = function(mappedUser){
    // render the dialog with the first tab (user data)
    var dl = drp.createDialog(jQuery('#drpUserSettingsDialogTPL').render(mappedUser));
    jQuery( "#tabs" ).tabs();
    // add functionality to change email
    dl.find("#show-email").css({"cursor":"pointer","text-decoration":"underline"});
    dl.find("#show-email").click(function(event){
        drp.postTR(
            {id:"getmail",comm:[drp.tr.comm.mailAdresForUid(mappedUser.id)]},
            function(rsp){
                var mailAddress = rsp.getmail.result.mail;
                var uid = rsp.getmail.result.id;
                var JQ_mailLink = jQuery("<div>"+mailAddress+" <a style='text-decoration:underline;cursor:pointer;'>edit</a></div>");
                dl.find("#show-email").replaceWith(JQ_mailLink);
                JQ_mailLink.find("a").click(function(event){
                    jQuery(dl).dialog('close');
                    drp.test.changeEmailAddressDialog(uid,mailAddress);
                })
            }
        );
    });
    // render and populate the reviews table into the second tab
    var rvTab = jQuery('#drpUserReviewsTabTPL').render({});
    var JQ_rvTab = jQuery(rvTab);
    var rvs = xpd.Mappers.getReviewsForBookOwner(mappedUser.id);
    rvs.each(function(v){
        var mappedReview = xpd.Mappers.getMappedReviewForReview(v);
        var tRow = jQuery("#drpUserReviewsTabRowTPL").render(mappedReview);
        JQ_rvTab.children().eq(0).after(tRow);
    });
    jQuery(dl).find("#tabs-2").children().first().replaceWith(JQ_rvTab);
    JQ_rvTab.find("input[type=button]").click(function(event){
        jQuery(dl).dialog('close');
        vdvw.c.onClick.call(event.target,event);
    });
    // render and ... comments table ... third tab
    var cmTab = jQuery('#drpUserCommentsTabTPL').render({});
    var JQ_cmTab = jQuery(cmTab);
    var cms = xpd.Mappers.getCommentsForUser(mappedUser.id);
    cms.each(function(v){
        var tRow = jQuery("#drpUserCommentsTabRowTPL").render(v);
        JQ_cmTab.children().eq(0).after(tRow);
    });
    jQuery(dl).find("#tabs-3").children().first().replaceWith(JQ_cmTab);
    JQ_cmTab.find("input[type=button]").click(function(event){
        jQuery(dl).dialog('close');
        vdvw.c.onClick.call(event.target,event);
    });
}
/**
 * DIALOG HELPERS
 */
// begin aanpassingon 3 apr 2012
drp.test.geo = {};
drp.test.codeAddress = function(type) {
    jQuery(".errorText").hide();
    jQuery(".errorText2").hide();
    var address = document.getElementById("address").value;
    if(typeof marker != "undefined") {
        marker.setMap(null);
    }
    switch(type){
        case 'subscription':
            marker_image = 'app/images/site/booklocation_icon.png';
            break;
        case 'review':
            marker_image = 'app/images/site/reviewlocation_icon.png';
            break;
        case 'comment':
            marker_image = 'app/images/site/commentlocation_icon.png';
            break;
    }
    marker = new google.maps.Marker({
        map: map, 
        draggable: true,
        icon: marker_image
    });
    if(type == 'subscription'){
        drp.test.geocodeAddress(address, true);
    }
    if(type == 'review'){
        //console.log('review');
        drp.test.geocodeCommentOrReviewLocation(address, true, false,"drpAddReviewForm");
    }
    if(type == 'comment') {
        //comment
        drp.test.geocodeCommentOrReviewLocation(address, true, true,"drpAddCommentForm");
    }
}
drp.test.geo.extractMA = function(val){
    return val.geometry.location.lat();
}
drp.test.geo.extractNA= function(val){
    return val.geometry.location.lng();
}
drp.test.geocodeAddress = function(address, string) {
    var text;
    var myMa;
    var myNa;
    
    
    if(string){
        //the address is a string
        drp.geocoder().geocode( {
            'address': address
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results && results.length > 0) {
                    //updateMarkerAddress(results[0].formatted_address);
                    map.setCenter(results[0].geometry.location);
                    map.setZoom(12);
                    marker.setPosition(results[0].geometry.location);
                
                    google.maps.event.addListener(marker, 'dragend', function() {
                        drp.test.geocodeAddress(marker.getPosition(), false);
                    });
                    text = 'Is this the book location? '+results[0].formatted_address;
                    document.getElementById("address").value = results[0].formatted_address;

                } else {
                    //updateMarkerAddress('Cannot determine address at this location.');
                    text = 'Cannot determine this location.';
                }
            
            } else {
                text = 'Oops! Something went wrong, please try again.';
            }
            jQuery( '#drpPlacePickerText' ).html( text );
            myMa = drp.test.geo.extractMA(results[0]);
            myNa = drp.test.geo.extractNA(results[0]);
            //console.log(myMa,myNa);
            jQuery(".drpCreateSubscriptionForm #locMa").val(myMa);
            jQuery(".drpCreateSubscriptionForm #locNa").val(myNa);
        });
    } else {
        
        drp.geocoder().geocode( {
            'latLng': address
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results && results.length > 0) {
                
                    if(map.getZoom() < 12){
                        map.setZoom(12);
                    }
                    google.maps.event.addListener(marker, 'dragend', function() {
                        drp.test.geocodeAddress(marker.getPosition(), false);
                    });
                    text = 'Is this the book location? '+results[0].formatted_address;
                    document.getElementById("address").value = results[0].formatted_address;

                } else {
                
                    text = 'Cannot determine this location.';
                }
            
            } else {
                //alert("Geocode was not successful for the following reason: " + status);
                text = 'Oops! Something went wrong, please try again.';
            }
            jQuery( '#drpPlacePickerText' ).html( text );
            //console.log(results[0]);
            myMa = drp.test.geo.extractMA(results[0]);
            myNa = drp.test.geo.extractNA(results[0]);
            //console.log(myMa,myNa);
            jQuery(".drpCreateSubscriptionForm #locMa").val(myMa);
            jQuery(".drpCreateSubscriptionForm #locNa").val(myNa);
        });
    }
    
    
}
drp.test.geocodeCommentOrReviewLocation = function(address, string, comment, formName) {
    var text;
    var myMa;
    var myNa;
    //var marker_image;
    
    if(comment){
        marker_image = 'app/images/site/commentlocation_icon.png';
       
    }else{
        marker_image = 'app/images/site/reviewlocation_icon.png';
    }
    
    if(string){
        //the address is a string
        drp.geocoder().geocode( {
            'address': address
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results && results.length > 0) {
                    //updateMarkerAddress(results[0].formatted_address);
                    map.setCenter(results[0].geometry.location);
                    map.setZoom(12);
                    marker.setPosition(results[0].geometry.location);
                
                    google.maps.event.addListener(marker, 'dragend', function() {
                        drp.test.geocodeAddress(marker.getPosition(), false);
                    });
                    text = 'Is this the book location? '+results[0].formatted_address;
                    document.getElementById("address").value = results[0].formatted_address;

                } else {
                    //updateMarkerAddress('Cannot determine address at this location.');
                    text = 'Cannot determine this location.';
                }
            
            } else {
                text = 'Oops! Something went wrong, please try again.';
            }
            jQuery( '#drpPlacePickerText' ).html( text );
            if(results.length > 0){
                myMa = drp.test.geo.extractMA(results[0]);
                myNa = drp.test.geo.extractNA(results[0]);
                //console.log(myMa,myNa);
                jQuery("." + formName + " #locMa").val(myMa);
                jQuery("." + formName + " #locNa").val(myNa);
            }
        });
    } else {
        
        drp.geocoder().geocode( {
            'latLng': address
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results && results.length > 0) {
                
                    if(map.getZoom() < 12){
                        map.setZoom(12);
                    }
                    google.maps.event.addListener(marker, 'dragend', function() {
                        drp.test.geocodeAddress(marker.getPosition(), false);
                    });
                    text = 'Is this the book location? '+results[0].formatted_address;
                    document.getElementById("address").value = results[0].formatted_address;

                } else {
                
                    text = 'Cannot determine this location.';
                }
            
            } else {
                //alert("Geocode was not successful for the following reason: " + status);
                text = 'Oops! Something went wrong, please try again.';
            }
            jQuery( '#drpPlacePickerText' ).html( text );
            //console.log(results[0]);
            myMa = drp.test.geo.extractMA(results[0]);
            myNa = drp.test.geo.extractNA(results[0]);
            //console.log(myMa,myNa);
            jQuery("." + formName + " #locMa").val(myMa);
            jQuery("." + formName + " #locNa").val(myNa);
        });
    }
}
// eind aanpassingon 3 apr 2012
drp.test.addTinyMCE = function() {
    jQuery('#email_body').tinymce({
        script_url: 'js/ext/tinymce/jscripts/tiny_mce/jquery.tinymce.js',
        width: "550px",
        height: "290px",
        mode: "none",
        // General options
        theme : "simple"
    });
}
drp.test.removeTinyMCE = function () {
    tinyMCE.execCommand('mceFocus', false, 'email_body');
    tinyMCE.execCommand('mceRemoveControl', false, 'email_body');
}
drp.createDialog = function(templateString){
    var opts = {};
    opts.close = drp.onRemoveOfDialog;
    return drp.displayDialogOrPanel(templateString, opts);
}
drp.createPanel = function(templateString){
    var opts = {};
    opts.close = drp.onRemoveOfPanel;
    return drp.displayDialogOrPanel(templateString, opts);
}
drp.displayDialogOrPanel = function(templateString,opts){
    // render a jquery wrapped dom object from the template string
    var templateObj = jQuery(templateString);
    // apply the width from the top level dom element to the dialog optiosn
    var dialogWidth = templateObj.css("width");
    if(dialogWidth == "0px") dialogWidth = "";
    
    if(dialogWidth != "") opts.width = dialogWidth;
    // set other dialog properties as wished
    opts.modal = false;
    // and set the z index to resolve a bug see
    // http://forum.jquery.com/topic/can-t-edit-fields-of-ckeditor-in-jquery-ui-modal-dialog
    opts.zIndex = -1;
    opts.draggable = true;
    // create the dialog
    var dl = templateObj.dialog(opts);
    // if the dialog is too high for the window, shorten its outer element
    var wHeight = jQuery("body").height();
    var dlHeight = jQuery(dl).height();
    if(dlHeight > wHeight){
        jQuery(dl).parent().height(wHeight - 20);
        jQuery(dl).parent().css("top","0px");
        jQuery(dl).height(wHeight - 80);
    }
    // find and initialize the editors, keep reference to their ids
    var countUnIdentifiedEditors = 0;
    var editorIDS = [];
    jQuery.each(dl.find(".texteditor"), function(index,value){
        if(value.id == "" || typeof value.id == "undefined") value.id = 'editor_unidentified_' + countUnIdentifiedEditors++;
        jQuery(value).ckeditor();
        editorIDS.push(value.id);
    });
    var parent = jQuery(".ui-dialog-title");
    if(parent.length != 1){
        alert("error number 1338927595");
    }else{
        jQuery(".help").each(function(index,value){
            var jqVal = jQuery(value);
            if(parent.find(jqVal).length > 0){
                jqVal.css("cursor","pointer");
                jqVal.click(function(e){
                    var child = vdvw.c.openHelpForId(jqVal.attr('id'));
                    jQuery('#faq-wrap').addClass("dialogChild");
                    jQuery('#faq-wrap').css('zIndex', 9999);
                });
            }
        });
    }   
    dl.data("editors", editorIDS);
    // toggle about
    if(xpd.viewState.toggleAbout){
        xpd.viewState.toggleAbout = false;
        jQuery('#about-text').fadeOut();
    }
    return dl;
}

drp.trimDialogVertically = function(dl){
    // see if we need to lower the height of the dialog
    // as it could fall off the page and not have a scrollbar
    
    }
drp.onRemoveOfDialog = function(){
    var editorsRR = jQuery(this).data("editors");
    if(null != editorsRR){
        jQuery.each(editorsRR,function(index,value){
            if(value.substring(0,1) == "#") value = value.substring(1);
            if(null != CKEDITOR.instances[value]) CKEDITOR.instances[value].destroy();
        });
    }
    jQuery(this).dialog('destroy').remove();
    jQuery(".drpDialog").remove();
    if(jQuery("#faq-wrap").hasClass("dialogChild")){
        if(xpd.viewState.toggleFAQ){
            vdvw.c.onFAQClick();
        }
    }
    jQuery(".dialogChild").removeClass("dialogChild");
}
drp.onRemoveOfPanel = function(){
    var editorsRR = jQuery(this).data("editors");
    if(null != editorsRR){
        jQuery.each(editorsRR,function(index,value){
            if(value.substring(0,1) == "#") value = value.substring(1);
            if(null != CKEDITOR.instances[value]) CKEDITOR.instances[value].destroy();
        });
    }
    var width = jQuery(this).dialog('option','width');
    var panel = jQuery(this).dialog('destroy');
    var appendedPanel = panel.appendTo(jQuery('body')).hide();
    appendedPanel.css("width",width);
    if(jQuery("#faq-wrap").hasClass("dialogChild")){
        if(xpd.viewState.toggleFAQ){
            vdvw.c.onFAQClick();
        }
    }
    jQuery(".dialogChild").removeClass("dialogChild");
}