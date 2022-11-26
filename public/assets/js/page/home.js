import {
    Page12345
} from './page.js';

import PointThree from '../rendering/SpecificThree.js';
import wastePlasticDataset from "../utils/waste_plastic_dataset.js";


class Home12345 extends Page12345 {
    constructor(_pagelayer) {
        super();
        this.pagelayer = _pagelayer
        this.homeThree = new PointThree( this.pagelayer.singleRenderer, "home", false);
        this.homeThree.animate()
        this.homeThree.render()
    }

    setup() {
        this.homeThree.setup(document.getElementById('home') )
        this.homeThree.import(wastePlasticDataset.getRandomPLY().path);
    }

    reset_page() {
        super.reset_page()
    }

}

export {
    Home12345
}