sideNav = document.getElementById("sideNavContainer")
circleSidebar(sideNav)
//creates balls in the side bar
function circleSidebar(sideNav){
//j determines number of colors in the sidebar
    for( let j=0; j<148;j++){
        node = document.createElement("span")
        node.className = "dot sideDot"
        node.style.backgroundColor = CSS_COLOR_NAMES[j]
        node.title = CSS_COLOR_NAMES[j]
        node.onclick=function(){
            var current = document.getElementById("highlighted");
            if(current != null ){
                current.removeAttribute('id')
            }
            this.id = "highlighted"


        }
        sideNav.prepend(node)
    }
}
//deletes ball on top of tube when tube is clicked on
function deleteMode(){
    button = document.getElementById("delButton")
    if(button.textContent == "Delete Mode: Off"){
        clickTube = document.getElementsByClassName("tube")
        for (const elem of clickTube){
            elem.onclick = function(){
               if(this.children[1].childElementCount == 0) return
               this.children[1].removeChild(this.children[1].firstChild)
            }
        }
        button.textContent = "Delete Mode: On"
    }else{
        EditMode()
        button.textContent = "Delete Mode: Off"
    }

}
//removes flask from html
function reduceFlask(){
    tubes = document.getElementsByClassName("tube")
    if (tubes.length == 0) return
    lastTube = tubes[tubes.length-1]
    lastTube.remove()
}
//add enlarged ball to tube when tube is clicked on
function EditMode(){
    clickTube = document.getElementsByClassName("tube")
    for (const elem of clickTube){
            elem.onclick = function(){
                if(this.children[1].childElementCount == 4) return
                var ball = document.createElement("span")
                ball.className = "dot dotInTube"
                ball.style.backgroundColor = document.getElementById("highlighted").style.backgroundColor
                this.children[1].prepend(ball)
            }
        }
}
//check whether if grid is valid, input true is alert output is wanted,false otherwise
function gridCheck(alertState){
    numTubes = document.getElementsByClassName('container')[0].childElementCount
    tubeHeight = 4
    numBalls = document.getElementsByClassName('dotInTube').length
    numBallsRequired = (numTubes-2)*tubeHeight
    if(numBalls > numBallsRequired){
        if(alertState){alert('Grid has incorrect number of balls')}
        return false
    }
    var dict = {}
    for (ball of document.getElementsByClassName('dotInTube')){
        if (ball.style.backgroundColor in dict){
            dict[ball.style.backgroundColor] += 1
        }else{
            dict[ball.style.backgroundColor] = 1
        }
    }
    for (const [key,value] of Object.entries(dict)){
        if (value != 4){
            if(alertState){alert("Expected "+tubeHeight+" "+key+" balls, found "+value)}
            return false
        }
    }
    if(alertState){alert("Grid is valid")}
    return true
}
function filterColor(){
     let searchbar = document.getElementById("refdocs")
     let list = document.getElementsByClassName('sideDot')
     string = searchbar.value
     for (balls of list){
        otherString = balls.style.backgroundColor
        if(otherString.match(new RegExp(string,'i'))){
            balls.style.display = "block"
        }else{
            balls.style.display = "none"
        }
     }


}