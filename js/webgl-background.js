// LYNCK Studio - WebGL Background Animations
// Starfield and Floating Oval animations used across all pages

(function() {
  'use strict';

  function parseOptIn(node) {
    if (!node) return null;
    const attr = node.getAttribute('data-webgl') || node.getAttribute('data-enable-webgl');
    if (attr !== null) {
      const normalized = attr.trim().toLowerCase();
      if (normalized === '' || normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'enabled') {
        return true;
      }
      if (normalized === 'false' || normalized === '0' || normalized === 'no' || normalized === 'disabled') {
        return false;
      }
      return true;
    }
    if (node.classList && node.classList.contains('webgl-enabled')) {
      return true;
    }
    return null;
  }

  function shouldEnableWebgl() {
    const fromBody = parseOptIn(document.body);
    if (fromBody !== null) {
      return fromBody;
    }
    const fromRoot = parseOptIn(document.documentElement);
    if (fromRoot !== null) {
      return fromRoot;
    }
    return false;
  }

  // Wait for page to load before initializing WebGL canvases
  window.addEventListener('load', function() {
    if (!shouldEnableWebgl()) {
      console.info('WebGL background disabled: page has not opted in.');
      return;
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      console.info('Reduced motion preference detected; skipping WebGL background.');
      return;
    }

    // ========================================
    // Starfield Background Layer
    // ========================================
    const starfieldCanvas = document.getElementById('starfield-canvas');
    if (starfieldCanvas) {
      const starGL = starfieldCanvas.getContext('webgl');
      if (starGL) {
        function starResize() {
          starfieldCanvas.width = window.innerWidth;
          starfieldCanvas.height = window.innerHeight;
          starGL.viewport(0, 0, starGL.drawingBufferWidth, starGL.drawingBufferHeight);
        }
        starResize();
        window.addEventListener('resize', starResize);

        function compileStarShader(type, source) {
          const shader = starGL.createShader(type);
          starGL.shaderSource(shader, source);
          starGL.compileShader(shader);
          if (!starGL.getShaderParameter(shader, starGL.COMPILE_STATUS)) {
            console.error('Starfield shader compilation error:', starGL.getShaderInfoLog(shader));
            return null;
          }
          return shader;
        }

        const starVertSrc = `
          attribute vec2 position;
          void main() {
            gl_Position = vec4(position, 0.0, 1.0);
          }
        `;

        const starFragSrc = `
          precision highp float;
          uniform vec2 iResolution;
          uniform float iTime;

          vec3 hash( vec3 p ) {
            p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
                      dot(p,vec3(269.5,183.3,246.1)),
                      dot(p,vec3(113.5,271.9,124.6)));
            return -1.0 + 2.0*fract(sin(p)*43758.5453123);
          }

          float noise( in vec3 p ) {
            vec3 i = floor( p );
            vec3 f = fract( p );
            vec3 u = f*f*(3.0-2.0*f);
            return mix( mix( mix( dot( hash( i + vec3(0.0,0.0,0.0) ), f - vec3(0.0,0.0,0.0) ),
                                dot( hash( i + vec3(1.0,0.0,0.0) ), f - vec3(1.0,0.0,0.0) ), u.x),
                           mix( dot( hash( i + vec3(0.0,1.0,0.0) ), f - vec3(0.0,1.0,0.0) ),
                                dot( hash( i + vec3(1.0,1.0,0.0) ), f - vec3(1.0,1.0,0.0) ), u.x), u.y),
                      mix( mix( dot( hash( i + vec3(0.0,0.0,1.0) ), f - vec3(0.0,0.0,1.0) ),
                                dot( hash( i + vec3(1.0,0.0,1.0) ), f - vec3(1.0,0.0,1.0) ), u.x),
                           mix( dot( hash( i + vec3(0.0,1.0,1.0) ), f - vec3(0.0,1.0,1.0) ),
                                dot( hash( i + vec3(1.0,1.0,1.0) ), f - vec3(1.0,1.0,1.0) ), u.x), u.y), u.z );
          }

          void main() {
            vec2 uv = gl_FragCoord.xy / iResolution.xy;
            vec3 stars_direction = normalize(vec3(uv * 2.0 - 1.0, 1.0));
            float stars_threshold = 8.0;
            float stars_exposure = 200.0;
            float stars = pow(clamp(noise(stars_direction * 200.0), 0.0, 1.0), stars_threshold) * stars_exposure;
            stars *= mix(0.4, 1.4, noise(stars_direction * 100.0 + vec3(iTime)));
            gl_FragColor = vec4(vec3(stars),1.0);
          }
        `;

        const starVertShader = compileStarShader(starGL.VERTEX_SHADER, starVertSrc);
        const starFragShader = compileStarShader(starGL.FRAGMENT_SHADER, starFragSrc);

        if (starVertShader && starFragShader) {
          const starProgram = starGL.createProgram();
          starGL.attachShader(starProgram, starVertShader);
          starGL.attachShader(starProgram, starFragShader);
          starGL.linkProgram(starProgram);

          if (starGL.getProgramParameter(starProgram, starGL.LINK_STATUS)) {
            starGL.useProgram(starProgram);

            const starPosLoc = starGL.getAttribLocation(starProgram, 'position');
            const starBuffer = starGL.createBuffer();
            starGL.bindBuffer(starGL.ARRAY_BUFFER, starBuffer);
            starGL.bufferData(starGL.ARRAY_BUFFER, new Float32Array([
              -1, -1, 1, -1, -1, 1,
              -1, 1, 1, -1, 1, 1,
            ]), starGL.STATIC_DRAW);
            starGL.enableVertexAttribArray(starPosLoc);
            starGL.vertexAttribPointer(starPosLoc, 2, starGL.FLOAT, false, 0, 0);

            const starIResolution = starGL.getUniformLocation(starProgram, 'iResolution');
            const starITime = starGL.getUniformLocation(starProgram, 'iTime');

            let starfieldFrame = null;
            function renderStarfield(time) {
              starGL.uniform2f(starIResolution, starfieldCanvas.width, starfieldCanvas.height);
              starGL.uniform1f(starITime, time * 0.001);
              starGL.drawArrays(starGL.TRIANGLES, 0, 6);
              starfieldFrame = requestAnimationFrame(renderStarfield);
            }

            function startStarfield() {
              if (starfieldFrame === null) {
                starfieldFrame = requestAnimationFrame(renderStarfield);
              }
            }

            function stopStarfield() {
              if (starfieldFrame !== null) {
                cancelAnimationFrame(starfieldFrame);
                starfieldFrame = null;
              }
            }

            document.addEventListener('visibilitychange', () => {
              if (document.visibilityState === 'visible') {
                startStarfield();
              } else {
                stopStarfield();
              }
            });

            startStarfield();
          }
        }
      }
    }

    // ========================================
    // Floating Oval Animation Layer
    // ========================================
    const canvas = document.getElementById('shader-canvas');
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.warn('WebGL not supported, falling back to black background');
      return;
    }

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }
    resize();
    window.addEventListener('resize', resize);

    const vertexShaderSource = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;
    const fragmentShaderSource = `
      precision highp float;
      uniform float iTime;
      uniform vec2 iResolution;
      mat2 rotate2d(float angle){
        float c = cos(angle), s = sin(angle);
        return mat2(c, -s, s, c);
      }
      float variation(vec2 v1, vec2 v2, float strength, float speed) {
        return sin(
            dot(normalize(v1), normalize(v2)) * strength + iTime * speed
        ) / 100.0;
      }
      vec3 paintCircle (vec2 uv, vec2 center, float rad, float width) {
        vec2 diff = center-uv;
        float len = length(diff);
        len += variation(diff, vec2(0.0, 1.0), 5.0, 2.0);
        len -= variation(diff, vec2(1.0, 0.0), 5.0, 2.0);
        float circle = smoothstep(rad-width, rad, len) - smoothstep(rad, rad+width, len);
        return vec3(circle);
      }
      void main() {
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        uv.x *= 1.5;
        uv.x -= 0.25;
        vec3 color = vec3(0.0);
        float radius = 0.35;
        vec2 center = vec2(0.5);
        color += paintCircle(uv, center, radius, 0.035);
        color += paintCircle(uv, center, radius - 0.018, 0.01);
        color += paintCircle(uv, center, radius + 0.018, 0.005);
        vec2 v = rotate2d(iTime) * uv;
        color *= vec3(v.x, v.y, 0.7-v.y*v.x);
        color += paintCircle(uv, center, radius, 0.003);
        float alpha = length(color) * 0.8; // Make it semi-transparent
        gl_FragColor = vec4(color, alpha);
      }
    `;

    function compileShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader));
      }
      return shader;
    }

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program));
    }

    gl.useProgram(program);

    // Enable blending for transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]), gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    const iTimeLoc = gl.getUniformLocation(program, 'iTime');
    const iResLoc = gl.getUniformLocation(program, 'iResolution');

    let ovalFrame = null;
    function render(time) {
      gl.uniform1f(iTimeLoc, time * 0.001);
      gl.uniform2f(iResLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      ovalFrame = requestAnimationFrame(render);
    }

    function startOval() {
      if (ovalFrame === null) {
        ovalFrame = requestAnimationFrame(render);
      }
    }

    function stopOval() {
      if (ovalFrame !== null) {
        cancelAnimationFrame(ovalFrame);
        ovalFrame = null;
      }
    }

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        startOval();
      } else {
        stopOval();
      }
    });

    startOval();
  });
})();
