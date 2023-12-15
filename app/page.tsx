'use client'

import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import './styles/scene.css'

import { Flag } from './components/flag'
import { Blob } from './components/blob'
import { FBOParticles } from './components/fbo-particles'
import { GPGPUParticles } from './components/gpgpu-particles'
import { Dispersion } from './components/dispersion'

const Scene = () => {
  return (
    <Canvas camera={{ position: [1.0, 1.0, 1.0] }}>
      <ambientLight intensity={1.0} />
      <Flag />
      <Blob />
      <GPGPUParticles />
      <FBOParticles />
      <Dispersion />
      <axesHelper />
      <OrbitControls />
    </Canvas>
  )
}

export default Scene
