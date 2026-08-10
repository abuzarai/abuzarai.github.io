/* Terminal site — tiny vanilla JS.
  No dependencies. */

(function () {
  'use strict';

  /* ---------- 404: show the real path that was requested ---------- */
  var p404s = document.querySelectorAll('.p404');
  if (p404s.length) {
    var missing = window.location.pathname.replace(/^\//, '');
    p404s.forEach(function (el) { el.textContent = missing; });
  }

  /* ---------- back-to-top: only when the page can actually scroll ---------- */
  var btt = document.querySelector('.btt');
  function updateBtt() {
    if (!btt) return;
    var scrollable = document.documentElement.scrollHeight > window.innerHeight + 24;
    btt.classList.toggle('show', scrollable && window.scrollY > 90);
  }
  window.addEventListener('scroll', updateBtt, { passive: true });
  window.addEventListener('resize', updateBtt);
  updateBtt();
})();

/* ============================================================
   code-block chrome — terminal window (dots + lang + copy)
   around <pre><code data-lang>. Highlighting itself is
   server-side: Zola/giallo, class mode → /giallo.css.
   ============================================================ */
(function () {
  'use strict';

  document.querySelectorAll('pre code[data-lang], pre code[class*="language-"]').forEach(function (code) {
    var m = code.className.match(/language-(\w+)/);
    var cls = code.getAttribute('data-lang') || (m ? m[1] : '');
    var pre = code.parentElement;
    if (pre.dataset.cb) return;
    pre.dataset.cb = '1';

    var wrap = document.createElement('div');
    wrap.className = 'cb-wrap';
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(pre);

    var hdr = document.createElement('div');
    hdr.className = 'cb-hdr';
    var d, dot;
    for (d = 0; d < 3; d++) {
      dot = document.createElement('i');
      hdr.appendChild(dot);
    }
    var lbl = document.createElement('span');
    lbl.textContent = cls;
    hdr.appendChild(lbl);

    if (navigator.clipboard && window.isSecureContext) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cb-copy';
      btn.textContent = 'copy';
      btn.setAttribute('aria-label', 'copy code block');
      btn.addEventListener('click', function () {
        navigator.clipboard.writeText(code.textContent).then(
          function () {
            btn.textContent = 'copied';
            btn.classList.add('copied');
            setTimeout(function () {
              btn.textContent = 'copy';
              btn.classList.remove('copied');
            }, 1500);
          },
          function () {
            btn.textContent = 'nope';
            setTimeout(function () { btn.textContent = 'copy'; }, 1500);
          }
        );
      });
      hdr.appendChild(btn);
    }
    wrap.insertBefore(hdr, pre);
  });
})();