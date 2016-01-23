
// Focus search input after hitting reset button
$('.searchbox [type="reset"]').on('click', function() {
  $(this).siblings('[type="search"]').focus();
});
