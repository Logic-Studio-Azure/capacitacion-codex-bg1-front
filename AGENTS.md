## Proyecto de consulta y apertura de inversiones - Grupo 1

- Este es una aplicación frontend para consulta y apertura de inversiones
- No es una aplicación real, el objetivo es una capacitación en CODEX.

- Esta es una aplicación SPA (Single Page Application)
- Está desarrollada con Node.js 24, Typescript, React y Vite.
- Tailwind CSS para el diseño y la estilización de la interfaz de usuario.
- Tiene una arquitectura basada en componentes, lo que facilita la reutilización y el mantenimiento del código.
- Para el diseño de la interfaz se puede usar el skill `banco-guayaquil-frontend`.

### Estructura de archivos

```
src/
├─ components/      # Componentes reutilizables de la interfaz de usuario
├─ pages/           # Páginas de la aplicación
├─ services/        # Servicios para la integración con backend
├─ assets/          # Archivos estáticos como imágenes y estilos
├─ App.jsx          # Componente principal de la aplicación
├─ main.jsx         # Punto de entrada de la aplicación
└─ styles/          # Estilos y archivos .css
```

- Mantener la carpeta raiz `/`limpia solo para documentos o archivos de configuración.

### Códificación TypeScript
- Evita el uso de `any` siempre que sea posible.
- Utiliza interfaces y tipos para mantener un código más legible y mantenible.
- No generar código o funciones en una sola línea; busca mantener la legibilidad y claridad del código.

### Pruebas
- Las pruebas deben estar en su proyecto dentro de la carpeta `/tests` con Vitest.

### Documentación

- El archivo README.md debe contener información general del proyecto, instrucciones de instalación y comandos para ejecutar el proyecto localmente.
- El archivo README.md debe estar actualizado cada vez que se agrega una nueva funcionalidad.
- Se recomienda incluir ejemplos de uso y capturas de pantalla para facilitar la comprensión del proyecto.

## Proyecto Azure DevOps
- las historias de usuario de este proyecto están cargadas en el proyecto `capacitacion-codex` de Azure DevOps.
- Pudes usar la extensión MCP `azure-devops` para interactuar con Azure DevOps directamente.
- Las historias de usuario están en el feature `Backlog-grupo-1-frontend` (184) de Azure DevOps.