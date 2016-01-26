# searchbox
Just a searchbox generator

## use the generator
http://shipow.github.io/searchbox/

## use the mixin in your project
https://github.com/Shipow/searchbox/blob/master/scss/_searchbox.scss

### html

```
<form role="search" novalidate="novalidate" class="searchbox sbx-custom">
  <input type="search" name="search" placeholder="Search your website" autocomplete="off" required="required" class="sbx-custom__input">
  <button type="submit" class="sbx-custom__submit">
    <svg role="img" aria-label="Search">
      <title>Icon Search</title>
      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#sbx-icon-search-18"></use>
    </svg>
  </button>
  <button type="reset" class="sbx-custom__reset">
    <svg role="img" aria-label="Reset">
      <title>Icon Reset</title>
      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#sbx-icon-clear-5"></use>
    </svg>
  </button>
</form>
```

### scss
```
@import 'searchbox';

$custom: (
  input-height: 32px,
  input-width: 200px,
  border-radius: 16px,
  icon-background-opacity: 0,
  font-size: 12px,
  input-background: #F5F8FA,
  icon-size: 12px,
  icon-position: right,
  input-border-color: #E1E8ED,
  input-focus-border-color: #D6DEE3,
  placeholder-color: #9AAEB5,
  icon-color: #657580,
  icon-clear-size: 10px,
  icon: 'sbx-icon-search-8',
  icon-clear: 'sbx-icon-clear-3'
);

.sbx-custom{
  @include searchbox();
}
```


### js (optionnal)
```
document.querySelector('.searchbox [type="reset"]').addEventListener('click', function() {
  this.parentNode.querySelector('input').focus();
});
```

## run the generator

- npm install
- gulp dev

## Icons
