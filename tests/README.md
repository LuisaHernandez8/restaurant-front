# Pruebas E2E con Playwright

Este directorio contiene las pruebas end-to-end (E2E) automatizadas usando Playwright.

## 📋 Pruebas Disponibles

### 1. Crear Cliente (`create-customer.spec.ts`)
- ✅ Prueba la creación exitosa de un cliente
- ✅ Valida que se muestren errores cuando faltan campos requeridos

### 2. Crear Plato (`create-dish.spec.ts`)
- ✅ Prueba la creación exitosa de un plato en el menú
- ✅ Valida que se muestren errores cuando faltan campos requeridos

## 🚀 Cómo Ejecutar las Pruebas

### Ejecutar todas las pruebas
```bash
npm run test:e2e
```

### Ejecutar pruebas con interfaz gráfica (recomendado para desarrollo)
```bash
npm run test:e2e:ui
```

### Ejecutar pruebas en modo visible (headed)
```bash
npm run test:e2e:headed
```

### Ejecutar pruebas en modo debug
```bash
npm run test:e2e:debug
```

### Ver reporte de pruebas
```bash
npm run test:e2e:report
```

## 📝 Requisitos Previos

1. **Servidor de desarrollo corriendo**: Las pruebas esperan que el servidor esté en `http://localhost:3000`
2. **Backend funcionando**: El backend debe estar corriendo y accesible
3. **Base de datos**: Debe haber una base de datos configurada (puede ser de prueba)

## 🔧 Configuración

La configuración de Playwright está en `playwright.config.ts`. Puedes ajustar:
- URL base de la aplicación
- Timeouts
- Navegadores a usar
- Configuración del servidor de desarrollo

## 📊 Estructura de las Pruebas

Cada prueba sigue esta estructura:
1. **Navegación**: Ir a la página correspondiente
2. **Interacción**: Hacer clic en botones, llenar formularios
3. **Validación**: Verificar que los resultados esperados aparezcan

## 🐛 Debugging

Si una prueba falla:
1. Ejecuta `npm run test:e2e:debug` para abrir el inspector
2. Revisa las capturas de pantalla en `test-results/`
3. Revisa los videos en `test-results/` (si están habilitados)
4. Revisa el reporte HTML con `npm run test:e2e:report`

## 📝 Agregar Nuevas Pruebas

Para agregar una nueva prueba:
1. Crea un archivo `.spec.ts` en el directorio `tests/`
2. Importa `test` y `expect` de `@playwright/test`
3. Usa `test.describe()` para agrupar pruebas relacionadas
4. Usa `test()` para cada caso de prueba individual

Ejemplo:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Mi Nueva Funcionalidad', () => {
  test('debe hacer algo', async ({ page }) => {
    await page.goto('/mi-pagina');
    // ... tu código de prueba
  });
});
```

## ⚠️ Notas Importantes

- Las pruebas generan datos únicos usando timestamps para evitar conflictos
- Las pruebas esperan que el servidor esté corriendo (se inicia automáticamente)
- Algunos selectores pueden necesitar ajustes según cambios en la UI


