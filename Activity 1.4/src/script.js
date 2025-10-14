import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//Axes Helper
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
/*onst camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height,
1, 100)*/
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

//Anmate
const tick = () =>
{
// Update objects
mesh.rotation.y += 0.01
mesh.rotation.x += 0.01
// Render
renderer.render(scene, camera)
// Call tick again on the next frame
window.requestAnimationFrame(tick)
}
tick()


/*let time = Date.now()
const tick = () =>
{

// Time

const currentTime = Date.now()
const deltaTime = currentTime - time
time = currentTime
// Update objects
mesh.rotation.y += 0.01 * deltaTime
// Render
renderer.render(scene, camera)
// Call tick again on the next frame
window.requestAnimationFrame(tick)
}
tick()*/

/*const clock = new THREE.Clock()
const tick = () =>
{
const elapsedTime = clock.getElapsedTime()
// Update objects
mesh.rotation.y = elapsedTime
// Render
renderer.render(scene, camera)
// Call tick again on the next frame
window.requestAnimationFrame(tick)
}
tick()*/

/*const clock = new THREE.Clock()
const tick = () =>
{
const elapsedTime = clock.getElapsedTime()
// Update objects
mesh.position.x = Math.cos(elapsedTime)
mesh.position.y = Math.sin(elapsedTime)
// Render
renderer.render(scene, camera)
// Call tick again on the next frame
window.requestAnimationFrame(tick)
}
tick()*/

/*const clock = new THREE.Clock()
const tick = () =>
{
const elapsedTime = clock.getElapsedTime()
// Update objects
camera.position.x = Math.cos(elapsedTime)
camera.position.y = Math.sin(elapsedTime)
camera.lookAt(mesh.position)
// Render
renderer.render(scene, camera)
// Call tick again on the next frame
window.requestAnimationFrame(tick)
}
tick()*/

/*gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 })

const tick = () =>
{

// Render
renderer.render(scene, camera)

// Call tick again on the next frame
window.requestAnimationFrame(tick)
}

tick()*/