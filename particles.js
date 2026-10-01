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

  // WCAG 2.2.2: decorative motion must not run for more than 5 seconds. Freeze the hexagons after 5s.
  setTimeout(function () {
    if (window.pJSDom && window.pJSDom[0]) {
      window.pJSDom[0].pJS.particles.move.enable = false;
    }
  }, 5000);
