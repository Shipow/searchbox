$('.q').on('input', function() {
    $(this).closest('.awesome-searchbox').find('.clear-q').removeClass('hide');
});
$('.clear-q').on('click', function() {
  $(this).closest('.awesome-searchbox').find('.q').val('').focus();
  $(this).addClass('hide');
});

var Sass = new Sass();

$('.snippet code.language-markup').text($('.awesome-searchbox').parent().html());

function updateSnippet(){
  $.get('awesome-searchbox.scss', function(data){

    var config = {};
    $('form#settings').serializeArray().map(function(item) {
        if ( config[item.name] ) {
            if ( typeof(config[item.name]) === "string" ) {
                config[item.name] = [config[item.name]];
            }
            config[item.name].push(item.value);
        } else {
            config[item.name] = item.value;
        }
    });

    config = JSON.stringify(config).replace(/"|{|}/g, '').replace(/,/g, ';');

    Sass.writeFile('settings.scss', config + ';');


    Sass.compile('@import "settings";' + data, function(result) {
      $('.snippet code.language-css').text(result.text);
      $("<style>" + result.text + "</style>").appendTo( "head" );
      Prism.highlightAll(false);
    });
  });
};
$('.btn-update').on('click',updateSnippet);
