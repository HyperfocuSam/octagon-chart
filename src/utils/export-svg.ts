export function exportSvg(svgElement: SVGSVGElement, filename: string = 'octagon-chart.svg') {
  const clone = svgElement.cloneNode(true) as SVGSVGElement;

  // Inline computed styles
  const allElements = clone.querySelectorAll('*');
  const originalElements = svgElement.querySelectorAll('*');

  allElements.forEach((el, i) => {
    const computed = window.getComputedStyle(originalElements[i]);
    const style = el as SVGElement;
    style.style.fontFamily = computed.fontFamily;
    style.style.fontSize = computed.fontSize;
    style.style.fontWeight = computed.fontWeight;
  });

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clone);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}
