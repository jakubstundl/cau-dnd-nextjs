import { useRef } from 'react'
import styles from '../styles/Dice.module.scss'
// stolen from https://codepen.io/vicentemundim/pen/nXNvBw
const Dice = ({setLuck, rolled, setRolled}: {setLuck: (n: number) => void, rolled: boolean, setRolled: () => void}) => {
    const die = useRef<HTMLDivElement>(null)

    let lastFace:number
    let timeoutId:NodeJS.Timeout
    const animationDuration  = 300
    const handleClick = () => {
        setRolled()
            die.current?.classList.add('rolling')
            clearTimeout(timeoutId)
            timeoutId = setTimeout(function () {
                die.current?.classList.remove('rolling')
                rollTo(randomFace())
            }, animationDuration)
             return false
     }
     const rollTo=(face:number) => {
        clearTimeout(timeoutId)
        setLuck(face)
        
        die.current?.setAttribute('data-face', face.toString());
      }
      const randomFace =()=> {
        const face = Math.floor((Math.random() * 20)) + 1
        lastFace = face == lastFace ? randomFace() : face
        return face;
      }
    

    return (
        <div className={styles.content}>
            <div ref={die} onClick={rolled ? () => {return true} : handleClick} className={styles.die}>
                <figure className={`${styles.face} ${styles['face-1']}`} ></figure>
                <figure className={`${styles.face} ${styles['face-2']}`}></figure>
                <figure className={`${styles.face} ${styles['face-3']}`}></figure>
                <figure className={`${styles.face} ${styles['face-4']}`}></figure>
                <figure className={`${styles.face} ${styles['face-5']}`}></figure>
                <figure className={`${styles.face} ${styles['face-6']}`} ></figure>
                <figure className={`${styles.face} ${styles['face-7']}`}></figure>
                <figure className={`${styles.face} ${styles['face-8']}`}></figure>
                <figure className={`${styles.face} ${styles['face-9']}`}></figure>
                <figure className={`${styles.face} ${styles['face-10']}`}></figure>                
                <figure className={`${styles.face} ${styles['face-11']}`}></figure>
                <figure className={`${styles.face} ${styles['face-12']}`}></figure>
                <figure className={`${styles.face} ${styles['face-13']}`}></figure>
                <figure className={`${styles.face} ${styles['face-14']}`}></figure>                
                <figure className={`${styles.face} ${styles['face-15']}`}></figure>
                <figure className={`${styles.face} ${styles['face-16']}`}></figure>
                <figure className={`${styles.face} ${styles['face-17']}`}></figure>
                <figure className={`${styles.face} ${styles['face-18']}`}></figure>                
                <figure className={`${styles.face} ${styles['face-19']}`}></figure>
                <figure className={`${styles.face} ${styles['face-20']}`}></figure>
            </div>
        </div>
    )
}

export default Dice