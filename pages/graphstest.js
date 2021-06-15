import Head from 'next/head';
import { Gutter } from '../components/layout/Gutter';
import MainNav from '../components/layout/MainNav';
import Footer from '../components/layout/Footer';
import styles from '../styles/Graph.module.css';

export default function GraphsTest() {
  return (
    <div>
      <Head>
        <title>Graphs Test!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainNav/>
        <h1>Graph Tests</h1>
      <Footer />
    </div>
  )
}