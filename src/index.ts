import { MainRenderer } from './main-renderer';

const container = document.getElementById('container');
if (container) {
	const renderer = new MainRenderer(container);
	renderer.render();
}
else {
	console.warn('NO CONTAINER AVAILABLE!!');
}