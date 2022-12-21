import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

const LandingPage: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Landing Page</title>
      </Head>

      <main>
        <h1>Start your journey!</h1>
      </main>
    </div>
  )
}

export default LandingPage
