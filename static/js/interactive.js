//balls can be moved around when tubes are clicked on
function addEvent(){
    clickTube = document.getElementsByClassName("tubepic")
    for (const elem of clickTube){
        elem.onclick = function(){
            var current = document.getElementsByClassName("selected");
            //if there is current active ball
            if (current.length != 0){
            //if same ball is selected then unselect ( so do nothing)
            //if different tube is selected then move active ball to tube
                if(verifyMove(current[0],this.nextSibling)){
                    if(this.nextSibling.firstChild != current[0]){
                        this.nextSibling.prepend(current[0])
                         if(verifyCompletion()){
                          alert("Nice!")
                         }
                    }
                }
            //then unselect
                current[0].className = current[0].className.replace(" selected", "");
            }else{
            //if there is no current active ball
                if (this.nextSibling.firstChild != null){
                    this.nextSibling.firstChild.className += " selected"
                }
            }
        }
    }
}
// to see if user is making valid move
function verifyMove(activeBall,targetTube){
    if(targetTube.childElementCount == 4) return false
    if(targetTube.firstChild == null) return true
    if(activeBall.style.backgroundColor != targetTube.firstChild.style.backgroundColor) return false
    return true
}
//to see if puzzle is completed when ball is manually moved
function verifyCompletion(){
    ballTube = document.getElementsByClassName("ballContainer")
    for (const elem of ballTube){
        if(elem.childElementCount == 0){continue}
        else if(elem.childElementCount < 4){return false}
        else if(sameColor(elem) == false) {return false}
    }
    return true

}
//checks if all tubes are of one color
function sameColor(ballstack){
    list = ballstack.children
    color = list[0].style.backgroundColor
    for (const elem of list){
        if(color != elem.style.backgroundColor) return false
    }
    return true
}
//adds flask
function addFlask(){
    container = document.getElementsByClassName("container")[0]
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
    if(document.getElementById("mySidenav").style.width == "250px"){
        if(document.getElementById("delButton").textContent == "Delete Mode: On"){
            deleteMode()
            deleteMode()
        }else{
            EditMode()
        }
    }else{
        addEvent()
    }

}
//converts tubes on html to an list of array of balls
function currentTubeToArray(){
    list = document.getElementsByClassName("ballContainer")
    listArray = []
    for (const tube of list){
        tubeArray = []
        balls = tube.children
        for(const ball of balls){
            tubeArray.push(ball.style.backgroundColor)
        }
        listArray.push(tubeArray)
    }
    return(listArray)
}
//ballSolver that produces a list of solution
function solveGrid(){
    if(!gridCheck(false)){
        alert("Invalid Grid")
        return
    }
    grid = currentTubeToArray()
    answer = []
    visitedPosition = new Set()
    t0 = performance.now()
    solved = solveGridRecursive(grid,visitedPosition,answer)
    t1 = performance.now()
    alert("Visited "+visitedPosition.size+" positions in "+eval(math.round(t1-t0))+" milliseconds with "+eval(answer.length-1)+" moves")
    container = document.getElementById("solution")
    while(container.firstChild){container.removeChild(container.firstChild)}
    if(!solved){
        alert("No solution")
        return
    }
    let answerSolutionArray = answerToSolution(answer)
    for(const array of answerSolutionArray){
        arrayDiv = document.createElement("div")
        arrayDiv.innerText = array
        container.appendChild(arrayDiv)


    }
}
//converts array of balls to string
function canonicalString(listArray){
    tubeStrings = []
    for (const tube of listArray){
        tubeStrings.push(tube.join())
        tubeStrings.sort()
    }
    return tubeStrings.join(";")
}
//solver
function solveGridRecursive(grid,visitedPosition,answer){
    visitedPosition.add(canonicalString(grid))
    for (const i of Array(grid.length).keys()){
        let tube = grid[i]
        for (const j of Array(grid.length).keys()){
            if (i==j){continue}
            let candidateTube = grid[j]
            if (isMoveValid(tube,candidateTube)){
                let grid2 = JSON.parse(JSON.stringify(grid))
                grid2[j].unshift(grid2[i].shift())
                if(isSolved(grid2)){
                    answer.unshift(grid.map(function(array){return array.length}),grid2.map(function(array){return array.length}))

                    return true
                }
                if(!visitedPosition.has(canonicalString(grid2)) ){
                    let solved = solveGridRecursive(grid2,visitedPosition,answer)
                    if (solved){
                        answer.unshift(grid.map(function(array){return array.length}))
                        return true
                    }
                }
            }

        }
    }
    return false
}
//for the array solver
function isMoveValid(fromTube,candidateTube){
    if (fromTube.length == 0 || candidateTube.length == 4) return false
    numFirstColor = fromTube.filter(x => x == fromTube[fromTube.length-1]).length
    if (numFirstColor == 4) return false
    if(candidateTube.length == 0){
        if (numFirstColor == fromTube.length) return false
        return true
    }
    return fromTube[0]===candidateTube[0]

}
//checks if solver is finished
function isSolved(grid){
    for (const tube of grid){
        if(tube.length==0) {continue}
        else if(tube.length < 4){return false}
        else if(tube.filter(x => x == tube[0]).length != 4) {return false}

    }
    return true

}
//unneeded
function printGridtoString(grid){
    lines = []
    for (const tube of grid){
        lines.push(tube.join(''))
    }
    return lines.join(" ")

}
//formatting the output of solution
function answerToSolution(list){
    let priorArray = []
    let solutionArray =[]
    let solutionArrayIndex = []
    for (const array of list ){
        if (priorArray.length == 0) {
            priorArray = array
            continue
        }
        for(let i = 0; i < array.length; i++){
            if(array[i] - priorArray[i] == 1){to = i+1}
            if(array[i] - priorArray[i] == -1){from = i+1}
        }
        priorArray = array
        solutionArray.push(from+" -> "+to)

    }
    return solutionArray
}
//takes the output of solution and plays it out step by step
function playSolution(){
    container = document.getElementById("solution")
    if (container.firstChild == null) return
    tubes = document.getElementsByClassName("ballContainer")
    fromTo = container.firstChild.textContent.split(' -> ')
    fromTube = tubes[fromTo[0]-1]
    toTube = tubes[fromTo[1]-1]
    toTube.prepend(fromTube.firstChild)
    container.removeChild(container.firstChild)


}
//open the editing tab
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("mySidenav").style.paddingLeft = "20px";
  document.getElementById("main").style.marginLeft = "250px";
  EditMode()
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("mySidenav").style.paddingLeft = "0px";
  document.getElementById("main").style.marginLeft = "0";
  addEvent()
}
//creates a new level
function newLevel(){
    let l = []
    let container = document.getElementsByClassName("container")[0]
    while(container.firstChild){container.removeChild(container.firstChild)}
    let numColor = Math.random() * (12 - 2) + 2;
    for (let step = 0; step < numColor; step++){
        color = CSS_COLOR_NAMES[step+25]
        l.push(color,color,color,color)
        addFlask()
    }
    l = shuffle(l)
    let a=JSON.parse(JSON.stringify(l))
    let tubes = document.getElementsByClassName('ballContainer')
    for (const tube of tubes){
        for (let step = 0; step < 4; step++){
            var ball = document.createElement("span")
            ball.className = "dot dotInTube"
            ball.style.backgroundColor = l.shift()
            ball.title = ball.style.backgroundColor
            tube.prepend(ball)
        }

    }
    addFlask()
    addFlask()
    localStorage.setItem("shuffledballs",a)

}
//fisher yates shuffle, randomises array
function shuffle(array) {
  var currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
//reset state to previous new level
function retryLevel(){
    let container = document.getElementsByClassName("container")[0]
    while(container.firstChild){container.removeChild(container.firstChild)}
    let shuffledballs = localStorage.getItem("shuffledballs").split(',')
    let numTubes = shuffledballs.length/4
    let tubes = document.getElementsByClassName('ballContainer')
    for (let step = 0; step < numTubes; step++){addFlask()}
    for (const tube of tubes){
        for (let step = 0; step < 4; step++){
            var ball = document.createElement("span")
            ball.className = "dot dotInTube"
            ball.style.backgroundColor = shuffledballs.shift()
            ball.title = ball.style.backgroundColor
            tube.prepend(ball)
        }

    }
    addFlask()
    addFlask()
}
//save button
function saveState(){
    let currArray = currentTubeToArray()
    var flattendata = [].concat.apply([], currArray)
    let currArrayNum = currArray.map(function(array){return array.length})
    localStorage.setItem("saveBalls",flattendata)
    localStorage.setItem("saveTubeDistribution",currArrayNum)
}
//load button
function loadState(){
    let container = document.getElementsByClassName("container")[0]
    while(container.firstChild){container.removeChild(container.firstChild)}
    ballsColor = localStorage.getItem("saveBalls").split(',')
    tubeDist = localStorage.getItem("saveTubeDistribution").split(',')
    for (let step = 0; step < tubeDist.length; step++){addFlask()}
    let tubes = document.getElementsByClassName('ballContainer')
    i=0
    for (const tubeNum of tubeDist){
        for (let step = 0; step < tubeNum; step++){
            var ball = document.createElement("span")
            ball.className = "dot dotInTube"
            ball.style.backgroundColor = ballsColor.shift()
            ball.title = ball.style.backgroundColor
            tubes[i].append(ball)
        }
        i++
    }


}