export function drawTextOnCanvas(ctx, textData, fontSize) {
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.fillStyle = textData.color;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.shadowColor = 'black';
  ctx.shadowBlur = 7;
  ctx.fillText(textData.text, textData.x, textData.y);
}