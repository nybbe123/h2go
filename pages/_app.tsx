import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { useEffect } from 'react'

export default function MyApp({
  Component, 
  pageProps: { session, ...pageProps } }: AppProps,
  ) {

  useEffect(() => {
    const handleRootSize = () => {
      const rootEl = document.documentElement
      rootEl.style.setProperty('--app-height', `${window.innerHeight}px`)
    }
  
    window.addEventListener('resize', handleRootSize)

    handleRootSize()

    return () => window.removeEventListener('resize', handleRootSize)
  })
  
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
