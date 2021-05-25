var canvas = document.getElementById('renderCanvas')

var engine = null
var scene = null
var sceneToRender = null
var createDefaultEngine = function () {
    return new BABYLON.Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
        disableWebGL2Support: false
    })
}
var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine)

    var gravityVector = new BABYLON.Vector3(0, -9.81, 0)
    var physicsPlugin = new BABYLON.CannonJSPlugin()
    scene.enablePhysics(gravityVector, physicsPlugin)

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera(
        'camera1',
        new BABYLON.Vector3(0, 5, -10),
        scene
    )

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero())

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true)

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight(
        'light',
        new BABYLON.Vector3(0, 1, 0),
        scene
    )

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7

    // Our built-in 'sphere' shape.
    var sphere = BABYLON.MeshBuilder.CreateSphere(
        'sphereE',
        { diameter: 2, segments: 32 },
        scene
    )

    // Move the sphere upward 1/2 its height
    sphere.position.y = 2

    // Our built-in 'ground' shape.
    var ground = BABYLON.MeshBuilder.CreateGround(
        'ground',
        { width: 6, height: 6 },
        scene
    )

    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(
        sphere,
        BABYLON.PhysicsImpostor.SphereImpostor,
        { mass: 1, restitution: 0.9 },
        scene
    )
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
        ground,
        BABYLON.PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 0.9 },
        scene
    )

    return scene
}
window.initFunction = async function () {
    var asyncEngineCreation = async function () {
        try {
            return createDefaultEngine()
        } catch (e) {
            console.log(
                'the available createEngine function failed. Creating the default engine instead'
            )
            return createDefaultEngine()
        }
    }

    window.engine = await asyncEngineCreation()
    if (!engine) throw 'engine should not be null.'
    window.scene = createScene()
}
initFunction().then(() => {
    sceneToRender = scene
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render()
        }
    })
})

// Resize
window.addEventListener('resize', function () {
    engine.resize()
})
