export function getCroppedImg(image, crop, rotation) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const rotatedImage = getRotatedImage(image, rotation);
    const { x, y, width, height } = crop;

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(rotatedImage, -x, -y);

    return canvas.toDataURL('image/png');
}

export function getRotatedImage(image, rotation) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const { naturalWidth, naturalHeight } = image;

    if (rotation === 90 || rotation === 270) {
        canvas.width = naturalHeight;
        canvas.height = naturalWidth;
    } else {
        canvas.width = naturalWidth;
        canvas.height = naturalHeight;
    }

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(image, -naturalWidth / 2, -naturalHeight / 2);

    return canvas;
}
