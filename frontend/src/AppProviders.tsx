// GENERATED from the architecture plan — do not edit by hand.
// Every discovered React context provider (Cart, Theme, ...), mounted around the
// app. Re-derived every attempt from src/context, src/providers, src/cart.

import { ReactNode } from 'react'
import { CartProvider } from './cart/CartContext'

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  )
}
