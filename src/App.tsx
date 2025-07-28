import { Canvas, useFrame, useThree } from '@react-three/fiber'
import './App.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import buttonVertexShader from "./shaders/button/vertex.glsl?raw"
import buttonFragmentShader from "./shaders/button/fragment.glsl?raw"
import html2canvas from 'html2canvas'

function StarField(){
  const starsRef = useRef<THREE.Points>(null)
  const count = 300
  const spread = 8

  const textureLoader = new THREE.TextureLoader()
  const starTexture = textureLoader.load("/textures/star.png")
  
  const positions = useMemo(() => {
    const positionsArray = new Float32Array(count * 3)
    for(let i = 0; i < count; i++){
      positionsArray[i * 3 + 0] = (Math.random() - 0.5) * spread
      positionsArray[i * 3 + 1] = (Math.random() - 0.5) * spread
      positionsArray[i * 3 + 2] = (Math.random() - 0.5) * spread
    }

    return positionsArray;
  }, [])


  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    if(starsRef.current){
      starsRef.current.rotation.x = time * 0.003
      starsRef.current.rotation.y = time * 0.005
    }
  })

  return (
    <points
      ref={starsRef}
    >
      <bufferGeometry>
        {/* @ts-ignore */}
        <bufferAttribute
          attach="attributes-position"
          count={count}
          itemSize={3}
          array={positions}
        />
      </bufferGeometry>
      <pointsMaterial
        sizeAttenuation={true}
        size={0.2}
        opacity={0.4}
        map={starTexture}
        alphaMap={starTexture}
        transparent={true}
        depthWrite={false}
      />
    </points>
  )
}

function AboutText(){
  const availableRef = useRef(null)
  const [active, setActive] = useState(false)
  return (
    <group position={[-2.2, 0.5, 0]} rotation={[0.1, 0.1, 0]}>
      <Text font='/fonts/Studio6-Black.ttf' color={"#ccc"} position={[0,0,0]} fontSize={0.6} lineHeight={0.9}>
        {'Swayam\nDuhan'}
      </Text>
      <Text font='/fonts/Studio6-MediumItalic.ttf' color={"#aaa"} position={[-0.25,-0.8,0]} fontSize={0.15}>
        {"Developer. Designer.\nCrafting digital experiences."}
      </Text>
      <Text
        ref={availableRef}
        font='/fonts/Studio6-MediumItalic.ttf'
        color={active ? "#ffff00": "#00ff00"} 
        position={[-0.3,-1.4,0]} 
        fontSize={0.2} 
        onClick={() => window.open("mailto:workplace.swayam@gmail.com")}
        onPointerOver={() => setActive(true)}
        onPointerOut={() => setActive(false)}
      >
        {"Available for work →"}
      </Text>
    </group>
  )
}

function CameraParallax(){
  const { camera } = useThree()
  const targetPosition = useRef(new THREE.Vector3())
  const parallaxStrength = 0.1
  const lerpConstant = 5

  useFrame((state, delta) => {
    const cursorX = state.pointer.x
    const cursorY = state.pointer.y
    targetPosition.current.x = cursorX * parallaxStrength
    targetPosition.current.y = cursorY * parallaxStrength

    camera.position.x = camera.position.x + (targetPosition.current.x - camera.position.x) * lerpConstant * delta
    camera.position.y = camera.position.y + (targetPosition.current.y - camera.position.y) * lerpConstant * delta
  })

  return null
}

function WavyButton(){
  const buttonMeshRef = useRef<THREE.Mesh>(null)
  const textureLoader = new THREE.TextureLoader()
  const textMap = textureLoader.load("/captured_button.png")
  const uniforms = useRef({
    uTime: { value: 0 },
    uTextTexture : { value: textMap }
  })
  useFrame(({ clock }) => {
    if(buttonMeshRef.current){
      const time = clock.getElapsedTime()
      // @ts-ignore
      buttonMeshRef.current.material.uniforms.uTime.value = time
    }
  })

  return (
    <>
    <mesh
      ref={buttonMeshRef} 
      rotation={[0, -0.3, 0]}
      onClick={() => window.open("/swayam-resume.pdf", "_blank")}
      position={[0.6, 0, 0]}
      >
      <planeGeometry 
        args={[2, 1, 24, 24]}
        />
      <shaderMaterial
        attach={"material"}
        vertexShader={buttonVertexShader}
        fragmentShader={buttonFragmentShader}
        uniforms={uniforms.current}
      />
    </mesh>
    </>
  )
}

function App() {
  const htmlButtonRef = useRef(null)


  useEffect(() => {
    // @ts-expect-error
    const setTexture = async() => {
      if(!htmlButtonRef.current) return;
      try{
        const canvas = await html2canvas(htmlButtonRef.current, {
          backgroundColor: null,
          scale: 2
        })
        const imageUrl = canvas.toDataURL('image/png');

        // Create a temporary link element to trigger download
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'captured_button.png'; // Suggested filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch(e){
        console.log(e)
      }
    }

    // setTimeout(setTexture, 100)
  }, [])

  return (
    <div>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 55 }}
      >
        <StarField />
        <AboutText />
        <WavyButton/>
        <CameraParallax />
      </Canvas>
      <div className='side-text'>
        Welcome to my minified portfolio. I created this as a filler until I am done learning complex shaders to make my main folio. SORRY 4 DA WAIT!
      </div>
      <div className='resume-btn' ref={htmlButtonRef}>
        View Resume
      </div>
    </div>
  )
}

export default App
