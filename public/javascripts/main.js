$(document).ready(function(){
  $('#regform').bind("submit", function(event){
    var username = $('#reg-username').attr('value');
    var password = $('#reg-password').attr('value');
    var passwordre = $('#reg-password-re').attr('value');
    var email = $('#reg-email').attr('value');
    if(username.length < 2 || username.length > 15){
      $('#reg-username-mis').addClass('show');
      event.preventDefault();
    }else{
      $('#reg-username-mis').removeClass('show');
    }
    if(email == ''){
      $('#reg-email-mis').addClass('show');
      event.preventDefault();
    }else{
      $('#reg-email-mis').removeClass('show');
    }
    if(password == ''){
      $('#reg-password-mis').addClass('show');
      event.preventDefault();
    }else{
      $('#reg-password-mis').removeClass('show');
    }
    if(passwordre !== password || passwordre == ''){
      $('#reg-password-re-mis').addClass('show');
      event.preventDefault();
    }else{
      $('#reg-password-re-mis').removeClass('show');
    }
  });

  $('#loginform').bind("submit", function(event){
    var username = $('#login-username').attr('value');
    var password = $('#login-password').attr('value');
    if(username == ''){
      $('#login-username-mis').addClass('show');
      event.preventDefault();
    }else{
      $('#login-username-mis').removeClass('show');
    }
    if(password == ''){
      $('#login-password-mis').addClass('show');
      event.preventDefault();
    }else{
      $('#login-password-mis').removeClass('show');
    }
  });

  $('#addnewform').bind("submit", function(event){
    var title = $('#addnew-title').attr('value');
    var type = $('#addnew-type').attr('value');
    var detail = $('#addnew-detail').attr('value');
    var placard = $('#addnew-placard').attr('value');
    var place = $('#addnew-place').attr('value');
    //var date = $('#addnew-date').attr('value');
    //console.log(new Date(date).getHours());
    if(title == ''){
      $('#addnew-title-mis').addClass('show');
      event.preventDefault();
    }else{
      $('#addnew-title-mis').removeClass('show');
    }
    if(type == '0'){
      $('#addnew-type-mis').addClass('show');
      event.preventDefault();
    }else{
      $('#addnew-type-mis').removeClass('show');
    }
    if(detail == ''){
      $('#addnew-detail-mis').addClass('show');
      event.preventDefault();
    }else{
      $('#addnew-detail-mis').removeClass('show');
    }
    if(placard == ''){
      $('#addnew-placard-mis').addClass('show');
      event.preventDefault();
    }else{
      $('#addnew-placard-mis').removeClass('show');
    }
    if(place == ''){
      $('#addnew-place-mis').addClass('show');
      event.preventDefault();
    }else{
      $('#addnew-place-mis').removeClass('show');
    }
  });

  $('#addnew-date').appendDtpicker({
    "locale": "cn",
    "animation": false,
    "futureOnly": true
  });



  $('#editform').bind("submit", function(event){
    var title = $('#edit-title').attr('value');
    var type = $('#edit-type').attr('value');
    var detail = $('#edit-detail').attr('value');
    var placard = $('#edit-placard').attr('value');
    var place = $('#edit-place').attr('value');
    
    if(title == ''){
      $('#edit-title-mis').addClass('show');
      event.preventDefault();
    }else{
      $('#edit-title-mis').removeClass('show');
    }
    if(type == '0'){
      $('#edit-type-mis').addClass('show');
      event.preventDefault();
    }else{
      $('#edit-type-mis').removeClass('show');
    }
    if(detail == ''){
      $('#edit-detail-mis').addClass('show');
      event.preventDefault();
    }else{
      $('#edit-detail-mis').removeClass('show');
    }
    //if(placard == ''){
    // $('#edit-placard-mis').addClass('show');
    //  event.preventDefault();
    //}else{
    //  $('#edit-placard-mis').removeClass('show');
    //}
    if(place == ''){
      $('#edit-place-mis').addClass('show');
      event.preventDefault();
    }else{
      $('#edit-place-mis').removeClass('show');
    }
  });

  $('#suggestform').bind("submit",function(){
    if($('#suggest').attr('value') == ""){
      $('#suggest-mis').addClass('show');
      event.preventDefault();
    }else{
      $('#suggest-mis').removeClass('show');
    }
  });

  $('.comment li p').each(function(){
    var aa = $(this).text();
    var bb = $.parseHTML(aa);
    $(this).html(bb);
  });

  $('#suggestlist li p').each(function(){
    var aa = $(this).text();
    var bb = $.parseHTML(aa);
    $(this).html(bb);
  });

});