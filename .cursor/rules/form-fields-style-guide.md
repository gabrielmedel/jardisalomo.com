# Jardi Salomo - Form Fields Style Guide

## Guía de Estilo para Campos de Formulario Frontend

Esta guía documenta los estándares de diseño visual para todos los campos de formulario en la aplicación Jardi Salomo. **Aplica únicamente a formularios frontend** (componentes en `src/blocks/Form/`), NO a componentes del admin de Payload.

## 🎨 Sistema de Diseño

### Colores

```typescript
// Fondo de sección (OPCIONAL - configurable desde el bloque)
bg-pastel          // #F6E7D9 - Beige claro (opcional)
// Otros fondos disponibles según configuración del bloque
// O sin fondo (bg-transparent)

// Fondos de campos
bg-white           // Fondo blanco para inputs, selects, textareas

// Bordes
border-accent/30   // Color tan/brown con 30% opacidad para estado normal
border-primary     // Verde oliva (#677548) para estado focus

// Texto
text-primary       // Verde oliva (#677548) para labels y texto de input
text-primary/40    // Verde oliva 40% opacidad para placeholders
text-destructive   // Rojo para mensajes de error
```

### Tipografía

```typescript
// Labels
font - sans // Roboto
font - normal // Peso normal (400)
text - sm // 14px
tracking - normal // Espaciado normal de letras

// Inputs/Selects/Textareas
font - sans // Roboto
font - light // Peso light (300)
text - base // 16px

// Títulos (Intro Content)
font - serif // Gambetta
// H2 como máximo heading

// Mensajes de error
font - sans // Roboto
font - light // Peso light (300)
text - sm // 14px
```

### Espaciado

```typescript
// Section wrapper
py-16              // Padding vertical de 64px

// Separación entre campos
space-y-6          // 24px entre cada campo

// Padding interno de inputs
px-4 py-3          // 16px horizontal, 12px vertical

// Margen del intro content
mb-12              // 48px de margen inferior

// Altura de inputs/selects
h-12               // 48px de altura fija
```

## 📐 Estructura del Formulario

### Section Wrapper

```tsx
<section className={cn('py-16', bgClassName)}>
  <div className="container mx-auto max-w-3xl">
    {/* Intro content */}
    {/* Form */}
  </div>y
</section>
```

**Características:**

- **Fondo opcional y configurable** - Puede ser `bg-pastel`, otro color configurable desde el bloque, o sin fondo
- Contenedor centrado con max-width de 3xl (768px)
- Padding vertical consistente de 16 (64px)
- El `bgClassName` se define según la configuración del bloque (igual que otros bloques del proyecto)

### Intro Content (Opcional)

```tsx
{
  enableIntro && introContent && !hasSubmitted && (
    <div className="mb-12 max-w-2xl mx-auto">
      <RichText className="block-richtext text-center" data={introContent} enableGutter={false} />
    </div>
  )
}
```

**Características:**

- Usa clase `.block-richtext` para estilo consistente con otros bloques
- **`text-center`** para centrar todo el contenido del RichText
- **`max-w-2xl mx-auto`** para limitar el ancho a 672px y centrar horizontalmente
- Margen inferior de 12 (48px)
- Solo se muestra antes de enviar el formulario
- Soporte para H2, H3, H4 (NO H1)

## 🔤 Campos de Formulario

### Labels

```tsx
<label
  htmlFor={name}
  className="block mb-2 text-sm font-sans font-normal text-primary tracking-normal"
>
  {label}
  {required && <span className="ml-1 text-destructive">*</span>}
</label>
```

**Características:**

- Display block
- Margen inferior de 2 (8px)
- Texto pequeño (14px)
- Roboto normal
- Color verde oliva
- Asterisco rojo para campos requeridos

### Text Input

```tsx
<input
  type="text"
  id={name}
  className="w-full h-12 px-4 py-3 bg-white border-2 border-accent/30 rounded-sm 
             text-base font-sans font-light text-primary 
             placeholder:text-primary/40 
             focus:border-primary focus:ring-0 focus:outline-none 
             transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  placeholder={placeholder}
  {...register(name, { required })}
/>
```

**Características:**

- Ancho completo (w-full)
- Altura fija de 48px (h-12)
- Padding generoso (16px horizontal, 12px vertical)
- Fondo blanco sobre fondo pastel
- Borde de 2px en color tan con 30% opacidad
- Bordes sutilmente redondeados (rounded-sm)
- Texto Roboto Light de 16px
- Placeholder en verde oliva 40% opacidad
- Focus cambia borde a verde oliva
- Sin ring en focus (focus:ring-0)
- Transición suave de colores
- Estados disabled con opacidad reducida

### Email Input

Idéntico a Text Input pero con `type="email"`.

### Number Input

```tsx
<input
  type="number"
  id={name}
  className="w-full h-12 px-4 py-3 bg-white border-2 border-accent/30 rounded-sm 
             text-base font-sans font-light text-primary 
             placeholder:text-primary/40 
             focus:border-primary focus:ring-0 focus:outline-none 
             transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  {...register(name, { required, valueAsNumber: true })}
/>
```

**Características:**

- Igual que Text Input
- `valueAsNumber: true` en register para convertir a número

### Select

```tsx
<select
  id={name}
  className="w-full h-12 px-4 py-3 bg-white border-2 border-accent/30 rounded-sm 
             text-base font-sans font-light text-primary 
             focus:border-primary focus:ring-0 focus:outline-none 
             transition-colors disabled:opacity-50 disabled:cursor-not-allowed 
             appearance-none cursor-pointer"
  {...register(name, { required })}
>
  <option value="" disabled>
    {placeholder || 'Selecciona una opción'}
  </option>
  {options?.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))}
</select>
```

**Características:**

- Mismo estilo que inputs
- `appearance-none` para eliminar flecha por defecto
- `cursor-pointer` para indicar interactividad
- Primera opción deshabilitada como placeholder

### Textarea

```tsx
<textarea
  id={name}
  rows={rows || 4}
  className="w-full px-4 py-3 bg-white border-2 border-accent/30 rounded-sm 
             text-base font-sans font-light text-primary 
             placeholder:text-primary/40 
             focus:border-primary focus:ring-0 focus:outline-none 
             transition-colors disabled:opacity-50 disabled:cursor-not-allowed 
             resize-none"
  placeholder={placeholder}
  {...register(name, { required })}
/>
```

**Características:**

- Mismo estilo que inputs pero sin altura fija
- Número de filas configurable (default: 4)
- `resize-none` para evitar distorsión del layout
- Sin altura fija (h-12) para permitir múltiples líneas

### Checkbox

```tsx
<div
  className="flex items-start gap-3 p-4 bg-white border-2 border-accent/30 rounded-sm 
                hover:border-primary transition-colors"
>
  <Checkbox
    id={name}
    checked={field.value}
    onCheckedChange={field.onChange}
    className="mt-1 border-2 border-accent 
               data-[state=checked]:bg-primary data-[state=checked]:border-primary 
               focus:ring-0 focus-visible:ring-2 focus-visible:ring-primary 
               focus-visible:ring-offset-2 transition-colors"
  />
  <div className="flex-1">
    <label
      htmlFor={name}
      className="block text-sm font-sans font-normal text-primary leading-relaxed cursor-pointer"
    >
      {label}
      {required && <span className="ml-1 text-destructive">*</span>}
    </label>
  </div>
</div>
```

**Características:**

- Contenedor con fondo blanco y borde (como un campo más)
- Hover cambia el borde a verde oliva
- Checkbox con borde tan por defecto
- Checked state cambia a fondo y borde verde oliva
- Focus visible con ring verde oliva
- Label clickeable con cursor pointer
- Layout flexible para texto multilínea
- Margen superior en checkbox para alineación visual

## 🔴 Mensajes de Error

### Error Component

```tsx
<p className="mt-2 text-destructive text-sm font-sans font-light">
  {message || 'Aquest camp és obligatori'}
</p>
```

**Características:**

- Margen superior de 2 (8px)
- Color rojo (text-destructive)
- Texto pequeño (14px)
- Roboto Light
- Mensaje predeterminado en catalán

### Error de Formulario (Submit)

```tsx
{
  error && (
    <div className="p-4 mb-6 bg-destructive/10 border-2 border-destructive/20 rounded-sm">
      <p className="text-destructive text-sm font-sans font-normal text-center">
        {error.status && `Error ${error.status}: `}
        {error.message}
      </p>
    </div>
  )
}
```

**Características:**

- Fondo rojo translúcido (10% opacidad)
- Borde rojo con 20% opacidad
- Padding generoso
- Margen inferior antes del form
- Texto centrado
- Muestra código de status si está disponible

## ✅ Mensaje de Éxito

```tsx
{
  !isLoading && hasSubmitted && confirmationType === 'message' && (
    <div className="p-8 bg-white rounded-sm max-w-2xl mx-auto">
      <RichText className="block-richtext text-center" data={confirmationMessage} />
    </div>
  )
}
```

**Características:**

- Fondo blanco (contrasta con cualquier fondo de sección)
- Padding generoso (32px)
- Bordes sutilmente redondeados
- **`text-center`** para centrar todo el contenido del RichText
- **`max-w-2xl mx-auto`** para limitar el ancho a 672px y centrar horizontalmente
- Usa RichText para permitir formato HTML

## ⏳ Estado de Carga

```tsx
{
  isLoading && !hasSubmitted && (
    <div className="py-8">
      <p className="text-center text-base font-sans font-light text-primary">
        Processant la teva sol·licitud...
      </p>
    </div>
  )
}
```

**Características:**

- Padding vertical
- Texto centrado
- Mensaje en catalán
- Roboto Light
- Color verde oliva

## 🔘 Botón de Submit

```tsx
<div className="flex justify-center mt-6">
  <Button form={formID} type="submit" variant="default" size="lg" disabled={isLoading}>
    {submitButtonLabel || 'Enviar'}
  </Button>
</div>
```

**Características:**

- Centrado con flex
- Variante `default` (verde oliva, redondeado completo)
- Tamaño `lg` para mejor visibilidad
- Deshabilitado durante carga
- Texto personalizable desde el form config

## 📱 Responsive

Todos los campos y contenedores usan clases responsive heredadas del sistema:

```typescript
// Container con breakpoints automáticos
container mx-auto

// Max-width responsive
max-w-3xl  // 768px en desktop, fluido en mobile

// Typography responsive
text-sm    // Escala automáticamente
text-base  // Escala automáticamente
```

## 🎯 Accesibilidad

Todos los campos implementan:

```tsx
// Asociación label-input
<label htmlFor={name}>{label}</label>
<input id={name} {...props} />

// Estados requeridos visibles
{required && <span className="ml-1 text-destructive">*</span>}

// Estados focus visibles
focus:border-primary
focus-visible:ring-2 focus-visible:ring-primary

// Estados disabled visibles
disabled:opacity-50 disabled:cursor-not-allowed

// Mensajes de error descriptivos
{errors[name] && <Error message={errors[name].message} />}

// Placeholders descriptivos
placeholder="Introduce tu nombre completo"
```

## 📝 Ejemplo Completo

```tsx
'use client'
import { useForm, Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Error } from './Error'

export const FormBlock = ({ form, enableIntro, introContent }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm()
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const onSubmit = async (data) => {
    setIsLoading(true)
    setError(null)

    try {
      // Submit logic
      setHasSubmitted(true)
    } catch (err) {
      setError({ message: err.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className={cn('py-16', bgClassName)}>
      <div className="container mx-auto max-w-3xl">
        {/* Intro */}
        {enableIntro && introContent && !hasSubmitted && (
          <div className="mb-12 max-w-2xl mx-auto">
            <RichText className="block-richtext text-center" data={introContent} enableGutter={false} />
          </div>
        )}

        {/* Form container */}
        <div className="bg-transparent">
          {/* Success message */}
          {!isLoading && hasSubmitted && (
            <div className="p-8 bg-white rounded-sm max-w-2xl mx-auto">
              <RichText className="block-richtext text-center" data={form.confirmationMessage} />
            </div>
          )}

          {/* Loading */}
          {isLoading && !hasSubmitted && (
            <div className="py-8">
              <p className="text-center text-base font-sans font-light text-primary">
                Processant la teva sol·licitud...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-4 mb-6 bg-destructive/10 border-2 border-destructive/20 rounded-sm">
              <p className="text-destructive text-sm font-sans font-normal text-center">
                {error.message}
              </p>
            </div>
          )}

          {/* Form */}
          {!hasSubmitted && (
            <form id={form.id} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Text field */}
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-sans font-normal text-primary tracking-normal"
                >
                  Nombre completo
                  <span className="ml-1 text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full h-12 px-4 py-3 bg-white border-2 border-accent/30 rounded-sm 
                             text-base font-sans font-light text-primary 
                             placeholder:text-primary/40 
                             focus:border-primary focus:ring-0 focus:outline-none 
                             transition-colors"
                  placeholder="Introduce tu nombre"
                  {...register('name', { required: true })}
                />
                {errors.name && <Error message="Aquest camp és obligatori" />}
              </div>

              {/* Checkbox */}
              <div>
                <Controller
                  name="privacy"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <div
                      className="flex items-start gap-3 p-4 bg-white border-2 border-accent/30 rounded-sm 
                                    hover:border-primary transition-colors"
                    >
                      <Checkbox
                        id="privacy"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1 border-2 border-accent 
                                   data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <label
                        htmlFor="privacy"
                        className="block text-sm font-sans font-normal text-primary 
                                                           leading-relaxed cursor-pointer flex-1"
                      >
                        Acepto la política de privacidad
                        <span className="ml-1 text-destructive">*</span>
                      </label>
                    </div>
                  )}
                />
                {errors.privacy && <Error message="Debes aceptar la política de privacidad" />}
              </div>

              {/* Submit button */}
              <div className="flex justify-center mt-6">
                <Button type="submit" variant="default" size="lg" disabled={isLoading}>
                  Enviar
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
```

## ⚠️ Importante

1. **NO usar Tailwind CSS en admin UI de Payload** - Esta guía es solo para frontend
2. **Fondo configurable** - El fondo de la sección es opcional y se configura igual que en otros bloques (puede ser `bg-pastel`, otro color, o sin fondo)
3. **Mantener consistencia** - Todos los campos deben seguir el mismo patrón visual
4. **Usar clases del sistema de diseño** - No crear colores/espaciados custom
5. **Validación en catalán** - Mensajes predeterminados en el idioma del proyecto
6. **Transiciones suaves** - Siempre incluir `transition-colors` en elementos interactivos
7. **Focus visible** - Crítico para accesibilidad
8. **Estados disabled claros** - Opacidad reducida y cursor not-allowed

## 🔗 Referencias

- Componentes de formulario: `src/blocks/Form/`
- Configuración del bloque: `src/blocks/Form/config.ts`
- Componente principal: `src/blocks/Form/Component.tsx`
- Sistema de colores: `tailwind.config.js`
- Tipografías: `app/globals.css`
