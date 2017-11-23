import * as THREE from 'three';
import { Geometry, Points, Scene, Vector3 } from 'three';
import { SnowParticleSystemConfig } from './models';

const ParticleSystemDefaults: SnowParticleSystemConfig = {
	count       : 1000,
	size        : new THREE.Vector3(),
	position    : new THREE.Vector3(),
	color       : 0xeeeeee,
	particleSize: 0.1
};

export class SnowParticleSystem {
	private config: SnowParticleSystemConfig;
	private particleSystem: Points;
	private size: Vector3;
	private position: Vector3;

	constructor( scene: Scene, userConfig: Partial<SnowParticleSystemConfig> ) {
		const config: SnowParticleSystemConfig = { ...ParticleSystemDefaults, ...userConfig };
		this.config = config;
		this.size = config.size;
		this.position = config.position;
		const particles = new THREE.Geometry();
		for (let p = 0; p < config.count; p++) {
			const xPos = Math.random() * config.size.x + config.position.x;
			const yPos = Math.random() * config.size.y + config.position.y;
			const zPos = Math.random() * config.size.z + config.position.z;
			const particle = new THREE.Vector3(xPos, yPos, zPos);
			particles.vertices.push(particle);
		}
		const particleMaterial = new THREE.PointsMaterial({ color: config.color, size: config.particleSize });
		this.particleSystem = new THREE.Points(particles, particleMaterial);

		scene.add(this.particleSystem);
	}


	public update( delta: number ): void {
		if (this.particleSystem) {
			const minYPos = this.position.y;
			(this.particleSystem.geometry as Geometry).vertices.forEach(( particle: Vector3 ) => {
				if (particle.y < minYPos) {
					const topBoundary = this.size.y * 0.7;
					particle.y = topBoundary + Math.random() * topBoundary * 0.2;
				}
				else {
					particle.y -= Math.min(0.5, delta);
				}

			});
			(this.particleSystem.geometry as Geometry).verticesNeedUpdate = true;
		}
	}

}