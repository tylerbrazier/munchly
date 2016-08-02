(function() {
  document.getElementById('nav').innerHTML = `\

<nav class="navbar navbar-default">
  <div class="container-fluid">

    <div class="navbar-header">
      <a class="navbar-brand" href="/admin">Admin</a>
    </div>

    <ul class="nav navbar-nav">
      <li class="${classFor('/admin/menu/')}">
        <a href="/admin/menu/">Menu</a>
      </li>
      <li class="${classFor('/admin/categories/')}">
        <a href="/admin/categories/">Categories</a>
      </li>
      <li class="${classFor('/admin/items/')}">
        <a href="/admin/items/">Items</a>
      </li>
      <li class="${classFor('/admin/upload/')}">
        <a href="/admin/upload/">Upload</a>
      </li>
      <li class="${classFor('/admin/feedback/')}">
        <a href="/admin/feedback/">Feedback</a>
      </li>
    </ul>

  </div>
</nav>`

  function classFor(path) {
    return (window.location.pathname == path) ? 'active' : ''
  }

})()
