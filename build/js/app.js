// asb

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


// demos

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
    config = JSON.stringify(config).replace(/"|{|}/g, '').replace(/,/g,',\n\t').replace(/:/g,': ');

    // Sass.writeFile('settings.scss', config + ';');

    scss = '$custom :(\n\tsearch-namespace:\'asb-custom\',\n\t' + config + '\n);\n\n' + data;
    scss += '\n@include awesome-searchbox(($custom)...);'

    Sass.compile(scss, function(result) {
      css = result.text;
      $('head style').last().remove();
      $("<style>" + css + "</style>").appendTo( "head" );
      $('.snippet code.language-css').text(css);
      $('.snippet code.language-scss').text(scss);
      Prism.highlightAll(false);
      $('#demo').removeClass('hide');
      $('#snippets').removeClass('hide');
    });
  });
  var searchIcon = $('select[name="search-icon"]').val();
  var clearIcon = $('select[name="search-clear-icon"]').val();
  $('.js-search-submit use').attr('xlink:href','#' + searchIcon);
  $('.js-search-reset use').attr('xlink:href','#' + clearIcon);
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

$('.select-icon').selectric({
  optionsItemBuilder: function(itemData, element, index) {
    return element.val().length ? '<svg class="icon-select-option"><use xlink:href="#' + element.val() +  '"></use></svg>' + itemData.text : itemData.text;
  },
  labelBuilder: function(itemData) {
    return '<svg class="icon-select-label"><use xlink:href="#' + itemData.value +  '"></use></svg>';
  }
});
$('.select').selectric();

//BERK

$.fn.regex = function(pattern, fn, fn_a){
    var fn = fn || $.fn.text;
    return this.filter(function() {
        return pattern.test(fn.apply($(this), fn_a));
    });
};

function applyTheme(val, el, suf){
  suf = typeof suf !== 'undefined' ? suf : '';
  $(' ' + el).regex(/asb-/, $.fn.attr, ['class']).removeClass(function (index, css) {
    return (css.match (/(^|\s)asb-\S+/g) || []).join(' ');
  }).addClass(val + suf);
}

$('select[name="search-namespace"]').on('change', function(){
  var val = $(this).val();
  applyTheme(val,'#demo','_demo');
  applyTheme(val,'.awesome-searchbox');
  applyTheme(val,'.js-search-input','__input');
  applyTheme(val,'.js-search-reset','__reset');
  applyTheme(val,'.js-search-submit','__submit');

});
