// HomeEnabled — shared behaviour
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  // Newsletter / contact forms are demo-only: confirm without submitting.
  document.querySelectorAll('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.form-note');
      if (!note) {
        note = document.createElement('p');
        note.className = 'form-note';
        note.style.cssText = 'margin-top:12px;font-weight:700;color:#166534;';
        form.appendChild(note);
      }
      note.textContent = 'Thank you! You are on the list — watch your inbox for our next guide.';
      form.reset();
    });
  });
})();
