import type { NestedKeysStripped } from '@payloadcms/translations'

export const monthlyMenuTranslations = {
  en: {
    monthlyMenu: {
      title: 'Monthly Menu',
      description: 'Upload the monthly menu here. The previous file will be automatically replaced.',
      loginRequired: 'You must be logged in to manage the monthly menu.',
      uploadError: 'Error uploading file',
      updateError: 'Error updating menu',
      unknownError: 'Unknown error',
      uploading: 'Uploading...',
      copied: 'Copied',
      copy: 'Copy',
      replace: 'Replace file',
      download: 'Download',
      publicUrl: 'Public URL (to copy):',
      urlHint:
        'Copy this URL and paste it into any link or linkGroup so users can download the menu.',
      dragOrClick: 'Drag the file here or click to select',
      anyFormat: 'PDF, images or any file format',
    },
  },
  es: {
    monthlyMenu: {
      title: 'Menú del Mes',
      description: 'Sube el menú del mes aquí. El archivo anterior se reemplazará automáticamente.',
      loginRequired: 'Debes iniciar sesión para gestionar el menú del mes.',
      uploadError: 'Error al subir el archivo',
      updateError: 'Error al actualizar el menú',
      unknownError: 'Error desconocido',
      uploading: 'Subiendo...',
      copied: '✓ Copiado',
      copy: 'Copiar',
      replace: 'Reemplazar archivo',
      download: 'Descargar',
      publicUrl: 'URL pública (para copiar):',
      urlHint:
        'Copia esta URL y pégala en cualquier link o linkGroup para que los usuarios puedan descargar el menú.',
      dragOrClick: 'Arrastra el archivo aquí o haz clic para seleccionar',
      anyFormat: 'PDF, imágenes o cualquier formato de archivo',
    },
  },
  ca: {
    monthlyMenu: {
      title: 'Menú del Mes',
      description: 'Puja el menú del mes aquí. L\'arxiu anterior es reemplaçarà automàticament.',
      loginRequired: 'Has d\'iniciar sessió per gestionar el menú del mes.',
      uploadError: 'Error en pujar l\'arxiu',
      updateError: 'Error en actualitzar el menú',
      unknownError: 'Error desconegut',
      uploading: 'Pujant...',
      copied: '✓ Copiat',
      copy: 'Copiar',
      replace: 'Reemplaçar arxiu',
      download: 'Descarregar',
      publicUrl: 'URL pública (per copiar):',
      urlHint:
        'Copia aquesta URL i enganxa-la en qualsevol link o linkGroup perquè els usuaris puguin descarregar el menú.',
      dragOrClick: 'Arrossega l\'arxiu aquí o fes clic per seleccionar',
      anyFormat: 'PDF, imatges o qualsevol format d\'arxiu',
    },
  },
}

export type MonthlyMenuTranslationsObject = typeof monthlyMenuTranslations.en
export type MonthlyMenuTranslationsKeys = NestedKeysStripped<MonthlyMenuTranslationsObject>
