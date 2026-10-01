// Adds the decorative gold hexagon background. Skipped when the visitor prefers reduced motion.
(function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (document.getElementById('particles-js')) return;

    var layer = document.createElement('div');
    layer.id = 'particles-js';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);

    var lib = document.createElement('script');
    lib.src = 'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js';
    lib.onload = function () {
        var app = document.createElement('script');
        app.src = 'particles.js';
        document.body.appendChild(app);
    };
    document.body.appendChild(lib);
})();
