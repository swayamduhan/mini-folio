uniform float uTime;

varying vec2 vUv;

void main()
{
    vec4 newPosition = vec4(position, 1.0);
    float elevation = sin(newPosition.x * 4.5 + uTime) * 0.2;
    elevation += sin(newPosition.y * 3.0 + uTime) * 0.2;
    newPosition.z += elevation;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * newPosition;

    vUv = uv;
}