$(function() {

  $.ajax({
    url: '/api/feedback' + location.search,
    dataType: 'json',
    success: populateTable,
    error: onErrorPopulate,
  })

  $('#th-item').append(sortHtml('item'))
  $('#th-comment').append(sortHtml('comment'))
  $('#th-rating').append(sortHtml('rating'))
  $('#th-id').append(sortHtml('id'))

  function populateTable(feedbacks) {
    var $tbody = $('#tbody')
    var $tr, item
    feedbacks.forEach(f => {
      var item
      if (f.item)
        item = `<a href="/admin/items#${f.item.id}">${f.item.name}</a>`
      else
        item = '(none)'
      $tr = $('<tr>')
      $tr.append(`<td>${item}</td>`)
      $tr.append(`<td>${f.comment}</td>`)
      $tr.append(`<td>${f.rating || 0}</td>`)
      $tr.append(`<td>${f.id}</td>`)
      $tbody.append($tr)
    })
    $('#status').text('')
  }

  function onErrorPopulate(jqXHR, textStatus, err) {
    $('#status').text(`Error getting feedback: ${err}`)
    console.error(jqXHR)
  }

  function sortHtml(field) {
    var url = (order) => `/admin/feedback?sort=${field}&order=${order}`
    return `&nbsp;&nbsp;<a href="${url('asc')}">&uarr;</a>` +
      `&nbsp;<a href="${url('desc')}">&darr;</a>`
  }

})
