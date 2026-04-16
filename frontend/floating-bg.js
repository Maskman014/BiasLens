/**
 * BiasLens Premium 3D Background
 * Uses Three.js to create floating glassmorphic figures.
 */

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js';

class FloatingBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.shapes = [];
        this.mouseX = 0;
        this.mouseY = 0;

        this.init();
        this.addShapes();
        this.animate();

        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    init() {
        this.camera.position.z = 5;
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x7000ff, 2); // BiasLens Purple
        pointLight1.position.set(2, 3, 4);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x00f5ff, 2); // BiasLens Cyan
        pointLight2.position.set(-2, -3, 4);
        this.scene.add(pointLight2);
    }

    addShapes() {
        const geometries = [
            new THREE.TorusGeometry(0.5, 0.2, 16, 100),
            new THREE.IcosahedronGeometry(0.6, 0),
            new THREE.OctahedronGeometry(0.5, 0),
            new THREE.TorusKnotGeometry(0.3, 0.1, 100, 16)
        ];

        const material = new THREE.MeshPhysicalMaterial({
            thickness: 0.5,
            roughness: 0,
            transmission: 1,
            ior: 1.5,
            colorSpace: THREE.SRGBColorSpace,
            attenuationColor: new THREE.Color(0xffffff),
            attenuationDistance: 0.5,
        });

        for (let i = 0; i < 15; i++) {
            const geo = geometries[Math.floor(Math.random() * geometries.length)];
            const mesh = new THREE.Mesh(geo, material);

            mesh.position.set(
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 5 - 2
            );

            mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
            
            const scale = Math.random() * 0.5 + 0.5;
            mesh.scale.set(scale, scale, scale);

            this.shapes.push({
                mesh: mesh,
                speedX: (Math.random() - 0.5) * 0.01,
                speedY: (Math.random() - 0.5) * 0.01,
                rotX: (Math.random() - 0.5) * 0.02,
                rotY: (Math.random() - 0.5) * 0.02
            });

            this.scene.add(mesh);
        }
    }

    onMouseMove(e) {
        this.mouseX = (e.clientX - window.innerWidth / 2) / 100;
        this.mouseY = (e.clientY - window.innerHeight / 2) / 100;
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.shapes.forEach(shape => {
            shape.mesh.rotation.x += shape.rotX;
            shape.mesh.rotation.y += shape.rotY;
            
            shape.mesh.position.x += shape.speedX;
            shape.mesh.position.y += shape.speedY;

            // Bounce back
            if (Math.abs(shape.mesh.position.x) > 10) shape.speedX *= -1;
            if (Math.abs(shape.mesh.position.y) > 10) shape.speedY *= -1;
        });

        // Subtle camera reaction to mouse
        this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    new FloatingBackground('bg-canvas');
});
