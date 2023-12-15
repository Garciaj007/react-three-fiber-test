'use client';
import {
  useFrame,
  useThree
} from '@react-three/fiber';
import { GPUComputationRenderer } from 'three/examples/jsm/Addons.js';
import {
  Color, AdditiveBlending,
  RepeatWrapping
} from 'three';
import { useMemo, useRef } from 'react';
import pointVS from '../shaders/point.vert';
import pointFS from '../shaders/point.frag';

import simulationCS from '../shaders/simulation.comp';

import { SimulationPoints } from '../types';

export const GPGPUParticles = () => {
  const size = 128;

  const gl = useThree(state => state.gl);
  const points = useRef<SimulationPoints>(null!);

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

  const [gpuCompute, positionVariable] = useMemo(() => {
    const compute = new GPUComputationRenderer(size, size, gl);

    const texture = compute.createTexture();
    const data = texture.image.data;
    for (let k = 0; k < data.length; k += 4) {
      data[k + 0] = particlesPosition[k + 0];
      data[k + 1] = particlesPosition[k + 1];
      data[k + 2] = particlesPosition[k + 2];
    }
    const variable = compute.addVariable('u_position', simulationCS, texture);

    compute.setVariableDependencies(variable, [variable]);

    variable.material.uniforms.u_time = { value: 0 };
    variable.material.uniforms.u_frequency = { value: 0.25 };

    variable.wrapS = RepeatWrapping;
    variable.wrapT = RepeatWrapping;

    const err = compute.init();
    if (err !== null) console.error(err);

    return [compute, variable];
  }, [size, gl]);

  const uniforms = useMemo(
    () => ({
      u_positions: { value: null },
      u_color: { value: new Color('#dd20d3') }
    }),
    []
  );

  useFrame(state => {
    const { clock } = state;
    positionVariable.material.uniforms.u_time.value = clock.getElapsedTime();
    gpuCompute.compute();
    points.current.material.uniforms.u_positions.value =
      gpuCompute.getCurrentRenderTarget(positionVariable).texture;
  });

  return (
    <points ref={points}>
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
  );
};
