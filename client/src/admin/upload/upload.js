$(function() {
  var $uploaded = $('#uploaded');
  var $status = $('#status');

  // update the list of uploaded files
  $.ajax({
    url: '/api/upload',
    dataType: 'json',
    success: onSuccess,
    error: onError,
  });

  $('#upload').on('submit', onSubmit);

  // submit using ajax so we can ignore the json response from the API
  function onSubmit(event) {
    event.preventDefault();
    $status.text('Uploading...');
    var $form = $(this);
    $.ajax({
      method: 'POST',
      url: $form.attr('action'),
      data: new FormData($form[0]),
      processData: false, // don't convert data to query string
      contentType: false, // needed so Content-Type header includes boundary
      success: () => location.reload(), // just reload the page
      error: onError,
    });
  }

  function onSuccess(files) {
    if (files.length == 0) {
      $status.text('No files have been uploaded yet.');
    } else {
      var $ul = $('<ul></ul>');
      for (var i = 0; i < files.length; i++) {
        // uploaded files are served at /local
        $ul.append($(`<li><a href="/local/${files[i]}">${files[i]}</a></li>`));
      }
      $status.text('Uploaded files:');
      $uploaded.html($ul);
    }
  }

  function onError(jqXHR, textStatus, err) {
    console.error(jqXHR);
    var message = err;
    if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
      message = jqXHR.responseJSON.message;
    }
    $status.text(message);
  }
});
