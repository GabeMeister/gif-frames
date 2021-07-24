export function drawTextOnCanvas(ctx, textPlacement, fontSize) {
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.fillStyle = textPlacement.getLinkedTextColor();
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.shadowColor = 'black';
  ctx.shadowBlur = 7;
  ctx.fillText(textPlacement.getLinkedTextValue(), textPlacement.x, textPlacement.y);
}