# Inversiones demo

SPA educativa para consultar inversiones de demostración y simular su rendimiento estimado. No representa una oferta financiera.

## Requisitos y ejecución

- Node.js 24 o superior.
- Backend API disponible, por defecto, en `http://localhost:5206`.

```bash
npm install
cp .env.example .env.local
npm run dev
```

La variable `VITE_API_BASE_URL` permite definir la URL del backend por ambiente. Por ejemplo, para otro host: `VITE_API_BASE_URL=https://api.ejemplo.com`.

## Comandos

```bash
npm run dev       # servidor de desarrollo
npm run build     # comprobación de tipos y build de producción
npm run test      # pruebas con Vitest
```

## Funcionalidades

- Consulta `GET /api/investments`, con filtros opcionales `status` y `search`.
- Recarga, carga inicial, errores recuperables, estado vacío y “sin coincidencias”.
- Simulador que consume `GET /api/products` y envía `POST /api/investments/simulations`.
- Validaciones locales según límites y unidades del producto, además de errores de validación que responda la API.

El simulador no realiza llamadas a `POST /api/investments`; sólo consulta la proyección del endpoint de simulación.
