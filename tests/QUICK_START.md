# 🚀 Guía Rápida: Cómo Probar la Automatización

## Opción 1: Interfaz Gráfica (RECOMENDADO para empezar) ⭐

```bash
npm run test:e2e:ui
```

**¿Qué hace?**
- Abre una interfaz gráfica donde puedes:
  - ✅ Ver todas las pruebas listadas
  - ✅ Ejecutar pruebas individuales haciendo clic
  - ✅ Ver el navegador en tiempo real
  - ✅ Ver el código mientras se ejecuta
  - ✅ Pausar y debuggear paso a paso

**Pasos:**
1. Ejecuta el comando
2. Espera a que se abra la ventana de Playwright
3. Haz clic en "Run all tests" o selecciona una prueba específica
4. Observa cómo se ejecuta automáticamente

---

## Opción 2: Modo Terminal (Rápido)

```bash
npm run test:e2e
```

**¿Qué hace?**
- Ejecuta todas las pruebas en la terminal
- Muestra resultados en texto
- Genera reportes automáticamente

---

## Opción 3: Modo Visible (Ver el navegador)

```bash
npm run test:e2e:headed
```

**¿Qué hace?**
- Ejecuta las pruebas pero puedes VER el navegador
- Útil para entender qué está pasando
- Más lento pero más visual

---

## Opción 4: Modo Debug (Para solucionar problemas)

```bash
npm run test:e2e:debug
```

**¿Qué hace?**
- Abre el inspector de Playwright
- Puedes ejecutar paso a paso
- Ver qué está pasando en cada momento

---

## Ver Reporte Después de Ejecutar

```bash
npm run test:e2e:report
```

Abre un reporte HTML con:
- ✅ Qué pruebas pasaron
- ✅ Qué pruebas fallaron
- ✅ Capturas de pantalla de errores
- ✅ Videos de las pruebas (si están habilitados)

---

## ⚠️ IMPORTANTE: Antes de Ejecutar

1. **Asegúrate de que el backend esté corriendo**
   - El backend debe estar en el puerto configurado
   - Debe tener acceso a la base de datos

2. **El servidor de Next.js se inicia automáticamente**
   - No necesitas ejecutar `npm run dev` manualmente
   - Playwright lo inicia por ti

3. **Si algo falla:**
   - Revisa que el backend esté funcionando
   - Verifica que la URL base sea correcta en `playwright.config.ts`
   - Revisa los logs en la terminal

---

## 🎯 Ejemplo de Ejecución

```bash
# 1. Abre la interfaz gráfica
npm run test:e2e:ui

# 2. En la ventana que se abre:
#    - Verás "create-customer.spec.ts" y "create-dish.spec.ts"
#    - Haz clic en "Run all tests"
#    - Observa cómo se ejecutan automáticamente

# 3. Verás:
#    ✅ Las pruebas navegando a las páginas
#    ✅ Llenando formularios automáticamente
#    ✅ Haciendo clic en botones
#    ✅ Verificando resultados
```

---

## 📊 Qué Esperar

Cuando ejecutes las pruebas, verás:

1. **Navegación automática** a `/clientes` o `/menu`
2. **Apertura automática** del diálogo de crear
3. **Llenado automático** del formulario
4. **Envío automático** del formulario
5. **Verificación automática** de que el elemento se creó

Todo esto sucede en **segundos** y sin intervención manual.


