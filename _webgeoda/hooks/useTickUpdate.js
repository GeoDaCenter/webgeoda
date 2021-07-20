import { useState, useEffect} from 'react';

export default function useTickUpdate({
    tickFunction,
    updateTrigger,
    resetTriggers
}){
    const [isTicking, setIsTicking] = useState(false);
    const [tickTimer, setTickTimer] = useState(100);
    const [tickTimeout, setTickTimeout] = useState()
    const [resetTimeout, setResetTimeout] = useState()
    
    useEffect(() => {
        if (isTicking) {
            clearTimeout(tickTimeout)
            setTickTimeout(setTimeout(tickFunction, 1))
        }
    },[isTicking])

    useEffect(() => {
        if (isTicking) {
            clearTimeout(tickTimeout)
            setTickTimeout(setTimeout(tickFunction, tickTimer))
            clearTimeout(resetTimeout)
            setResetTimeout(setTimeout(() => setIsTicking(false), 1500))
        } else if (isTicking) {
            clearTimeout(resetTimeout)
            setResetTimeout(setTimeout(() => setIsTicking(false), 1500))
        }
    },[updateTrigger])

    useEffect(() => {
        clearTimeout(resetTimeout)
        clearTimeout(tickTimeout)
        setIsTicking(false)
    }, resetTriggers)

    return [isTicking, setIsTicking, tickTimer, setTickTimer]
}