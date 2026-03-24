import { toPng } from 'html-to-image';

export async function exportPng(element: HTMLElement, filename: string = 'octagon-chart.png') {
  await document.fonts.ready;
  const dataUrl = await toPng(element, {
    pixelRatio: 2,
    cacheBust: true,
  });
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
