import {
    Page12345
} from './page.js';
import BasicThree
 from '../three/basicThree.js';
 
 import  wastePlasticDataset from "../waste_plastic_dataset.js";

   
class Home12345 extends Page12345 {
    constructor(_pagelayer) {
        super();
        this.pagelayer = _pagelayer
        this.homeThree
    }

    setup() {
        this.homeThree= new BasicThree();
        const SPREAD= true
        this.homeThree.import(
            document.getElementById('home'), 
            this.getRandomSourcePath(),
            SPREAD
        );
    }

    reset_page() {
        super.reset_page();
    }

    getRandomSourcePath() {
        const folderPath ="./assets/3dmodel"
        const randomBeachIndex = Math.floor(Math.random() * wastePlasticDataset.data.length)
        const randomBeach=  wastePlasticDataset.data[randomBeachIndex].beachName
        const randomWastePlasticIndex = Math.floor(Math.random() *  (wastePlasticDataset.data[randomBeachIndex].wastePlasticCount -1) +1)
       
        const path = `${folderPath}/${randomBeach}/${randomWastePlasticIndex}.ply`

        return path 
    }
}

export {
    Home12345
}