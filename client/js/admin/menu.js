$(function() {

  var $form = $('#form')

  $.ajax({
    url: '/api/menu',
    dataType: 'json',
    success: populateForm,
    error: onErrorPopulate, // will 404 if there's no menu yet. np, handle it below
  })

  // Submit with ajax to ignore the json response from the API
  // Also need to use ajax because regular form submit doesn't allow PUT
  $form.on('submit', function(event) {
    event.preventDefault()
    $.ajax({
      method: 'PUT',
      url: $form.attr('action'),
      data: $form.serialize(),
      success: () => location.reload(), // just reload the page
      error: onErrorSubmit,
    })
  })


  // sort an array of objects by their name property
  function sort(stuff) {
    return stuff.sort((a, b) => {
      return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
    })
  }

  // pass undefined or null to empty the form
  function populateForm(menu) {
    menu = menu || { name: '', categories: [] }
    $('#name').val(menu.name).focus()

    $('#categories-status').text('Getting the list of categories...')

    // populate included and available categories
    $.ajax({
      url: '/api/categories',
      dataType: 'json',
      success: populateCategoriesLists,
      error: onErrorCategoriesLists,
    })

    function populateCategoriesLists(cats) {
      // first populate included categories
      var $included = $('#included-categories')
      menu.categories.forEach(cat => {
        var c = extractCategory(cats, cat.id)
        $included.append(getCategoryHtmlTemplate(c))
      })

      // then populate available categories with the remainder
      var $available = $('#available-categories')
      sort(cats).forEach(c => $available.append(getCategoryHtmlTemplate(c)) )

      $('#categories-status').text('Drag categories to include / exclude / sort.')

      // make the lists sortable
      sortable('.sortable', {
        placeholderClass: 'list-group-item',
        forcePlaceholderSize: true,
        connectWith: 'connected', // allow dragging between lists
      })[0].addEventListener('sortupdate', updateHiddenInput)

      updateHiddenInput()
    }

    // given an array of categories, remove one from the array with
    // the given id and return the category.
    function extractCategory(cats, id) {
      for (var i = 0; i < cats.length; i++)
        if (cats[i].id == id)
          return cats.splice(i, 1)[0]
    }

    // update the hidden input field on the form to have a value that
    // contains all the ids of categories in the included-categories list
    function updateHiddenInput() {
      var result = []
      $('#included-categories > li').each(function(index) {
        result.push( $(this).attr('data-category-id') )
      })
      $('input[name=categories]').val(result.join(','))
    }

  } // end populateForm


  function getCategoryHtmlTemplate(c) {
    return `\
    <li class="list-group-item" data-category-id="${c.id}">
      ${c.name}
      [<a href="/admin/categories/#${c.id}">Edit</a>]
    </li>`
  }


  function onErrorSubmit(jqXHR, textStatus, err) {
    console.error(jqXHR)
    var $msg = $('#submit-error')
    if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
      $msg.text(jqXHR.responseJSON.message)
    } else {
      $msg.text(err)
    }
  }

  function onErrorPopulate(jqXHR, textStatus, err) {
    // will 404 if no menu has been created yet
    if (jqXHR.status == 404) {
      populateForm() // fresh form
    } else {
      alert(`Error getting menu data: ${err}`)
      console.error(jqXHR)
    }
  }

  function onErrorCategoriesLists(jqXHR, textStatus, err) {
    $('#categories-status').text(`Error getting category lists: ${err}`)
    console.error(jqXHR)
  }

})
