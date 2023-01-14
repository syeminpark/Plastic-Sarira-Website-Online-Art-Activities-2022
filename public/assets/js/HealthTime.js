export default class HealthTime {
    constructor(maxTime,htmlElement) {
        this.maxTime = maxTime //120 
        this.htmlElement=htmlElement
    }

    start() {
        let start = Date.now();
        let seconds; 

        let countdownInterval = setInterval(() =>{
            let delta = Date.now() - start; // milliseconds elapsed since start
            seconds= Math.floor(delta / 1000); // in seconds
            let currentTime= this.maxTime-seconds
            this.convert(currentTime)

            if (currentTime <= 0) clearInterval(countdownInterval);
        },1000)
    }

    convert(currentTime){
        let remainingMinutes = Math.floor(currentTime/60)
        let remainingSeconds= currentTime - remainingMinutes*60
        if(remainingSeconds<10){
            this.htmlElement.innerHTML=`${remainingMinutes}:0${remainingSeconds}`
        }
        else{
            this.htmlElement.innerHTML=`${remainingMinutes}:${remainingSeconds}`
        }
    }
}