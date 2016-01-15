
$('.q').on('input', function() {
    $(this).closest('.awesome-searchbox').find('.clear-q').removeClass('hide');
});

$('.clear-q').on('click', function() {
  $(this).closest('.awesome-searchbox').find('.q').val('').focus();
  $(this).addClass('hide');
});

var Sass = new Sass();

$('.snippet code.language-markup').text($('.awesome-searchbox').parent().html());

$.get('_awesome-searchbox.scss', function(data){
  Sass.compile(data, function(result) {
    $('.snippet code.language-css').text(result.text);
    Prism.highlightAll(false);
  });
});

// var scss = '$someVar: 123px; .some-selector { width: $someVar; }';
