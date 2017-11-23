import * as THREE from 'three';
import { PointLight, Scene, SpotLight } from 'three';

import { LightDescription } from './models';

export class SceneLight {
	public light: SpotLight | PointLight;
	public lightDef: LightDescription;

	constructor( scene: Scene, lightDef: LightDescription, renderHelper: boolean = false ) {
		let light;
		if (lightDef.type && lightDef.type === 'spot') {
			light = new THREE.SpotLight(lightDef.color || 0xffffff, lightDef.intensity || 1);
			light.penumbra = lightDef.penumbra || 0;
			light.distance = lightDef.distance || 0;
			light.angle = lightDef.angle || 0;
			if (renderHelper) {
				const spotLightHelper = new THREE.SpotLightHelper(light);
				scene.add(spotLightHelper);
			}
		}
		else {
			light = new THREE.PointLight(lightDef.color || 0xffffff, lightDef.intensity || 1);
			if (renderHelper) {
				const lightHelper = new THREE.PointLightHelper(light, 1);
				scene.add(lightHelper);
			}
		}

		light.position.copy(lightDef.position || new THREE.Vector3());
		light.castShadow = lightDef.castShadow || false;
		this.light = light;
		this.lightDef = lightDef;
		scene.add(light);
	}
}