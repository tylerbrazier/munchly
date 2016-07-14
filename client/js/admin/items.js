$(function() {

  var $form = $('#form')

  // get the list of uploaded files
  $.ajax({
    url: '/api/upload',
    dataType: 'json',
    success: populateUploadedRadios,
    error: onErrorUploaded,
  })

  // get the list of menu items
  $.ajax({
    url: '/api/items',
    dataType: 'json',
    success: populateItemsList,
    error: onErrorItemsList,
  })

  // submit with ajax to ignore the json response from the API, and use PUT
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

  $('#create').click(event => populateFormFields()) // clears the form

  $('#delete').click(function(event) {
    var id = $('#item-id').text()
    if (!id) {
      $('#submit-error').text('Nothing to delete')
    } else if (confirm('Delete?')) {
      $.ajax({
        method: 'DELETE',
        url: `/api/items/${id}`,
        success: () => location.reload(), // just reload the page
        error: onErrorSubmit,
      })
    }
  })

  function populateUploadedRadios(files) {
    var $status = $('#uploaded-status')
    if (files.length == 0) {
      $status.text('No files have been uploaded yet.')
    } else {
      $status.text('Uploaded files:')
      var $div = $('#uploaded-radios')
      files.forEach(f => {
        $div.append( $(radioTemplate(f)) )
      })
    }
    addRadioClickHandlers()
  }

  function radioTemplate(name) {
    return `\
    <div class="radio">
      <label>
        <input type="radio" class="file-radio" name="image" value="/local/${name}">
        ${name}
      </label>
    </div>`
  }

  // when a radio is clicked, update the preview image
  function addRadioClickHandlers() {
    $('.file-radio').click(function() {
      $('#preview').attr('src', $(this).attr('value'))
    })
  }

  function populateItemsList(items) {
    $('#items-status').text('Menu items:')
    var $list = $('#items-list')
    sort(items).forEach(i => {
      var $a = $(`<a href="#">${i.name}</a>`)
      $a.click(event => { event.preventDefault(); populateFormFields(i) })
      $list.append( $('<li>').append($a) )
    })
  }

  function sort(items) {
    return items.sort((a, b) => {
      return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
    })
  }

  function populateFormFields(item) {
    // setting .text() and .attr() to undefined doesn't clear them so
    // always use empty strings for missing properties
    var empty = { id:'', name:'', description:'', price:'', image:'' }
    item = Object.assign(empty, item)

    $form.attr('action', `/api/items/${item.id}`)
    $('#name').val(item.name).focus()
    $('#description').val(item.description)
    $('#price').val(item.price)
    $('#item-id').text(item.id)
    $('#submit-error').text('') // clear any errors

    // check the radio button and set the image if able
    $('.file-radio').prop('checked', false)
    $(`input[type='radio'][value='${item.image}']`).prop('checked', true)
    $('#preview').attr('src', item.image)
  }


  function onErrorUploaded(jqXHR, textStatus, err) {
    $('#uploaded-status').text(`Error getting uploaded files list: ${err}`)
    console.error(jqXHR)
  }

  function onErrorItemsList(jqXHR, textStatus, err) {
    $('#items-status').html(`Error getting items list: ${err}`)
    console.error(jqXHR)
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

})