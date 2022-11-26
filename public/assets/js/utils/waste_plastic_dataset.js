// export default{
//     data
// }

export default class Waste_plastic_dataset {
    constructor() {

    }
    static data = [{
            beachName: "Naechi",
            wastePlasticCount: 30
        },
        {
            beachName: "Songpyeong",
            wastePlasticCount: 30
        },
        {
            beachName: "Cheonggan",
            wastePlasticCount: 16
        },
        {
            beachName: "Gamchu",
            wastePlasticCount: 15
        },
        {
            beachName: "Yumjeon",
            wastePlasticCount: 30
        },
        {
            beachName: "Dogu",
            wastePlasticCount: 30
        },
        {
            beachName: "Guryeongpo",
            wastePlasticCount: 30
        },
        {
            beachName: "Dumo-mongdol",
            wastePlasticCount: 30
        },
        {
            beachName: "Masian",
            wastePlasticCount: 30
        },
        {
            beachName: "Bangameori",
            wastePlasticCount: 30
        },
        {
            beachName: "Jangan",
            wastePlasticCount: 30
        }
    ]

    static array = [
        []
    ]


    static getImagePath(beach, index) {
        return `./assets/img/${beach}/studio/${index}.jpg`
    }
    static getPLYPath(beach, index) {
        return `./assets/3dmodel/${beach}/${index}.ply`
    }

    static getRawData() {
        return Waste_plastic_dataset.data
    }

    static getRandomPLY(call) {

        const randomBeachIndex = Math.floor(Math.random() * Waste_plastic_dataset.getRawData().length)
        const randomBeach = Waste_plastic_dataset.getRawData()[randomBeachIndex].beachName
        const randomWastePlasticIndex = Math.floor(Math.random() * (Waste_plastic_dataset.getRawData()[randomBeachIndex].wastePlasticCount - 1) + 1)
        const path = Waste_plastic_dataset.getPLYPath(randomBeach, randomWastePlasticIndex)
        return {
            beach: randomBeach,
            index: randomWastePlasticIndex,
            path: path
        }

    }

    static getRandomBatchPLY(length) {
        let array = []
        let result=[]
        for (let i = 0; i < Waste_plastic_dataset.getRawData().length; i++) {
            array.push(new Array())
            for (let j = 0; j < Waste_plastic_dataset.getRawData()[i].wastePlasticCount; j++) {
                array[i].push("Not Chosen")
            }
        }

        for (let i =0;i<length;i++){

          let randomBeachIndex = Math.floor(Math.random() * Waste_plastic_dataset.getRawData().length)
           let randomWastePlasticIndex = Math.floor(Math.random() * (Waste_plastic_dataset.getRawData()[randomBeachIndex].wastePlasticCount - 1) + 1)
           if( array[randomBeachIndex][randomWastePlasticIndex] =='Chosen'){
            i-=1
           }
           else{
            const randomBeach = Waste_plastic_dataset.getRawData()[randomBeachIndex].beachName
            const path = Waste_plastic_dataset.getPLYPath(randomBeach, randomWastePlasticIndex)

            array[randomBeachIndex][randomWastePlasticIndex] = "Chosen"
            result.push( {
                beach: randomBeach,
                index: randomWastePlasticIndex,
                path: path
            })
           }
        }
        console.log(result)
        return result 

    }


static getID(beach, id) {
    return `${beach.toUpperCase()} #${id}`

}



}