$(() => {
  'use strict'
  let categoriesUl, meatDiv, categoriesDiv, brandLink, categoriesButton

  categoriesUl = $('#categories')
  meatDiv = $('#meat')
  categoriesDiv = $('#categories-div')
  brandLink = $('#brand-link')
  categoriesButton = $('#categories-button')

  populateMenuFromAjax()

  // when the categories list is toggled, animate the button
  categoriesDiv.on('hide.bs.collapse show.bs.collapse', () => {
    categoriesButton.toggleClass('is-active')
  })

  toggleShowCategories()

  function handleAjaxErr(jqXHR, textStatus, err) {
    console.error(jqXHR)
    $('#err-container').html(getErrHtmlTemplate(jqXHR.responseText))
  }
  function getErrHtmlTemplate(message) {
    return `\
    <div id="err-bubble" class="alert alert-danger alert-dismissible">
      <button type="button" class="close" data-dismiss="alert">
        <span id="close-err-sign">&times;</span>
      </button>
      <strong>Error</strong><br><span>${message}</span>
    </div>`
  }

  function toggleShowCategories() {
    if(categoriesButton.is(':visible')) {
      categoriesDiv.collapse('toggle')
    }
  }

  function populateMenuFromAjax() {
    $.ajax({
      url: '/api/menu',
      dataType: 'json',
      success: (menu) => {
        $('title').text(menu.name)
        brandLink.text(menu.name)
        appendCategoryListItems(menu.categories)
      },
      error: handleAjaxErr
    })
  }

  function appendCategoryListItems(jsonData) {
    jsonData.forEach( (c) => {
      let li = $(`<li><a class="category" href="#">${c.name}</a></li>`)
      li.children('a').click((event) => {
        event.preventDefault()
        populateMenuItemsFromAjax(c.id)
        toggleShowCategories()

        // mark it as selected
        categoriesUl.children().removeClass('selected-category')
        li.addClass('selected-category')
      })

      categoriesUl.append(li)
    })
  }

  function populateMenuItemsFromAjax(categoryId) {
    $.ajax({
      url: `/api/categories/${categoryId}`,
      dataType: 'json',
      success: setMenuListItems,
      error: handleAjaxErr
    })
  }

  function setMenuListItems(jsonData) {
    meatDiv.empty()
    jsonData.items.forEach((i) => meatDiv.append(getMenuItemHtmlTemplate(i)))
    $('.star-rating').rating({
      min:0, max:5, step:1, size:'sm', theme:'krajee-uni',
      filledStar: '&#x2605;', emptyStar: '&#x2606;',
      showClear: false, showCaption: false,
    })
    $('a.feedback').click(function(event) {
      event.preventDefault()
      let id = $(this).attr('data-item')
      $(`form.${id}`).slideToggle()
    })
    $('form.feedback').on('submit', function(event) {
      event.preventDefault()
      let form = $(this)
      // don't do anything if nothing has been typed
      if (form.children('textarea').val() == "")
        return
      $.ajax({
        type: 'POST',
        url: '/api/feedback',
        data: form.serialize(),
        success: () => {
          form.slideToggle(() => {
            form.empty()
            form.append('<div class="feedback thanks">Thanks for your feedback!</div>')
            form.slideToggle()
          })
        },
        error: handleAjaxErr
      })
    })
  }

  function getMenuItemHtmlTemplate(item) {
    return `\
    <div class="col-sm-4 col-md-3">
      <div class="panel panel-default item-panel">

        <div class="panel-body item-panel-body">
          <img class="img-responsive" src="${item.image}">
        </div>

        <div class="panel-footer item-panel-footer">
          <div>
            <span class="item-name">${item.name}</span>
            <span class="feedback">
              <a href="#" data-item="${item.id}" class="feedback">Feedback</a>
            </span>
          </div>

          <div class="item-description">
            ${item.description}
            <span class="item-price">$${item.price.toFixed(2)}</span>
          </div>

          <form class="form-group feedback ${item.id}"
                method="post" action="/api/feedback">
            <textarea placeholder="Feed us back :)"
                      name="comment"
                      class="form-control feedback"
                      rows="3"></textarea>
            <input type="hidden" name="rating" class="star-rating">
            <input type="hidden" name="item" value="${item.id}">
            <input type="submit" class="btn btn-primary" value="Submit">
          </form>

        </div>
      </div>
    </div>`
  }
})
