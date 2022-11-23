export default class FileLoader{

    constructor(){
    }
        
    import = (path,lambda) => {
        let object
        new PLYLoader().load(
            path, (geometry) => {
                geometry.computeBoundingBox()
                const array= new Array(geometry.attributes.position.count)
                object = new THREE.Points(geometry, this.material);
            })

            lambda();
            return object
    }
    
    getRandomSourcePath() {
    const folderPath = "./assets/3dmodel"
    const randomBeachIndex = Math.floor(Math.random() * wastePlasticDataset.data.length)
    const randomBeach = wastePlasticDataset.data[randomBeachIndex].beachName
    const randomWastePlasticIndex = Math.floor(Math.random() * (wastePlasticDataset.data[randomBeachIndex].wastePlasticCount - 1) + 1)

    const path = `${folderPath}/${randomBeach}/${randomWastePlasticIndex}.ply`

    return path
}

    }

}