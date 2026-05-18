export function buildSvgString(body: string, width: number, height: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

export function downloadSvg(name: string, body: string, width: number, height: number) {
  const svgString = buildSvgString(body, width, height);
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  triggerDownload(blob, `${name}.svg`);
}

export async function downloadPng(
  name: string,
  body: string,
  width: number,
  height: number,
  size: number = 512
) {
  const blob = await svgToRasterBlob(body, width, height, size, 'image/png');
  triggerDownload(blob, `${name}.png`);
}

export async function downloadJpeg(
  name: string,
  body: string,
  width: number,
  height: number,
  size: number = 512
) {
  const blob = await svgToRasterBlob(body, width, height, size, 'image/jpeg');
  triggerDownload(blob, `${name}.jpg`);
}

function svgToRasterBlob(
  body: string,
  width: number,
  height: number,
  size: number,
  mimeType: string
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const svgString = buildSvgString(body, width, height);
    const encoded = btoa(unescape(encodeURIComponent(svgString)));
    const dataUrl = `data:image/svg+xml;base64,${encoded}`;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;

      if (mimeType === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);
      }

      ctx.drawImage(img, 0, 0, size, size);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob'));
        },
        mimeType,
        0.95
      );
    };
    img.onerror = () => reject(new Error('Failed to load SVG'));
    img.src = dataUrl;
  });
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
