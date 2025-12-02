import { test, expect } from '@playwright/test';

/**
 * Prueba E2E para crear un plato en el menú
 * 
 * Esta prueba:
 * 1. Navega a la página del menú
 * 2. Abre el diálogo de crear plato
 * 3. Llena el formulario con datos de prueba
 * 4. Envía el formulario
 * 5. Verifica que el plato se creó exitosamente
 */
test.describe('Crear Plato en el Menú', () => {
  test('debe crear un plato exitosamente', async ({ page }) => {
    // Navegar a la página del menú
    await page.goto('/menu');
    
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle');
    
    // Buscar el botón para agregar nuevo plato
    const nuevoPlatoButton = page.getByRole('button', { name: /nuevo plato/i });
    await nuevoPlatoButton.click();
    
    // Esperar a que el diálogo se abra
    await page.waitForSelector('text=Añadir Nuevo Plato', { timeout: 5000 });
    
    // Generar datos únicos para evitar conflictos
    const timestamp = Date.now();
    const dishName = `Plato Test ${timestamp}`;
    const dishPrice = '25.99';
    const dishCategory = 'Plato Principal'; // Ajustar según las categorías disponibles
    
    // Llenar el formulario
    await page.fill('input[id="name"]', dishName);
    
    // Seleccionar categoría - el Select de Radix UI
    await page.locator('[id="category"]').click();
    await page.getByRole('option', { name: dishCategory }).click();
    
    // Llenar precio
    await page.fill('input[id="price"]', dishPrice);
    
    // La disponibilidad ya viene activada por defecto, no necesitamos cambiarla
    
    // Enviar el formulario
    await page.getByRole('button', { name: /guardar plato/i }).click();
    
    // Esperar a que el diálogo se cierre
    await page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 5000 });
    
    // Esperar a que aparezca el mensaje de éxito
    // Usar .first() para evitar el error de strict mode violation
    const successMessage = page.getByText('Plato guardado con éxito').first();
    await expect(successMessage).toBeVisible({ timeout: 10000 });
    
    // Verificar que el plato aparece en la lista
    await page.waitForTimeout(1000);
    
    // Verificar que el nombre del plato aparece
    await expect(page.getByText(dishName)).toBeVisible({ timeout: 5000 });
  });

  test('debe mostrar error si faltan campos requeridos', async ({ page }) => {
    // Navegar a la página del menú
    await page.goto('/menu');
    
    // Esperar a que la página cargue
    await page.waitForLoadState('networkidle');
    
    // Abrir el diálogo
    await page.getByRole('button', { name: /nuevo plato/i }).click();
    
    // Esperar a que el diálogo se abra
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
    
    // Intentar enviar sin llenar los campos
    await page.getByRole('button', { name: /guardar plato/i }).click();
    
    // Verificar que aparecen mensajes de error
    const errorMessage = page.getByText(/requerido|required/i).first();
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });
});

