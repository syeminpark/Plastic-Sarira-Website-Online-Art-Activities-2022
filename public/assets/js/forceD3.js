export default function forcedD3(data) {
    const margin = {
        top: 50,
        right: 30,
        bottom: 30,
        left: 40
    }
    let width = document.getElementById('plane').offsetWidth - margin.left - margin.right
    let height = document.getElementById('plane').offsetHeight - margin.top - margin.bottom;

    const svg = d3.select("#plane") //just a div in html
        .append("svg")
        .attr("viewBox", `0 0 ${ width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append("g")
        .attr("transform",
            `translate(0,${margin.top})`);

    let colorScale = d3.scaleOrdinal()
        .domain(["Waste Plastic", "Microbe", "Herbivore", "Carnivore", "Homo Sapiens", ])
        .range(['#eee9e9 ',"#0000FF", '#78924e', '#EE4B2B', '#DFBCFF'])
        // .range(['#ededed', '#bfbfbf', '#757474', '#525050', '#141414'])
    let aura = function (category) {
        if (category == "Homo Sapiens") {
            return "2%"
        } else {
            return "0.5%"
        }
    }
    svg.append('defs').append('marker')
        .attr("id", 'arrowhead')
        .attr('viewBox', '-0 -5 10 10') //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
        .attr('refX', "3%") // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 13)
        .attr('markerHeight', 13)
        .attr('xoverflow', 'visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#FF3659')
        .attr('fill-opacity', 0.3)
        .style('stroke', 'none');

    d3.json("./assets/json/d3/sample.json").then(function (data) {
        // Initialize the links
        const link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(data.links)
            .enter().append("line")
            .style("stroke-opacity", 0.3)
            .attr('marker-end', 'url(#arrowhead)')
            .attr("stroke-width", function (d) {
                return Math.sqrt(d.value);
            });

        const edgepaths = svg.selectAll(".edgepath") //make path go along with the link provide position for link labels
            .data(data.links)
            .enter()
            .append('path')
            .attr('class', 'edgepath')
            .attr('fill-opacity', 0)
            .attr('stroke-opacity', 0)
            .attr('id', function (d, i) {
                return 'edgepath' + i
            })
            .style("pointer-events", "none");

        const edgelabels = svg.selectAll(".edgelabel")
            .data(data.links)
            .enter()
            .append('text')
            .style("pointer-events", "none")
            .attr('class', 'edgelabel')
            .attr('id', function (d, i) {
                return 'edgelabel' + i
            })

            .style("fill-opacity", 0.8)
            .attr('fill', '#FF3659');

        edgelabels.append('textPath')
            .attr('xlink:href', function (d, i) {
                return '#edgepath' + i
            })
            .style("text-anchor", "middle")
            .style("pointer-events", "none")
            .attr("startOffset", "45%")
            .attr('font-size', "var(--font-citation)")
            .text(d => {
                return "MP " + d.uniqueID
            })

        // Initialize the nodes
        const node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(data.nodes)
            .enter().append("g")

        node.each(function (d) {
            if (d.category == "Waste Plastic") {
                d3.select(this).append("rect")
                    .attr("x", -10)
                    .attr("y", -10)
                    .attr("width", "3%")
                    .attr("height", "3%")
                    .style("fill", '#999')

                    .style("stroke", "grey")
                    .style("stroke-opacity", 0.3)
                    .style("stroke-width", d => aura(d.category))
                    .style("fill", d => colorScale(d.category))
            } else {
                d3.select(this).append("circle")
                    .attr("r", "2%")

                    .style("fill", '#999')

                    .style("stroke", "grey")
                    .style("stroke-opacity", 0.3)
                    .style("stroke-width", d => aura(d.category))
                    .style("fill", d => colorScale(d.category))
            }
        })

        const lables = node.append("text")
            .text(function (d) {
                return d.subcategory + d.uniqueID;
            })
            .attr("dy", "-3.5%")
            .attr("dx", "-2%")


         
        const drag_handler = d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            // .on("end", dragended)



        drag_handler(node);


        // Let's list the force we wanna apply on the network
        const simulation = d3.forceSimulation(data.nodes) // Force algorithm is applied to data.nodes
            .force("link", d3.forceLink() // This force provides links between nodes
                .id(function (d) {
                    return d.id;
                }) // This provide  the id of a node
                .links(data.links) // and this the list of links
                .distance(
                    (document.getElementById('plane').offsetWidth * 4) / 30))

            .force("boundary", forceBoundary(0, 0, width, height))
            .force("collide", d3.forceCollide().radius(20))
            .force("charge", d3.forceManyBody().strength(-300)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
            .force("center", d3.forceCenter(width / 2, height / 2)) // This force attracts nodes to the center of the svg area
            .on("tick", ticked);


        // This function is run at each iteration of the force algorithm, updating the nodes position.
        function ticked() {
            link
                .attr("x1", function (d) {
                    return d.source.x
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });


            node
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                })
            edgepaths.attr('d', d => 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y);
        }

        function dragstarted(d) {
            if (!d.active) simulation.alphaTarget(0.3).restart();
            d.subject.fx = d.x;
            d.subject.fy = d.y;
        }

        function dragged(d) {

            d.subject.fx = d.x;
            d.subject.fy = d.y;
        }

        function dragended(d) {
            if (!d.active) simulation.alphaTarget(0);
            d.subject.fx = null;
            d.subject.fy = null;
        }

    });

    const legend_g = svg.selectAll(".legend")
        .data(colorScale.domain())
        .enter().append("g")
        .attr("transform", (d, i) => `translate(${width-50},${i * 20})`);


    svg.append("text")
        .attr("x", "4%")
        .attr("y", legend_g.attr("y") + 0 * 20 + 5)
        .text("Waste Plastic ID")
    // .attr("class", "EN")
    // svg.append("text")
    //     .attr("x", legend_g.attr("x") + width - 50 + 10)
    //     .attr("y", legend_g.attr("y") + 0 * 20 + 5)
    //     .text("??????????????? ID").attr("class", "KR")

    svg.append("circle")
        .attr("r", 5)
        .attr("cx", "2%")
        .attr("cy", legend_g.attr("y") + 0 * 20)
        .attr("fill", "#eee9e9")
        .attr("fill-opacity", 1);


    svg.append("text")
        .attr("x", "4%")
        .attr("y", legend_g.attr("y") + 1 * 20 + 5)
        .text("Microbe ID")
    // .attr("class", "EN")
    // svg.append("text")
    //     .attr("x", legend_g.attr("x") + width - 50 + 10)
    //     .attr("y", legend_g.attr("y") + 1 * 20 + 5)
    //     .text("????????? ID")
    //     .attr("class", "KR")

    svg.append("circle")
        .attr("r", 5)
        .attr("cx", "2%")
        .attr("cy", legend_g.attr("y") + 1 * 20)
        .attr("fill", "#0000FF")
        .attr("fill-opacity", 1);



    svg.append("text")
        .attr("x", "4%")
        .attr("y", legend_g.attr("y") + 2 * 20 + 5)
        .text("Herbivore ID")
    // .attr("class", "EN")
    // svg.append("text")
    //     .attr("x", legend_g.attr("x") + width - 50 + 10)
    //     .attr("y", legend_g.attr("y") + 2 * 20 + 5)
    //     .text("???????????? ID")
    //     .attr("class", "KR")


    svg.append("circle")
        .attr("r", 5)
        .attr("cx", "2%")
        .attr("cy", legend_g.attr("y") + 2 * 20)
        .attr("fill", "#78924e")
        .attr("fill-opacity", 1);

    svg.append("text")
        .attr("x", "4%")
        .attr("y", legend_g.attr("y") + 3 * 20 + 5)
        .text("Carnivore ID")
    // .attr("class", "EN")
    // svg.append("text")
    //     .attr("x", legend_g.attr("x") + width - 50 + 10)
    //     .attr("y", legend_g.attr("y") + 3 * 20 + 5)
    //     .text("???????????? ID")
    //     .attr("class", "KR")

    svg.append("circle")
        .attr("r", 5)
        .attr("cx", "2%")
        .attr("cy", legend_g.attr("y") + 3 * 20)
        .attr("fill", "#EE4B2B")
        .attr("fill-opacity", 1);


    svg.append("text")
        .attr("x", "4%")
        .attr("y", legend_g.attr("y") + 4 * 20 + 5)
        .text("Homo Sapiens ID")
    // .attr("class", "EN")

    // svg.append("text")
    //     .attr("x", legend_g.attr("x") + width - 50 + 10)
    //     .attr("y", legend_g.attr("y") + 4 * 20 + 5)
    //     .text("?????? ID")
    //     .attr("class", "KR")

    svg.append("circle")
        .attr("r", 5)
        .attr("cx", "2%")
        .attr("cy", legend_g.attr("y") + 4 * 20)
        .attr("fill", "#DFBCFF")
        .attr("fill-opacity", 1);


    svg.append("text")
        .attr("x", "4%")
        .attr("y", legend_g.attr("y") + 5 * 20 + 5)
        .text("Microplastic ID")
    // .attr("class", "EN")
    // svg.append("text")
    //     .attr("x", legend_g.attr("x") + width - 50 + 10)
    //     .attr("y", legend_g.attr("y") + 5 * 20 + 5)
    //     .text("?????????????????? ID")
    //     .attr("class", "KR")

    svg.append("circle")
        .attr("r", 5)
        .attr("cx", "2%")
        .attr("cy", legend_g.attr("y") + 5 * 20)
        .attr("fill", "#FF3659")
        .attr("fill-opacity", 0.6);

}

     