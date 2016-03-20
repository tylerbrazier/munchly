'use strict'
$(() => {

  $.ajax({
    url: '/api/categories',
    dataType: 'json',
    success: (data) => {
      let ul = $('#categories')
      data.forEach( (c) => ul.append(`<li><a href="#">${c.name}</a></li>`) )
    },
    error: (jqXHR, textStatus, err) => {
      console.error(jqXHR.responseText)
      alert(jqXHR.responseText)
    }
  })

})
