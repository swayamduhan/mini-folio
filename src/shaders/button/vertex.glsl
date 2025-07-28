uniform float uTime;

varying vec2 vUv;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float elevation = sin(modelPosition.x * 4.5 + uTime) * 0.2;
    elevation += sin(modelPosition.y * 3.0 + uTime) * 0.2;
    modelPosition.z += elevation;
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    vUv = uv;
}