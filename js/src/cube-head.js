'use strict';

var canvas, renderer, scene, camera, world;
var gameCanvas, gameScene, gameRenderer, gameCamera;
var cubeBlue, cubeYellow;
var cubeLeftTop, cubeLeftBottom, cubeRightTop, cubeRightBottom;
var bullet, bulletBody, worldObjs = [];
var light;
var onClick = false;

var loadGameCanvas = function () {
    document.getElementById('game-cvs-container').style.width = `${document.getElementById('game-container').offsetWidth}px`;
    gameCanvas = document.getElementById('cvs-game');

    if (!gameCanvas) return;

    gameCanvas.width = gameCanvas.parentElement.offsetWidth;
    gameCanvas.height = gameCanvas.parentElement.offsetHeight;

    gameRenderer = new THREE.WebGLRenderer({ canvas: gameCanvas, antialias: true, logarithmicDepthBuffer: true, alpha: true });
    gameRenderer.setClearColor(0xDDE2E4, 0);

    gameScene = new THREE.Scene();

    gameCamera = new THREE.PerspectiveCamera(45, gameCanvas.width / gameCanvas.height, 1, 100);
    gameCamera.position.set(0, 0, 14);
    gameCamera.lookAt(0, 0, 0);

    cubeLeftTop = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1, 1, 1, 1),
        new THREE.MeshBasicMaterial({ color: 0x4F7CAC })
    );
    cubeLeftBottom = cubeLeftTop.clone();
    cubeRightTop = cubeLeftTop.clone();
    cubeRightBottom = cubeLeftTop.clone();
    cubeLeftTop.position.set(-3, 3, 0);
    cubeLeftBottom.position.set(-3, -3, 0);
    cubeRightTop.position.set(3, 3, 0);
    cubeRightBottom.position.set(3, -3, 0);
    gameScene.add(cubeLeftTop);
    gameScene.add(cubeLeftBottom);
    gameScene.add(cubeRightTop);
    gameScene.add(cubeRightBottom);

    requestAnimationFrame(renderGameLoop);
}

var loadCubeHead = function () {
    canvas = document.getElementById('cvs-cube-head');

    if (!canvas) return;

    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, logarithmicDepthBuffer: true, alpha: true });
    renderer.setClearColor(0xDDE2E4, 0);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 100);
    camera.position.set(0, 0, 14);
    camera.lookAt(0, 0, 0);

    cubeBlue = new THREE.Mesh(
        new THREE.BoxGeometry(10, 10, 10, 1, 1, 1),
        new THREE.MeshBasicMaterial({ color: 0x4F7CAC, transparent: true })
    );
    cubeBlue.position.set(-7, 7, 0);
    scene.add(cubeBlue);

    cubeYellow = new THREE.Mesh(
        new THREE.BoxGeometry(7, 7, 7, 1, 1, 1),
        new THREE.MeshBasicMaterial({ color: 0xBF9A73, transparent: true, opacity: .9 })
    );
    cubeYellow.position.set(1, -8, 0);
    scene.add(cubeYellow);

    world = new CANNON.World();
    world.gravity.set(0, 0, 0);

    requestAnimationFrame(renderLoopHead);
}

var renderGameLoop = function () {
    cubeLeftTop.rotation.x += 0.005;
    cubeLeftBottom.rotation.x += 0.005;
    cubeRightTop.rotation.x += 0.005;
    cubeRightBottom.rotation.x += 0.005;

    gameRenderer.render(gameScene, gameCamera);
    requestAnimationFrame(renderGameLoop);
}

var renderLoopHead = function () {
    cubeBlue.rotation.x += 0.0005;
    cubeBlue.rotation.y += 0.002;
    cubeBlue.rotation.z += 0.005;
    cubeYellow.rotation.x -= 0.0005;
    cubeYellow.rotation.y += 0.002;
    cubeYellow.rotation.z -= 0.005;

    if (window.scrollY < document.getElementById('sec-project').offsetTop) {
        cubeBlue.position.x = -7 - window.scrollY / 150;
        cubeBlue.position.y = 7 - window.scrollY / 200;
        cubeYellow.position.x = 1 + window.scrollY / 150;
        cubeYellow.position.y = -8 + window.scrollY / 200;
        cubeBlue.scale.set(1 + window.scrollY / 1500, 1 + window.scrollY / 1500, 1 + window.scrollY / 1500);
    }
    // else if (window.scrollY >= document.getElementById('sec-profile').offsetTop &&
    //     window.scrollY < document.getElementById('sec-about').offsetTop) {

    // } else {
    //     cube1.scale.x = 1 + (document.getElementById('sec-about').offsetTop - 1000) / 1500 - (window.scrollY - document.getElementById('sec-about').offsetTop + 1000) / 1500;
    //     cube1.scale.y = 1 + (document.getElementById('sec-about').offsetTop - 1000) / 1500 - (window.scrollY - document.getElementById('sec-about').offsetTop + 1000) / 1500;
    //     cube1.scale.z = 1 + (document.getElementById('sec-about').offsetTop - 1000) / 1500 - (window.scrollY - document.getElementById('sec-about').offsetTop + 1000) / 1500;
    // }

    updatePhysics();
    updateCubeHeadElement();

    renderer.render(scene, camera);
    requestAnimationFrame(renderLoopHead);
}

var updatePhysics = function () {
    world.step(1 / 60);

    worldObjs.forEach((obj) => {
        obj.mesh.position.copy(obj.body.position);
        obj.mesh.quaternion.copy(obj.body.quaternion);
        if (obj.mesh.position.z < 14 - 200) {
            scene.remove(obj.mesh);
            world.remove(obj.body);
        }
    })
}

var updateCubeHeadElement = function () {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    camera.aspect = canvas.width / canvas.height;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.width, canvas.height);
}