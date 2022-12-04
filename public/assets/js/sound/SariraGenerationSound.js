import {
    MyMath
} from "../utils/MyMath.js"
import * as Tone from 'https://cdn.skypack.dev/tone';

export default class SariraGenerationSound {
    constructor() {
        this.directory = "./assets/mp3/sarira_beats.mp3"

        this.hasStarted = false;
        //1.delay
        this.feedbackRate = 0 //range = 0 ,1

        //2.tranpose
        this.pitch_left = 0 //range -60 , 60
        this.pitch_right = 0 //range -60 , 60

        this.frequency_left = 100 //range -100, 100 
        this.frequency_right = 100 //range -100, 100 

        //3.convol reverb
        this.roomsize = 0.3 // 추가된 항목. range 0,1
        this.freeverb_wet = 0 //range 0,1


        ////////////////////////////////////
        this.sourceNode = new Tone.BufferSource()
        this.splitNode = new Tone.Split();
        this.mergeNode = new Tone.Merge()
        const delayTime = 0.6
        this.feedbackDelayNode = new Tone.FeedbackDelay(delayTime, this.feedbackRate)
        this.frequency_shift_leftNode = new Tone.FrequencyShifter(this.frequency_left)
        this.frequency_shift_rightNode = new Tone.FrequencyShifter(this.frequency_right)
        this.pitchShift_leftNode = new Tone.PitchShift(this.pitch_left)
        this.pitchShift_rightNode = new Tone.PitchShift(this.pitch_right)

        const damp = 830
        this.freeverbNode = new Tone.Freeverb(this.roomsize, damp)
        this.freeverbNode.wet.value = this.freeverb_wet; //max is 1

        this.gainNode = new Tone.Gain(1)

    }

    async setup() {
        const LEFT = 0
        const RIGHT = 1
        const MONO = 0

        let buffer = new Tone.Buffer(this.directory, () => {
            this.sourceNode.buffer = buffer.get();
            this.sourceNode.loop = true;
            this.sourceNode.start()

            this.sourceNode.connect(this.splitNode)
            this.splitNode.connect(this.frequency_shift_leftNode, LEFT, MONO)
            this.splitNode.connect(this.frequency_shift_rightNode, RIGHT, MONO)
            this.frequency_shift_leftNode.connect(this.pitchShift_leftNode)
            this.frequency_shift_rightNode.connect(this.pitchShift_rightNode)

            this.pitchShift_leftNode.connect(this.mergeNode, MONO, LEFT)
            this.pitchShift_rightNode.connect(this.mergeNode, MONO, RIGHT)
            Tone.connectSeries(this.mergeNode, this.feedbackDelayNode, this.freeverbNode, this.gainNode)
        })
    }

    setFeedbackDelay(micorplasticCount) {
        console.log(micorplasticCount)
        this.feedbackRate = MyMath.map(micorplasticCount, 0, 1000, 0, 1)
        this.feedbackDelayNode.feedback.value = this.feedbackRate
    }



    setFrequency_PitchShift(width, height) {
        this.pitch_left = MyMath.map(height, 0, 4, 0, -10)
        this.pitch_right = MyMath.map(width, 0, 4, 0, -10)
        console.log('pitch', this.pitch_left, this.pitch_right)

        this.frequency_left = MyMath.map(height, 0, 4, 100, -100)
        this.frequency_right = MyMath.map(width, 0, 4, 100, -100)
        console.log('freq', this.frequency_left, this.frequency_right)

        // this.pitchShift_leftNode.pitch = this.pitch_left
        // this.pitchShift_rightNode.pitch = this.pitch_right

        this.frequency_shift_leftNode.freqeuncy = this.frequency_left
        this.frequency_shift_rightNode.freqeuncy = this.frequency_right
    }

    setFreeverb(depth) {
        this.freeverb_wet = MyMath.map(depth, 0, 4, 0, 1)
        this.freeverbNode.wet.value = this.freeverb_wet; //max is 1
    }

    play() {
        if (document.getElementById('sound-btn').classList.contains('active')) {

            if (!this.hasStarted) {
                this.gainNode.connect(Tone.Destination)
                this.hasStarted = true
                console.log('start')
            }
        } else {
            if (this.hasStarted) {
                this.hasStarted = false
                this.gainNode.disconnect(Tone.Destination)

            }
        }
    }
 
    dispose(){
        this.gainNode.dispose()
    }
}