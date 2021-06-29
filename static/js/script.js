fetch('example.json')
  .then(response => response.json())
  .then(data => {
    var flattendata = [].concat.apply([], data["tubes"]);
    colorDict = elemToColor(new Set(flattendata))
    container = document.getElementsByClassName("container")[0]
    for (var tube of (data["tubes"])){
        var node = document.createElement("img")
        var nodeContainer = document.createElement("div")
        nodeContainer.className = "tube"
        node.src="static/img/paintedtube.png"
        node.className = "tubepic"
        nodeContainer.appendChild(node)
        var ballContainer = document.createElement("div")
        ballContainer.className = "ballContainer"
        container.appendChild(nodeContainer)
        nodeContainer.appendChild(ballContainer)

        for (var circle of tube){
            ballColor = colorDict[circle]
            var ball = document.createElement("span")
            ball.className = "dot dotInTube"
            ball.style.backgroundColor = ballColor
            ballContainer.prepend(ball)

        }


    }
    addEvent()
  }
  );
function countUnique(iterable){
    return new Set(iterable).size;
}
function elemToColor(set){
    var dict = []
    var i = 25
    for (var elem of set){
        dict[elem] = CSS_COLOR_NAMES[i]
        i = i + 1
    }
    return dict
}