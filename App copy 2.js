import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber'
// Canvas: 用于创建 Three.js 场景的主要容器组件。extend: 用于扩展 R3F 的内置组件集。useThree: 一个钩子，用于访问 Three.js 渲染上下文。useFrame: 一个钩子，用于在每一帧更新时执行代码。
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
// 从 meshline 库中导入两个主要类：MeshLineGeometry: 用于创建线条几何体。MeshLineMaterial: 用于定义线条的材质和外观。
import { useControls } from 'leva'
// 这行代码从 Leva 库中导入 useControls 钩子函数。Leva 是一个用于 React 应用的 GUI 控制面板库，可以方便地创建交互式控制界面。
// npm install three @react-three/fiber @react-three/drei @react-three/rapier meshline leva
extend({ MeshLineGeometry, MeshLineMaterial })
// 这行代码使用 extend 函数将 MeshLineGeometry 和 MeshLineMaterial 添加到 R3F 的内置组件集中。这样做之后，您可以在 JSX 中直接使用这些组件，就像使用内置的 Three.js 组件一样。例如，您可以这样使用：jsx,<meshLineGeometry />,<meshLineMaterial />
useGLTF.preload('https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb')
useTexture.preload('https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg')

export default function App() {
  const { debug } = useControls({ debug: false }) 
  // 这行代码使用 useControls 钩子创建一个控制选项。{ debug: false } 是传递给 useControls 的配置对象。这里定义了一个名为 "debug" 的布尔类型控制选项，初值为 false。const { debug } 使用解构赋值来获取控制选项的当前值。这段代码会在你的应用中创建一个简单的 GUI 控制面板。在这个面板中，会出现一个名为 "debug" 的开关（toggle）。用户可以通过点击这个开关来改变 debug 的值（在 true 和 false 之间切换）。在你的组件中，你可以使用 debug 变量来根据其值执行不同的逻辑。
  return (
    <Canvas camera={{ position: [0, 0, 13], fov: 35 }}> 
    {/* // Canvas组件是你开始定义你的React Three Fiber的场景的起点。position: [0, 0, 13]:这是一个数组，表示相机在 3D 空间中的位置。数组中的三个数字分别代表 X, Y, Z 坐标。[0, 0, 13] 意味着相机位于 Z 轴上距离原点 13 个单位的位置。X 和 Y 坐标为 0，表示相机在 XY 平面的中心。FOV 是 "Field of View" 的缩写，即视场角。fov这个值定义了相机的视角范围，单位是度。25 度是一个相对较小的视角，会产生一种"长焦"或"望远"的效果。较小的 FOV 会让远处的物体看起来更大，场景会显得更"扁平"。 */}

      <ambientLight intensity={ Math.PI} /> 
      {/* //这行代码是使用 React Three Fiber (R3F) 创建一个环境光源(Ambient Light)。intensity={Math.PI} 设置了光源的强度:intensity 是环境光的强度参数。Math.PI (约等于 3.14159) 作为强度值。在 Three.js r155 版本之后,光照系统进行了更新,以提供更加物理正确的光照模式。这个更改导致之前版本中强度为 1 的环境光在新版本中会显得更暗。使用 Math.PI 作为强度值可以大致恢复到之前版本的亮度效果 */}
      <Physics debug={debug} interpolate gravity={[0, -40, 0]} timeStep={1 / 60}> 
      {/* // Physics:这是 @react-three/rapier 提供的组件，用于创建一个物理世界。所有需要应用物理效果的对象都应该放在这个组件内。debug={debug}:启用或禁用物理引擎的调试模式。debug 是一个布尔值，可能来自之前我们讨论的 Leva 控制面板。当 debug 为 true 时，会显示物理对象的碰撞边界和其他调试信息。interpolate:这个属性启用插值。插值可以使物理模拟看起来更平滑，特别是在帧率不稳定的情况下。gravity={[0, -40, 0]}:设置物理世界的重力。数组 [0, -40, 0] 表示 X, Y, Z 三个轴的重力值。这里设置了一个向下（Y轴负方向）的重力，强度为 40。比地球重力（通常设置为 [0, -9.81, 0]）强得多，会产生更快的下落效果。timeStep={1 / 60}:设置物理模拟的时间步长。1/60 表示每秒进行 60 次物理计算，这通常与标准的 60 FPS 显示刷新率匹配。 */}
        <Band />
      </Physics>
      <Environment background blur={0.75}> //这是react three fiber组件,创建一个环境组件，用于设置场景的整体光照和背景。background 属性表示这个环境会影响背景。blur={0.75} 对环境贴图应用模糊效果，增加柔和度。
        <color attach="background" args={['black']} /> // 将场景的背景色设置为黑色。
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} /> 
        {/* // 这是 @react-three/drei 提供的组件，用于创建自定义形状的区域光源。这里定义了四个 Lightformer，每个都有不同的位置、旋转和强度。intensity：光源强度。color：光源颜色，这里都是白色。position：光源在 3D 空间中的位置 [x, y, z]。rotation：光源的旋转角度 [x, y, z]，使用弧度表示。scale：光源的缩放 [x, y, z]，这里创建了细长的光源形状。 */}
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        {/* // 这段代码创建了一个黑色背景的环境，其中有四个细长的白色光源从不同角度照亮场景。这种设置可以产生戏剧性的光影效果，适合用于突出物体轮廓或创造特定的氛围。最强的光源（强度为 10）可能会在场景中产生主要的光照效果，而其他较弱的光源则提供补充照明和细节。 */}
      </Environment>
    </Canvas>
  )
}

function Band({ maxSpeed = 50, minSpeed = 10 }) {
  const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef() // prettier-ignore ,useRef()这是 React 的一个钩子函数，用于创建一个可变的引用对象。引用对象可以在组件的整个生命周期内保持不变。通常用于访问 DOM 元素或存储任何可变值，而不会触发组件重新渲染。band: 可能用于引用一个带状或条状元素。fixed: 可能用于引用一个固定位置的元素。j1, j2, j3: 可能用于引用三个相关的元素，比如关节或连接点。card: 可能用于引用一个卡片元素。 prettier-ignore:这是一个注释，告诉代码格式化工具（如 Prettier）忽略这一行。这通常用于保持特定的代码格式，防止自动格式化工具改变它。
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3() // prettier-ignore,这是 Three.js 库中的一个类，用于表示三维空间中的向量或点。每个 Vector3 对象包含 x, y, z 三个分量。vec: 一个通用的向量，可能用于各种计算。ang: 可能用于表示角度或旋转。rot: 可能专门用于表示旋转。dir: 可能用于表示方向。new THREE.Vector3():创建一个新的 Vector3 实例。不传参数时，默认创建一个 (0, 0, 0) 的向量。
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 2, linearDamping: 2 } //type: 'dynamic': 这表示该段是动态的，意味着它可以在物理模拟中移动和受力影响.canSleep: true: 这允许物理引擎在对象静止时将其置于"睡眠"状态，以提高性能。colliders: false: 这表示该段不会与其他物体发生碰撞。angularDamping: 2: 这是角度阻尼，用于减缓旋转运动。值为2表示中等程度的旋转阻尼。linearDamping: 2: 这是线性阻尼，用于减缓直线运动。值为2表示中等程度的线性阻尼。数值越大,阻力越大.
  const { nodes, materials } = useGLTF('https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb') //图标的地址
  const texture = useTexture('https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg') //那个卡片的资源地址
  const { width, height } = useThree((state) => state.size) // useThree 钩子：这是React Three Fiber提供的一个自定义Hook。它允许你访问Three.js场景的各种属性和方法。(state) => state.size：这是一个传递给useThree的回调函数。它从Three.js的状态对象中提取size属性。解构赋值 { width, height }：这里使用了JavaScript的解构赋值语法。它从state.size对象中提取width和height属性。结果：width变量将包含Three.js渲染区域的宽度。height变量将包含Three.js渲染区域的高度。
  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]))
  // 这段代码使用了React的useState钩子来创建和管理组件的状态。让我逐行解释：const [curve] = useState(() => new THREE.CatmullRomCurve3([...]))创建一个状态变量curve初始值是一个Three.js的CatmullRomCurve3对象这个曲线由四个Vector3点定义使用函数初始化可以避免在每次渲染时重新创建曲线对象const [dragged, drag] = useState(false)创建一个布尔状态dragged和它的设置函数drag初始值为false可能用于跟踪某个元素是否正在被拖动const [hovered, hover] = useState(false)创建另一个布尔状态hovered和它的设置函数hover初始值为false可能用于跟踪鼠标是否悬停在某个元素上这些状态变量可能用于以下目的：curve: 定义一个3D空间中的曲线，可能用于动画或路径生成dragged: 跟踪用户是否正在拖动某个3D对象hovered: 检测鼠标是否悬停在某个3D对象上在Three.js和React Three Fiber的上下文中，这些状态可能用于创建交互式3D场景，如：允许用户通过拖动来修改曲线的形状当用户与3D对象交互时改变其外观（如高亮显示）基于用户输入（拖动、悬停）触发动画或其他效果这种方式结合了React的状态管理和Three.js的3D图形功能，使得创建复杂的、响应式的3D用户界面成为可能。
  
  const [dragged, drag] = useState(false)
  const [hovered, hover] = useState(false)

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]) // prettier-ignore
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]) // prettier-ignore
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]) // prettier-ignore
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]) // prettier-ignore
  //这段代码使用了React Three Fiber和React Three Rapier库来创建3D物理模拟中的关节连接。让我逐行解释:useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])创建一个绳索关节，连接fixed和j1两个刚体[[0, 0, 0], [0, 0, 0], 1]分别表示两个刚体上的锚点坐标和绳索长度useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])创建另一个绳索关节，连接j1和j2useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])创建第三个绳索关节，连接j2和j3useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]])创建一个球形关节，连接j3和card[[0, 0, 0], [0, 1.45, 0]]表示两个刚体上的锚点坐标这段代码的目的是创建一个由多个关节连接的物理系统，可能用于模拟一个挂牌或徽章的物理行为。fixed可能是一个固定点，j1、j2、j3是中间的连接点，card则可能是最终的可交互对象。使用绳索关节(useRopeJoint)可以让物体之间保持一定距离但允许旋转，而球形关节(useSphericalJoint)则允许更自由的旋转。这种设置可以创造出一种自然的摆动效果，就像一个挂在绳子上的物体。 prettier-ignore注释是为了防止代码格式化工具改变这些行的格式，保持代码的可读性。

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => void (document.body.style.cursor = 'auto')
    }
  }, [hovered, dragged])
  // 这段代码使用了React的useEffect钩子来控制鼠标光标的样式。让我来详细解释一下:useEffect(() => { ... }, [hovered, dragged])这个useEffect会在组件渲染后执行，并且会在hovered或dragged状态变化时重新执行。if (hovered) { ... }这个条件检查鼠标是否悬停在某个元素上。document.body.style.cursor = dragged ? 'grabbing' : 'grab'如果鼠标悬停，这行代码会设置鼠标光标的样式:如果dragged为true，光标样式设为'grabbing'（抓取中）如果dragged为false，光标样式设为'grab'（可抓取）return () => void (document.body.style.cursor = 'auto')这是清理函数。它会在以下情况执行:组件卸载时下一次effect执行之前（如果依赖项变化）清理函数将光标样式重置为'auto'（默认）。void 操作符在这里用于执行赋值操作但不返回值，这是一种常见的简洁写法。总的来说，这段代码的作用是当鼠标悬停在元素上时，根据是否正在拖拽来改变光标样式当鼠标离开元素或组件卸载时，恢复默认光标样式这种效果通常用于实现可拖拽的用户界面元素，提供视觉反馈以增强用户体验。

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z })
    }
    // 这段代码使用了React Three Fiber的useFrame钩子来实现3D场景中的拖拽功能。让我详细解释一下:useFrame((state, delta) => { ... })这个钩子在每一帧渲染时执行，提供了当前的状态(state)和自上一帧以来经过的时间(delta)。if (dragged) { ... }只有在某个对象被拖拽时才执行以下代码。vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)将2D鼠标位置转换为3D空间中的点。dir.copy(vec).sub(state.camera.position).normalize()计算从相机到该3D点的方向向量。vec.add(dir.multiplyScalar(state.camera.position.length()))将该点延伸到与相机距离相同的位置。[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())唤醒场景中的所有物理对象，确保它们能够参与交互。card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z })更新被拖拽对象(card)的位置。新位置是计算出的3D位置减去初始拖拽偏移量。这段代码的主要目的是实现一个直观的3D拖拽交互:它将2D鼠标移动转换为3D空间中的移动。考虑了相机的位置和视角，使拖拽在任何视角下都感觉自然。保持了拖拽对象与鼠标指针之间的相对位置。确保所有相关的物理对象都处于活跃状态，以便正确响应这个交互。这种实现使得用户可以在3D环境中直观地拖动对象，就像在2D界面中一样自然，同时考虑了3D空间的复杂性。

    if (fixed.current) {
      // Fix most of the jitter when over pulling the card
      ;[j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation())
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())))
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)))
      })
      // Calculate catmul curve
      curve.points[0].copy(j3.current.translation())
      curve.points[1].copy(j2.current.lerped)
      curve.points[2].copy(j1.current.lerped)
      curve.points[3].copy(fixed.current.translation())
      band.current.geometry.setPoints(curve.getPoints(32))
      // Tilt it back towards the screen
      ang.copy(card.current.angvel())
      rot.copy(card.current.rotation())
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z })
    }
    // 这段代码使用了Three.js和React Three Fiber来实现3D场景中的高级动画效果。让我逐行解释这段代码的含义：if (fixed.current) { ... }这段代码块只有在fixed对象存在时才会执行。Fix most of the jitter when over pulling the card这行注释说明了接下来的代码是为了减少在过度拉动卡片时的抖动。[j1, j2].forEach((ref) => { ... })对j1和j2两个对象进行遍历。if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation())如果ref.current.lerped不存在，则创建一个新的THREE.Vector3对象并将ref.current.translation()的值复制给它。这是为了初始化lerped属性，用于存储插值后的位置。const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())))计算lerped位置和当前实际位置之间的距离，并将其限制在0.1到1之间。这样可以防止距离过大或过小。ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)))使用线性插值（lerp）方法将lerped位置逐渐移动到当前实际位置。插值速度由delta、minSpeed和maxSpeed决定，确保移动平滑。Calculate catmul curve这行注释说明了接下来的代码是为了计算Catmull-Rom样条曲线。curve.points.copy(j3.current.translation())将j3的当前位置信息复制到曲线的第一个点。curve.points.copy(j2.current.lerped)将j2的插值位置复制到曲线的第二个点。curve.points.copy(j1.current.lerped)将j1的插值位置复制到曲线的第三个点。curve.points.copy(fixed.current.translation())将fixed的当前位置信息复制到曲线的第四个点。band.current.geometry.setPoints(curve.getPoints(32))使用32个点来生成Catmull-Rom样条曲线，并将这些点设置到band的几何体上。Tilt it back towards the screen这行注释说明了接下来的代码是为了将卡片向屏幕方向倾斜。ang.copy(card.current.angvel())获取卡片的当前角速度并复制到ang变量中。rot.copy(card.current.rotation())获取卡片的当前旋转角度并复制到rot变量中。card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z })设置卡片的新的角速度，使其在y轴方向上减去当前旋转角度的四分之一。这会使卡片在拖动时有一个自然的倾斜效果。总结：这段代码的主要目的是在3D场景中实现一个平滑的拖动效果，同时减少抖动，并通过计算Catmull-Rom样条曲线来生成平滑的路径。最后，通过调整角速度来实现卡片的自然倾斜效果。
  })

  curve.curveType = 'chordal'
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping

  // 这段代码设置了Three.js中曲线和纹理的属性。让我解释一下每一部分：curve.curveType = 'chordal'这行代码设置了曲线的类型为"chordal"（弦线型）。在Three.js中，这通常用于Catmull-Rom曲线。"chordal"类型的曲线会通过每个控制点，并且曲线的张力会根据控制点之间的距离自动调整。这种类型的曲线通常会产生比默认设置更平滑的结果。texture.wrapS = texture.wrapT = THREE.RepeatWrapping这行代码设置了纹理的包裹模式。wrapS和wrapT分别控制纹理在水平和垂直方向上的重复方式。THREE.RepeatWrapping表示纹理会在到达边界时重复。将两者都设置为THREE.RepeatWrapping意味着纹理会在两个方向上无限重复。这段代码的目的可能是：创建一个平滑的、基于弦线的曲线，可能用于生成路径或形状。设置一个可以在物体表面无限重复的纹理，这在创建大面积的纹理表面（如地板、墙壁等）时很有用。这些设置通常用于优化3D场景的视觉效果，使曲线更平滑，纹理更连续。

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        {/* // 这段代码使用了React Three Fiber和React Three Rapier库来创建一个3D物理场景。让我详细解释一下：group position={[0, 4, 0]}创建一个组（group），将其位置设置为(0, 4, 0)。这个组包含了所有的刚体对象。RigidBody ref={fixed} {...segmentProps} type="fixed" /创建一个固定的刚体（RigidBody）。ref={fixed}允许在其他地方引用这个对象。{...segmentProps}展开了之前定义的segmentProps对象的属性。type="fixed"表示这个刚体是固定的，不会移动。RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}创建第一个可移动的刚体，位置在(0.5, 0, 0)。ref={j1}允许在其他地方引用这个对象。BallCollider args={[0.1]} /在刚体内部添加一个球形碰撞体。args={[0.1]}设置球体的半径为0.1。后面的两个RigidBody块分别创建了j2和j3两个刚体，位置分别在(1, 0, 0)和(1.5, 0, 0)。每个刚体都有一个球形碰撞体。这段代码的目的是创建一个由四个刚体组成的物理系统：一个固定的刚体（可能作为锚点）三个可移动的刚体，每个都有球形碰撞体这种设置通常用于创建类似链条或绳索的物理效果。固定刚体作为起点，后面的三个可移动刚体可以像链条一样摆动。球形碰撞体允许这些刚体之间进行物理交互。这个结构可能是前面我们讨论的"挂牌"或"徽章"物理模拟的一部分，其中这些刚体形成了连接固定点和可交互对象（如卡片）的物理链条。 */}

        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={(e) => (e.target.setPointerCapture(e.pointerId), drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation()))))}>
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial map={materials.base.map} map-anisotropy={16} clearcoat={1} clearcoatRoughness={0.15} roughness={0.3} metalness={0.5} />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
        {/* // 这段代码创建了一个复杂的3D物体，可能是一个可交互的卡片或徽章。让我详细解释一下：RigidBody组件：位置设置为 [2, 0, 0]引用设置为 card类型根据 dragged 状态动态切换：拖拽时为 'kinematicPosition'，否则为 'dynamic'应用了之前定义的 segmentPropsCuboidCollider为刚体添加了一个长方体碰撞器，尺寸为 [0.8, 1.125, 0.01]group 组件：缩放为 2.25位置调整为 [0, -1.2, -0.05]添加了多个交互事件处理器：onPointerOver 和 onPointerOut：处理悬停状态onPointerUp：释放指针捕获，结束拖拽onPointerDown：设置指针捕获，开始拖拽，并计算拖拽偏移量内部的 mesh组件：卡片主体：使用 nodes.card.geometry 和自定义的 meshPhysicalMaterial卡片夹子：使用 nodes.clip.geometry 和 materials.metal卡片夹：使用 nodes.clamp.geometry 和 materials.metal这段代码的主要功能是：创建一个可物理模拟的3D卡片对象。允许用户与卡片交互（悬停和拖拽）。在拖拽状态下改变物理行为（从动态变为运动学）。使用复杂的材质设置来实现逼真的视觉效果。这个组件可能是一个交互式3D场景中的核心元素，允许用户拖拽和操作一个精细渲染的3D卡片或徽章。它结合了物理模拟、用户交互和高质量的视觉渲染，创造出一个丰富的用户体验。 */}

      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial color="white" depthTest={false} resolution={[width, height]} useMap map={texture} repeat={[-3, 1]} lineWidth={1} />
      </mesh>
      {/* // 这段代码创建了一个特殊的网格对象，用于渲染一条线或带状物体。让我详细解释一下：mesh ref={band}创建一个网格对象，并通过 ref={band} 提供了一个引用，以便在其他地方访问这个对象。meshLineGeometry /使用 MeshLine 库的特殊几何体。这种几何体专门用于创建线条或带状物体。meshLineMaterial设置了线条的材质，包含以下属性：color="white": 设置线条颜色为白色。depthTest=false: 禁用深度测试，使线条始终显示在其他物体之上。resolution=[width, height]: 设置线条的分辨率，使用之前定义的 width 和 height 变量。useMap: 启用纹理贴图。map=texture: 使用之前定义的 texture 作为纹理。repeat={[-3, 1]}: 设置纹理重复方式，水平方向重复-3次，垂直方向重复1次。lineWidth=1: 设置线条宽度为1。这段代码的目的是创建一个可能用于连接其他对象的线条或带状物体。它使用了特殊的几何体和材质来实现高质量的线条渲染，可能用于创建类似绳索、链条或其他连接元素的视觉效果。线条的特点包括：始终显示在其他物体之上（因为禁用了深度测试）。使用纹理来增加视觉细节。可以根据分辨率自适应调整。纹理在水平方向上有特殊的重复设置，可能用于创造动画效果。这种技术常用于创建复杂的3D场景中的连接元素，如绳索、能量线、轨迹等。 */}
    </>
  )
}