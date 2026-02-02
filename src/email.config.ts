import nodemailer from 'nodemailer'
import type { EmailAdapter } from 'payload'

export const emailAdapter: EmailAdapter = () => {
  const shouldSendEmails = process.env.SMTP_SEND_EMAILS === 'true'

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true para 465, false para otros puertos
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      // No fallar en certificados inválidos en desarrollo
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
  })

  return {
    name: 'nodemailer',
    defaultFromAddress: process.env.SMTP_FROM_EMAIL || 'noreply@eljardisalomo.com',
    defaultFromName: process.env.SMTP_FROM_NAME || 'El Jardí Salomó',
    sendEmail: async (message) => {
      const emailData = {
        from: message.from || `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: message.to,
        subject: message.subject,
        html: message.html,
        text: message.text,
      }

      if (shouldSendEmails) {
        // Enviar correo real
        await transport.sendMail(emailData)
        console.log(`📧 Correo enviado a: ${message.to}`)
      } else {
        // Solo registrar en consola (desarrollo)
        console.log('📧 [MODO DESARROLLO] Correo NO enviado (simulado):')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log(`De: ${emailData.from}`)
        console.log(`Para: ${emailData.to}`)
        console.log(`Asunto: ${emailData.subject}`)
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        if (emailData.text) {
          console.log('Contenido (texto):')
          console.log(emailData.text)
        }
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
      }
    },
  }
}
