// write your javascript code here.
// feel free to change the preset attributes as you see fit

let margin = {
    top: 60,
    left: 50,
    right: 30,
    bottom: 60,
  },
  width = 500 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// first visualization
let svg1 = d3
  .select('#vis1')
  .append('svg')
  .attr('preserveAspectRatio', 'xMidYMid meet') // this will scale your visualization according to the size of its parent element and the page.
  .attr('width', '100%') // this is now required by Chrome to ensure the SVG shows up at all
  .style('background-color', '#ccc') // change the background color to light gray
  .attr(
    'viewBox',
    [
      0,
      0,
      width + margin.left + margin.right,
      height + margin.top + margin.bottom,
    ].join(' ')
  );

// second visualization
let svg2 = d3
  .select('#vis2')
  .append('svg')
  .attr('preserveAspectRatio', 'xMidYMid meet') // this will scale your visualization according to the size of its parent element and the page.
  .attr('width', '100%') // this is now required by Chrome to ensure the SVG shows up at all
  .style('background-color', '#ccc') // change the background color to light gray
  .attr(
    'viewBox',
    [
      0,
      0,
      width + margin.left + margin.right,
      height + margin.top + margin.bottom,
    ].join(' ')
  );

// Import dataset #1
d3.csv('../data/dallas-tx.csv').then(function (data) {
  // Count occurrences of each chatbot and make a new dictionary with these values
  graphOneObj = {};
  badChats = ['', 'text us', 'N/A', 'AnyoneHome'];
  for (const d of data) {
    if (!badChats.includes(d.chatbot)) {
      if (!graphOneObj[d.chatbot]) {
        graphOneObj[d.chatbot] = 1;
      } else {
        graphOneObj[d.chatbot] = graphOneObj[d.chatbot] + 1;
      }
    }
  }
  graphOneArr = [];
  for (const key in graphOneObj) {
    temp = {};
    temp['chatbot'] = key;
    temp['value'] = graphOneObj[key];
    graphOneArr.push(temp);
  }

  // Define the chart's location and basic structural info

  const chart = svg1.append('g').attr('transform', `translate(${60}, ${60})`);

  const yScale = d3.scaleLinear().range([height, 0]).domain([0, 100]);

  chart.append('g').call(d3.axisLeft(yScale));

  const xScale = d3
    .scaleBand()
    .range([0, width])
    .domain(graphOneArr.map((s) => s.chatbot))
    .padding(0.2);

  chart
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  // Build color scale
  const myColor = d3
    .scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([1, 100]);

  // create a tooltip
  const Tooltip = d3
    .select('#div_template')
    .append('div')
    .style('opacity', 0)
    .attr('class', 'tooltip')
    .style('background-color', 'white')
    .style('border', 'solid')
    .style('border-width', '2px')
    .style('border-radius', '5px')
    .style('padding', '5px');

  // Three function that change the tooltip when user hover / move / leave a cell
  const mouseover = function (d) {
    Tooltip.style('opacity', 1);
    d3.select(this).style('stroke', 'black').style('opacity', 1);
  };
  const mousemove = function (d) {
    Tooltip.html('The exact value of<br>this cell is: ' + d.value)
      .style('left', d.clientX + 70 + 'px')
      .style('top', d.clientY + 'px');
  };
  const mouseleave = function (d) {
    Tooltip.style('opacity', 0);
    d3.select(this).style('stroke', 'none').style('opacity', 0.8);
  };

  // Build the chart with the imported data

  chart
    .selectAll()
    .data(graphOneArr)
    .enter()
    .append('rect')
    .style('fill', function (d) {
      return myColor(d.value);
    })
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseleave', mouseleave)
    .attr('x', (s) => xScale(s.chatbot))
    .attr('y', (s) => yScale(s.value))
    .attr('height', (s) => height - yScale(s.value))
    .attr('width', xScale.bandwidth());

  // Add a grid to the chart
  chart
    .append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom().scale(xScale).tickSize(-height, 0, 0).tickFormat(''));

  chart
    .append('g')
    .attr('class', 'grid')
    .call(d3.axisLeft().scale(yScale).tickSize(-width, 0, 0).tickFormat(''));

  // Add labels
  svg1
    .append('text')
    .attr('x', -(height / 2) - 60)
    .attr('y', 60 / 2.4)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Number of Properties');

  svg1
    .append('text')
    .attr('x', width / 2 + 60)
    .attr('y', height + 60 * 1.7)
    .attr('text-anchor', 'middle')
    .text('Type of Chatbot on Website');

  svg1
    .append('text')
    .attr('x', width / 2 + 60)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .text('Chatbot Brand Popularity With Apartments in Austin, TX');
});

// Import data for visualization #2
d3.csv('../data/insurance.csv').then(function (data) {
  data.sort((a, b) => (a.age > b.age ? 1 : -1));
  console.log(data);

  // Build color scale
  const myColor = d3
    .scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([1, 100]);

  const yScale = d3.scaleLinear().range([height, 0]).domain([1, 50]);

  const xScale = d3
    .scaleBand()
    .range([0, width])
    .domain(data.map((s) => s.age));

  svg2
    .append('g')
    .attr('transform', `translate(60, 60)`)
    .call(d3.axisLeft(yScale));

  svg2
    .append('g')
    .attr('transform', `translate(60, ${height + 60})`)
    .call(d3.axisBottom(xScale));

  svg2
    .append('text')
    .attr('x', width / 2 + 60)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .text('Age to BMI Correlation');

  // X label
  svg2
    .append('text')
    .attr('x', width / 2 + 60)
    .attr('y', height + 60 * 1.7)
    .attr('text-anchor', 'middle')
    .style('font-family', 'Helvetica')
    .style('font-size', 12)
    .text('Age (18-64)');

  // Y label
  svg2
    .append('text')
    .attr('x', -(height / 2) - 60)
    .attr('y', 60 / 2.4)
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .style('font-family', 'Helvetica')
    .style('font-size', 12)
    .text('BMI (as %)');

  svg2
    .append('g')
    .selectAll('dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', function (d) {
      return xScale(d.age);
    })
    .attr('cy', function (d) {
      return yScale(d.bmi);
    })
    .attr('r', 2)
    .attr('transform', 'translate(' + 60 + ',' + 140 + ')')
    .style('fill', function (d) {
      return myColor(d.bmi);
    });
});
