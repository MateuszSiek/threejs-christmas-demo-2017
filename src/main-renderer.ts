import * as THREE from 'three';
import { PerspectiveCamera, WebGLRenderer, Scene, PositionalAudio, SkinnedMesh, Mesh } from 'three';

import * as ThreeOrbitControls from 'three-orbit-controls';

import { JsonModel } from './utils/json-model';
import { CameraControls } from './utils/camera-controls';
import { JsonModelDescription, LightDescription, SnowmanModel, SnowmanObjectDescription } from './utils/models';
import {
	ambientLightDef,
	cameraConstrains,
	cameraPosition, fogDef,
	jsonModelsToLoad, lightsToLoad, particleSystemDef,
	playPauseButtonSelector,
	reindeerModelDef,
	rendererClearColor,
	snowmanObjectsToLoad, songSource
} from './scene-setup';
import { SnowParticleSystem } from './utils/particle-system';
import { SceneLight } from './utils/scene-light';


export class MainRenderer {
	public container: HTMLElement;

	private clock: THREE.Clock;

	private scene: Scene;
	private renderer: WebGLRenderer;

	private camera: PerspectiveCamera;
	private audio: PositionalAudio;
	private viewControls: CameraControls;

	private snowmanModels: SnowmanModel[] = [];
	private reindeer: JsonModel;

	private particleSystem: SnowParticleSystem;

	private updateAnimation: boolean = false;

	constructor( container: HTMLElement ) {
		this.container = container;
		this.clock = new THREE.Clock();
		this.scene = new THREE.Scene();

		this.scene.fog = new THREE.FogExp2(fogDef.color, fogDef.dist);
		const playButton = document.querySelector(playPauseButtonSelector)!;

		playButton!.addEventListener('mousedown', ( event: Event ) => event.stopPropagation());
		playButton!.addEventListener('click', ( event: Event ) => {
			event.preventDefault();
			event.stopPropagation();
			this.updateAnimation = true;
			if (this.audio) {
				this.audio.isPlaying ? this.audio.pause() : this.audio.play();
				playButton.innerHTML = this.audio.isPlaying ? 'PAUSE' : 'PLAY';
			}
		});
		window.addEventListener('resize', () => {
			this.updateViewSize({ width: window.innerWidth, height: window.innerHeight });
		});
	}

	public render(): void {
		const viewSize = { width: window.innerWidth, height: window.innerHeight };

		this.setRenderer(viewSize);
		this.setCamera(viewSize);
		this.setViewControls(this.camera);
		this.setLights(this.scene);
		this.setParticleSystem(this.scene);

		this.container.appendChild(this.renderer.domElement);

		Promise.all([
			this.setAudio(),
			this.loadSceneObjects(this.scene)
		]).then(() => {
			document.querySelector('body')!.classList.remove('loading');
			this.update();
		}).catch(( error: any ) => {
			console.warn(error);
		});
	}

	public updateViewSize( { width, height } ): void {
		this.renderer.setSize(width, height);
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
		this.viewControls.resizeViewport(width, height);
	}

	private update(): void {
		requestAnimationFrame(() => {this.update();});

		const delta = this.clock.getDelta();
		this.snowmanModels.forEach(( snowmanModelDesc: SnowmanModel ) => {
			snowmanModelDesc.model.update(delta);
			if (this.updateAnimation) {
				let animationToPlayName;
				if (this.audio && this.audio.isPlaying) {
					animationToPlayName = snowmanModelDesc.snowmanDesc.danceAnimations[ 0 ];
				}
				else {
					animationToPlayName = snowmanModelDesc.snowmanDesc.iddleAnimation[ 0 ];
				}
				snowmanModelDesc.model.playAnimation(animationToPlayName);
				snowmanModelDesc.snowmanDesc.currentAnimation = animationToPlayName;
			}
		});
		this.updateAnimation = false;

		this.reindeer.update(delta);
		this.viewControls.update(delta);
		this.particleSystem.update(delta);
		this.renderer.render(this.scene, this.camera);
	}

	private setRenderer( { width, height } ): void {
		const renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(width, height);
		renderer.shadowMap.enabled = true;
		renderer.setClearColor(rendererClearColor, 1);
		this.renderer = renderer;
	}

	private setCamera( { width, height } ): void {
		const camera = new THREE.PerspectiveCamera(60, width / height);
		camera.position.copy(cameraPosition);
		this.camera = camera;
	}

	private setViewControls( camera: PerspectiveCamera ): void {
		// // for testing
		// const OrbitControls = ThreeOrbitControls(THREE);
		// const camControls = new OrbitControls(camera, this.renderer.domElement);
		// camControls.target = new THREE.Vector3(0, 0.2, 0);

		const camControls = new CameraControls(camera);
		camControls.verticalMin = cameraConstrains.verticalMin;
		camControls.verticalMax = cameraConstrains.verticalMax;
		camControls.horizontalMin = cameraConstrains.horizontalMin;
		camControls.horizontalMax = cameraConstrains.horizontalMax;
		this.viewControls = camControls;
	}

	private setAudio(): Promise<boolean> {
		const listener = new THREE.AudioListener();

		this.audio = new THREE.PositionalAudio(listener);
		const audioLoader = new THREE.AudioLoader();

		return new Promise(( resolve, reject ) => {
			audioLoader.load(songSource, ( buffer ) => {
				this.audio.setBuffer(buffer);
				this.audio.setRefDistance(1);
				this.audio.setLoop(true);
				resolve(true);
			}, () => {
				// on progress
			}, ( error: any ) => {
				reject(error);
			});
		});
	}

	private setParticleSystem( scene: Scene ): void {
		this.particleSystem = new SnowParticleSystem(scene, {
			size    : particleSystemDef.size,
			position: particleSystemDef.position
		});
	}

	private setLights( scene: Scene ): void {
		const ambientLight = new THREE.AmbientLight(ambientLightDef.color, ambientLightDef.brightness);
		scene.add(ambientLight);
		lightsToLoad.forEach(( lightDef: LightDescription ) => {
			new SceneLight(scene, lightDef);
		});
	}

	private loadSceneObjects( scene: Scene ): Promise<boolean[]> {
		const loadPromises: Promise<boolean>[] = [];
		jsonModelsToLoad.forEach(( modelDesc: JsonModelDescription ) => {
			const jsonModel = new JsonModel(modelDesc);
			const loadPromise = jsonModel.load().then(( model: SkinnedMesh | Mesh | undefined ) => {
				if (model) {
					scene.add(model);
				}
				return true;
			});
			loadPromises.push(loadPromise);
		});

		snowmanObjectsToLoad.forEach(( snowmanDesc: SnowmanObjectDescription ) => {
			const snowman = new JsonModel(snowmanDesc);
			const loadPromise = snowman.load({ animations: snowmanDesc.animations })
				.then(( model: SkinnedMesh | Mesh | undefined ) => {
					if (model) {
						scene.add(model);
						this.snowmanModels.push({ model: snowman, snowmanDesc: snowmanDesc });
						snowman.playAnimation(snowmanDesc.currentAnimation || snowmanDesc.animations[ 0 ]);
					}
					return true;
				});
			loadPromises.push(loadPromise);
		});

		const reindeer = new JsonModel(reindeerModelDef);
		const loadPromise = reindeer.load(reindeerModelDef)
			.then(( model: SkinnedMesh | Mesh | undefined ) => {
				if (model) {
					scene.add(model);
					reindeer.playAnimation('raindeer_idle_1');
					this.reindeer = reindeer;
				}
				return true;
			});
		loadPromises.push(loadPromise);

		return Promise.all(loadPromises);
	}

}