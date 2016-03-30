'use strict'

let categoriesUl, meatDiv, categoriesDiv, brandLink

$(() => {
  categoriesUl = $('#categories')
  meatDiv = $('#meat')
  categoriesDiv = $('#categories-div')
  brandLink = $('#brand-link')

  populateMenuFromAjax()
  categoriesDiv.collapse('show')
})

function populateMenuFromAjax() {
  $.ajax({
    url: '/api/menu',
    dataType: 'json',
    success: (menu) => {
      $('title').text(menu.name)
      brandLink.text(menu.name)
      appendCategoryListItems(menu.categories)
    },
    error: (jqXHR, textStatus, err) => {
      console.error(jqXHR.responseText)
      alert(jqXHR.responseText)
    }
  })
}

function appendCategoryListItems(jsonData) {
  jsonData.forEach( (c) => {
    let li = $(`<li><a href="#">${c.name}</a></li>`)
    li.click((event) => {
      event.preventDefault()
      populateMenuItemsFromAjax(c.id)
      categoriesDiv.collapse('hide')
      brandLink.text(c.name)
    })
    categoriesUl.append(li)
  })
}

function populateMenuItemsFromAjax(categoryId) {
  $.ajax({
    url: `/api/categories/${categoryId}`,
    dataType: 'json',
    success: setMenuListItems,
    error: (jqXHR, textStatus, err) => {
      console.error(jqXHR.responseText)
      alert(jqXHR.responseText)
    }
  })
}

function setMenuListItems(jsonData) {
  meatDiv.empty()
  jsonData.items.forEach( (i) => {
    let panel = getMenuItemHtmlTemplate(i)
    meatDiv.append(panel)
  })
}

function getMenuItemHtmlTemplate(item) {
  return `\
  <div class="col-sm-4 col-md-3">
    <div class="panel panel-default">
      <div class="panel-body">
        <img class="img-responsive" src="${item.image}">
      </div>
      <div class="panel-footer">
        <div class="item-name">${item.name}</div>
        <div class="item-description">
          ${item.description}
          <span class="item-price">${item.price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  </div>`
}

