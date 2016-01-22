var Sass = new Sass();
var html, scss, css, prefixed, js;
var themes = {};

$('.theme-json').each(function(){
  var theme = JSON.parse(JSON.parse(window.getComputedStyle(this,':before').content));
  themes[theme['search-namespace']] = theme;
});

$.fn.regex = function(pattern, fn, fn_a){
  var fn = fn || $.fn.text;
  return this.filter(function() {
    return pattern.test(fn.apply($(this), fn_a));
  });
};

function updateSnippet(){
  $.get('scss/awesome-searchbox.scss', function(data){
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
      prefixed = autoprefixer.process(css);
      $("<style>" + prefixed + "</style>").appendTo( "head" );
      $('#css').text(css);
      $('#css-prefix').text(prefixed.css);
      $('#scss').text(scss);
      Prism.highlightAll(false);
      $('#demo, #snippets').removeClass('hide');
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

$.get('js/awesome-searchbox.js', function(data){
  $('#js').text(data);
});


$('form#settings').on('input change', function(){
    updateSnippet();
    var val = "asb-custom";
    if (!$('#demo').hasClass('asb-custom_demo')){
      $('select[name="search-namespace"]').prop('selectedIndex', 0).selectric('refresh');
      applyTheme(val,'.awesome-searchbox');
      applyTheme(val,'.js-search-input','__input');
      applyTheme(val,'.js-search-reset','__reset');
      applyTheme(val,'.js-search-submit','__submit');
    }
});

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
  zip.file("style.css", prefixed );
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

function applyTheme(val, el, suf){
  suf = typeof suf !== 'undefined' ? suf : '';
  $(' ' + el).regex(/asb-/, $.fn.attr, ['class']).removeClass(function (index, css) {
    return (css.match (/(^|\s)asb-\S+/g) || []).join(' ');
  }).addClass(val + suf);
}

function populate(frm, data) {
  $.each(data, function(key, value){
    var $ctrl = $('[name='+key+']', frm);
    if( typeof value === "string" && value.match(/px/) ){
      $('[name='+key+'-px]', frm).val(value.replace(/px/,''));
    };
    switch($ctrl.attr("type"))
    {
      case "text" :
      case "hidden" :
      $ctrl.val(value);
      break;
      case "radio" : case "checkbox":
      $ctrl.each(function(){
        if($(this).attr('value') == value) {  $(this).attr("checked",value); } });
        break;
        default:
        $ctrl.val(value);
      }
    });
  }

  $('select[name="search-namespace"]').on('change', function(){

    var val = $(this).val();
    populate($('form#settings'), themes['asb-google']); //default
    populate($('form#settings'), themes[val]);
    $.map($('.jscolor'), function(data){
      data.jscolor.fromString($(data).val().replace(/#/,''));
    });


    applyTheme(val,'#demo','_demo');
    applyTheme(val,'.awesome-searchbox');
    applyTheme(val,'.js-search-input','__input');
    applyTheme(val,'.js-search-reset','__reset');
    applyTheme(val,'.js-search-submit','__submit');

    updateSnippet();

  });
