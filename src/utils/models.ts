import { JsonModel } from './json-model';
import { Vector3 } from 'three';

export interface LightDescription extends PointLightDescription, SpotLightDescription {
	type?: 'point' | 'spot';
}


export interface PointLightDescription {
	position?: Vector3;
	color?: number;
	intensity?: number;
	castShadow?: boolean;
}

export interface SpotLightDescription extends PointLightDescription {
	distance?: number;
	angle?: number;
	penumbra?: number;
}

export interface JsonModelDescription {
	src: string,
	receiveShadow?: boolean,
	castShadow?: boolean
}

export interface AnimatedObjectDescription extends JsonModelDescription {
	animations: string[],
	currentAnimation: string,
}

export interface SnowmanObjectDescription extends AnimatedObjectDescription {
	danceAnimations: string[],
	iddleAnimation: string[],
}


export interface SnowmanModel {
	model: JsonModel,
	snowmanDesc: SnowmanObjectDescription
}

export interface SnowParticleSystemConfig {
	count: number;
	size: Vector3;
	position: Vector3;
	color: number;
	particleSize: number;
}

