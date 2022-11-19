import {
    Page12345
} from './page.js';

import PointThree from '../three/SpecificThree.js';
 import  wastePlasticDataset from "../waste_plastic_dataset.js";

   
class Home12345 extends Page12345 {
    constructor(_pagelayer) {
        super();
        this.pagelayer = _pagelayer
        this.homeThree
    }

    setup() {
        this.homeThree= new PointThree(document.getElementById('home'),this.pagelayer.singleRenderer,"home",false);
        this.homeThree.import(this.getRandomSourcePath());
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