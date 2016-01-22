$('.js-search-input').on('input', function() {
    $(this).closest('.awesome-searchbox').find('.js-search-reset').removeClass('hide');
    if($(this).val().length === 0){
      $(this).closest('.awesome-searchbox').find('.js-search-reset').addClass('hide')
    }
});
$('.js-search-reset').on('click', function() {
  $(this).closest('.awesome-searchbox').find('.js-search-input').val('').focus();
  $(this).addClass('hide');
});
