import {
  DataTexture,
  FloatType,
  MathUtils,
  RGBAFormat,
  ShaderMaterial
} from 'three'

import simulationVS from '../shaders/simulation.vert'
import simulationFS from '../shaders/simulation.frag'

const getRandomData = (width: number, height: number): Float32Array => {
  const length = width * height * 4
  const data = new Float32Array(length)

  for (let i = 0; i < length; i++) {
    const stride = i * 4

    const distance = Math.sqrt(Math.random()) * 2.0
    const theta = MathUtils.randFloatSpread(360)
    const phi = MathUtils.randFloatSpread(360)

    data[stride + 0] = distance * Math.cos(theta) * Math.sin(phi)
    data[stride + 1] = distance * Math.sin(theta) * Math.sin(phi)
    data[stride + 2] = distance * Math.cos(phi)
  }

  return data
}

class SimulationMaterial extends ShaderMaterial {
  constructor(size: number) {
    const positionsTexture = new DataTexture(
      getRandomData(size, size),
      size,
      size,
      RGBAFormat,
      FloatType
    )
    positionsTexture.needsUpdate = true

    const uniforms = {
      u_positions: { value: positionsTexture },
      u_frequency: { value: 0.25 },
      u_time: { value: 0 }
    }

    super({
      vertexShader: simulationVS,
      fragmentShader: simulationFS,
      uniforms: uniforms
    })
  }
}

export default SimulationMaterial
