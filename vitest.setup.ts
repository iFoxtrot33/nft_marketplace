import '@testing-library/jest-dom'

global.requestAnimationFrame = (callback: FrameRequestCallback) => {
  return setTimeout(callback, 16) // ~60fps
}

global.cancelAnimationFrame = (id: number) => {
  clearTimeout(id)
}
