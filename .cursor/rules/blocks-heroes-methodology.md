# Metodología para Heroes, Blocks y Fields

Esta guía documenta la metodología estándar para crear y organizar Heroes, Blocks y Fields en este proyecto de Payload CMS.

## Estructura General

```
src/
├── blocks/
│   ├── RenderBlocks.tsx         # Componente que renderiza todos los blocks
│   ├── BlockName/
│   │   ├── Component.tsx        # Componente React del block
│   │   └── config.ts           # Configuración de Payload del block
│   └── ...
├── heros/
│   ├── RenderHero.tsx          # Componente que renderiza los heroes
│   ├── config.ts               # Configuración compartida de heroes
│   ├── HeroType/
│   │   └── index.tsx           # Componente React del hero
│   └── ...
└── fields/
    ├── fieldName.ts            # Field reutilizable
    └── ...
```

---

## 1. BLOCKS

Los blocks son componentes modulares que se pueden agregar a layouts de páginas.

### Paso 1: Crear la configuración (`config.ts`)

Ubicación: `src/blocks/BlockName/config.ts`

```typescript
import type { Block } from 'payload'

export const BlockName: Block = {
  slug: 'blockSlug',                    // Identificador único (camelCase)
  interfaceName: 'BlockNameBlock',      // Nombre del tipo TypeScript
  fields: [
    // Array de fields
    {
      name: 'title',
      type: 'text',
      localized: true,                  // Para soporte multiidioma
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      maxRows: 3,                       // Limitar cantidad de items
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'heading',
          type: 'text',
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
      ],
    },
  ],
  labels: {
    singular: 'Block Name',
    plural: 'Block Names',
  },
}
```

**Convenciones importantes:**
- `slug`: camelCase, descriptivo y único
- `interfaceName`: PascalCase + "Block" al final
- `localized: true`: para campos que necesitan traducción
- Usar `maxRows` en arrays para limitar contenido

### Paso 2: Crear el componente React (`Component.tsx`)

Ubicación: `src/blocks/BlockName/Component.tsx`

```typescript
import React from 'react'
import type { BlockNameBlock as BlockProps } from '@/payload-types'

export const BlockName: React.FC<BlockProps & { locale?: string }> = ({
  title,
  items,
  locale,
}) => {
  return (
    <div className="container my-16">
      <h2>{title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items?.map((item, index) => (
          <div key={index} className="text-center">
            {/* Contenido del item */}
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Patrones importantes:**
- Importar tipos desde `@/payload-types` (auto-generados)
- Extender props con `& { locale?: string }`
- Usar clases de Tailwind para frontend
- Estructura responsive: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

### Paso 3: Registrar el block en `RenderBlocks.tsx`

```typescript
// 1. Importar el componente
import { BlockName } from '@/blocks/BlockName/Component'

// 2. Agregar al objeto blockComponents
const blockComponents = {
  content: ContentBlock,
  cta: CallToActionBlock,
  blockSlug: BlockName,  // Usar el slug del config
}
```

### Paso 4: Exportar la configuración

Crear o actualizar `src/blocks/index.ts`:

```typescript
export { BlockName } from './BlockName/config'
```

### Paso 5: Registrar en colecciones

En `src/collections/Pages/index.ts` (o donde uses blocks):

```typescript
import { BlockName } from '@/blocks/BlockName/config'

export const Pages: CollectionConfig = {
  fields: [
    {
      name: 'layout',
      type: 'blocks',
      blocks: [
        Content,
        CallToAction,
        BlockName,  // Agregar aquí
      ],
    },
  ],
}
```

---

## 2. HEROES

Los heroes son secciones destacadas al inicio de páginas. Se configuran centralizadamente.

### Estructura de Heroes

Los heroes tienen una configuración unificada en `src/heros/config.ts` que define:
- Los tipos de hero disponibles
- Los campos compartidos entre todos
- Los campos condicionales por tipo

### Configuración centralizada (`config.ts`)

Ubicación: `src/heros/config.ts`

```typescript
import type { Field } from 'payload'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      options: [
        { label: 'None', value: 'none' },
        { label: 'High Impact', value: 'highImpact' },
        { label: 'Medium Impact', value: 'mediumImpact' },
        { label: 'Low Impact', value: 'lowImpact' },
      ],
      required: true,
    },
    // Campos compartidos
    {
      name: 'richText',
      type: 'richText',
      localized: true,
    },
    // Campos condicionales
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
    },
  ],
}
```

**Patrones importantes:**
- Tipo `group` para agrupar campos relacionados
- Campo `type` con select para elegir el hero
- `admin.condition` para campos condicionales según tipo

### Crear componente de Hero

Ubicación: `src/heros/HeroType/index.tsx`

```typescript
import React from 'react'
import type { Page } from '@/payload-types'

export const HeroType: React.FC<Page['hero'] & { locale?: string }> = ({
  richText,
  media,
  links,
  locale,
}) => {
  return (
    <div className="container">
      {/* Contenido del hero */}
    </div>
  )
}
```

**Convenciones:**
- Props: `Page['hero'] & { locale?: string }`
- Nombre del archivo: `index.tsx` (para importación limpia)

### Registrar en `RenderHero.tsx`

```typescript
// 1. Importar
import { HeroType } from '@/heros/HeroType'

// 2. Agregar al objeto heroes
const heroes = {
  highImpact: HighImpactHero,
  mediumImpact: MediumImpactHero,
  lowImpact: LowImpactHero,
  heroType: HeroType,  // Usar el value del select
}
```

### Uso en colecciones

```typescript
import { hero } from '@/heros/config'

export const Pages: CollectionConfig = {
  fields: [
    hero,  // Agregar el field group completo
    // ... otros fields
  ],
}
```

---

## 3. FIELDS

Fields reutilizables que se usan en múltiples lugares.

### Crear un field reutilizable

Ubicación: `src/fields/fieldName.ts`

```typescript
import type { Field } from 'payload'

export const fieldName = (overrides?: Partial<Field>): Field => ({
  name: 'fieldName',
  type: 'text',
  localized: true,
  required: true,
  ...overrides,
})
```

**Patrones importantes:**
- Función que retorna un Field
- Acepta `overrides` para personalización
- Spread `...overrides` al final

### Field con nested fields

```typescript
import type { Field } from 'payload'

interface FieldOptions {
  appearances?: string[]
  overrides?: Record<string, unknown>
}

export const linkGroup = ({ 
  appearances = ['default', 'outline'],
  overrides = {},
}: FieldOptions = {}): Field => ({
  name: 'links',
  type: 'array',
  fields: [
    {
      name: 'link',
      type: 'group',
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Internal', value: 'internal' },
            { label: 'External', value: 'external' },
          ],
        },
        {
          name: 'label',
          type: 'text',
          localized: true,
        },
        {
          name: 'appearance',
          type: 'select',
          options: appearances.map(a => ({ label: a, value: a })),
        },
      ],
    },
  ],
  ...overrides,
})
```

**Convenciones:**
- Interface para opciones tipadas
- Valores por defecto
- Opciones configurables (como `appearances`)

### Uso de fields reutilizables

```typescript
import { linkGroup } from '@/fields/linkGroup'
import { slugField } from '@/fields/slug'

export const Pages: CollectionConfig = {
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    slugField({ fieldToUse: 'title' }),  // Field con opciones
    linkGroup({
      appearances: ['primary', 'secondary'],
      overrides: { maxRows: 2 },
    }),
  ],
}
```

---

## 4. RESPONSIVE DESIGN

### Patrones de Grid

```tsx
// 1 columna móvil, 2 tablet, 3 desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

// 1 columna móvil, 3 desktop
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

// Grid flexible con auto-fit
<div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
```

### Patrones de Flexbox

```tsx
// Stack vertical en móvil, horizontal en desktop
<div className="flex flex-col md:flex-row gap-4">

// Centrado
<div className="flex items-center justify-center">

// Wrap automático
<div className="flex flex-wrap gap-4">
```

### Espaciado responsive

```tsx
// Padding responsive
<div className="p-4 md:p-8 lg:p-12">

// Margen responsive
<div className="my-8 md:my-12 lg:my-16">

// Gap responsive
<div className="grid gap-4 md:gap-6 lg:gap-8">
```

---

## 5. FLUJO DE TRABAJO COMPLETO

### Para crear un nuevo Block:

1. ✅ Crear carpeta: `src/blocks/BlockName/`
2. ✅ Crear `config.ts` con configuración de Payload
3. ✅ Crear `Component.tsx` con componente React
4. ✅ Registrar en `RenderBlocks.tsx`
5. ✅ Exportar en `src/blocks/index.ts`
6. ✅ Agregar al array de blocks en colecciones
7. ✅ Correr `pnpm generate:types` para regenerar tipos
8. ✅ Verificar con `tsc --noEmit`

### Para crear un nuevo Hero:

1. ✅ Agregar tipo en `src/heros/config.ts` (campo select)
2. ✅ Agregar campos condicionales si es necesario
3. ✅ Crear carpeta: `src/heros/HeroType/`
4. ✅ Crear `index.tsx` con componente React
5. ✅ Registrar en `RenderHero.tsx`
6. ✅ Correr `pnpm generate:types`
7. ✅ Verificar con `tsc --noEmit`

### Para crear un Field reutilizable:

1. ✅ Crear `src/fields/fieldName.ts`
2. ✅ Definir función que retorna Field con overrides
3. ✅ Usar en configs de collections/blocks/heroes

---

## 6. PATRÓN DE CONTENIDO TEXTUAL (PreTitle + RichText + CTAs)

Este proyecto sigue un patrón consistente para estructurar el contenido textual en bloques y heroes. Este patrón permite flexibilidad editorial mientras mantiene una jerarquía visual consistente.

### Estructura del Patrón

```
┌─────────────────────────────────────┐
│  preTitle (opcional)                │  ← Texto pequeño, uppercase, tracking amplio
├─────────────────────────────────────┤
│  richText                           │  ← Título principal (h1/h2) + párrafo opcional
│    - Heading (h1, h2, h3)           │
│    - Paragraph                      │
├─────────────────────────────────────┤
│  links / CTAs (opcional)            │  ← Array de botones/enlaces
└─────────────────────────────────────┘
```

### Campos en Configuración

```typescript
// Patrón estándar para config.ts de blocks/heroes
{
  name: 'preTitle',
  type: 'text',
  localized: true,
  label: 'Pre-título',
},
{
  name: 'richText',
  type: 'richText',
  localized: true,
  editor: lexicalEditor({
    features: ({ rootFeatures }) => {
      return [
        ...rootFeatures,
        HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }), // h1 solo para heroes
        FixedToolbarFeature(),
        InlineToolbarFeature(),
      ]
    },
  }),
  label: 'Contenido',
},
linkGroup({
  overrides: {
    maxRows: 2,  // Limitar número de CTAs
  },
}),
```

### Renderizado en Componentes

```tsx
// Patrón estándar para Component.tsx

// 1. PreTitle - usa clase CSS según contexto
{preTitle && <p className="pretitle">{preTitle}</p>}
// Variante para fondos oscuros:
{preTitle && <p className="pretitle--secondary">{preTitle}</p>}

// 2. RichText - usa wrapper class para aplicar estilos
{richText && (
  <RichText
    className="block-richtext"  // o "hero-richtext" para heroes
    data={richText}
    enableGutter={false}
    enableProse={false}
  />
)}

// 3. CTAs/Links
{Array.isArray(links) && links.length > 0 && (
  <div className="flex gap-4 flex-wrap">
    {links.map(({ link }, i) => (
      <CMSLink key={i} {...link} locale={locale} />
    ))}
  </div>
)}
```

### Clases CSS Disponibles

#### PreTitle

| Clase | Uso | Estilos |
|-------|-----|---------|
| `.pretitle` | Fondos claros | `uppercase text-sm md:text-base tracking-[0.3em] mb-3 text-accent font-medium` |
| `.pretitle--secondary` | Fondos oscuros | `uppercase text-sm md:text-base tracking-[0.3em] mb-3 text-secondary font-light` |
| `.hero-pretitle` | Heroes (adicional) | Agrega `padding-left: var(--optical-subtitle-indent)` |

#### RichText Wrappers

| Clase | Contexto | Comportamiento |
|-------|----------|----------------|
| `.hero-richtext` | Heroes | h1 → `.hero-title`, p → `.roboto-subtitle--hero`, alineado izquierda |
| `.block-richtext` | Blocks | h2 → `.block-title`, p centrado, `max-w-3xl` en headings |

#### Estilos de Tipografía Base

```css
/* Títulos Gambetta */
.gambetta-title {
  font-family: var(--font-serif);  /* Gambetta */
  font-weight: 450;
  letter-spacing: 0.07em;
  line-height: tight;
}

.gambetta-title--hero {
  font-size: clamp(2.25rem, 5vw, 3.75rem);  /* text-4xl → text-6xl */
  margin-bottom: var(--space-hero-text);     /* 16px */
}

.gambetta-title--block {
  font-size: clamp(1.75rem, 3vw, 2.8rem);   /* ~0.75x del hero */
  margin-bottom: var(--space-hero-text);
}

/* Párrafos Roboto */
.body-paragraph / .roboto-subtitle {
  font-family: var(--font-sans);  /* Roboto */
  font-weight: 300;               /* Light */
  font-size: 20px;
  line-height: 1.332;
}
```

### Variables CSS de Espaciado

```css
:root {
  --space-hero-text: 16px;        /* Espacio entre título y párrafo */
  --space-hero-cta: 32px;         /* Espacio antes de CTAs */
  --optical-subtitle-indent: clamp(3px, 0.3vw, 8px);  /* Ajuste óptico para alinear */
}
```

### Ejemplos de Implementación

#### Hero (HighImpact)

```tsx
// src/heros/HighImpact/index.tsx
<div className="w-full max-w-5xl text-left pt-20">
  {preTitle && (
    <p className="pretitle hero-pretitle">{preTitle}</p>
  )}
  {richText && (
    <RichText
      className="hero-richtext mb-[var(--space-hero-cta)]"
      data={richText}
      enableGutter={false}
      enableProse={false}
    />
  )}
  {Array.isArray(links) && links.length > 0 && (
    <div className="flex gap-4 flex-wrap">
      {links.map(({ link }, i) => (
        <CMSLink key={i} {...link} locale={locale} />
      ))}
    </div>
  )}
</div>
```

#### Block Centrado (CenteredWithMedia)

```tsx
// src/blocks/CenteredWithMedia/Component.tsx
<div className="w-full max-w-5xl text-center py-16">
  {preTitle && <p className="pretitle--secondary">{preTitle}</p>}
  {richText && (
    <RichText
      className="block-richtext text-center mb-[var(--space-hero-cta)]"
      data={richText}
      enableGutter={false}
      enableProse={false}
    />
  )}
  {Array.isArray(links) && links.length > 0 && (
    <div className="flex gap-4 flex-wrap justify-center">
      {links.map(({ link }, i) => (
        <CMSLink key={i} {...link} locale={locale} />
      ))}
    </div>
  )}
</div>
```

#### Block con Header (CarouselSlider)

```tsx
// src/blocks/CarouselSlider/Component.tsx
<div className="carousel-slider-header mb-12">
  {preTitle && <p className="pretitle">{preTitle}</p>}
  {richText && (
    <RichText
      className="block-richtext"
      data={richText}
      enableGutter={false}
      enableProse={false}
    />
  )}
</div>
```

### Diferencias entre Hero y Block

| Aspecto | Hero | Block |
|---------|------|-------|
| Heading principal | `h1` | `h2` |
| Tamaño título | `text-4xl → text-6xl` | `text-[28px] → text-[45px]` |
| Alineación típica | Izquierda | Centro |
| Clase wrapper | `.hero-richtext` | `.block-richtext` |
| Clase pretitle | `.pretitle.hero-pretitle` | `.pretitle` o `.pretitle--secondary` |
| Ancho máximo | `max-w-5xl` | `max-w-3xl` (headings) |

### Ajuste Óptico

El patrón incluye un ajuste óptico entre títulos Gambetta y párrafos Roboto:

```css
/* Hero: ajusta párrafo después de heading */
.hero-richtext h1 + p,
.hero-richtext h2 + p {
  padding-left: var(--optical-subtitle-indent);
}

/* Blocks centrados: sin ajuste (centrado natural) */
.block-richtext h2,
.block-richtext p {
  padding-left: 0 !important;
}
```

### Headings Permitidos por Contexto

| Contexto | Headings Disponibles | Razón |
|----------|---------------------|-------|
| Heroes | `h1, h2, h3, h4` | `h1` es el título principal de página |
| Blocks | `h2, h3, h4` | `h2` es el máximo nivel dentro de página |

### Checklist para Nuevos Bloques

Cuando crees un nuevo block con este patrón:

1. ✅ Agregar campo `preTitle` (text, localized)
2. ✅ Agregar campo `richText` con lexicalEditor y HeadingSizes apropiados
3. ✅ Usar `linkGroup()` para CTAs (con maxRows si aplica)
4. ✅ En Component: usar clase `.pretitle` o `.pretitle--secondary`
5. ✅ En Component: usar `.block-richtext` como wrapper del RichText
6. ✅ En Component: espaciado con `mb-[var(--space-hero-cta)]` antes de CTAs
7. ✅ Pasar `locale` a `CMSLink` para enlaces internos

---

## 7. VALIDACIÓN Y TESTING

### Validar TypeScript

```bash
# Validar sin emitir archivos
pnpm tsc --noEmit

# Regenerar tipos después de cambios en config
pnpm generate:types
```

### Regenerar Import Map

Después de crear o modificar componentes:

```bash
pnpm generate:importmap
```

---

## 8. CONVENCIONES DE CÓDIGO

### Nombres de archivos

- **Componentes React**: `Component.tsx` o `index.tsx`
- **Configs de Payload**: `config.ts`
- **Fields reutilizables**: `fieldName.ts` (camelCase)

### Nombres de exportaciones

- **Blocks**: PascalCase + Block (ej: `CallToActionBlock`)
- **Heroes**: PascalCase + Hero (ej: `HighImpactHero`)
- **Fields**: camelCase (ej: `linkGroup`, `slugField`)

### Imports

```typescript
// Tipos generados
import type { Page, Media } from '@/payload-types'

// Componentes de Payload
import type { Block, Field, CollectionConfig } from 'payload'

// UI de Payload (solo admin)
import { Button } from '@payloadcms/ui'

// Componentes locales
import { CMSLink } from '@/components/Link'
```

### Localización

Siempre agregar `localized: true` a campos de contenido:

```typescript
{
  name: 'title',
  type: 'text',
  localized: true,  // ✅ Permitir traducción
}

{
  name: 'slug',
  type: 'text',
  localized: false,  // ❌ No traducir slugs
}
```

---

## 9. ESTILOS

### Frontend (Blocks y Heroes)

- ✅ Usar Tailwind CSS
- ✅ Usar clases utilitarias
- ✅ Preferir clases responsive de Tailwind

```tsx
<div className="container mx-auto px-4">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* contenido */}
  </div>
</div>
```

### Admin UI (Payload components)

- ❌ NO usar Tailwind CSS
- ✅ Usar CSS/SCSS modules
- ✅ Usar variables CSS de Payload

```scss
.my-component {
  background-color: var(--theme-elevation-500);
  color: var(--theme-text);
  padding: var(--base);
}
```

---

## 10. PATRONES COMUNES

### Array con máximo de items

```typescript
{
  name: 'features',
  type: 'array',
  maxRows: 3,  // Limitar a 3 items
  fields: [
    // ... campos del array
  ],
}
```

### Campo condicional

```typescript
{
  name: 'description',
  type: 'textarea',
  admin: {
    condition: (data, siblingData) => siblingData?.showDescription === true,
  },
}
```

### Upload con validación

```typescript
{
  name: 'icon',
  type: 'upload',
  relationTo: 'media',
  required: true,
  filterOptions: {
    mimeType: { contains: 'image' },  // Solo imágenes
  },
}
```

### Rich text con features limitadas

```typescript
{
  name: 'content',
  type: 'richText',
  localized: true,
  editor: lexicalEditor({
    features: ({ rootFeatures }) => [
      ...rootFeatures,
      HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
      FixedToolbarFeature(),
    ],
  }),
}
```

---

## 11. TROUBLESHOOTING

### Tipos no actualizados

```bash
pnpm generate:types
```

### Componente no aparece en admin

```bash
pnpm generate:importmap
```

### Error de TypeScript

```bash
# Ver todos los errores
pnpm tsc --noEmit

# Limpiar y rebuildar
rm -rf .next
pnpm build
```

### Block no se renderiza

1. Verificar que esté en `blockComponents` en `RenderBlocks.tsx`
2. Verificar que el `slug` coincida
3. Verificar que esté agregado al array `blocks` en la colección

---

## Recursos

- Payload Docs: https://payloadcms.com/docs
- Tailwind Docs: https://tailwindcss.com/docs
- Proyecto AGENTS.md: Reglas específicas de Payload CMS
