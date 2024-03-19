type CropImageArg = {
  currentZoom: number
  image: HTMLImageElement
  positionX: number
  positionY: number
  rotation?: number
}

export const cropImage = async ({ image, positionX, positionY, currentZoom, rotation = 0 }: CropImageArg) => {
  const canvas = document.createElement("canvas")
  const scale = image.naturalWidth / (image.clientWidth * currentZoom)
  const normalizedRotation = rotation % 360
  const croppedImageWidth = image.clientWidth * scale
  const croppedImageHeight = image.clientHeight * scale
  canvas.width = croppedImageWidth
  canvas.height = croppedImageHeight
  const canvasContext = canvas.getContext("2d") as CanvasRenderingContext2D

  const sx = Math.max(0, Math.abs(positionX) * scale)
  const sy = Math.max(0, Math.abs(positionY) * scale)

  canvasContext.drawImage(
    image,
    sx,
    sy,
    croppedImageWidth,
    croppedImageHeight,
    0,
    0,
    croppedImageWidth,
    croppedImageHeight,
  )

  const originalImage = new Image()
  originalImage.src = canvas.toDataURL()

  await new Promise((resolve) => setTimeout(resolve, 0))

  const rotatedCanvas = document.createElement("canvas") as HTMLCanvasElement
  const rotatedCanvasContext = rotatedCanvas.getContext("2d") as CanvasRenderingContext2D

  if (normalizedRotation === 90 || normalizedRotation === 270) {
    rotatedCanvas.width = originalImage.naturalHeight
    rotatedCanvas.height = originalImage.naturalWidth
  } else {
    rotatedCanvas.width = originalImage.naturalWidth
    rotatedCanvas.height = originalImage.naturalHeight
  }

  rotatedCanvasContext.clearRect(0, 0, canvas.width, canvas.height)
  if (normalizedRotation === 90 || normalizedRotation === 270) {
    rotatedCanvasContext.translate(originalImage.height / 2, originalImage.width / 2)
  } else {
    rotatedCanvasContext.translate(originalImage.width / 2, originalImage.height / 2)
  }
  rotatedCanvasContext.rotate((normalizedRotation * Math.PI) / 180)
  rotatedCanvasContext.drawImage(originalImage, -originalImage.width / 2, -originalImage.height / 2)

  return rotatedCanvas.toDataURL()
}
