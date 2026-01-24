import { cn } from '@/utilities/ui'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full text-base font-sans font-light tracking-wide ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden text-ellipsis',
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        clear: '',
        default: 'h-10 px-5 py-2 text-sm md:h-11 md:px-6 md:text-base',
        icon: 'h-10 w-10',
        lg: 'h-11 px-6 py-2.5 text-base md:h-12 md:px-8 md:text-lg',
        sm: 'h-9 px-4 py-1.5 text-xs md:h-10 md:px-5 md:text-sm',
      },
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        ghost: 'hover:bg-card hover:text-accent-foreground',
        link: 'text-inherit items-start justify-start p-0 h-auto whitespace-normal break-words',
        outline:
          'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-sm hover:shadow-md',
        secondary:
          'bg-[#F6E7D9] text-black hover:bg-[#F6E7D9]/90 hover:text-black shadow-sm hover:shadow-md',
      },
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  ref?: React.Ref<HTMLButtonElement>
}

const Button: React.FC<ButtonProps> = ({
  asChild = false,
  className,
  size,
  variant,
  ref,
  ...props
}) => {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ className, size, variant }))} ref={ref} {...props} />
}

export { Button, buttonVariants }
