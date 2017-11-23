import * as THREE from 'three';
import {
	AnimationMixer, Geometry, JSONLoader, Material, MultiMaterial, SkinnedMesh, AnimationAction, Mesh
} from 'three';
import { JsonModelDescription } from './models';

export interface LoadConfig {
	animations?: string[] | undefined
}

const ANIM_CROSSFADE_LENGTH = 2;

/*
 * JSON model loader.
 */
export class JsonModel {
	private modelDesc: JsonModelDescription;
	private src: string; // source of file
	private loader: JSONLoader;
	private animationMixer: AnimationMixer;
	private animationActions: { [key: string]: AnimationAction } = {};
	private currentAnimationName: string;

	constructor( modelDesc: JsonModelDescription ) {
		this.modelDesc = modelDesc;
		this.src = this.modelDesc.src;
		this.loader = new THREE.JSONLoader();
	}

	public load( { animations = undefined }: LoadConfig = {} ): Promise<SkinnedMesh | Mesh | undefined> {
		return new Promise(( resolve, reject ) => {
			this.loader.load(this.src,
				( geometry: Geometry, materials: Material[] ) => {
					const material: MultiMaterial = new THREE.MultiMaterial(materials);
					let object;
					if (animations && animations.length && geometry.animations) {
						object = new THREE.SkinnedMesh(geometry, material as any);
						this.animationMixer = new THREE.AnimationMixer(object);
						animations.forEach(( animName: string ) => {
							const animation = geometry.animations.find(( d: any ) => d.name === animName);
							if (animation) {
								const animationAction = this.animationMixer.clipAction(animation);
								animationAction.enabled = true;
								this.animationActions[ animName ] = animationAction;
							}
						});
						object.material.forEach(( material: any ) => {
							material.morphTargets = true;
							material.skinning = true;
						});
					}
					else {
						object = new THREE.Mesh(geometry, material);
					}
					object.receiveShadow = this.modelDesc.receiveShadow || false;
					object.castShadow = this.modelDesc.castShadow || false;
					resolve(object);
				},
				() => {},
				( error ) => {
					reject(error);
				}
			);
		});
	}

	public playAnimation( toPlayAnimationName: string ): void {
		if (this.animationActions[ toPlayAnimationName ]) {
			if (!this.currentAnimationName) {
				this.animationActions[ toPlayAnimationName ].play();
			}
			else {
				const from = this.animationActions[ this.currentAnimationName ].play();
				const to = this.animationActions[ toPlayAnimationName ].play();
				from.enabled = true;
				to.enabled = true;
				from.crossFadeTo(to, ANIM_CROSSFADE_LENGTH, true);
			}
			this.currentAnimationName = toPlayAnimationName;
		}
	}

	public update( delta: number ): void {
		if (this.animationMixer) {
			this.animationMixer.update(delta);
		}
	}
}