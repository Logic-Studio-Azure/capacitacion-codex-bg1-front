---
name: probar-apertura-inversiones
description: Ejecuta pruebas funcionales de apertura de inversiones en la aplicación local, cubriendo altas válidas y el rechazo de plazos inferiores al mínimo de cada producto.
metadata:
  short-description: Prueba funcional de aperturas
---

# Prueba funcional de apertura de inversiones

Usa el navegador integrado sobre la sesión que el usuario indique para probar el formulario de apertura. La aplicación es una demostración local; aun así, una apertura válida crea un registro persistente durante la ejecución actual.

## Cobertura base

Prueba cada producto disponible con un monto válido y su plazo mínimo. Además, para cada producto intenta abrir una inversión con un plazo de un día menos que el mínimo y verifica que el formulario la rechace sin registrar la inversión.

El catálogo actual define estos valores de referencia:

| Producto | Monto válido sugerido | Plazo válido | Plazo inválido |
| --- | ---: | ---: | ---: |
| Ahorro flexible | USD 100 | 30 días | 29 días |
| Plazo fijo 90 días | USD 500 | 90 días | 89 días |
| Plazo fijo 180 días | USD 500 | 180 días | 179 días |

Obtén los límites mostrados en la interfaz antes de actuar; si el catálogo cambió, usa los límites actuales en lugar de esta tabla. Emplea datos ficticios no sensibles para el inversionista.

## Ejecución y confirmación

1. Navega a **Apertura** y detecta los productos y sus límites visibles.
2. Ejecuta primero los casos inválidos y confirma el mensaje de validación correspondiente al plazo.
3. Deja preparados los datos de un caso válido, pero solicita autorización inmediatamente antes de confirmar aperturas que creen registros. Indica cuántos registros se crearán y que pertenecen a la demostración local.
4. Tras la autorización, confirma cada caso válido y verifica la pantalla de éxito, incluyendo producto, inversionista y monto final estimado. Si la pantalla no permite iniciar otra apertura, restablece el formulario de manera no destructiva, por ejemplo recargando la ruta de apertura.
5. Detén la ejecución si una validación esperada no aparece, una apertura devuelve un error, o la autorización no llega. No reintentes ciegamente ni modifiques datos ya creados.

## Entrega

Reporta una tabla con una fila por caso, incluyendo producto, escenario, datos usados y resultado. Distingue claramente las aperturas registradas de los rechazos de validación y conserva el mensaje de error observado cuando exista.