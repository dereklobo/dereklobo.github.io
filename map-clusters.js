/* Groups map pins that sit close together into one numbered pin.
   Hover, focus or tap a cluster to open a parchment card listing its cities. */
(function () {
    var THRESHOLD = 22;     // px between pin tips before they merge
    var HIDE_DELAY = 220;   // ms grace so the pointer can travel into the card

    var css = '' +
    '.pin.is-clustered{visibility:hidden;pointer-events:none}' +
    '.pin-cluster{position:absolute;width:30px;height:38px;transform:translate(-50%,-100%);transform-origin:50% 100%;' +
        'padding:0;border:0;background:none;cursor:pointer;z-index:3;filter:drop-shadow(0 2px 2px rgba(0,0,0,.45));' +
        'transition:transform .18s ease}' +
    '.pin-cluster svg{display:block;overflow:visible}' +
    '.pin-cluster .pin-body{fill:#9b1c1c;stroke:#f5e6c0;stroke-width:1.5}' +
    '.pin-cluster-count{position:absolute;left:0;right:0;top:6px;text-align:center;color:#f5e6c0;' +
        'font:700 13px/1 Georgia,"Times New Roman",serif;pointer-events:none}' +
    '.pin-cluster:hover,.pin-cluster[aria-expanded="true"],.pin-cluster:focus-visible{transform:translate(-50%,-100%) scale(1.2);z-index:30}' +
    '.pin-cluster:hover .pin-body,.pin-cluster[aria-expanded="true"] .pin-body{fill:#c0392b}' +
    '.pin-cluster:focus-visible{outline:3px solid #fff;outline-offset:2px;border-radius:6px}' +
    '.cluster-card{position:absolute;z-index:40;min-width:170px;max-width:260px;padding:10px 14px 12px;' +
        'background:#fffcf4;color:#2a1f14;border:1px solid #8a6a3b;border-radius:6px;' +
        'box-shadow:0 8px 24px rgba(60,40,15,.4);font-family:Georgia,"Times New Roman",serif}' +
    '.cluster-card[hidden]{display:none}' +
    '.cluster-card h3{margin:0 0 6px;font-size:.78rem;font-style:italic;letter-spacing:.08em;text-transform:uppercase;color:#6b5030}' +
    '.cluster-card h4{margin:6px 0 2px;font-size:.9rem;font-weight:700;color:#14532d}' +
    '.cluster-card ul{margin:0;padding:0 0 0 1.1rem;list-style:disc;font-size:.9rem}' +
    '@media (prefers-reduced-motion:reduce){.pin-cluster{transition:none}}';

    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var map = document.querySelector('.map-container');
    if (!map) return;
    var pins = Array.prototype.slice.call(map.querySelectorAll('.pin'));

    var items = pins.map(function (el) {
        var label = el.getAttribute('aria-label') || '';
        var parts = label.replace(/, visited$/, '').split(/,\s*(?=[^,]*$)/);
        var city = (el.querySelector('.pin-label') || {}).textContent || parts[0];
        return {
            el: el, city: city.trim(), country: (parts[1] || '').trim(),
            x: parseFloat(el.style.left) || 0, y: parseFloat(el.style.top) || 0
        };
    });
    // Pin positions come from CSS classes, so read them from computed style.
    function readPositions() {
        var w = map.clientWidth, h = map.clientHeight;
        items.forEach(function (it) {
            var cs = getComputedStyle(it.el);
            it.px = parseFloat(cs.left);
            it.py = parseFloat(cs.top);
            if (isNaN(it.px)) { it.px = 0; it.py = 0; }
        });
    }

    var layer = []; // clusters + cards currently in the DOM
    var openCluster = null, hideTimer = null;

    function clear() {
        layer.forEach(function (n) { n.remove(); });
        layer = [];
        openCluster = null;
        items.forEach(function (it) {
            it.el.classList.remove('is-clustered');
            it.el.removeAttribute('aria-hidden');
            it.el.tabIndex = 0;
        });
    }

    // Greedy grouping against each cluster's running centre, so a long chain of
    // neighbours doesn't collapse into one giant cluster.
    function group() {
        var groups = [];
        items.slice().sort(function (a, b) { return a.px - b.px || a.py - b.py; }).forEach(function (it) {
            var hit = null, best = THRESHOLD;
            groups.forEach(function (g) {
                var dx = g.cx - it.px, dy = g.cy - it.py, d = Math.sqrt(dx * dx + dy * dy);
                if (d < best) { best = d; hit = g; }
            });
            if (!hit) { groups.push({ cx: it.px, cy: it.py, list: [it] }); return; }
            hit.list.push(it);
            hit.cx = hit.list.reduce(function (n, i) { return n + i.px; }, 0) / hit.list.length;
            hit.cy = hit.list.reduce(function (n, i) { return n + i.py; }, 0) / hit.list.length;
        });
        return groups.map(function (g) { return g.list; }).filter(function (l) { return l.length > 1; });
    }

    function showCard(c) {
        if (openCluster && openCluster !== c) hideCard(openCluster, true);
        clearTimeout(hideTimer);
        c.card.hidden = false;
        c.btn.setAttribute('aria-expanded', 'true');
        openCluster = c;
        var mw = map.clientWidth, cw = c.card.offsetWidth, ch = c.card.offsetHeight;
        var left = Math.min(Math.max(c.x - cw / 2, 6), mw - cw - 6);
        var top = c.y - 46 - ch;                       // above the pin
        if (top < 6) top = c.y + 10;                   // flip below near the top edge
        c.card.style.left = left + 'px';
        c.card.style.top = top + 'px';
    }
    function hideCard(c, now) {
        function done() {
            c.card.hidden = true;
            c.btn.setAttribute('aria-expanded', 'false');
            if (openCluster === c) openCluster = null;
        }
        clearTimeout(hideTimer);
        if (now) done(); else hideTimer = setTimeout(done, HIDE_DELAY);
    }

    function build() {
        clear();
        readPositions();
        group().forEach(function (g, n) {
            var cx = 0, cy = 0;
            g.forEach(function (it) { cx += it.px; cy += it.py; });
            cx /= g.length; cy /= g.length;

            g.forEach(function (it) {
                it.el.classList.add('is-clustered');
                it.el.setAttribute('aria-hidden', 'true');
                it.el.tabIndex = -1;
            });

            var byCountry = {};
            g.forEach(function (it) { (byCountry[it.country] = byCountry[it.country] || []).push(it.city); });
            var countries = Object.keys(byCountry).sort();

            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'pin-cluster';
            btn.style.left = cx + 'px';
            btn.style.top = cy + 'px';
            btn.setAttribute('aria-haspopup', 'true');
            btn.setAttribute('aria-expanded', 'false');
            btn.setAttribute('aria-controls', 'cluster-card-' + n);
            btn.setAttribute('aria-label', g.length + ' destinations: ' + g.map(function (i) { return i.city; }).join(', '));
            btn.innerHTML = '<svg width="30" height="38" viewBox="0 0 28 36" focusable="false" aria-hidden="true">' +
                '<path class="pin-body" d="M14 35C14 35 3 21.5 3 13.5a11 11 0 0 1 22 0C25 21.5 14 35 14 35z"/></svg>' +
                '<span class="pin-cluster-count" aria-hidden="true">' + g.length + '</span>';

            var card = document.createElement('div');
            card.className = 'cluster-card';
            card.id = 'cluster-card-' + n;
            card.hidden = true;
            card.setAttribute('role', 'group');
            card.setAttribute('aria-label', 'Destinations near this pin');
            var html = '<h3>' + g.length + ' places nearby</h3>';
            countries.forEach(function (c) {
                html += '<h4>' + c + '</h4><ul>' + byCountry[c].sort().map(function (name) {
                    return '<li>' + name + '</li>';
                }).join('') + '</ul>';
            });
            card.innerHTML = html;

            var c = { btn: btn, card: card, x: cx, y: cy };
            btn.addEventListener('mouseenter', function () { showCard(c); });
            btn.addEventListener('mouseleave', function () { hideCard(c); });
            card.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
            card.addEventListener('mouseleave', function () { hideCard(c); });
            btn.addEventListener('focus', function () { showCard(c); });
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                if (card.hidden) showCard(c); else hideCard(c, true);
            });
            card.addEventListener('focusout', function (e) {
                if (!card.contains(e.relatedTarget) && e.relatedTarget !== btn) hideCard(c);
            });
            btn.addEventListener('blur', function (e) {
                if (!card.contains(e.relatedTarget)) hideCard(c);
            });

            map.appendChild(btn);
            map.appendChild(card);
            layer.push(btn, card);
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && openCluster) { var b = openCluster.btn; hideCard(openCluster, true); b.focus(); }
    });
    document.addEventListener('click', function (e) {
        if (openCluster && !openCluster.card.contains(e.target)) hideCard(openCluster, true);
    });

    var rt;
    function schedule() { clearTimeout(rt); rt = setTimeout(build, 80); }
    window.addEventListener('resize', schedule);
    if (window.ResizeObserver) new ResizeObserver(schedule).observe(map);
    window.addEventListener('load', build);
    build();
})();
