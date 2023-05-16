export const cropImage = ({
  image,
  container,
  positionX,
  positionY,
  currentZoom,
}: {
  image: HTMLImageElement
  container: HTMLElement
  positionX: number
  positionY: number
  currentZoom: number
}) => {
  const canvas = document.createElement("canvas")
  const scale = image.naturalWidth / (container.clientWidth * currentZoom)
  const croppedImageWidth = container.clientWidth * scale
  const croppedImageHeight = container.clientHeight * scale
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
