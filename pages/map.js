import Head from "next/head";
import styles from "../styles/Map.module.css";

import MainNav from "../components/layout/MainNav";

import MainMap from "../components/map/MainMap";
import VariablePanel from "../components/map/VariablePanel";
import MapTooltip from "../components/map/MapTooltip";
import TimeSlider from '../components/map/slider/TimeSlider';
// import useLoadData from '@webgeoda/hooks/useLoadData'
// import useUpdateData from '@webgeoda/hooks/useUpdateData'
import rootReducer from "@webgeoda/reducers";
import {GeodaContext, ViewportProvider} from "@webgeoda/contexts";

import { createStore } from "redux";
import { Provider } from "react-redux";
import { useEffect, useState } from "react";
import * as Comlink from "comlink";

const store = createStore(
  rootReducer,
  (
    typeof window === 'object' 
    && window.__REDUX_DEVTOOLS_EXTENSION__ 
    && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ) && window.__REDUX_DEVTOOLS_EXTENSION__({
    stateSanitizer: (state) => state.storedGeojson ? { ...state, storedData: '<<EXCLUDED>>', storedGeojson: '<<EXCLUDED>>' } : state
  })
);

var geoda;

export default function Map() {
  const [geodaReady, setGeodaReady] = useState(false);

  useEffect(() => {
    geoda = Comlink.wrap(new Worker("./workers/worker.jsgeoda.js"));
    geoda
      .New()
      .then(() => setGeodaReady(true))
      .then(() => geoda.listFunctions());
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Map :: WebGeoDa Template</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,900;1,400;1,700&family=Lora:ital@0;1&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,900;1,400;1,700&family=Lora:ital@0;1&display=swap"
          media="print"
          onLoad="this.media='all'"
        />
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v2.2.0/mapbox-gl.css"
          rel="stylesheet"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,900;1,400;1,700&family=Lora:ital@0;1&display=swap"
          />
        </noscript>
      </Head>
      <MainNav />
      {/* {!geodaReady && <div className={styles.preLoader}><Loader globe={true} /></div>} */}
      
      <ViewportProvider>
      <Provider store={store}>
        {geodaReady && (
          <GeodaContext.Provider value={geoda}>
            <MainMap geoda={geoda} />
            <VariablePanel />
            <MapTooltip />
            <TimeSlider />
          </GeodaContext.Provider>
        )}
      </Provider>
      </ViewportProvider>
    </div>
  );
}
