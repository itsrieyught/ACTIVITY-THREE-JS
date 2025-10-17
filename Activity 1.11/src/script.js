import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

// Debug
const gui = new dat.GUI()
const params = { matcap: '8' }

gui.add(params, 'matcap', { '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8' })
    .onChange((value) => {
        if (currentMaterial) {
            currentMaterial.matcap = matcapTextures[value]
        }
    })

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTextures = {
    '1': textureLoader.load('textures/matcaps/1.png'),
    '2': textureLoader.load('textures/matcaps/2.png'),
    '3': textureLoader.load('textures/matcaps/3.png'),
    '4': textureLoader.load('textures/matcaps/4.png'),
    '5': textureLoader.load('textures/matcaps/5.png'),
    '6': textureLoader.load('textures/matcaps/6.png'),
    '7': textureLoader.load('textures/matcaps/7.png'),
    '8': textureLoader.load('textures/matcaps/8.png')
}

let currentMaterial = null
let donuts = []
let textMesh = null

/**
 * Fonts
 */
const fontLoader = new FontLoader()

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        // Material
        currentMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTextures['8'] })

        // Text
        const textGeometry = new TextGeometry(
            'Welcome to my vlog',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        textGeometry.center()

        const text = new THREE.Mesh(textGeometry, currentMaterial)
        textMesh = text
        scene.add(text)

        // Donuts
        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64)

        for(let i = 0; i < 50; i++)
        {
            const donut = new THREE.Mesh(donutGeometry, currentMaterial)
            donut.position.x = (Math.random() - 0.5) * 10
            donut.position.y = (Math.random() - 0.5) * 10
            donut.position.z = (Math.random() - 0.5) * 10
            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI
            const scale = Math.random()
            donut.scale.set(scale, scale, scale)

            // Store rotation speed for animation
            donut.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.01,
                    y: (Math.random() - 0.5) * 0.01,
                    z: (Math.random() - 0.5) * 0.01
                }
            }

            donuts.push(donut)
            scene.add(donut)
        }

        // Spheres
        const sphereGeometry = new THREE.SphereGeometry(0.25, 32, 32)

        for(let i = 0; i < 25; i++)
        {
            const sphere = new THREE.Mesh(sphereGeometry, currentMaterial)
            sphere.position.x = (Math.random() - 0.5) * 10
            sphere.position.y = (Math.random() - 0.5) * 10
            sphere.position.z = (Math.random() - 0.5) * 10
            const scale = Math.random()
            sphere.scale.set(scale, scale, scale)
            scene.add(sphere)
        }

        // Cubes
        const cubeGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3)

        for(let i = 0; i < 25; i++)
        {
            const cube = new THREE.Mesh(cubeGeometry, currentMaterial)
            cube.position.x = (Math.random() - 0.5) * 10
            cube.position.y = (Math.random() - 0.5) * 10
            cube.position.z = (Math.random() - 0.5) * 10
            cube.rotation.x = Math.random() * Math.PI
            cube.rotation.y = Math.random() * Math.PI
            const scale = Math.random()
            cube.scale.set(scale, scale, scale)
            scene.add(cube)
        }
    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()