import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-primary-foreground hover:scale-105 hover:shadow-cute active:scale-95 font-semibold",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-105 active:scale-95",
        outline: "border-2 border-primary/20 bg-background hover:bg-primary/5 hover:border-primary/40 hover:scale-105 active:scale-95",
        secondary: "bg-gradient-secondary text-accent-foreground hover:scale-105 hover:shadow-soft active:scale-95 font-semibold",
        ghost: "hover:bg-accent/10 hover:text-accent hover:scale-105 active:scale-95",
        link: "text-primary underline-offset-4 hover:underline hover:scale-105",
        cute: "bg-gradient-cute text-primary-foreground hover:scale-110 hover:shadow-glow hover:animate-bounce-cute active:scale-95 font-bold rounded-2xl",
        kawaii: "bg-gradient-accent text-foreground hover:scale-105 hover:shadow-cute hover:rotate-1 active:scale-95 font-bold border-2 border-white/50",
        sticker: "bg-card text-card-foreground border-4 border-primary/30 hover:border-primary hover:scale-105 hover:shadow-cute active:scale-95 font-bold rounded-2xl"
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-lg px-4 py-2",
        lg: "h-14 rounded-xl px-10 py-4 text-base",
        icon: "h-12 w-12 rounded-xl",
        sticker: "h-16 w-16 rounded-2xl p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
