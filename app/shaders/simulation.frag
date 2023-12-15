#pragma glslify: curlNoise = require(./curl-noise.glsl)

uniform sampler2D u_positions;
uniform float u_time;
uniform float u_frequency;

varying vec2 v_Uv;

void main() {
  vec3 pos = texture2D(u_positions, v_Uv).rgb;
  vec3 curlPos = texture2D(u_positions, v_Uv).rgb;

  pos = curlNoise(pos * u_frequency + u_time * 0.1);
  curlPos = curlNoise(curlPos * u_frequency + u_time * 0.1);
  curlPos += curlNoise(curlPos * u_frequency * 2.0) * 0.5;

  gl_FragColor = vec4(mix(pos, curlPos, sin(u_time)), 1.0);
}