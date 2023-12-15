'use client';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import { useMemo, useRef } from 'react';

import blobVS from '../shaders/blob.vert'
import blobFS from '../shaders/blob.frag';

import { ShaderMesh } from '../types';

export const Blob = () => {
  const mesh = useRef<ShaderMesh>(null!);
  const hover = useRef(false);
  const uniforms = useMemo(
    () => ({
      u_intensity: { value: 0 },
      u_time: { value: 0 }
    }),
    []
  );
  useFrame(state => {
    const { clock } = state;
    mesh.current.material.uniforms.u_time.value = 0.4 * clock.getElapsedTime();
    mesh.current.material.uniforms.u_intensity.value = MathUtils.lerp(
      mesh.current.material.uniforms.u_intensity.value,
      hover.current ? 0.85 : 0.15,
      0.02
    );
  });

  return (
    <mesh
      ref={mesh}
      position={[0.5, 0.5, -0.5]}
      scale={0.2}
      onPointerOver={() => (hover.current = true)}
      onPointerOut={() => (hover.current = false)}
    >
      <icosahedronGeometry args={[2, 20]} />
      <shaderMaterial
        vertexShader={blobVS}
        fragmentShader={blobFS}
        uniforms={uniforms} />
    </mesh>
  );
};
