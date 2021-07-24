export function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

export function isCursorPositionOverText(ctx, textPlacement, x, y) {
    return (
      x >= textPlacement.x
      && x <= (textPlacement.x + textPlacement.getWidth(ctx))
      && (y >= textPlacement.y - textPlacement.getHeight(ctx))
      && y <= textPlacement.y
    );
  }