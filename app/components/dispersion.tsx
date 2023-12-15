import { useRef, useMemo } from 'react'
import { BackSide, FrontSide, Vector2, Vector3 } from 'three'
import { useFBO } from '@react-three/drei'

import { ShaderMesh } from '../types'
import { useFrame } from '@react-three/fiber'
import { generateUUID } from 'three/src/math/MathUtils.js'

import dispersionVS from '../shaders/dispersion.vert'
import dispersionFS from '../shaders/dispersion.frag'

export const Dispersion = () => {
  const mesh = useRef<ShaderMesh>(null!)

  const mainRenderTarget = useFBO()
  const backRenderTarget = useFBO()

  const uniforms = useMemo(() => {
    const resolution = new Vector2(
      window.innerWidth,
      window.innerHeight
    ).multiplyScalar(Math.min(window.devicePixelRatio, 2))
    return {
      u_texture: { value: null },
      u_resolution: { value: resolution },
      u_ior: {
        value: {
          r: 1.15,
          y: 1.16,
          g: 1.18,
          c: 1.22,
          b: 1.22,
          v: 1.22
        }
      },
      u_chromaticAberration: { value: 0.05 },
      u_refractionPower: { value: 1.33 },
      u_saturate: { value: 1.02 },
      u_shininess: { value: 40 },
      u_diffuseness: { value: 0.4 },
      u_fresnelPower: { value: 32.0 },
      u_light: { value: new Vector3(10, 10, 10) },
    }
  }, [])

  useFrame(state => {
    const { gl, scene, camera, clock } = state

    mesh.current.visible = false
    gl.setRenderTarget(backRenderTarget)
    gl.render(scene, camera)

    mesh.current.material.uniforms.u_texture.value = backRenderTarget.texture
    mesh.current.material.side - BackSide
    mesh.current.visible = true

    gl.setRenderTarget(mainRenderTarget)
    gl.render(scene, camera)

    mesh.current.material.uniforms.u_texture.value = mainRenderTarget.texture
    mesh.current.material.side = FrontSide

    gl.setRenderTarget(null)
    mesh.current.visible = true

    mesh.current.rotation.x = clock.getElapsedTime()
    mesh.current.rotation.y = clock.getElapsedTime()
    mesh.current.rotation.z = clock.getElapsedTime()

  })

  return (
    <mesh ref={mesh}>
      {/* <icosahedronGeometry args={[0.4, 20]} /> */}
      <torusGeometry args={[0.4, 0.1, 24, 48]} />
      <shaderMaterial
        key={generateUUID()}
        vertexShader={dispersionVS}
        fragmentShader={dispersionFS}
        uniforms={uniforms}
      />
    </mesh>
  )
}
