import { useEffect } from 'react';
import styles from './Story.module.css';
import { useDispatch, useSelector } from "react-redux";
import "intersection-observer";
import scrollama from "scrollama";
import { fitBounds } from "@math.gl/web-mercator";
import {FlyToInterpolator} from '@deck.gl/core';
import { useSetViewport } from '@webgeoda/contexts';

export default function StoryOverlay(){
    const dispatch = useDispatch();
    const dataPresets = useSelector((state) => state.dataPresets);
    // const currentData = useSelector((state) => state.currentData);
    const setViewport = useSetViewport();

    const handleStep = (step) => {
        if ('map' in step){
            if ('variable' in step.map && 'dataset' in step.map){
                // todo
            } else if ('variable' in step.map) {
                dispatch({
                    type:'CHANGE_VARIABLE',
                    payload:step.map.variable
                })
            } else if (step.map.dataset){
                dispatch({
                    type:'CHANGE_DATASET',
                    payload:step.map.dataset
                })
            }
            if ('bounds' in step.map || 'viewState' in step.map){
                let boundsView = fitBounds({
                    width: window.innerWidth,
                    height: window.innerHeight,
                    bounds: step.map.bounds
                })
                setViewport((viewState) => {
                    return {
                        ...viewState,
                        ...boundsView,          
                        transitionDuration: 2500,
                        transitionInterpolator: new FlyToInterpolator(),
                        ...step.map.viewState
                    }
                })
            }
        }
    }
    useEffect(() => {
        const scroller = scrollama();
        // setup the instance, pass callback functions
        scroller
        .setup({
            step: ".step",
        })
        .onStepEnter((response) => {
            console.log(dataPresets.story[response.index])
            handleStep(dataPresets.story[response.index])
        })
        .onStepExit((response) => {
            console.log(response)
        })
        // setup resize event
        window.addEventListener("resize", scroller.resize);
    },[])

    return <div className={styles.storyContainer}>
        {dataPresets.story.map((step, idx) => <section className={`${styles[step.layout]} step`} key={'step'+idx}>
            <div className={styles.inner}>
                {step.text}
            </div>
        </section>)}
    </div>
}