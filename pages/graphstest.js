import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Gutter } from '../components/layout/Gutter';
import MainNav from '../components/layout/MainNav';
import Footer from '../components/layout/Footer';
import styles from '../styles/Graphstest.module.css';
import {BarChart, ResponsiveContainer, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import {bin} from "d3-array";

export default function GraphsTest() {
  const [data, setData] = useState(null);

  let rechart;
  let victoryChart;
  
  if(data != null){
    const d3bin = bin();
    const binned = d3bin(Object.values(data).map(i => i["Median age"]));
    const rechartsFormattedData = binned.map((i, idx) => {
      return {
        name: `${i.x0}-${i.x1}`,
        val: i.length
      };
    });
    console.log(rechartsFormattedData);
    const victoryFormattedData = null;

    rechart = (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={rechartsFormattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="val" fill="#000000" />
        </BarChart>
      </ResponsiveContainer>
    );
  } else {
    fetchData().then((res) => {
      setData(res);
    });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Graphs Test!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainNav/>
        <main className={styles.main}>
          <h1>Graph Tests</h1>
          {
            data == null ? null : (
              <>
                <div className={styles["charts-container"]}>
                  {rechart}
                  {rechart}
                </div>
              </>
            )
          }
        </main>
      <Footer />
    </div>
  )
}

async function fetchData(){
  let res;
  try {
    res = await fetch("/json/properties.json");
  } catch(e){
    console.error(e);
    return null;
  }
  return await res.json();
}