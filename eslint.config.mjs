import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
  ...nextVitals,
  {
    rules: {
      // La exportación estática usa images.unoptimized: <img> con srcset propio es lo correcto
      // (ver src/components/Imagen.jsx y especificación §11).
      '@next/next/no-img-element': 'off',
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'node_modules/**',
    'coverage/**',
    'public/**',
    'src/fonts/fuentes.generated.js',
  ]),
]);
