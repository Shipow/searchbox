var Sass = new Sass();
var html, scss, css, prefixed;
var themes = {};

$('.jscolor').addClass('{hash:true}')

$('.select').selectric();

$.fn.regex = function(pattern, fn, fn_a){
  var fn = fn || $.fn.text;
  return this.filter(function() {
    return pattern.test(fn.apply($(this), fn_a));
  });
};

$.fn.flash_message = function(options) {
  options = $.extend({
    text: 'Done',
    time: 1000,
    how: 'before',
    class_name: ''
  }, options);
  return $(this).each(function() {
    if( $(this).parent().find('.flash_message').get(0) )
      return;
    var message = $('<span />', {
      'class': 'flash_message ' + options.class_name,
      html: options.text
    }).hide().fadeIn('fast');
    $(this)[options.how](message);
    message.delay(options.time).fadeOut('normal', function() {
      $(this).remove();
    });
  });
};

function updateSnippet(){
  $.get('scss/searchbox.scss', function(data){
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

    scss = '$custom:(\n\t' + config + '\n);\n\n' + data;
    scss += '\n.' + $('[name="namespace"]').val() + '{\n\t@include searchbox($custom...);\n}';

    Sass.options({
      style: Sass.style.expanded
    });

    Sass.compile(scss, function(result) {
      css = result.text;
      $('head style').last().remove();
      prefixed = autoprefixer.process(css);
      $("<style>" + prefixed + "</style>").appendTo( "head" );
      $('#css-prefix').text(prefixed.css);
      $('#css').text(css);
      $('#scss').text(scss);
      Prism.highlightAll(false);
      $('.main-content').removeClass('hide');
      $('.loading-wrapper').addClass('hide');
    });
  });
  var searchIcon = $('select[name="icon"]').val();
  var clearIcon = $('select[name="icon-clear"]').val();
  $('.searchbox [type="submit"] use').attr('xlink:href','#' + searchIcon);
  $('.searchbox [type="reset"] use').attr('xlink:href','#' + clearIcon);
  var serializer = new XMLSerializer();
  var searchSymbol = serializer.serializeToString($('#' + searchIcon)[0]);
  var clearSymbol = serializer.serializeToString($('#' + clearIcon)[0]);
  var svgWrapper = '  <svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n\t' + searchSymbol + '\n\t' + clearSymbol + '\n  </svg>\n';
  $('.snippet code.language-markup').text( html_beautify( svgWrapper + $('.searchbox').parent().html(),{
    indent_size: 2,
    indent_char: " "
  }));

  $('.select-icon').selectric('refresh');
  $('.select').selectric('refresh');
};

tabby.init();
$('#snippets .tabs a').on('click', function(e){
  $('#snippets .tabs a').removeClass('active');
  $(this).addClass('active');

})

$('.select-icon').selectric({
  optionsItemBuilder: function(itemData, element, index) {
    return element.val().length ? '<svg class="icon-select-option"><use xlink:href="#' + element.val() +  '"></use></svg>' + itemData.text : itemData.text;
  },
  labelBuilder: function(itemData) {
    return '<svg class="icon-select-label"><use xlink:href="#' + itemData.value +  '"></use></svg>';
  }
});

updateSnippet();

$('form#settings').on('input change', function(){
    updateSnippet();
    var val = "sbx-custom";
    if (!$('.searchbox-demo').hasClass('sbx-custom-demo')){
      $('select[name="namespace"]').prop('selectedIndex', 0).selectric('refresh');
      applyTheme(val,'.searchbox');
      applyTheme(val,'[type="search"]','__input');
      applyTheme(val,'[type="reset"]','__reset');
      applyTheme(val,'[type="submit"]','__submit');
    }
});

$('.download-zip').on('click',function(){
  var zip = new JSZip();
  html = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">\n'+
  '<html lang="en">\n'+
  '<head>\n' +
  '<meta http-equiv="content-type" content="text/html; charset=utf-8">\n'+
  '<title>title</title>\n'+
  '<link rel="stylesheet" type="text/css" href="style.css">\n' +
  '</head>\n' +
  '<body>\n' +
  $('.snippet code.language-markup').text() +
  '</body>\n'+
  '</html>';
  zip.file("index.html", html);
  zip.file("style.css", prefixed.content );
  var content = zip.generate({type:"blob"});
  saveAs(content, "searchbox.zip");
});

function applyTheme(val, el, suf){
  suf = typeof suf !== 'undefined' ? suf : '';
  $(' ' + el).regex(/sbx-/, $.fn.attr, ['class']).removeClass(function (index, css) {
    return (css.match (/(^|\s)sbx-\S+/g) || []).join(' ');
  }).addClass(val + suf);
}

function populate(frm, data) {
  $.each(data, function(key, value){
    var $ctrl = $('[name='+key+']', frm);
    if( typeof value === "string" && value.match(/px/) ){
      $('[name='+key+'-px]', frm).val(value.replace(/px/,''));
    }
    switch($ctrl.attr("type")) {
      case "text" :
      case "hidden" :
      $ctrl.val(value);
      break;
      case "radio" : case "checkbox":
      $ctrl.each(function(){
        $(this).removeAttr("checked");
        if($(this).attr('value') == value) {
          $(this).attr("checked", value);
        }
      });
      break;
      default:
      $ctrl.val(value);
    }
  });
}

$('.json').each(function(){
  var theme = window.getComputedStyle(this,':before').content.replace(/\\"/g,'"').replace(/"{/g,'{').replace(/\}"/g,'}').replace(/'/g,'');
  theme = JSON.parse(theme);
  var themeKey = $(this).data("theme");
  themes[themeKey] = theme;
});


$('select[name="namespace"]').on('change', function(){
  var val = $(this).val();
  if (val !== 'sbx-custom'){
    populate($('form#settings'), themes['sbx-google']); //default
  }
  populate($('form#settings'), themes[val]);
  $.map($('.jscolor'), function(data){
    data.jscolor.fromString($(data).val().replace(/#/,''));
  });
  applyTheme(val,'.searchbox-demo','-demo');
  applyTheme(val,'.searchbox');
  applyTheme(val,'[role="search"]','__wrapper');
  applyTheme(val,'[type="search"]','__input');
  applyTheme(val,'[type="reset"]','__reset');
  applyTheme(val,'[type="submit"]','__submit');
  updateSnippet();
});

// catch submit
$("form.searchbox").submit(function(e){
    e.preventDefault();
    var form = this;
    $('.message-demo').flash_message({
        text: 'The query "<strong class="query">'+$('[type="search"]').val()+'</strong>" has been triggered.',
        how: 'append'
    });
});

var clipboard = new Clipboard('.copy');
clipboard.on('success', function(e) {
  $( $(e.trigger).data('clipboard-target')).parent().removeClass("flash");
  setTimeout(function() {
      $( $(e.trigger).data('clipboard-target')).parent().addClass('flash');
  }, 1);

  $('.message-demo').flash_message({
      text: 'Snippet copied in your clipboard!',
      how: 'append'
  });
  e.clearSelection();
});

$('.edit-fidddle').on('click', function(e){
  e.preventDefault;
  html = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">\n'+
  '<html lang="en">\n'+
  '<head>\n' +
  '<meta http-equiv="content-type" content="text/html; charset=utf-8">\n'+
  '<title>title</title>\n'+
  '<link rel="stylesheet" type="text/css" href="style.css">\n' +
  '</head>\n' +
  '<body>\n' +
  $('.snippet code.language-markup').text() +
  '</body>\n'+
  '</html>';
  $('#jsfiddle [name="html"]').val(html);
  $('#jsfiddle [name="css"]').val(prefixed);

  $('#jsfiddle').submit();
});
