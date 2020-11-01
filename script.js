var diameter = 1000,
  format = d3.format(",d"),
  color = d3.scaleOrdinal(d3.schemeCategory10);

var bubble = d3.pack().size([diameter, diameter]).padding(1.5);

var svg = d3
  .select("body")
  .append("svg")
  .attr("width", diameter)
  .attr("height", diameter)
  .attr("class", "bubble");

d3.csv("shows_platform_split.csv").then(function (data) {
  var PlatformsAndShows = new Proxy(
    {},
    {
      get: (target, name) => (name in target ? target[name] : 0),
    }
  );
  data.map((d) => {
    PlatformsAndShows[d["Streaming Platform"]] += 1;
  });
  console.log(PlatformsAndShows);
  // console.log(PlatformsAndShows["Netflix"]);
  // console.log(data[0]["Streaming Platform"]);
  console.log(d3.keys(PlatformsAndShows));

  update(PlatformsAndShows);
});

function update(newData) {
  var root = d3
    .hierarchy({ children: Object.values(newData) })
    .sum(function (d) {
      return d;
    });
  bubble(root);

  var bubbles = svg.selectAll(".bubble").data(root.children).enter();

  bubbles
    .append("circle")
    .attr("class", "circle")
    .attr("cx", function (d) {
      return d.x;
    })
    .attr("cy", function (d) {
      return d.y;
    })
    .attr("r", 0)
    .transition()
    .attr("r", function (d) {
      return d.r;
    })
    .duration(1000)

    .style("fill", function (d) {
      return color(d.value);
    });

  bubbles
    .append("text")
    .attr("x", function (d) {
      return d.x;
    })
    .attr("y", function (d) {
      return d.y + 5;
    })
    .attr("text-anchor", "middle")
    .text(function (d) {
      // console.log(d3.keys(newData));
      // console.log(d3.keys(d))
      // console.log(d["data"])
      // console.log(getKeyByValue(newData, d["data"]))
      return getKeyByValue(newData, d["data"]);
    })
    .style("fill", "white")
    .style("font-family", "Helvetica Neue, Helvetica, Arial, san-serif")
    .style("font-size", "12px");
}

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

// filtering
const filterObj = { age: [0, 18], genre: "All", rating: [5, 10] };

const filterData = (data, filterObj) => {
  return data.filter((d) => {
    if (filterObj.genre === "All") {
      return (
        d["IMDB Rating"] >= filterObj.rating[0] &&
        d["IMDB Rating"] <= filterObj.rating[1] &&
        d["Content Rating"] >= filterObj.age[0] &&
        d["Content Rating"] <= filterObj.age[1]
      );
    }
    return (
      d["Genre"] === filterObj.genre &&
      d["IMBD Rating"] >= filterObj.rating[0] &&
      d["IMBD Rating"] <= filterObj.rating[1] &&
      d["Content Rating"] >= filterObj.age[0] &&
      d["Content Rating"] <= filterObj.age[1]
    );
  });
};

const init = async () => {
  let data = await d3.csv("shows_platform_split.csv", d3.autoType);

  let filteredData = filterData(data, filterObj); //filterObj tests a filtered situation
  console.log(filteredData);
  console.log(filteredData.length);
};

init();
