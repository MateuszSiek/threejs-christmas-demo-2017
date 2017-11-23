import * as THREE from 'three';

import { Vector3 } from 'three';
import {
	AnimatedObjectDescription, JsonModelDescription, LightDescription,
	SnowmanObjectDescription
} from './utils/models';

export const playPauseButtonSelector = '.play-button';

export const particleSystemDef = {
	size    : new THREE.Vector3(20, 10, 17),
	position: new THREE.Vector3(-10, 0, -6)
};

export const rendererClearColor = 0xe8f1f6;

export const cameraPosition = new THREE.Vector3(0, 6, 10);

export const cameraConstrains = {
	verticalMin  : 2 * Math.PI / 5,
	verticalMax  : 3 * Math.PI / 4,
	horizontalMin: -3 * Math.PI / 4,
	horizontalMax: -Math.PI / 4
};

export const songSource = './sounds/jingle-bells.mp3';

export const ambientLightDef = {
	color     : 0xffffff,
	brightness: 0.55
};

export const fogDef = {
	color: 0xEBF5FB,
	dist : 0.03
};

export const reindeerModelDef: AnimatedObjectDescription = {
	src             : './models/raindeer.json',
	receiveShadow   : true,
	castShadow      : true,
	animations      : [ 'raindeer_idle_1', 'raindeer_idle_2' ],
	currentAnimation: 'raindeer_idle_1'
};

export const lightsToLoad: LightDescription[] = [
	{ position: new Vector3(-10, 3.6, -12), color: 0xffe28a, intensity: 0.1 },
	{ position: new Vector3(-13, 3.6, -14), color: 0xffe28a, intensity: 0.1, castShadow: true },
	{ position: new Vector3(-15.6, 3.6, -14.8), color: 0xffe28a, intensity: 0.1, castShadow: false },
	{ position: new Vector3(-5.6, 3.6, -16), color: 0xffe28a, intensity: 0.1, castShadow: false },
	{ position: new Vector3(-10, 2.2, -7.8), color: 0x5fcdee, intensity: 0.4, castShadow: true },
	{
		type      : 'spot',
		position  : new Vector3(0, 8, 4),
		color     : 0xffffff,
		intensity : 0.4,
		castShadow: true,
		distance  : 20,
		angle     : 3.14 * 0.3,
		penumbra  : 0.8
	}
];

export const jsonModelsToLoad: JsonModelDescription[] = [
	{ src: './models/scene.json', receiveShadow: true, castShadow: true }
];

export const snowmanObjectsToLoad: SnowmanObjectDescription[] = [
	{
		src             : './models/snowman3.json', castShadow: true, animations: [ 'dance3', 'iddle3' ],
		currentAnimation: 'iddle3', danceAnimations: [ 'dance3' ], iddleAnimation: [ 'iddle3' ]
	}, {
		src             : './models/snowman2.json', castShadow: true, animations: [ 'dance2', 'iddle2' ],
		currentAnimation: 'iddle2', danceAnimations: [ 'dance2' ], iddleAnimation: [ 'iddle2' ]
	}, {
		src             : './models/snowman1.json', castShadow: true, animations: [ 'dance2', 'iddle2' ],
		currentAnimation: 'iddle2', danceAnimations: [ 'dance2' ], iddleAnimation: [ 'iddle2' ]
	}
];