jQuery(document).ready(function($) {
  "use strict";

  //Contact
  $('form.contactForm').submit(function() {
    var f = $(this).find('.form-group'),
      ferror = false,
      emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

    f.children('input').each(function() { // run all inputs

      var i = $(this); // current input
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;

          case 'email':
            if (!emailExp.test(i.val())) {
              ferror = ierror = true;
            }
            break;

          case 'checked':
            if (! i.is(':checked')) {
              ferror = ierror = true;
            }
            break;

          case 'regexp':
            exp = new RegExp(exp);
            if (!exp.test(i.val())) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validation').html((ierror ? (i.attr('data-msg') !== undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });
    f.children('textarea').each(function() { // run all inputs

      var i = $(this); // current input
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validation').html((ierror ? (i.attr('data-msg') != undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });
    if (ferror) return false;
    else var str = $(this).serialize();
    var action = $(this).attr('action');
    if( ! action ) {
      action = 'contactform/contactform.php';
    }
    enviar_mail($("#subject").val(),$("#mensaje").val(),$("#email").val());
    // $.ajax({
    //   type: "POST",
    //   url: action,
    //   data: str,
    //   success: function(msg) {
    //     // alert(msg);
    //     if (msg == 'OK') {
    //       $("#sendmessage").addClass("show");
    //       $("#errormessage").removeClass("show");
    //       $('.contactForm').find("input, textarea").val("");
    //     } else {
    //       $("#sendmessage").removeClass("show");
    //       $("#errormessage").addClass("show");
    //       $('#errormessage').html(msg);
    //     }

    //   }
    // });
    return false;
  });

});
function enviar_mail(sujeto,mensaje,mail){
  Email.send({
    Host : "smtp.elasticemail.com",
    Username : "brankoottavianelli@gmail.com",
    Password : "1293f1f9-e855-4030-a104-94a102fc0b33",
    To : 'branko-96@hotmail.com',
    From : "brankoottavianelli@gmail.com",
    Subject : sujeto,
    Body : "De: "+mail+" , "+mensaje
}).then(
  message => mostrar_mensaje(message)
);
}
function mostrar_mensaje(msg){
  if (msg == 'OK') {
    $("#sendmessage").addClass("show");
    $("#errormessage").removeClass("show");
    $('.contactForm').find("input, textarea").val("");
  } else {
    $("#sendmessage").removeClass("show");
    $("#errormessage").addClass("show");
    $('#errormessage').html("No se ha podido enviar el mensaje, intente mas tarde");
  }
  $('.contactForm').hide("slow");
  $("#btn_volver").show();
}
function mostrar_form(){
  $('.contactForm').show("fast");
  $("#btn_volver").hide();
  $("#sendmessage").removeClass("show");
  $("#errormessage").removeClass("show");
}