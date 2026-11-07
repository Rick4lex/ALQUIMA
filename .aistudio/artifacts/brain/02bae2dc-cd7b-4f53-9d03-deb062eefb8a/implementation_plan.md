# Plan de Implementación: Carrusel Dinámico y Rotación de Artefactos por Ciclo (MainCarousel)

Este plan actualizado detalla la implementación basada en la **Opción B** confirmada por el usuario: rotación dinámica y aleatoria del producto de portada cada vez que una diapositiva de categoría vuelve a estar en foco o completa un ciclo en Embla Carousel, manteniendo un diseño visual depurado y minimalista **sin badges flotantes**.

---

### Decisiones Confirmadas por el Usuario

> [!NOTE]
> - **Modo de Rotación (Opción B Seleccionada):** Cada vez que el carrusel cambia de diapositiva o una categoría vuelve a entrar en pantalla, se selecciona dinámicamente un nuevo producto aleatorio disponible (`available: true`) de dicha categoría, sin necesidad de refrescar la página.
> - **Depuración Visual (Sin Badges Flotantes):** La tarjeta conserva una estética sobria y enfocada en la fotografía artística: se eliminan badges flotantes de precios y etiquetas superpuestas, manteniendo únicamente el degradado sutil y el título representativo de la categoría.

---

## 1. Visión General y Concepto Central

### ¿Qué soluciona esta implementación?
Actualmente, `MainCarousel` asigna una única imagen de portada de forma estática al momento de cargar la página (`useEffect(..., [])`). Con esta solución:
- Cada ciclo de visualización de categorías es único y sorprendente.
- Cada vez que una diapositiva (ej. *Minifiguras*, *Dibujos*, *Stickers*) entra en foco en el carrusel, su portada cambia aleatoriamente mostrando una pieza diferente de esa misma categoría.
- Todo ocurre de manera reactiva en el cliente, sin recargas de página y sin sobrecargar la interfaz con elementos gráficos invasivos.

---

## 2. Experiencia de Usuario y Diseño Visual (UX/UI)

### Flujo de Interacción
1. **Ciclo Automático de Categorías (Embla Carousel)**:
   - El carrusel avanza automáticamente entre categorías cada 5 segundos.
   - Cuando una categoría vuelve a aparecer en la rotación (o al avanzar a la siguiente diapositiva), el componente selecciona de forma reactiva una imagen de producto diferente perteneciente a esa categoría específica.
2. **Navegación Manual**:
   - Si el usuario navega manualmente con las flechas o gestos táctiles, las categorías presentan variedad de productos de su colección en cada pasada.
3. **Estética Minimalista (Sin Badges Flotantes)**:
   - Eliminación total de insignias o badges flotantes de precio/serie sobre la tarjeta.
   - Composición limpia: Fotografía a pantalla ancha (`aspect-video`), degradado inferior místico (`from-black/70 to-transparent`) y título tipográfico nítido de la categoría (`Belanosima`).
4. **Apertura de Galería Inmediata**:
   - Al hacer clic en la tarjeta de cualquier categoría, se abre la galería interactiva (`GalleryModal`) filtrada con todos los productos disponibles de esa categoría, priorizando el producto que estaba visible en pantalla.

---

## 3. Decisiones de Producto y Arquitectura de Estado

### Decisión 1: Sincronización con el Evento `select` de Embla Carousel
- **Enfoque Elegido**: Escuchar el evento de cambio de slide del API de Embla (`emblaApi.on('select', ...)` o cambio de diapositiva activa). Al cambiar de categoría, se actualiza el mapa de imágenes de portada seleccionando un nuevo artefacto aleatorio diferente al actual para la categoría que entra o sale de foco.
- **Por qué**: Garantiza que el cambio de imagen coincida de forma natural con el ritmo de navegación del carrusel, logrando que el usuario perciba variedad continua sin saltos bruscos mientras mira una diapositiva fija.
- **Alternativa Descartada**: Intervalos temporales desfasados dentro de la misma diapositiva (descartada al elegir la Opción B).

### Decisión 2: Transición Visual Suave (Crossfade)
- **Enfoque Elegido**: Aplicar una transición suave de opacidad al cambiar de imagen de producto para que el cambio de portada sea elegante y fluido.
- **Por qué**: Evita parpadeos en blanco o saltos visuales secos al reemplazar la URL de la imagen.

---

## 4. Arquitectura Técnica y Flujo de Componentes

```
┌────────────────────────────────────────────────────────┐
│                   src/app/page.tsx                     │
│      (Mantiene estado general y controladores modales)  │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│        MainCarousel (src/components/main-carousel.tsx) │
│                                                        │
│  ┌──────────────────────┐    ┌──────────────────────┐  │
│  │ Embla Carousel API   │───▶│ Slide Change Listener│  │
│  │ (Autoplay cada 5s)   │    │ (emblaApi.on('select)│  │
│  └──────────────────────┘    └──────────┬───────────┘  │
│                                         │              │
│                                         ▼              │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Actualización de Estado Reactivo                 │  │
│  │  - Selecciona aleatoriamente nuevo producto      │  │
│  │    en stock (available: true) por categoría      │  │
│  │  - Transición fluida de imagen                   │  │
│  └──────────────────────────────────────────────────┘  │
│                                         │              │
│                                         ▼              │
│  ┌──────────────────────────────────────────────────┐  │
│  │ CarouselItem (Tarjeta de Categoría Limpia)       │  │
│  │  - Next.js <Image fill /> con transición suave   │  │
│  │  - Degradado inferior estético                   │  │
│  │  - Título de la categoría (Sin badges flotantes) │  │
│  └──────────────────────────────────────────────────┘  │
└───────────────────────────┬────────────────────────────┘
                            │ onClick(categoryImages)
                            ▼
┌────────────────────────────────────────────────────────┐
│                    GalleryModal                        │
│   (Abre todos los productos de la categoría activa)     │
└────────────────────────────────────────────────────────┘
```

### Plan de Tareas de Implementación

1. **Agrupación Reactiva de Productos**:
   - Crear un mapa memoizado `categoryProductsMap` con todos los productos en stock (`available: true`) agrupados por categoría.
2. **Integración con Embla Carousel API**:
   - Obtener la instancia `emblaApi` mediante el callback `setApi` provisto por el componente `Carousel` de shadcn/ui.
   - Suscribir un manejador al evento `'select'` que aleatorice la portada de la categoría entrante, garantizando no repetir inmediatamente la misma imagen si hay más de una disponible.
3. **Diseño Visual Depurado**:
   - Limpiar el contenido de la tarjeta para retirar cualquier badge o píldora flotante.
   - Ajustar el título y degradado para máxima legibilidad y estética mística.
4. **Verificación y Pruebas**:
   - Probar la rotación continua durante múltiples vueltas del carrusel.
   - Verificar la navegación manual mediante flechas y gestos táctiles.
   - Confirmar que al hacer clic se abre la galería con los productos de la categoría correcta.
