$('.q').on('input', function() {
    $(this).closest('.awesome-searchbox').find('.asb__reset').removeClass('hide');
    if($(this).val().length === 0){
      $(this).closest('.awesome-searchbox').find('.asb__reset').addClass('hide')
    }
});
$('.asb__reset').on('click', function() {
  $(this).closest('.awesome-searchbox').find('.q').val('').focus();
  $(this).addClass('hide');
});

var Sass = new Sass();

var html, scss, css, js;

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
            if(item.name.match(/-px/)){
              var itemName = item.name.replace(/-px/,"");
              config[itemName] = item.value + 'px';
            } else {
              config[item.name] = item.value;
            }
        }
    });
    config = JSON.stringify(config).replace(/"|{|}/g, '').replace(/,/g, ';\n');

    Sass.writeFile('settings.scss', config + ';');

    scss = config + ';\n\n' + data;

    Sass.compile(scss, function(result) {
      css = result.text;
      $('head style').last().remove();
      $("<style>" + css + "</style>").appendTo( "head" );
      $('.snippet code.language-css').text(css);
      $('.snippet code.language-scss').text(scss);
      Prism.highlightAll(false);
    });
  });
  var searchIcon = $('select[name="$search-icon"]').val();
  var clearIcon = $('select[name="$clear-icon"]').val();
  $('.awesome-searchbox .asb__submit use').attr('xlink:href','#' + searchIcon);
  $('.awesome-searchbox .asb__reset use').attr('xlink:href','#' + clearIcon);
  var serializer = new XMLSerializer();
  var searchSymbol = serializer.serializeToString($('#' + searchIcon)[0]);
  var clearSymbol = serializer.serializeToString($('#' + clearIcon)[0]);
  var svgWrapper = '  <svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n\t' + searchSymbol + '\n\t' + clearSymbol + '\n  </svg>\n';
  $('.snippet code.language-markup').text( svgWrapper + $('.awesome-searchbox').parent().html());
};

updateSnippet();

$('form#settings').on('input change', updateSnippet);

html = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">\n'+
  '<html lang="en">\n'+
    '<head>\n' +
      '<meta http-equiv="content-type" content="text/html; charset=utf-8">\n'+
      '<title>title</title>\n'+
      '<link rel="stylesheet" type="text/css" href="style.css">\n' +
      '<script type="text/javascript" src="script.js"></script>\n' +
    '</head>\n' +
    '<body>\n' +
  		$('.snippet code.language-markup').text() +
    '</body>\n'+
  '</html>';

$('.download-zip').on('click',function(){
  var zip = new JSZip();
  zip.file("index.html", html);
  zip.file("style.css", css );
  zip.file("script.js", "Hello World\n");
  var content = zip.generate({type:"blob"});
  saveAs(content, "awesome-searchbox.zip");
});

$('.jscolor').addClass('{hash:true}')

$('.jselectric').selectric({
  optionsItemBuilder: function(itemData, element, index) {
    return element.val().length ? '<svg class="icon-select-option"><use xlink:href="#' + element.val() +  '"></use></svg>' + itemData.text : itemData.text;
  },
  labelBuilder: function(itemData) {
    return '<svg class="icon-select-label"><use xlink:href="#' + itemData.value +  '"></use></svg>';
  }
});
