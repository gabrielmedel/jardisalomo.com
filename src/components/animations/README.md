# Componentes de Animación con Scroll

Componentes reutilizables para animaciones de parallax y reveal usando Motion.

## ParallaxWrapper

Crea efectos de parallax (movimiento a diferentes velocidades al hacer scroll).

### Uso básico

```tsx
import { ParallaxWrapper } from '@/components/animations'

<ParallaxWrapper speed={0.5}>
  <img src="/image.jpg" alt="Parallax" />
</ParallaxWrapper>
```

### Props

- `speed`: Velocidad del parallax (default: 0.5)
  - Valores negativos: movimiento más lento que el scroll
  - Valores positivos: movimiento más rápido que el scroll
- `direction`: Dirección del movimiento: `'up' | 'down' | 'left' | 'right'` (default: 'up')
- `className`: Clases CSS adicionales

### Ejemplos

```tsx
// Parallax lento hacia arriba
<ParallaxWrapper speed={0.3} direction="up">
  <div>Contenido</div>
</ParallaxWrapper>

// Parallax rápido hacia la derecha
<ParallaxWrapper speed={1.5} direction="right">
  <img src="/bg.jpg" />
</ParallaxWrapper>

// Múltiples capas con diferentes velocidades
<section className="relative">
  <ParallaxWrapper speed={0.2}>
    <div className="background-layer">Fondo</div>
  </ParallaxWrapper>
  <ParallaxWrapper speed={0.5}>
    <div className="mid-layer">Medio</div>
  </ParallaxWrapper>
  <ParallaxWrapper speed={0.8}>
    <div className="front-layer">Frente</div>
  </ParallaxWrapper>
</section>
```

## ScrollReveal

Revela elementos cuando aparecen en el viewport.

### Uso básico

```tsx
import { ScrollReveal } from '@/components/animations'

<ScrollReveal animation="slideUp">
  <h1>Título que aparece al hacer scroll</h1>
</ScrollReveal>
```

### Props

- `animation`: Tipo de animación (default: 'fade')
  - `'fade'`: Solo opacidad
  - `'slideUp'`: Desliza desde abajo
  - `'slideDown'`: Desliza desde arriba
  - `'slideLeft'`: Desliza desde la derecha
  - `'slideRight'`: Desliza desde la izquierda
  - `'scale'`: Escala desde pequeño
  - `'blur'`: Desenfocar gradualmente
- `delay`: Delay antes de animar (segundos)
- `duration`: Duración de la animación (segundos)
- `threshold`: Cuándo activar (0-1, donde 0.5 = 50% visible)
- `className`: Clases CSS adicionales

### Ejemplos

```tsx
// Fade simple
<ScrollReveal animation="fade">
  <p>Aparece gradualmente</p>
</ScrollReveal>

// Slide up con delay
<ScrollReveal animation="slideUp" delay={0.2} duration={0.8}>
  <h2>Título con delay</h2>
</ScrollReveal>

// Scale con threshold personalizado
<ScrollReveal animation="scale" threshold={0.5}>
  <img src="/logo.png" />
</ScrollReveal>

// Blur effect
<ScrollReveal animation="blur">
  <div className="card">Contenido con blur</div>
</ScrollReveal>
```

## StaggerReveal

Revela múltiples elementos en secuencia (uno tras otro).

### Uso básico

```tsx
import { StaggerReveal } from '@/components/animations'

<StaggerReveal>
  <div>Elemento 1</div>
  <div>Elemento 2</div>
  <div>Elemento 3</div>
</StaggerReveal>
```

### Props

- `staggerDelay`: Delay entre cada elemento (segundos, default: 0.1)
- `animation`: Tipo de animación (igual que ScrollReveal)
- `className`: Clases CSS adicionales

### Ejemplos

```tsx
// Lista con stagger
<StaggerReveal animation="slideUp" staggerDelay={0.15}>
  {items.map(item => (
    <div key={item.id}>{item.title}</div>
  ))}
</StaggerReveal>

// Cards con fade stagger
<StaggerReveal animation="fade" staggerDelay={0.1} className="grid grid-cols-3 gap-4">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</StaggerReveal>
```

## Ejemplos Combinados

```tsx
// Parallax background + reveal content
<section className="relative min-h-screen">
  <ParallaxWrapper speed={0.3} className="absolute inset-0">
    <img src="/bg.jpg" className="w-full h-full object-cover" />
  </ParallaxWrapper>
  
  <div className="relative z-10 container mx-auto">
    <ScrollReveal animation="slideUp">
      <h1>Título principal</h1>
    </ScrollReveal>
    
    <StaggerReveal animation="slideUp" staggerDelay={0.2}>
      <p>Párrafo 1</p>
      <p>Párrafo 2</p>
      <p>Párrafo 3</p>
    </StaggerReveal>
  </div>
</section>

// Hero section con múltiples efectos
<section>
  <ParallaxWrapper speed={0.5}>
    <ScrollReveal animation="scale">
      <img src="/hero.jpg" />
    </ScrollReveal>
  </ParallaxWrapper>
  
  <ScrollReveal animation="slideUp" delay={0.3}>
    <h2>Subtítulo</h2>
  </ScrollReveal>
</section>
```

## Performance Tips

1. Usa `will-change` en CSS para elementos con parallax intenso
2. Evita parallax en móviles si es muy complejo
3. Los componentes ya usan GPU acceleration automáticamente
4. `ScrollReveal` usa `viewport={{ once: true }}` para animar solo una vez
