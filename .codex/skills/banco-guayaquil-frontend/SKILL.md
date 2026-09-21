---
name: banco-guayaquil-frontend
description: "Diseña o ajusta interfaces frontend inspiradas en el lenguaje visual público actual de Banco Guayaquil: digital, cercano y magenta. Úsalo para productos web internos o demostrativos; no para reproducir logos o activos oficiales."
---

# Frontend Banco Guayaquil

Construye una interfaz contemporánea y clara, con prioridad en las tareas de la persona usuaria. Inspírate en el sitio público actual, pero no presentes el resultado como material oficial ni copies logotipos, ilustraciones, fotografías o texto comercial de la marca.

## Sistema visual

- Usa `Manrope, sans-serif` en titulares: peso 700, jerarquía amplia y espaciado cómodo. Para navegación, controles y texto de interfaz usa `"Nunito Sans", sans-serif`; define ambos con alternativas sans-serif y carga las fuentes solo si el proyecto lo permite.
- Usa el magenta de acción observado, `#A80058`, para la acción principal; su acento más vivo, `#D2006E`, puede destacar estados o fragmentos de texto. Mantén `#FFFFFF` sobre el magenta.
- Usa tinta azul-negra, `#182238` o `#1F293D`, para títulos y navegación; texto secundario `#515A73`; superficies blancas o grises muy claros (`#F5F6F8`). El azul `#0F62FE` queda para enlaces o acciones informativas, no para competir con la acción principal.
- Trata estos valores como una referencia de implementación observada, no como códigos oficiales. Confirma contraste WCAG AA, en especial en estados hover, focus y texto pequeño.

## Componentes y composición

- Cabecera de escritorio: limpia, blanca o transparente sobre una imagen segura para la lectura, altura objetivo cercana a 88 px. Agrupa la navegación por audiencia (por ejemplo, Personas, Empresas, Recursos), deja apoyo y acceso al final, y colapsa en móvil sin ocultar la acción esencial.
- Acción primaria: fondo `#A80058`, texto blanco, altura aproximada de 56 px, `padding-inline: 24px`, radio de 32 px, peso normal o medio y sin sombra por defecto. En hover, oscurece o aclara sutilmente sin cambiar su jerarquía; en focus-visible agrega un anillo perceptible que no dependa solo del color.
- Las acciones secundarias deben ser enlaces de tinta o controles de contorno discretos; reserva los botones sólidos magenta para una acción dominante por área.
- Evita sombras decorativas pesadas: la referencia privilegia planos limpios. Empléalas solo para separar menús, modales o tarjetas flotantes, con una sombra suave y baja opacidad.
- Diseña héroes con titulares grandes, mensajes breves y una sola llamada a la acción. Mantén suficiente contraste entre texto e imágenes/degradados y usa espacio en blanco generoso entre secciones.

## Al implementar

- Convierte los valores en tokens CSS/Tailwind reutilizables antes de repetirlos en componentes.
- Respeta los componentes, convenciones y sistema de diseño ya presentes en el proyecto. No sustituyas identidad, contenido ni dependencias salvo que el encargo lo solicite.
- Verifica al menos escritorio y móvil, navegación por teclado, foco visible y estados disabled/carga cuando haya formularios o acciones.
