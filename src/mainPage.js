let musicInfo
let onLoading
let synthSound
let menuHeight
let showBarLine
let timeLinePos
let barLength
let totalLength
let barCount
let trackCount
let plotStart
let plotW
let plotH
let barW
let barH
let showInstruction
let saveFrame

function mainPage(){
    if(showLoading(onLoading))
        return
    topLeftMenu()
    playButton()
    musicPlot()
    topRightMenu()
}

function musicPlot(){
    //bar line
    rectMode(CORNER)
    textSize(height/40)
    stroke(255,100)
    if(showBarLine){
        for(let i = 0;i < trackCount;i++){
            for(let j = 0;j < barCount;j++){
                let x = plotStart.x+(barW)*j
                let y = plotStart.y+(barH)*i
                noFill();
                rect(x,y,barW,barH);
                if(i == trackCount-1){
                    fill(255,100)
                    text(j,x,plotStart.y+(barH)*trackCount+height/50)
                }
            }
        }
        fill(255,100)
        text(barCount,plotStart.x+(barW)*barCount,plotStart.y+(barH)*trackCount+height/50)
    }
    rectMode(CENTER)

    //track name
    for(let i = 0;i < trackCount;i++){
        let s = musicInfo.instruments[i].name
        let y = plotStart.y+(plotH/trackCount)*(i+0.5)
        fill(255)
        textSize(height/80)
        push()
        translate((width-plotW)*0.3,y)
        rotate(-PI/2)
        text(s,0,0,plotH/trackCount,plotStart.x)
        pop()
    }

    //music tune
    strokeWeight(3)
    for(let i = 0;i < trackCount;i++){
        stroke(i*(255.0/trackCount),255,255)
        let notes = musicInfo.instruments[i].notes
        for(let j = 0;j < notes.length;j++){
            let note = notes[j]
            let sx = plotStart.x+map(note.start,0,barLength,0,barW);
            let y = plotStart.y+(barH)*i+map(note.pitch,108,21,0,barH);
            let ex = plotStart.x+map(note.end,0,barLength,0,barW);;
            line(sx,y,ex,y)
        }
    }

    //timeline
    stroke(0,255,255)
    line(timeLinePos,plotStart.y+(barH)*trackCount,timeLinePos,plotStart.y)
    strokeWeight(1)
    noStroke()
    if(synthSound.isPlaying()){
        timeLinePos = map(synthSound.currentTime(),0,barLength,plotStart.x,plotStart.x+barW)
    }
}

function topLeftMenu(){
    fill(255)
    textSize(height/40);
    let m = height/20
    text(musicInfo.file_name,textWidth(musicInfo.file_name)*0.5+m*1.2,menuHeight);
    text("<",m/2,menuHeight)

    if(dist(mouseX,mouseY,m/2,menuHeight) < m/2){
        fill(255,100)
        ellipse(m/2,menuHeight,m*0.8,m*0.8)
    }
}

function topRightMenu(){
    let m = height/20
    textSize(height/40);
    noFill()
    stroke(255)
    strokeWeight(2)
    ellipse(width-m/2,menuHeight,m*0.6,m*0.6)
    strokeWeight(1)
    fill(255)
    text("i",width-m/2,menuHeight)

    if(dist(mouseX,mouseY,width-m/2,menuHeight) < m/2){
        fill(255,100)
        noStroke()
        ellipse(width-m/2,menuHeight,m*0.8,m*0.8)
    }else{
        if(showInstruction != 1)
            showInstruction = 0
    }

    if(showInstruction == 1 || (dist(mouseX,mouseY,width-m/2,menuHeight) < m/2 && showInstruction != 2)){
        fill(255,80)
        noStroke()
        rect(width-m*2.6,menuHeight+m*2.2,-m*5,m*3.5,m*0.2)
        textSize(height/40)
        fill(255)
        textAlign(RIGHT)
        text("s:\nspace:\n-/+:\nmouse:\nb:",width-m*3.2,menuHeight+m*2.2)
        textAlign(LEFT)
        text(" save,\n play/pause\n zoom in/out\n set time\n show grid",width-m*3.2,menuHeight+m*2.2)
        textAlign(CENTER)
    }

    //download Image
}

function playButton(){
    if(synthSound.isPlaying()){
        let x = width/2
        let y = menuHeight
        let l = 20
        let w = 10;
        let h = 30;
        rect(width/2-w,y,w,h)
        rect(width/2+w,y,w,h)
        if(dist(mouseX,mouseY,x,y) < l*1.4 ){
            fill(255,100)
            ellipse(x,y,l*2.6,l*2.6)
        }
    }else{
        fill(255)
        let x = width/2
        let y = menuHeight
        let l = 20
        triangle(x+l*cos(0),y+l*sin(0),x+l*cos(2*PI/3),y+l*sin(2*PI/3),x+l*cos(4*PI/3),y+l*sin(4*PI/3));
        if(dist(mouseX,mouseY,x,y) < l*1.4 ){
            fill(255,100)
            ellipse(x,y,l*2.6,l*2.6)
        }
    }
}

function showLoading(l){
    if(l){
        fill(255)
        textSize(height/15);
        let s = "Loading"
        // if(dist(mouseX,mouseY,width/2,height*0.8) < height/16){
            for(let i = 1;i < (frameCount/20) % 4;i++)
                s += "."
        // }
        text(s,width/2,height*0.5);
        return true
    }
}

function setMainPage(){
    onError = false
    onLoading = false
    menuHeight = height/20
    showBarLine = false
    barLength = musicInfo.time_signature.numerator * (musicInfo.time_signature.quarterNoteDuration/(musicInfo.time_signature.denominator/4))
    totalLength = musicInfo.time_signature.time
    barCount = ceil(totalLength/barLength)
    trackCount = musicInfo.instruments.length
    plotW = width*0.9
    plotH = height*0.85
    barW = plotW/barCount
    barH = plotH/trackCount
    plotStart = createVector((width-plotW)*0.66,(height-plotH)*0.6)
    timeLinePos = plotStart.x
    showInstruction = 0
    saveFrame = createGraphics(width, plotH*1.04)
}

function mainPageMousePressed(){
    //play button
    let x = width/2
    let y = menuHeight
    let m = height/20
    let l = 20
    if(dist(mouseX,mouseY,x,y) < l*1.4 ){
        if(synthSound.isPlaying()){
            synthSound.pause()
        }else{
            synthSound.play()
        }
    }
    //back
    else if(dist(mouseX,mouseY,m/2,menuHeight) < m/2){
        page = 0
        if(synthSound.isPlaying()){
            synthSound.pause()
        }
    }
    //info
    else if(dist(mouseX,mouseY,width-m/2,menuHeight) < m/2){
        if(showInstruction == 0 || showInstruction == 2)
            showInstruction = 1
        else if(showInstruction == 1)
            showInstruction = 2
    }
}

function mainPageKeyPressed(){
    if(key == ' '){
        if(synthSound.isPlaying()){
            synthSound.pause()
        }else{
            synthSound.play()
        }
    }else if(key == 'b' || key == 'B'){
        showBarLine = !showBarLine
    }else if(key == 's' || key == 'S'){
        let c = get(0,plotStart.y-plotH*0.02, width, plotStart.y+plotH*1.02);
        saveFrame.image(c, 0, 0);
        save(saveFrame, musicInfo.file_name.split('.')[0]+".png");
    }
}