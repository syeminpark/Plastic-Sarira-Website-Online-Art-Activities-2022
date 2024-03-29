//Change to use maps instead of plain objects 
class D3Dataset {
    constructor(microplasticUniqueID) {
        this.microplasticUniqueID = microplasticUniqueID
        this.nodes = [];
        this.links = [];
    }

    static categories = ['Waste Plastic', 'Producer', "Decomposer", "Primary Consumer", "Secondary Consumer",'Tertiary Consumer', 'Final Consumer'];
    static subcategories = {
        "Waste Plastic": ['MASIAN', 'BANGAMEORI', 'JANGAN', 'NAECHI', 'SONGPYEONG', 
        'CHEONGGAM', 'GAMCHU', 'YUMJEON', 'DOGU', 'GURYEONGPO', 'DUMO-MONGDOL'],
        
        'Producer': "PRODUCER",
        "Decomposer": "DECOMPOSER",
        "Secondary Consumer": 'SECONDARY CONSUMER',
        "Tertiary Consumer": 'TERTIARY CONSUMER',
        "Final Consumer": 'FINAL CONSUMER'
    }

    static id = 1;
    static USER_NODE_ID = 0
    static userNodeCreated = false;


    //모든 미세플라스틱이 이 함수를 사용해야함 
    saveNode(plasticData) {
     
        // if (D3Dataset.isValid(plasticData.category)) {
        //     this.nodes.push(new Map([
        //         ["category", plasticData.category],
        //         ["subcategory", plasticData.subcategory],
        //         ["uniqueID", plasticData.uniqueID]
        //     ]))
        //     plasticData=undefined
        // }
    }


    solidify(userName) {
        //사람뺴고 4개 있는 노드라면 
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i]

            if (node.subcategory == userName && !D3Dataset.userNodeCreated) {
                node.id = D3Dataset.USER_NODE_ID;
                D3Dataset.userNodeCreated = true;

            } else {
                node.id = D3Dataset.id++;
                let link = new Map([
                    ["source", node.id],
                    ["category", "Micro Plastic"],
                    ["subcategory", "MP"],
                    ["uniqueID", this.microplasticUniqueID]
                ])
                if (i != this.nodes.length - 1) {
                    link.set("target", ++node.id)
                } else {
                    link.set("target",  D3Dataset.USER_NODE_ID)
                }
                this.links.push(link)
            }
        }
    }

   static export (list) {
        let totalNodes = [];
        let totalLinks = [];

        for (let element of list) {
            let nodes = element.d3Dataset.getNodes()
            let links= element.d3Dataset.getLinks()

            for (let i = 0; i < nodes.length; i++) {
                nodes[i] =Object.fromEntries(nodes[i])
            }
            for (let i = 0; i < links.length; i++) {
                links[i] = Object.fromEntries(links[i])
            }
            totalNodes = totalNodes.concat(nodes)
            totalLinks = totalLinks.concat(links)
        }

        const dataset = JSON.stringify({
            nodes: totalNodes,
            links: totalLinks
        })

        //sendToServer(dataset)
    }

    getNodes(){
        return this.nodes
    }

    getLinks() {
        return JSON.stringify(this.links)
    }

    static isValid(category) {
        if (D3Dataset.categories.find(element => element === category)) {
            return true;
        } else {
            console.error(category,": Does not match any existing category")
            return false;
        }
    }
}

export {D3Dataset}