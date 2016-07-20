$(function() {

  var $form = $('#form')

  populateForm() // initialize the form for category creation

  // get the list of categories
  $.ajax({
    url: '/api/categories',
    dataType: 'json',
    success: populateCategoriesList,
    error: onErrorCategoriesList,
  })

  $('#create').click(event => populateForm()) // clears the form

  // Submit with ajax to ignore the json response from the API
  // Also need to use ajax because regular form submit doesn't allow PUT
  $form.on('submit', function(event) {
    event.preventDefault()
    $.ajax({
      method: $form.attr('method'),
      url: $form.attr('action'),
      data: $form.serialize(),
      success: () => location.reload(), // just reload the page
      error: onErrorSubmit,
    })
  })

  $('#delete').click(function(event) {
    var id = $('#category-id').text()
    if (!id) {
      $('#submit-error').text('Nothing to delete')
    } else if (confirm('Delete this category?')) {
      $.ajax({
        method: 'DELETE',
        url: `/api/categories/${id}`,
        success: () => location.reload(), // just reload the page
        error: onErrorSubmit,
      })
    }
  })


  function populateCategoriesList(cats) {
    $('#categories-status').text('Categories:')
    var $list = $('#categories-list')
    sort(cats).forEach(c => {
      var $a = $(`<a href="#${c.id}">${c.name}</a>`)
      $a.click(event => populateForm(c))
      $list.append( $('<li>').append($a) )
    })

    // populate the form with an category if the url anchors to an id of
    // that category
    var hash = window.location.hash
    if (hash) {
      var id = hash.substring(1) // remove leading #
      for (var i = 0; i < cats.length; i++) {
        if (id == cats[i].id) {
          populateForm(cats[i])
          break;
        }
      }
    }
  }

  // sort an array of objects by their name property
  function sort(stuff) {
    return stuff.sort((a, b) => {
      return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
    })
  }

  // pass undefined or null to empty the form
  function populateForm(category) {
    $form.attr('method', (category ? 'PUT' : 'POST'))
    category = category || { id:'', name:'', items:[] }

    $form.attr('action', `/api/categories/${category.id}`)
    $('#name').val(category.name).focus()
    $('#category-id').text(category.id)
    $('#submit-error').text('') // clear any errors

    $('#items-status').text('Getting the list of items...')

    // populate included and available items
    $.ajax({
      url: '/api/items',
      dataType: 'json',
      success: populateItemsLists,
      error: onErrorItemsLists,
    })

    function populateItemsLists(items) {
      // first populate included items
      var $included = $('#included-items')
      $included.empty()
      category.items.forEach(id => {
        var i = extractItem(items, id)
        $included.append(getItemHtmlTemplate(i))
      })

      // then populate available items with the remainder
      var $available = $('#available-items')
      $available.empty()
      sort(items).forEach(i => {
        $available.append(getItemHtmlTemplate(i))
      })

      $('#items-status').text('Drag items to include / exclude / sort.')

      // make the lists sortable
      sortable('.sortable', {
        placeholderClass: 'list-group-item',
        forcePlaceholderSize: true,
        connectWith: 'connected', // allow dragging between lists
      })[0].addEventListener('sortupdate', updateHiddenInput)

      updateHiddenInput()
    }

    // given an array of items, remove an item from the array with
    // the given id and return the item.
    function extractItem(items, id) {
      for (var i = 0; i < items.length; i++)
        if (items[i].id == id)
          return items.splice(i, 1)[0]
    }

    // update the hidden input field on the form to have a value that
    // contains all the ids of items in the included-items list
    function updateHiddenInput() {
      var result = []
      $('#included-items > li').each(function(index) {
        result.push( $(this).attr('data-item-id') )
      })
      $('input[name=items]').val(result.join(','))
    }

  } // end populateForm


  function getItemHtmlTemplate(item) {
    return `\
    <li class="list-group-item" data-item-id="${item.id}">
      ${item.name}
      [<a href="/admin/items/#${item.id}">Edit</a>]
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

  function onErrorCategoriesList(jqXHR, textStatus, err) {
    $('#categories-status').text(`Error getting categories list: ${err}`)
    console.error(jqXHR)
  }

  function onErrorItemsLists(jqXHR, textStatus, err) {
    $('#items-status').text(`Error getting item lists: ${err}`)
    console.error(jqXHR)
  }

})
