'use client';
import { useFBO } from '@react-three/drei';
import { createPortal, extend, useFrame } from '@react-three/fiber';
import {
  Color, Scene as RawScene,
  OrthographicCamera,
  NearestFilter,
  RGBAFormat,
  FloatType, AdditiveBlending
} from 'three';
import { useMemo, useRef } from 'react';

import pointVS from '../shaders/point.vert';
import pointFS from '../shaders/point.frag';

import SimulationMaterial from './simulation-material';

extend({SimulationMaterial});

import { SimulationPoints } from '../types';

export const FBOParticles = () => {
  const size = 128;

  const points = useRef<SimulationPoints>(null!);
  const simulationMatRef = useRef<SimulationMaterial>(null!);

  const scene = new RawScene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1);
  const positions = new Float32Array([
    -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0
  ]);
  const uvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]);

  const renderTarget = useFBO(size, size, {
    minFilter: NearestFilter,
    magFilter: NearestFilter,
    format: RGBAFormat,
    stencilBuffer: false,
    type: FloatType
  });

  const particlesPosition = useMemo(() => {
    const length = size * size;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      let i3 = i * 3;
      particles[i3 + 0] = (i % size) / size;
      particles[i3 + 1] = i / size / size;
    }
    return particles;
  }, [size]);

  const uniforms = useMemo(
    () => ({
      u_positions: { value: null },
      u_color: { value: new Color('#0a8ee6') }
    }),
    []
  );

  useFrame(state => {
    const { gl, clock } = state;

    gl.setRenderTarget(renderTarget);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    points.current.material.uniforms.u_positions.value = renderTarget.texture;
    simulationMatRef.current.uniforms.u_time.value = clock.getElapsedTime();
  });

  return (
    <>
      {createPortal(
        <mesh>
          {/* @ts-ignore */}
          <simulationMaterial ref={simulationMatRef} args={[size]} />
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={positions.length / 3}
              array={positions}
              itemSize={3} />
            <bufferAttribute
              attach="attributes-uv"
              count={uvs.length / 2}
              array={uvs}
              itemSize={2} />
          </bufferGeometry>
        </mesh>,
        scene
      )}
      <points ref={points} scale={0.5}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesPosition.length / 3}
            array={particlesPosition}
            itemSize={3} />
        </bufferGeometry>
        <shaderMaterial
          blending={AdditiveBlending}
          depthWrite={false}
          fragmentShader={pointFS}
          vertexShader={pointVS}
          uniforms={uniforms} />
      </points>
    </>
  );
};
