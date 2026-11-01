(function () {
  var gate = document.getElementById('gate');
  var KEY = 'oakking-21';
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set() { try { localStorage.setItem(KEY, 'yes'); } catch (e) {} }
  if (get() === 'yes') { gate.hidden = true; gate.style.display = 'none'; }
  else { document.getElementById('gate-yes').focus(); }
  document.getElementById('gate-yes').addEventListener('click', function () {
    set(); gate.style.display = 'none';
  });
  document.getElementById('gate-no').addEventListener('click', function () {
    document.getElementById('gate-title').textContent = 'Come back when you\'re 21.';
    document.getElementById('gate-msg').textContent = 'This site is only for adults of legal drinking age.';
    document.getElementById('gate-actions').hidden = true;
    document.getElementById('gate-actions').style.display = 'none';
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.textContent = 'Sending...';
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      form.reset();
      status.textContent = 'Thanks. Your message was sent.';
    }).catch(function () {
      status.textContent = 'Your message didn\'t send. Please email Jeff@oak-king.com.';
    });
  });
})();
