'use strict';

var canvasHead, rendererHead, sceneHead, cameraHead;
var cubeHead, cubes = [];
var light;
var withCubeHead = true;

var loadCubeHead = function() {
    canvasHead = document.getElementById('cvs-cube-head');

    if (!canvasHead) return;

    canvasHead.width = canvasHead.parentElement.offsetWidth;
    canvasHead.height = canvasHead.parentElement.offsetHeight;

	rendererHead = new THREE.WebGLRenderer({ canvas: canvasHead, antialias: true, logarithmicDepthBuffer: false, alpha: true });
	rendererHead.setClearColor(0xffffff);

    sceneHead = new THREE.Scene();
    
    cameraHead = new THREE.PerspectiveCamera(45, canvasHead.width / canvasHead.height, 1, 100);
    cameraHead.position.set(0, 0, 14);
    cameraHead.lookAt(0, 0, 0);

    if (withCubeHead) {
        cubeHead = new THREE.Mesh(
            new THREE.CubeGeometry(2.5, 2.5, 2.5, 1, 1, 1),
            new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true })
        );
        cubeHead.position.y = 0;
        cubeHead.rotation.x = 0.1;
        cubeHead.rotation.y = 0.1;
        cubeHead.rotation.z = 0.1;
        sceneHead.add(cubeHead);
    }

    light = new THREE.DirectionalLight(0xaaaaaa, 1, 100);
    light.position.set(0, 0, 75);
    sceneHead.add(light);

    requestAnimationFrame(renderLoopHead);
}

var renderLoopHead = function() {
    if (withCubeHead) {
        cubeHead.rotation.x += 0.0005;
        cubeHead.rotation.y += 0.002;
        cubeHead.rotation.z += 0.005;
    }

    cubeHead.scale.x = 1 + window.scrollY / 500;
    cubeHead.scale.y = 1 + window.scrollY / 500;
    cubeHead.scale.z = 1 + window.scrollY / 500;
    cubeHead.material.opacity = 0.5 - window.scrollY / 10000;

    updateCubeHead();
    
    rendererHead.render(sceneHead, cameraHead);
    requestAnimationFrame(renderLoopHead);
}

var updateCubeHead = function() {
    canvasHead.width = canvasHead.parentElement.offsetWidth;
    canvasHead.height = canvasHead.parentElement.offsetHeight;
    cameraHead.aspect = canvasHead.width / canvasHead.height;
    cameraHead.updateProjectionMatrix();
    rendererHead.setSize(canvasHead.width, canvasHead.height);
}