let particlesJSON = {
    particles: {
      number: {
        value: 18,
        density: {
          enable: true,
          value_area: 500
        }
      },
      color: {
        value: "#c9a96c"
      },
      shape: {
        type: "polygon",
        stroke: {
          width: 2,
          color: "#c9a96c"
        },
        polygon: {
          nb_sides: 6
        },
        image: {
          src: "img/github.svg",
          width: 100,
          height: 100
        }
      },
      opacity: {
        value: 0.3,
        random: true
      },
      size: {
        value: 10,
        random: true
      },
      line_linked: {
        enable: false,
        distance: 200,
        color: "#ff5722",
        opacity: 0.3,
        width: 2
      },
      move: {
        enable: true,
        speed: 1.5,
        direction: "bottom",
        random: true,
        straight: true,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: false,
          mode: ["grab", "bubble"]
        },
        onclick: {
          enable: false,
          mode: "push"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 400,
          line_linked: {
            opacity: 0.7
          }
        },
        bubble: {
          distance: 600,
          size: 12,
          duration: 1,
          opacity: 0.8,
          speed: 2
        },
        repulse: {
          distance: 400,
          duration: 0.4
        },
        push: {
          particles_nb: 20
        },
        remove: {
          particles_nb: 10
        }
      }
    },
    retina_detect: true
  };
  
  particlesJS("particles-js", particlesJSON);

  // WCAG 2.2.2: moving background needs a pause control. Particles run until the visitor pauses them.
  (function () {
    var KEY = 'bg-motion';
    var pJS = function () { return window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS; };
    var paused = false;
    try { paused = localStorage.getItem(KEY) === 'paused'; } catch (e) {}

    var style = document.createElement('style');
    style.textContent =
      '#motion-toggle{position:fixed;right:16px;bottom:16px;z-index:5;width:36px;height:36px;border-radius:50%;' +
      'display:inline-flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;line-height:1;' +
      'background:#2a2f45;color:#f5e6c0;border:2px solid #7a5f25;transition:transform .2s ease}' +
      '#motion-toggle:hover{transform:scale(1.08)}' +
      '#motion-toggle:focus-visible{outline:2px solid #1e3a8a;outline-offset:3px}' +
      'html.dark #motion-toggle{background:rgba(255,255,255,.1);color:#d9c48c;border-color:#d9c48c}' +
      'html.dark #motion-toggle:focus-visible{outline-color:#d9c48c}';
    document.head.appendChild(style);

    var btn = document.createElement('button');
    btn.id = 'motion-toggle';
    btn.type = 'button';

    function apply() {
      var s = pJS();
      if (s) {
        var wasPaused = !s.particles.move.enable;
        s.particles.move.enable = !paused;
        // particles.js cancels its draw loop while motion is off, so restart it on resume.
        if (wasPaused && !paused) s.fn.vendors.draw();
      }
      btn.textContent = paused ? '\u25B6' : '\u23F8';
      btn.setAttribute('aria-label', paused ? 'Play background animation' : 'Pause background animation');
      btn.setAttribute('aria-pressed', paused ? 'true' : 'false');
      btn.title = paused ? 'Play background animation' : 'Pause background animation';
    }

    btn.addEventListener('click', function () {
      paused = !paused;
      try { localStorage.setItem(KEY, paused ? 'paused' : 'running'); } catch (e) {}
      apply();
    });

    document.body.appendChild(btn);
    apply();
  })();
