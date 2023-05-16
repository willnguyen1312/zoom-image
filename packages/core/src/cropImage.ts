type CropImageArg = {
  currentZoom: number
  image: HTMLImageElement
  positionX: number
  positionY: number
}

export const cropImage = ({
  image,
  positionX,
  positionY,
  currentZoom,
}: CropImageArg) => {
  const canvas = document.createElement("canvas")
  const scale = image.naturalWidth / (image.clientWidth * currentZoom)
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

  return canvas.toDataURL()
}
