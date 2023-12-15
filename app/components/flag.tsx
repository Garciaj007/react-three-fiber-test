import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Color } from 'three'
import { ShaderMesh } from '../types'

import flagVS from '../shaders/flag.vert'
import flagFS from '../shaders/flag.frag'

export const Flag = () => {
  // This reference will give us direct access to the mesh
  const mesh = useRef<ShaderMesh>(null!)
  const uniforms = useMemo(
    () => ({
      u_time: { value: 0.0 },
      u_colorA: { value: new Color('#003fb4') },
      u_colorB: { value: new Color('#a2dcff') }
    }),
    []
  )
  useFrame(state => {
    const { clock } = state
    mesh.current.material.uniforms.u_time.value = clock.getElapsedTime()
  })

  return (
    <mesh
      ref={mesh}
      position={[0, -0.5, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={2}
    >
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        vertexShader={flagVS}
        fragmentShader={flagFS}
        uniforms={uniforms}
      />
    </mesh>
  )
}
