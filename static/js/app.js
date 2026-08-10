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
   syntax highlighting — hand-rolled, ~90 lines, no deps.
   Tokenizes <pre><code class="language-x"> blocks on load.
   Palette: amber kws, green strings, dim comments, amber nums.
   ============================================================ */
(function () {
  'use strict';

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* tokenizer: list of [type, regex] tried in order at each position.
     First regex that matches at the current index wins. */
  var LANG = {
    python: [
      ['cmt', /#[^\n]*/],
      ['str', /(?:f|r|b|fr|rf)?"""[\s\S]*?"""|(?:f|r|b|fr|rf)?'''[\s\S]*?'''|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/],
      ['num', /\b(?:0[xX][0-9a-fA-F_]+|\d[\d_]*\.?\d*(?:[eE][+-]?\d+)?)\b/],
      ['kw', /\b(?:def|class|return|if|elif|else|for|while|import|from|as|with|try|except|finally|raise|pass|break|continue|lambda|yield|global|nonlocal|None|True|False|and|or|not|in|is|del|assert|async|await|self)\b/],
      ['fn', /[A-Za-z_]\w*(?=\s*\()/],
    ],
    bash: [
      ['cmt', /#[^\n]*/],
      ['str', /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/],
      ['kw', /\b(?:if|then|else|elif|fi|for|while|do|done|case|esac|function|in|export|local|return|exit|echo|sudo|cd|mkdir|rm|cp|mv|ls|cat|grep|pip|python3|git|curl|wget)\b/],
      ['fn', /[A-Za-z_]\w*(?=\s*\()/],
    ],
    json: [
      ['str', /"(?:[^"\\]|\\.)*"/],
      ['kw', /\b(?:null|true|false)\b/],
      ['num', /-?\b\d+\.?\d*(?:[eE][+-]?\d+)?\b/],
    ],
    sql: [
      ['cmt', /--[^\n]*/],
      ['str', /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/],
      ['kw', /\b(?:SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|JOIN|ON|LEFT|RIGHT|INNER|OUTER|AND|OR|NOT|NULL|ORDER|BY|GROUP|HAVING|LIMIT|AS|DISTINCT|COUNT|SUM|AVG|CREATE|TABLE|DROP|DELETE|PRIMARY|KEY|REFERENCES|IF|EXISTS|LIKE|BETWEEN|IN|IS|ASC|DESC)\b/],
    ],
    text: [],
  };

  document.querySelectorAll('pre code[data-lang], pre code[class*="language-"]').forEach(function (code) {
    /* original: (dataTag || classMatch || [''])[1] — when data-lang is truthy it's
       a string, so [1] grabbed a single char ("y" from "python"). Fix: unbox. */
    var m = code.className.match(/language-(\w+)/);
    var cls = code.getAttribute('data-lang') || (m ? m[1] : '');
    var rules = LANG[cls];
    if (!rules || !rules.length) return;

    /* rules need the g flag: the walk anchors each rule with lastIndex, and
       bare regexes always scan from position 0 and re-find the first match */
    for (var g = 0; g < rules.length; g++) {
      rules[g][1] = new RegExp(rules[g][1].source, rules[g][1].flags + 'g');
    }

    /* terminal shell: titlebar dots + lang label + copy button, as a
       wrapper so the header never scrolls away with wide code */
    var pre = code.parentElement;
    if (!pre.dataset.cb) {
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
    }
    var src = code.textContent;
    var out = '';
    var i = 0;
    while (i < src.length) {
      var matched = null;
      for (var r = 0; r < rules.length; r++) {
        rules[r][1].lastIndex = i;
        var m = rules[r][1].exec(src);
        if (m && m.index === i) { matched = [rules[r][0], m[0]]; break; }
      }
      if (matched) {
        out += '<span class="tok-' + matched[0] + '">' + esc(matched[1]) + '</span>';
        i += matched[1].length;
      } else {
        out += esc(src[i]);
        i++;
      }
    }
    code.innerHTML = out;
  });
})();