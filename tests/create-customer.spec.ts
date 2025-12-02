import { test, expect } from '@playwright/test';

/**
 * Prueba E2E para crear un cliente
 * 
 * Esta prueba:
 * 1. Navega a la página de clientes
 * 2. Abre el diálogo de crear cliente
 * 3. Llena el formulario con datos de prueba
 * 4. Envía el formulario
 * 5. Verifica que el cliente se creó exitosamente
 */
test.describe('Crear Cliente', () => {
  test('debe crear un cliente exitosamente', async ({ page }) => {
    // Navegar a la página de clientes
    await page.goto('/clientes');
    
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle');
    
    // Hacer clic en el botón "Nuevo Cliente"
    const nuevoClienteButton = page.getByRole('button', { name: /nuevo cliente/i });
    await nuevoClienteButton.click();
    
    // Esperar a que el diálogo se abra
    await page.waitForSelector('text=Añadir Nuevo Cliente', { timeout: 5000 });
    
    // Generar datos únicos para evitar conflictos
    const timestamp = Date.now();
    const customerName = `Cliente Test ${timestamp}`;
    const customerEmail = `test${timestamp}@example.com`;
    const customerPhone = `3${timestamp.toString().slice(-9)}`; // 10 dígitos
    
    // Llenar el formulario
    await page.fill('input[id="name"]', customerName);
    await page.fill('input[id="email"]', customerEmail);
    await page.fill('input[id="phone"]', customerPhone);
    
    // Enviar el formulario
    await page.getByRole('button', { name: /guardar cliente/i }).click();
    
    // Esperar a que aparezca el mensaje de éxito - esto confirma que se creó exitosamente
    const successMessage = page.getByText('Cliente creado exitosamente').first();
    await expect(successMessage).toBeVisible({ timeout: 10000 });
    
    // Esperar a que el diálogo se cierre
    await page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 5000 });
    
    // Esperar a que cualquier petición de red termine
    await page.waitForLoadState('networkidle');
    
    // Esperar un poco para que React actualice el estado y renderice la tabla
    await page.waitForTimeout(2000);
    
    // Recargar la página para asegurar que vemos los datos actualizados del servidor
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Usar el campo de búsqueda para encontrar el cliente recién creado
    const searchInput = page.getByPlaceholder(/buscar clientes/i);
    await searchInput.fill(customerEmail);
    
    // Esperar a que la búsqueda filtre los resultados
    await page.waitForTimeout(2000);
    
    // Verificar que el cliente aparece después de la búsqueda
    // Buscar el email en toda la página
    await expect(page.getByText(customerEmail)).toBeVisible({ timeout: 10000 });
  });

  test('debe mostrar error si faltan campos requeridos', async ({ page }) => {
    // Navegar a la página de clientes
    await page.goto('/clientes');
    
    // Esperar a que la página cargue
    await page.waitForLoadState('networkidle');
    
    // Abrir el diálogo
    await page.getByRole('button', { name: /nuevo cliente/i }).click();
    
    // Esperar a que el diálogo se abra
    await page.waitForSelector('text=Añadir Nuevo Cliente', { timeout: 5000 });
    
    // Intentar enviar sin llenar los campos
    await page.getByRole('button', { name: /guardar cliente/i }).click();
    
    // Verificar que aparecen mensajes de error
    // Los mensajes de error pueden aparecer de diferentes formas dependiendo de la validación
    const errorMessage = page.getByText(/requerido|required/i).first();
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });
});

