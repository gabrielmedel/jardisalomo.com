import Image from 'next/image'

export function Icon() {
  return (
    <Image
      src="/favicon-32x32.png"
      alt="Jardi Salomó"
      width={32}
      height={32}
      priority
    />
  )
}
