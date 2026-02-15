// Debug letter positioning
const letters = 7;
const CIRCLE_SIZE = 200;
const TILE_SIZE = 48;
const cx = CIRCLE_SIZE / 2;
const cy = CIRCLE_SIZE / 2;
const radius = (CIRCLE_SIZE - TILE_SIZE) / 2;

console.log('=== Current Angle Calculation ===');
console.log(`Circle: ${CIRCLE_SIZE}x${CIRCLE_SIZE}, Center: (${cx}, ${cy})`);
console.log(`Radius: ${radius}, Tile: ${TILE_SIZE}x${TILE_SIZE}\n`);

console.log('Letter positions:');
for (let i = 0; i < letters; i++) {
  const angle = -Math.PI / 2 + (2 * Math.PI * i) / letters;
  const x = cx + radius * Math.cos(angle);
  const y = cy + radius * Math.sin(angle);
  const degrees = (angle * 180 / Math.PI).toFixed(1);
  
  // Position descriptions
  let position = '';
  if (Math.abs(degrees - (-90)) < 5) position = 'TOP';
  else if (Math.abs(degrees - 0) < 15) position = 'RIGHT';
  else if (Math.abs(degrees - 90) < 15) position = 'BOTTOM';
  else if (Math.abs(degrees - 180) < 15 || Math.abs(degrees - (-180)) < 15) position = 'LEFT';
  else if (degrees > -90 && degrees < 0) position = 'TOP-RIGHT';
  else if (degrees > 0 && degrees < 90) position = 'BOTTOM-RIGHT';
  else if (degrees > 90 && degrees < 180) position = 'BOTTOM-LEFT';
  else if (degrees > -180 && degrees < -90) position = 'TOP-LEFT';
  
  console.log(`  Letter ${i}: ${position.padEnd(12)} angle=${degrees}°, coords=(${x.toFixed(1)}, ${y.toFixed(1)})`);
}

console.log('\n=== In Screen Coordinates (Y-axis down) ===');
console.log('Starting angle -90° = TOP (12 o\'clock position)');
console.log('Angles increase clockwise: -90° → 0° → 90° → 180°');
console.log('This arranges letters: TOP → RIGHT → BOTTOM → LEFT → TOP\n');
