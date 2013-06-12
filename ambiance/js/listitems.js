$(document).ready(function() {
  $("ul li").on('swipeleft', function(e) {
    console.log('test');
    $(event.target).addClass( 'swipeleft' );
  });
});