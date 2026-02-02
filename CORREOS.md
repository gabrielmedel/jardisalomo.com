# Configuración de Correos Electrónicos

## Variables de Entorno

Actualiza las siguientes variables en tu archivo `.env` con tus credenciales reales:

```env
# Email SMTP Configuration
SMTP_HOST=mail.privateemail.com
SMTP_PORT=587
SMTP_USER=tu-correo@eljardisalomo.com
SMTP_PASS=tu-contraseña
SMTP_FROM_NAME=El Jardí Salomó
SMTP_FROM_EMAIL=tu-correo@eljardisalomo.com
# Set to 'true' to send real emails (production), 'false' to only log to console (development)
SMTP_SEND_EMAILS=false
```

### Variable SMTP_SEND_EMAILS

Esta variable controla si los correos se envían realmente o solo se registran en la consola:

- **`false`** (desarrollo): Los correos NO se envían, solo se muestran en la consola del servidor
- **`true`** (producción): Los correos se envían realmente a través del servidor SMTP

**Recomendación:** Mantén `SMTP_SEND_EMAILS=false` en desarrollo para evitar enviar correos de prueba accidentalmente.

### Puertos SMTP

- **Puerto 587**: TLS/STARTTLS (recomendado)
- **Puerto 465**: SSL
- **Puerto 25**: Sin cifrado (no recomendado)

## Enviar Correos desde Hooks

### Ejemplo: Enviar correo después de crear un documento

```typescript
import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation === 'create') {
          await req.payload.sendEmail({
            to: doc.customerEmail,
            subject: 'Confirmación de pedido',
            html: `
              <h1>Gracias por tu pedido</h1>
              <p>Tu pedido #${doc.id} ha sido confirmado.</p>
            `,
          })
        }
      },
    ],
  },
}
```

## Enviar Correos desde Endpoints

```typescript
import type { Endpoint } from 'payload'

export const contactEndpoint: Endpoint = {
  path: '/contact',
  method: 'post',
  handler: async (req) => {
    const { name, email, message } = req.data

    await req.payload.sendEmail({
      to: 'info@eljardisalomo.com',
      subject: `Nuevo mensaje de contacto de ${name}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      `,
      replyTo: email,
    })

    return Response.json({ success: true })
  },
}
```

## Enviar Correos desde Acciones de Formulario

En el plugin de formularios, los correos se envían automáticamente usando la configuración:

```typescript
{
  name: 'contactForm',
  type: 'blocks',
  blocks: [
    {
      slug: 'form',
      fields: [
        {
          name: 'confirmationEmails',
          type: 'array',
          fields: [
            {
              name: 'to',
              type: 'email',
              required: true,
            },
            {
              name: 'subject',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
```

## Plantillas de Correo HTML

Para correos más complejos, crea plantillas reutilizables:

```typescript
// src/email/templates/welcome.ts
export const welcomeEmailTemplate = (name: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Bienvenido, ${name}!</h1>
    </div>
    <div class="content">
      <p>Gracias por registrarte en El Jardí Salomó.</p>
      <p>Estamos encantados de tenerte con nosotros.</p>
    </div>
    <div class="footer">
      <p>El Jardí Salomó - eljardisalomo.com</p>
    </div>
  </div>
</body>
</html>
`

// Uso:
await req.payload.sendEmail({
  to: user.email,
  subject: 'Bienvenido a El Jardí Salomó',
  html: welcomeEmailTemplate(user.name),
})
```

## Verificación de Correo para Usuarios

PayloadCMS incluye verificación de correo por defecto para colecciones con `auth`:

```typescript
export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    verify: true, // Habilita verificación de email
    forgotPassword: {
      generateEmailSubject: () => 'Recuperar contraseña',
      generateEmailHTML: ({ token, user }) => `
        <p>Hola ${user.email},</p>
        <p>Haz clic en el siguiente enlace para recuperar tu contraseña:</p>
        <a href="${process.env.PAYLOAD_PUBLIC_SERVER_URL}/reset-password?token=${token}">
          Recuperar contraseña
        </a>
      `,
    },
  },
}
```

## Solución de Problemas

### Error: "Connection refused"

- Verifica que `SMTP_HOST` sea correcto: `mail.privateemail.com`
- Verifica que el puerto sea el correcto (587 o 465)

### Error: "Authentication failed"

- Verifica que `SMTP_USER` sea tu correo completo
- Verifica que `SMTP_PASS` sea la contraseña correcta
- Algunos proveedores requieren "contraseñas de aplicación" en lugar de la contraseña normal

### Error: "SSL/TLS error"

Si usas puerto 465, cambia a 587:

```env
SMTP_PORT=587
```

### Probar configuración

El proyecto incluye un endpoint de prueba en `src/endpoints/test-email.ts`.

**Para probar en desarrollo (sin enviar correos reales):**

1. Asegúrate de tener `SMTP_SEND_EMAILS=false` en tu `.env`
2. Inicia el servidor: `pnpm dev`
3. Inicia sesión en el panel de administración
4. Visita: `http://localhost:3000/api/test-email`
5. Verás el correo simulado en la consola del servidor

**Para probar con correos reales (producción):**

1. Cambia `SMTP_SEND_EMAILS=true` en tu `.env`
2. Reinicia el servidor
3. Visita: `http://localhost:3000/api/test-email`
4. Recibirás un correo real en tu bandeja de entrada

**Ejemplo de salida en consola (modo desarrollo):**

```
📧 [MODO DESARROLLO] Correo NO enviado (simulado):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
De: El Jardí Salomó <info@eljardisalomo.com>
Para: usuario@ejemplo.com
Asunto: Prueba de configuración de correo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Contenido (texto):
¡La configuración de correo funciona correctamente!
...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
