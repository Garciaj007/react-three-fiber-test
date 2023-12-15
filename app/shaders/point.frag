uniform vec3 u_color;

void main() {
    //gl_FragColor = vec4(vec3(0.102, 0.5216, 0.8235), 1.0);
    gl_FragColor = vec4(u_color, 1.0);
}