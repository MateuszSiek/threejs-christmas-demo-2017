/**
 * Created based on three-first-person-controls plugin
 * https://www.npmjs.com/package/three-first-person-controls
 */

import * as THREE from 'three';
import { PerspectiveCamera, Vector3 } from 'three';

/*
* First person camera controller which allows to look around
* movement is not implemented as it was not needed
 */

export class CameraControls {
	public camera: PerspectiveCamera;
	public domElement: any; // view element used to listen mouse events
	public target: Vector3 = new THREE.Vector3(0, 0, 0); // defines in which direction camera looks
	public enabled = true; // when false camera is locked in current position

	public lookSpeed: number = 0.001; // speed of camera movement

	public constrainVertical: boolean = true; // set to true if we want constrain vertical movement
	public constrainHorizontal: boolean = true; // set to true if we want constrain horizontal movement


	private _verticalMin: number = 0;
	private _verticalMax: number = Math.PI;
	private _horizontalMin: number = 0;
	private _horizontalMax: number = Math.PI;

	private mouseX: number = 0;
	private mouseY: number = 0;

	private phi: number = 0;
	private theta: number = 0;

	private mouseDown: boolean = false;

	private viewHalfX: number = 0;
	private viewHalfY: number = 0;

	constructor( camera: PerspectiveCamera, domElement?: HTMLElement ) {
		this.camera = camera;
		this.domElement = ( domElement !== undefined ) ? domElement : document;

		if (this.domElement !== document) {
			this.domElement.setAttribute('tabindex', -1);
		}

		this.domElement.addEventListener('contextmenu', ( event: Event ) => { event.preventDefault(); }, false);
		this.domElement.addEventListener('mousemove', ( event: MouseEvent ) => this.onMouseMove(event), false);
		this.domElement.addEventListener('mousedown', ( event: MouseEvent ) => this.onMouseDown(event), false);
		this.domElement.addEventListener('mouseup', ( event: MouseEvent ) => this.onMouseUp(event), false);

		this.resizeViewport(window.innerWidth, window.innerHeight);
	}


	/*
	* Vertical min constrain setter in radians
	 */
	public set verticalMin( val: number ) {
		this._verticalMin = val;
		this.centerCameraDirection();
	}

	/*
	 * Vertical max constrain setter in radians
	 */
	public set verticalMax( val: number ) {
		this._verticalMax = val;
		this.centerCameraDirection();
	}

	/*
	 * Horizontal min constrain setter in radians
	 */
	public set horizontalMin( val: number ) {
		this._horizontalMin = val;
		this.centerCameraDirection();
	}

	/*
	 * Horizontal min constrain setter in radians
	 */
	public set horizontalMax( val: number ) {
		this._horizontalMax = val;
		this.centerCameraDirection();
	}

	public resizeViewport( width: number, height: number ): void {
		this.viewHalfX = width / 2;
		this.viewHalfY = height / 2;
	}

	public update( delta: number ): void {
		if (this.enabled === false) return;
		let actualLookSpeed = delta * this.lookSpeed;

		this.theta += this.mouseX * actualLookSpeed;
		if (this.constrainHorizontal) {
			this.theta = Math.max(this._horizontalMin, Math.min(this._horizontalMax, this.theta));
		}

		this.phi -= this.mouseY * actualLookSpeed;
		if (this.constrainVertical) {
			this.phi = Math.max(this._verticalMin, Math.min(this._verticalMax, this.phi));
		}

		this.updateCameraDirection(this.phi, this.theta);
	};

	private updateCameraDirection( phi: number, theta: number ): void {
		const cameraPos = this.camera.position;

		this.target.x = cameraPos.x + Math.sin(phi) * Math.cos(theta);
		this.target.y = cameraPos.y + Math.cos(phi);
		this.target.z = cameraPos.z + Math.sin(phi) * Math.sin(theta);

		this.camera.lookAt(this.target);
	}

	/*
	* function reset camera position so it look direction is in between defined constrains
	 */
	private centerCameraDirection(): void {
		if(this.constrainHorizontal){
			this.theta = (this._horizontalMax + this._horizontalMin) / 2;
		}
		if(this.constrainVertical){
			this.phi = (this._verticalMin + this._verticalMax) / 2;
		}
		this.updateCameraDirection(this.theta, this.phi);
	}

	private onMouseDown( event: MouseEvent ): void {
		if (this.domElement !== document) {
			this.domElement.focus();
		}
		event.preventDefault();
		event.stopPropagation();
		this.mouseDown = true;
	}

	private onMouseUp( event: MouseEvent ): void {
		event.preventDefault();
		event.stopPropagation();
		this.mouseDown = false;
	};

	private onMouseMove( event: MouseEvent ): void {
		if (this.mouseDown) {
			if (this.domElement === document) {
				this.mouseX = event.pageX - this.viewHalfX;
				this.mouseY = -event.pageY + this.viewHalfY;
			} else {
				this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
				this.mouseY = -event.pageY + this.domElement.offsetTop + this.viewHalfY;
			}
		}
		else {
			this.mouseX = 0;
			this.mouseY = 0;
		}
	};


}