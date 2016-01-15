
$('.q').on('input', function() {
    $(this).closest('.awesome-searchbox').find('.clear-q').removeClass('hide');
});

$('.clear-q').on('click', function() {
  $(this).closest('.awesome-searchbox').find('.q').val('').focus();
  $(this).addClass('hide');
});
