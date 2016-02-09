# SEARCHBOX
Just a searchbox generator

## use the generator
http://shipow.github.io/searchbox/

## use the mixin in your project
https://github.com/Shipow/searchbox/blob/master/scss/_searchbox.scss

### html

```html
<form novalidate="novalidate" onsubmit="return false;" class="searchbox sbx-custom">
  <div role="search" class="sbx-custom__wrapper">
    <input type="search" name="search" placeholder="Search your website" autocomplete="off" required="required" class="sbx-custom__input">
    <button type="submit" title="Submit your search query." class="sbx-custom__submit">
      <svg role="img" aria-label="Search">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#sbx-icon-search-18"></use>
      </svg>
    </button>
    <button type="reset" title="Clear the search query." class="sbx-custom__reset">
      <svg role="img" aria-label="Reset">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#sbx-icon-clear-5"></use>
      </svg>
    </button>
  </div>
</form>
```

### scss

```scss
@import 'searchbox';

$custom:(
	input-width: 300px,
	input-height: 50px,
	border-width: 2px,
	border-radius: 25px,
	input-border-color: #ccc,
	input-focus-border-color: #FF2E83,
	input-background: white,
	input-focus-background: white,
	font-size: 14px,
	placeholder-color: #bbb,
	icon: sbx-icon-search-18,
	icon-size: 30px,
	icon-position: left,
	icon-color: #FF2E83,
	icon-background: #FFFFFF,
	icon-background-opacity: 0,
	icon-clear: sbx-icon-clear-5,
	icon-clear-size: 18px
);

.sbx-custom{
  @include searchbox($custom...);
}
```

### js (optionnal)

```javascript
// focus input after reset
document.querySelector('.searchbox [type="reset"]').addEventListener('click', function() {
  this.parentNode.querySelector('input').focus();
});
```

### With Instantsearch.js

```javascript
search.addWidget(
  instantsearch.widgets.searchBox({
    container: '#search',
    placeholder: 'Search for product, brands, SKU, ...',
    wrapInput: false
  })
);
```

### Icons

#### Reset

#### Search

## run the generator

- npm install
- gulp dev
