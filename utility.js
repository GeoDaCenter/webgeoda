/**
 * Converts a hex code color to RGB values.
 * @param {string} hex The hex code to convert.
 * @returns An array of each value as [r, g, b], with each ranging from 0-255.
 */
export function hexToRgb(hex) {
    // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}