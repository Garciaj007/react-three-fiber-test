import { BufferGeometry, Mesh, Points, ShaderMaterial } from "three"

export type ShaderMesh = Mesh<BufferGeometry, ShaderMaterial>
export type SimulationPoints = Points<BufferGeometry, ShaderMaterial>