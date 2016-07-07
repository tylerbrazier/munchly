$(function() {
  var $div = $('#uploaded')
  // update the list of uploaded files
  $.ajax({
    url: '/api/upload',
    dataType: 'json',
    success: onSuccess,
    error: onError,
  })

  $('#upload').on('submit', onSubmit)

  // submit using ajax so we can ignore the json response from the API
  function onSubmit(event) {
    event.preventDefault()
    var $form = $(this)
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
      var $ul = $('<ul></ul>')
      for (var i = 0; i < files.length; i++) {
        // uploaded files are served at the root level
        $ul.append($(`<li><a href="/${files[i]}">${files[i]}</a></li>`))
      }
      $div.append($('<p>Uploaded files:</p>'))
      $div.append($ul)
    }
  }

  function onError(jqXHR, textStatus, err) {
    console.error(jqXHR)
    $div.html('<p>' + err + '</p>')
  }
})
