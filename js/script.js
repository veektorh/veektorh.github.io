contactname = $('#contact-name');
contactemail = $('#contact-email');
contactmessage = $('#contact-message');

$(".home h1").typed({
        //strings: ["V^500I^500C^500T^50O^500R ^500B^500O^500L^500U^500M"]
        strings: ["VICTOR BOLUM"]
      });

setTimeout(function(){
    $(".home h2").typed({
    strings:["I'm a Full Stack Developer"]
});
},1000);

//$('.home').hide();
$('.profile-container').hide();
$('.portfolio-container').hide();
$('.contact-container').hide();

$('.profile_link').click(function(){
    displayHome(".home",".profile-container");
});

$('.portfolio_link').click(function(){
    displayHome(".home",".portfolio-container");
});

$('.contact_link').click(function(){
    displayHome(".home",".contact-container");
});

$('.homebtn,.homebtn2,.home-nav-icon').click(function(){
    displayNav(".current",".home");
});

$('.portfoliobtn,.portfolio-nav-icon').click(function(){
    displayNav(".current",".portfolio-container");
});

$('.profilebtn,.profile-nav-icon').click(function(){
    displayNav(".current",".profile-container");
});

$('.contactbtn,.contact-nav-icon').click(function(){
    displayNav(".current",".contact-container");
});


$('.download-resume').click(function(){
    bootbox.alert('Downloading Resume ...');
});

function displayHome(oldpage,newpage){
    $(oldpage).slideUp(1000);
    $(newpage).show().addClass('current');
}

function displayNav(oldpage,newpage){
    $(oldpage).slideUp(1000).removeClass('current').hide(2000);
    $(newpage).slideDown(1000).addClass('current');
}