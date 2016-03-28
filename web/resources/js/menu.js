'use strict'

let categoriesUl, meatDiv

$(() => {
  categoriesUl = $('#categories')
  meatDiv = $('#meat')

  populateMenuFromAjax()
})

function populateMenuFromAjax() {
  $.ajax({
    url: '/api/menu',
    dataType: 'json',
    success: (menu) => {
      $('title').text(menu.name)
      $('#brand-link').text(menu.name)
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
  <div class="col-md-4">
    <div class="panel panel-default">
      <div class="panel-body">
        <img class="img-responsive" src="${item.image}">
      </div>
      <div class="panel-footer">
        ${item.name}
      </div>
    </div>
  </div>`
}
