
$('.q').on('input', function() {
    $(this).closest('.awesome-searchbox').find('.clear-q').removeClass('hide');
});

$('.clear-q').on('click', function() {
  $(this).closest('.awesome-searchbox').find('.q').val('').focus();
  $(this).addClass('hide');
});

var Sass = new Sass();

$.get('_awesome-searchbox.scss', function(data){
  Sass.compile(data, function(result) {
    $('.snippet').text(result.text);
    Prism.highlightAll(false);
  });
});

// var scss = '$someVar: 123px; .some-selector { width: $someVar; }';
