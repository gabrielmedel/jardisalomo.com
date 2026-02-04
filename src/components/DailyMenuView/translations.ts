import type { NestedKeysStripped } from '@payloadcms/translations'

export const dailyMenuTranslations = {
  en: {
    dailyMenu: {
      title: 'Daily Menu',
      description: 'Upload the daily menu here. The previous file will be automatically replaced.',
      loginRequired: 'You must be logged in to manage the daily menu.',
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
    dailyMenu: {
      title: 'Menú Diario',
      description: 'Sube el menú del día aquí. El archivo anterior se reemplazará automáticamente.',
      loginRequired: 'Debes iniciar sesión para gestionar el menú diario.',
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
    dailyMenu: {
      title: 'Menú Diari',
      description: 'Puja el menú del dia aquí. L\'arxiu anterior es reemplaçarà automàticament.',
      loginRequired: 'Has d\'iniciar sessió per gestionar el menú diari.',
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

export type DailyMenuTranslationsObject = typeof dailyMenuTranslations.en
export type DailyMenuTranslationsKeys = NestedKeysStripped<DailyMenuTranslationsObject>
