/* ==================================================================================
   UTILS & HELPERS
   ================================================================================== */

export const hexToRgb = (hex) => {
  if (!hex || hex === 'transparent') return '255, 255, 255';
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 255, 255';
};

