$("#confirm").on('click', conf_id);
$("#forgot-username").keypress(function (e) {
  if (e.which == 13) {
    conf_id();
    return false;
  }
});

function conf_id() {
	$("#confirm").attr('disabled', true);
	try{
		$.ajax({
			url: 'ajax/user_exists',
			type: 'POST',
			data: {
				'username': $("#forgot-username").val(),
				'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
			}, 
			success: function(data) {
				if (data.exists) {
					$("#modalPassword").modal("hide");
					$("#verify-username").val($("#forgot-username").val());
					$("#my2_emaildetails").text("Your registered email address is " + data.email);
					// IMPORTANT! On deployment, the following code will send a verification code
					// Devs have temporarily disabled this, waiting for an SMTP server.
					// Once available, you must uncomment the code and comment out the one after it!
					$("#myModal2").modal("show");
					// $("#conf-password").modal("show");
				} else {
					err_mesg("#forgot-username", "#forgot-error", "This username does not exist.");
				}
				$("#confirm").attr('disabled', false);
			},
			error: function(err) {
				console.log(err);
			}
		});
	} catch(err) {
		console.log(err.message);
	}
}

$("#btn-auth").on('click', function(event) {
	event.preventDefault();
	$("#btn-auth").attr('disabled', true);
	$.ajax({
		url: 'ajax/user_login',
		type: 'POST',
		data: {
			'username': $("#auth-username").val(),
			'password': $("#auth-password").val(),
			'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
		},
		success: function(data) {
			if (data.err == '') {
				window.location.href = '/account/profile';
			} else {
				err_mesg('#auth-password', '#auth-error', data.err);
				$("#login-form").addClass("show");
			}
			$("#btn-auth").attr('disabled', false);
		}
	})
})

$("#my2_submit").on('click', verif);
$("#my2_verifcode").keypress(function (e) {
  if (e.which == 13) {
    verif();
    return false;
  }
});

function verif() {
	try{
		$("#my2_submit").attr('disabled', true);
	$.ajax({
		url: 'ajax/user_verifies',
		type: 'POST',
		data: {
			'username': $("#forgot-username").val(),
			'verifcode': $("#my2_verifcode").val(),
			'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
		}, 
		success: function(data) {
			if (data.valid) {
				$("#myModal2").modal("hide");
				$("#conf-password").modal("show");
			} else {
				err_mesg("#my2_verifcode", "#my2-error", "The code you entered is incorrect.");
			}
			$("#my2_submit").attr('disabled', false);
		},
		error: function(err) {
			console.log(err);
		}
	});
	} catch(err) {
		console.log(err.message);
	}
	// return false;
}

$("#btn-signin").on('click', function() {
	$("#myModalLabel").text("Sign-up");
	$("#modalPassword").modal('show');
})

$("#btn-forgot").on('click', function() {
	$("#myModalLabel").text("Forgot Password");
	$("#modalPassword").modal('show');
})

$("#conf_submit").on('click', pass_ver);
$("#conf-password-1").keypress(function (e) {
  if (e.which == 13) {
    pass_ver();
    return false;
  }
});
$("#conf-password-2").keypress(function (e) {
  if (e.which == 13) {
    pass_ver();
    return false;
  }
});
function pass_ver() {
	$("#conf_submit").attr('disabled', true);
	try{
	$.ajax({
		url: 'ajax/user_changes_password',
		type: 'POST',
		data: {
			'username': $("#forgot-username").val(),
			'password': $("#conf-password-1").val(),
			'conf-password': $("#conf-password-2").val(),
			'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
		}, 
		success: function(data) {
			if (data.error == "") {
				// $("#conf-password").modal("hide");
				// $("#successmodal").modal("show");
				window.location.href = '/account/profile';
			} else {
				err_mesg("#conf-password-1", "#conf-error", data.error);
				err_mesg("#conf-password-2", "#conf-error", data.error);
			}
			$("#conf_submit").attr('disabled', false);
		},
		error: function(err) {
			console.log(err);
		}
	});
	} catch(err) {
		console.log(err.message);
	}
	// return false;
}

$("#success_reload").on('click', function(){
	location.reload();
})

$("#forgot-username").click(function() {
	removeVal(this, "#forgot-error");
})

$("#forgot-username").change(function() {
	removeVal(this, "#forgot-error");
})

$("#my2_verifcode").click(function() {
	removeVal(this, "#my2-error");
})

$("#my2_verifcode").change(function() {
	removeVal(this, "#my2-error");
})

$("#conf-password-1").click(function() {
	removeVal(this, "#conf-error");
})

$("#conf-password-1").change(function() {
	removeVal(this, "#conf-error");
})

$("#conf-password-2").click(function() {
	removeVal(this, "#conf-error");
})

$("#conf-password-2").change(function() {
	removeVal(this, "#conf-error");
})

$("#auth-password").click(function() {
	removeVal(this, "#auth-error");
})

$("#auth-password").change(function() {
	removeVal(this, "#auth-error");
})

function removeVal(inp, errplace) {
	$(inp).css("background-color", "");
    $(inp).next(".validation").remove();
    $(".validation").remove();
}

function err_mesg(inp, errplace, err) {
	if ($(errplace).next(".validation").length == 0) { // only add if not added
		$(inp).css("background-color", "#FFBABA");
        $(errplace).after("<div class='validation' style='color:red;margin-bottom: 5px;'>" + err + "</div>");
    }
}