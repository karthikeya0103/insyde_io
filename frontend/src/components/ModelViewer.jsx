import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Stars, Stats } from "@react-three/drei";
import React, { Suspense, useEffect, useState } from "react";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";

const LoadingSpinner = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-lg">
    <div className="flex flex-col items-center">
      <div className="h-12 w-12 mb-3 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
      <p className="text-sm font-medium text-gray-700">Loading model...</p>
    </div>
  </div>
);

const Model = ({ fileUrl, modelColor }) => {
  const geometry = useLoader(STLLoader, fileUrl);
  const meshRef = React.useRef();
  const { camera, scene } = useThree();
  const [isScaled, setIsScaled] = useState(false);

  useEffect(() => {
    if (meshRef.current && geometry && !isScaled) {
      geometry.center();
      const box = new THREE.Box3().setFromObject(meshRef.current);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      const maxDim = Math.max(size.x, size.y, size.z);
      const scaleFactor = 5 / Math.max(0.1, maxDim);
      meshRef.current.scale.setScalar(scaleFactor);

      const cameraPosition = new THREE.Vector3(1, 0.5, 1).normalize().multiplyScalar(maxDim * 2.5);
      camera.position.copy(cameraPosition);
      camera.lookAt(center);

      scene.userData.controls?.target.copy(center);

      setIsScaled(true);
    }
  }, [geometry, camera, scene, isScaled]);

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <primitive object={geometry} attach="geometry" />
      <meshPhongMaterial
        color={modelColor} // Dynamic Model Color
        specular="#94a3b8"
        shininess={50}
        flatShading={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const CameraController = () => {
  const { camera } = useThree();

  useEffect(() => {
    camera.near = 0.01;
    camera.far = 10000;
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
};

const ViewerControls = ({ controlsRef, showGrid, setShowGrid, showStats, setShowStats, bgColor, setBgColor, modelColor, setModelColor }) => {
  return (
    <div className="absolute top-4 right-4 flex flex-col space-y-2">
      {/* Reset Button */}
      <button
        onClick={() => controlsRef.current?.reset()}
        className="bg-white hover:bg-gray-100 text-gray-700 font-medium py-2 px-3 rounded-lg text-xs flex items-center shadow-lg hover:scale-105 transition-transform"
        title="Reset view"
      >
        🔄 Reset
      </button>

      {/* Grid Toggle */}
      <button
        onClick={() => setShowGrid(!showGrid)}
        className={`${
          showGrid ? "bg-blue-600 text-white" : "bg-white text-gray-700"
        } hover:bg-blue-700 hover:text-white font-medium py-2 px-3 rounded-lg text-xs flex items-center shadow-lg hover:scale-105 transition-transform`}
        title="Toggle grid"
      >
        📏 Grid
      </button>

      {/* Stats Toggle */}
      <button
        onClick={() => setShowStats(!showStats)}
        className={`${
          showStats ? "bg-blue-600 text-white" : "bg-white text-gray-700"
        } hover:bg-blue-700 hover:text-white font-medium py-2 px-3 rounded-lg text-xs flex items-center shadow-lg hover:scale-105 transition-transform`}
        title="Toggle stats"
      >
        📊 Stats
      </button>

      {/* Background Color Picker */}
      <div className="flex flex-col items-start bg-white p-2 rounded-lg shadow-md">
        <label className="text-xs font-medium text-gray-700 mb-1">Background Color</label>
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
          className="w-10 h-6 border border-gray-300 rounded cursor-pointer"
        />
      </div>

      {/* Model Color Picker */}
      <div className="flex flex-col items-start bg-white p-2 rounded-lg shadow-md">
        <label className="text-xs font-medium text-gray-700 mb-1">Model Color</label>
        <input
          type="color"
          value={modelColor}
          onChange={(e) => setModelColor(e.target.value)}
          className="w-10 h-6 border border-gray-300 rounded cursor-pointer"
        />
      </div>
    </div>
  );
};

const ModelViewer = ({ fileUrl }) => {
  const controlsRef = React.useRef();
  const [showGrid, setShowGrid] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [bgColor, setBgColor] = useState("#191970"); // Midnight Blue Default
  const [modelColor, setModelColor] = useState("#FFFFFF"); // White Default

  const handleCreated = (state) => {
    if (controlsRef.current) {
      state.scene.userData.controls = controlsRef.current;
    }
  };

  return (
    <div className="relative w-full h-[600px] bg-gray-900 shadow-xl rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [20, 20, 20], fov: 45, near: 0.01, far: 10000 }}
        className="w-full h-full"
        shadows
        onCreated={handleCreated}
        dpr={[1, 2]}
      >
        {/* Dynamic Background Color */}
        <color attach="background" args={[bgColor]} />
        
        {/* Lighting Setup */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
        <hemisphereLight color="#ffffff" groundColor="#b9b9b9" intensity={0.4} />
        <Stars radius={100} depth={50} count={1000} factor={4} fade />

        <CameraController />

        {showGrid && (
          <Grid
            renderOrder={-1}
            position={[0, -0.5, 0]}
            infiniteGrid
            cellSize={0.6}
            cellThickness={0.6}
            sectionSize={3}
            sectionThickness={1}
            sectionColor="#64748b"
            fadeDistance={50}
          />
        )}

        <Suspense fallback={null}>
          <Model fileUrl={fileUrl} modelColor={modelColor} />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan
          enableZoom
          enableRotate
          minDistance={0.1}
          maxDistance={1000}
          target={[0, 0, 0]}
          makeDefault
          zoomSpeed={1}
          enableDamping
          dampingFactor={0.05}
        />

        {showStats && <Stats />}
      </Canvas>

      <Suspense fallback={<LoadingSpinner />} />

      <ViewerControls
        controlsRef={controlsRef}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        showStats={showStats}
        setShowStats={setShowStats}
        bgColor={bgColor}
        setBgColor={setBgColor}
        modelColor={modelColor}
        setModelColor={setModelColor}
      />
    </div>
  );
};

export default ModelViewer;
