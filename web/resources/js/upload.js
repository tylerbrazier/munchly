const $div = $('#uploaded')

$(function() {
  // update the list of uploaded files
  $.ajax({
    url: '/api/upload',
    dataType: 'json',
    success: onSuccess,
    error: onError,
  })

  $('#upload').on('submit', onSubmit)
})

// submit using ajax so we can ignore the json response from the API
function onSubmit(event) {
  event.preventDefault()
  let $form = $(this)
  $.ajax({
    method: 'POST',
    url: $form.attr('action'),
    data: new FormData($form[0]),
    processData: false, // don't convert data to query string
    contentType: false, // needed so Content-Type header includes boundary
    success: () => location.reload(), // just reload the page
    error: onError,
  })
}

function onSuccess(files) {
  if (files.length == 0) {
    $div.html('<p>No files have been uploaded yet.</p>')
  } else {
    $div.empty()
    let $p = $('<p>Uploaded files:</p>')
    let $ul = $('<ul></ul>')
    for (let i = 0; i < files.length; i++) {
      $ul.append($('<li>' + files[i] + '</li>'))
    }
    $div.append($p)
    $div.append($ul)
  }
}

function onError(jqXHR, textStatus, err) {
  console.error(jqXHR)
  $div.html('<p>' + err + '</p>')
}
