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
    const currentData = useSelector((state) => state.currentData);
    const setViewport = useSetViewport();

    const handleStep = (step) => {
        console.log(step)
        if (step.hasOwnProperty('map')){
            if (step.map.hasOwnProperty('variable') && step.map.hasOwnProperty('dataset')){
                // todo
            } else if (step.map.hasOwnProperty('variable')) {
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
            if (step.map.hasOwnProperty('bounds') || step.map.hasOwnProperty('viewState')){
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
        {dataPresets.story.map(step => <section className={`${step.layout} step`}>
            <div className={styles.inner}>
                {step.text}
            </div>
        </section>)}
    </div>
}