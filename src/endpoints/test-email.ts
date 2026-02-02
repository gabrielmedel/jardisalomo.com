import type { Endpoint } from 'payload'

export const testEmailEndpoint: Endpoint = {
  path: '/test-email',
  method: 'get',
  handler: async (req) => {
    // Verificar que el usuario esté autenticado
    if (!req.user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    try {
      await req.payload.sendEmail({
        to: req.user.email,
        subject: 'Prueba de configuración de correo',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px; }
              .content { padding: 20px; background: #f9f9f9; margin-top: 20px; border-radius: 5px; }
              .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
              .success { color: #4CAF50; font-size: 48px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ ¡Correo de Prueba!</h1>
              </div>
              <div class="content">
                <p class="success">✓</p>
                <h2>¡La configuración de correo funciona correctamente!</h2>
                <p>Este es un correo de prueba para verificar que el sistema de envío de correos está configurado correctamente.</p>
                <p><strong>Datos de configuración:</strong></p>
                <ul>
                  <li>Servidor SMTP: ${process.env.SMTP_HOST}</li>
                  <li>Puerto: ${process.env.SMTP_PORT}</li>
                  <li>Usuario: ${process.env.SMTP_USER}</li>
                </ul>
              </div>
              <div class="footer">
                <p>El Jardí Salomó - Sistema de Gestión</p>
                <p>Este es un correo automático, por favor no respondas.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
¡La configuración de correo funciona correctamente!

Este es un correo de prueba para verificar que el sistema de envío de correos está configurado correctamente.

Servidor SMTP: ${process.env.SMTP_HOST}
Puerto: ${process.env.SMTP_PORT}
Usuario: ${process.env.SMTP_USER}

El Jardí Salomó - Sistema de Gestión
        `,
      })

      return Response.json({
        success: true,
        message: `Correo de prueba enviado a ${req.user.email}`,
      })
    } catch (error) {
      console.error('Error al enviar correo:', error)
      return Response.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Error desconocido',
        },
        { status: 500 },
      )
    }
  },
}
