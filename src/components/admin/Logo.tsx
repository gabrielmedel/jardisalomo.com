import Image from 'next/image'

export function Logo() {
  return (
    <Image
      src="/logo.png"
      alt="Jardi Salomó"
      width={150}
      height={40}
      style={{ objectFit: 'contain' }}
      priority
    />
  )
}
