import { useEffect, useState, createRef } from 'react';
import Head from 'next/head';
import { Gutter } from '../components/layout/Gutter';
import MainNav from '../components/layout/MainNav';
import Footer from '../components/layout/Footer';
import styles from '../styles/Graphstest.module.css';
import {BarChart, ResponsiveContainer, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import {VictoryBar, VictoryChart, VictoryTooltip} from 'victory';
import {bin} from "d3-array";
import { Bar as VisxBar } from '@visx/shape';
import { Group } from '@visx/group';
import { GradientTealBlue } from '@visx/gradient';
import { scaleBand, scaleLinear } from '@visx/scale';

export default function GraphsTest() {
  const [data, setData] = useState(null);

  let rechart;
  let victoryChart;
  let visxChart;
  
  if(data != null){
    const d3bin = bin();
    const binned = d3bin(Object.values(data).map(i => i["Median age"]));
    const formattedData = binned.map((i, idx) => {
      return {
        name: `${i.x0}-${i.x1}`,
        val: i.length,
        label: i.length
      };
    });
    console.log(formattedData);

    rechart = (
      <ResponsiveContainer>
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="val" fill="#000000" />
        </BarChart>
      </ResponsiveContainer>
    );
    victoryChart = (
      <VictoryChart animate={{duration: 500}}>
        <VictoryBar data={formattedData} x="name" y="val" labelComponent={<VictoryTooltip />} />
      </VictoryChart>
    );
    const VISX_CHART_WIDTH = 500;
    const VISX_CHART_HEIGHT = 300;
    const xScale = scaleBand({
      range: [0, VISX_CHART_WIDTH],
      round: true,
      domain: formattedData.map(i => i.name),
      padding: 0.4
    });
    const yScale = scaleLinear({
      range: [VISX_CHART_HEIGHT, 0],
      round: true,
      domain: [0, Math.max(...formattedData.map(i => i.val))]
    });
    visxChart = (
      <svg width={VISX_CHART_WIDTH} height={VISX_CHART_HEIGHT}>
        <Group top={10}>
          {formattedData.map(i => {
            const barHeight = VISX_CHART_HEIGHT - yScale(i.val);
            return (
              <VisxBar
                key={`visxbar-` + i.name}
                x={xScale(i.name)}
                y={VISX_CHART_HEIGHT - barHeight}
                width={xScale.bandwidth()}
                height={barHeight}
                fill="#000000"
              />
            )
          })}
        </Group>
      </svg>
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
                  {victoryChart}
                  {visxChart}
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