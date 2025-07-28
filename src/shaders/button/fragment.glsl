uniform sampler2D uTextTexture;
uniform float uTime;

varying vec2 vUv;

void main()
{
    vec4 textTexture = texture2D(uTextTexture, vUv);
    vec4 bgColor = vec4(vUv - 0.3, 1.0, 1.0);
    vec3 finalColor = mix(bgColor.rgb, textTexture.rgb, textTexture.a);
    gl_FragColor = vec4(finalColor, 1.0);
}