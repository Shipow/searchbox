
// Focus search input after hitting reset button
$('.awesome-searchbox [type="reset"]').on('click', function() {
  $(this).siblings('[type="search"]').focus();
});
