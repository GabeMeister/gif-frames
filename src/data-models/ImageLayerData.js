import md5 from "md5";

class ImageLayerData {
  constructor(dataUrl, height, width) {
    this.dataUrl = dataUrl;
    this.height = height;
    this.width = width;
  }

  getHash() {
    const val = md5(
      JSON.stringify(this.dataUrl) +
        JSON.stringify(this.height) +
        JSON.stringify(this.width)
    );

    return val;
  }

  static initFromCanvas(canvas) {
    return new ImageLayerData(
      canvas.toDataURL(),
      canvas.height,
      canvas.width
    );
  }
}

export default ImageLayerData;
