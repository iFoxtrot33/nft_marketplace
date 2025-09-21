'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

interface SimpleLogoProps {
  width?: number
  height?: number
}

export const ThreeBanner: React.FC<SimpleLogoProps> = ({ width = 200, height = 200 }) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)

  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0)
    mountRef.current.appendChild(renderer.domElement)

    const light = new THREE.AmbientLight(0xffffff, 1)
    scene.add(light)

    camera.position.z = 5

    let model: THREE.Group | null = null
    let mixer: THREE.AnimationMixer | null = null

    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')

    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)

    loader.load(
      '/logo.glb',
      (gltf) => {
        model = gltf.scene

        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        model.position.sub(center)

        model.rotation.x = 0.0
        model.rotation.y = -0.3
        model.rotation.z = 0.0

        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model)
          gltf.animations.forEach((clip) => {
            const action = mixer!.clipAction(clip)
            action.play()
          })
        }

        scene.add(model)
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error)
      },
    )

    const clock = new THREE.Clock()

    const animate = () => {
      requestAnimationFrame(animate)

      const deltaTime = clock.getDelta()

      if (mixer) {
        mixer.update(deltaTime)
      }

      renderer.render(scene, camera)
    }
    animate()
    const handleMouseDown = (event: MouseEvent) => {
      isDraggingRef.current = true
      mouseRef.current = { x: event.clientX, y: event.clientY }
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDraggingRef.current || !model) return

      const deltaX = event.clientX - mouseRef.current.x
      const deltaY = event.clientY - mouseRef.current.y

      model.rotation.y += deltaX * 0.01
      model.rotation.x += deltaY * 0.01

      mouseRef.current = { x: event.clientX, y: event.clientY }
    }

    const handleMouseUp = () => {
      isDraggingRef.current = false
    }

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        isDraggingRef.current = true
        const touch = event.touches[0]
        mouseRef.current = { x: touch.clientX, y: touch.clientY }
      }
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (!isDraggingRef.current || !model || event.touches.length !== 1) return

      event.preventDefault()
      const touch = event.touches[0]
      const deltaX = touch.clientX - mouseRef.current.x
      const deltaY = touch.clientY - mouseRef.current.y

      model.rotation.y += deltaX * 0.01
      model.rotation.x += deltaY * 0.01

      mouseRef.current = { x: touch.clientX, y: touch.clientY }
    }

    const handleTouchEnd = () => {
      isDraggingRef.current = false
    }

    const canvas = renderer.domElement
    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
      dracoLoader.dispose()
    }
  }, [width, height])

  return (
    <div
      ref={mountRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        cursor: 'grab',
      }}
      className="select-none"
    />
  )
}
