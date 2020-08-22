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
let plotScale
let downloadIcon
let plotShift
let keyPressTime
let showIntro
let pressOnResume
let drawTimeLine
let drawPlotShift
let onSwitch

function mainPage() {
    if (showLoadingWithIntro(onLoading))
        return

    push()
    if (!mouseIsPressed) {
        plotShift = width / 2 - timeLinePos
    }
    showScrollHorizontalArea()

    plotShift = constrain(plotShift, -(plotW * (plotScale - 1)), 0)
    drawPlotShift += (plotShift - drawPlotShift) / 10
    translate(drawPlotShift, 0)
    // translate(plotShift, 0)
    musicPlot()
    pop()
    showTrackName()

    topLeftMenu()
    playButton()
    topRightMenu()

    console.log(getFrameRate())
    
    if (keyIsPressed && millis() - keyPressTime > 500) {
        if (key == '-' || key == '_') {
            let tmpTime = map(timeLinePos, 0, barW * plotScale, 0, barLength)

            plotScale -= 0.05;
            if (plotScale < 1)
                plotScale = 1

            timeLinePos = map(tmpTime, 0, barLength, 0, barW * plotScale)
            timeLinePos = constrain(timeLinePos, 0, plotW * plotScale)

            plotShift = width / 2 - timeLinePos
            plotShift = constrain(plotShift, -(plotW * (plotScale - 1)), 0)

        } else if (key == '=' || key == '+') {
            let tmpTime = map(timeLinePos, 0, barW * plotScale, 0, barLength)
            plotScale += 0.05;

            timeLinePos = map(tmpTime, 0, barLength, 0, barW * plotScale)
            timeLinePos = constrain(timeLinePos, 0, plotW * plotScale)

            plotShift = width / 2 - timeLinePos
            plotShift = constrain(plotShift, -(plotW * (plotScale - 1)), 0)

        }
    }
}

function showScrollHorizontalArea(){
    if(mouseIsPressed && mouseY > plotStart.y && mouseY < height && mouseX > 0 && mouseX < width){
        noStroke()
        fill(200,100)
        let tw = 40;
        let txl = plotStart.x*0.8+tw/2
        let ctw = (width - plotStart.x - plotW)
        let txr = width-ctw*0.8-tw/2
        push()
        if(plotScale != 1){
            rect(txl,plotStart.y+plotH/2,tw,plotH)
            rect(txr,plotStart.y+plotH/2,tw,plotH)
        }
        pop()

        if(mouseY > plotStart.y && abs(mouseX-txl) < tw/2){
            plotShift += 2*plotScale;
            setTimeLineToMouse()
        }else if(mouseY > plotStart.y && abs(mouseX-txr) < tw/2){
            plotShift -= 2*plotScale;
            setTimeLineToMouse()
        }
    }
}

function musicPlot() {
    //bar line
    rectMode(CORNER)
    textSize(height / 40)
    stroke(255, 80)
    if (showBarLine) {
        fill(255, 100)
        if (barW * plotScale > height / 10 || (barW * plotScale <= height / 10 && barCount % int(height / (10 * barW)) == 0)) {
            let x = plotStart.x + (barW * plotScale) * barCount
            text(barCount, plotStart.x + (barW * plotScale) * barCount, plotStart.y + (barH) * trackCount + height / 50)
            line(x, plotStart.y, x, plotStart.y + plotH)
        }
        for (let i = 0; i < trackCount; i++) {
            let y = plotStart.y + (barH) * i

            for (let j = 0; j < barCount; j++) {
                let x = plotStart.x + (barW * plotScale) * j

                if (barW * plotScale > height / 10 || (barW * plotScale <= height / 10 && j % int(height / (10 * barW)) == 0)) {
                    if (i == trackCount - 1) {
                        fill(255, 100)
                        text(j, x, plotStart.y + (barH) * trackCount + height / 50)
                    }
                    line(x, plotStart.y + (barH) * i, x, plotStart.y + (barH) * i + barH)
                }
            }

            line(plotStart.x, y, plotStart.x - plotShift + plotW * plotScale, y)
        }

        stroke(255, 100)
        line(plotStart.x, plotStart.y + (barH) * trackCount, plotStart.x - plotShift + plotW * plotScale, plotStart.y + (barH) * trackCount)
    }
    rectMode(CENTER)

    //music tune
    strokeWeight(3)
    for (let i = 0; i < trackCount; i++) {
        stroke(i * (255.0 / trackCount), 255, 255)
        let notes = musicInfo.instruments[i].notes
        for (let j = 0; j < notes.length; j++) {
            let note = notes[j]
            let sx = plotStart.x + map(note.start, 0, barLength, 0, barW * plotScale);
            let y = plotStart.y + (barH) * i + map(note.pitch, 108, 21, 0, barH);
            let ex = plotStart.x + map(note.end, 0, barLength, 0, barW * plotScale);
            line(sx, y, ex, y)
        }
    }

    //timeline
    drawTimeLine += (timeLinePos - drawTimeLine) / 5;
    stroke(0, 255, 255)
    if (drawTimeLine > plotStart.x - plotStart.x)
        line(plotStart.x + drawTimeLine, plotStart.y + (barH) * trackCount, plotStart.x + drawTimeLine, plotStart.y)
    // if (timeLinePos > plotStart.x - plotStart.x)
        // line(plotStart.x + timeLinePos, plotStart.y + (barH) * trackCount, plotStart.x + timeLinePos, plotStart.y)
    strokeWeight(1)
    noStroke()
    if (synthSound.isPlaying()) {
        if(!onSwitch){
            onSwitch = true
            return
        }
        timeLinePos = map(synthSound.currentTime(), 0, barLength, 0, barW * plotScale)
    }else{
        onSwitch = false
    }
    // console.log(timeLinePos)
}

function showTrackName() {
    //cover
    noStroke()
    fill(0)
    rect(plotStart.x * 0.4, height / 2, plotStart.x * 0.8, height)
    let ctw = (width - plotStart.x - plotW)
    rect(width - ctw * 0.4, height / 2, ctw * 0.8, height)

    //track name
    for (let i = 0; i < trackCount; i++) {
        let s = musicInfo.instruments[i].name
        let y = plotStart.y + (plotH / trackCount) * (i + 0.5)
        fill(255)
        textSize(height / 80)
        push()
        translate((width - plotW) * 0.3, y)
        rotate(-PI / 2)
        text(s, 0, 0, plotH / trackCount, plotStart.x)
        pop()
    }
}

function topLeftMenu() {
    fill(255)
    textSize(height / 40);
    let m = height / 20
    text(musicInfo.file_name, textWidth(musicInfo.file_name) * 0.5 + m * 1.2, menuHeight);
    text("<", m / 2, menuHeight)

    if (dist(mouseX, mouseY, m / 2, menuHeight) < m / 2) {
        fill(255, 100)
        noStroke()
        ellipse(m / 2, menuHeight, m * 0.8, m * 0.8)
    }
}

function topRightMenu() {
    let m = height / 20
    textSize(height / 40);
    noFill()
    stroke(255)
    strokeWeight(2)
    ellipse(width - m / 2, menuHeight, m * 0.6, m * 0.6)
    strokeWeight(1)
    fill(255)
    text("i", width - m / 2, menuHeight)

    if (dist(mouseX, mouseY, width - m / 2, menuHeight) < m / 2) {
        fill(255, 100)
        noStroke()
        ellipse(width - m / 2, menuHeight, m * 0.9, m * 0.9)
    } else {
        if (showInstruction != 1)
            showInstruction = 0
    }

    if (showInstruction == 1 || (dist(mouseX, mouseY, width - m / 2, menuHeight) < m / 2 && showInstruction != 2)) {
        fill(255, 80)
        noStroke()
        rect(width - m * 2.6, menuHeight + m * 2.2, -m * 5, m * 3.5, m * 0.2)
        textSize(height / 40)
        fill(255)
        textAlign(RIGHT)
        text("s:\nspace:\n-/+:\nmouse:\nb:", width - m * 3.2, menuHeight + m * 2.2)
        textAlign(LEFT)
        text(" Save\n Play/pause\n Zoom in/out\n Set time\n Show grid", width - m * 3.2, menuHeight + m * 2.2)
        textAlign(CENTER)
    }

    //download Image
    image(downloadIcon, width - m * 1.5, menuHeight)
    if (dist(mouseX, mouseY, width - m * 1.5, menuHeight) < m / 2) {
        fill(255, 100)
        noStroke()
        ellipse(width - m * 1.5, menuHeight, m * 0.9, m * 0.9)
    }
}

function playButton() {
    if (synthSound.isPlaying()) {
        let x = width / 2
        let y = menuHeight
        let l = 20
        let w = 10;
        let h = 30;
        fill(255)
        noStroke()
        rect(width / 2 - w, y, w, h)
        rect(width / 2 + w, y, w, h)
        if (dist(mouseX, mouseY, x, y) < l * 1.4) {
            fill(255, 100)
            noStroke()
            ellipse(x, y, l * 2.6, l * 2.6)
        }
    } else {
        fill(255)
        let x = width / 2
        let y = menuHeight
        let l = 20
        noStroke()
        triangle(x + l * cos(0), y + l * sin(0), x + l * cos(2 * PI / 3), y + l * sin(2 * PI / 3), x + l * cos(4 * PI / 3), y + l * sin(4 * PI / 3));
        if (dist(mouseX, mouseY, x, y) < l * 1.4) {
            fill(255, 100)
            noStroke
            ellipse(x, y, l * 2.6, l * 2.6)
        }
    }
}

function showLoadingWithIntro(l) {
    if (l || millis() - showIntro < 2000) {
        fill(255)
        textSize(height / 10);
        text("Instruction",width/2,height*0.15)
        textSize(height / 15);

        textAlign(RIGHT)
        text("s:\nspace:\n-/+:\nmouse:\nb:", width / 2.1, height / 2)
        textAlign(LEFT)
        text(" Save\n Play/pause\n Zoom in/out\n Set time\n Show grid", width / 2, height / 2)
        textAlign(CENTER)

        textSize(height / 30);
        let s = "Loading"
        // if(dist(mouseX,mouseY,width/2,height*0.8) < height/16){
        for (let i = 1; i < (frameCount / 20) % 4; i++)
            s += "."
        // }
        text(s, width / 2, height * 0.9);
        return true
    }
}

function showLoading(l) {
    if (l) {
        fill(255)
        textSize(height / 15);
        let s = "Loading"
        // if(dist(mouseX,mouseY,width/2,height*0.8) < height/16){
        for (let i = 1; i < (frameCount / 20) % 4; i++)
            s += "."
        // }
        text(s, width / 2, height * 0.5);
        return true
    }
}

function setMainPage() {
    onError = false
    onLoading = false
    menuHeight = height / 20
    showBarLine = false
    barLength = musicInfo.time_signature.numerator * (musicInfo.time_signature.quarterNoteDuration / (musicInfo.time_signature.denominator / 4))
    totalLength = musicInfo.time_signature.time
    barCount = ceil(totalLength / barLength)
    trackCount = musicInfo.instruments.length
    plotW = width * 0.9
    plotH = height * 0.85
    barW = plotW / barCount
    barH = plotH / trackCount
    plotScale = 1
    plotStart = createVector((width - plotW) * 0.66, (height - plotH) * 0.6)
    timeLinePos = 0
    showInstruction = 0
    saveFrame = createGraphics(width, plotH * 1.04)
    plotShift = 0
    keyPressTime = 0
    drawTimeLine = 0
    drawPlotShift = 0
    pressOnResume = false
    onSwitch = false;
    showIntro = millis()
}

function setTimeLineToMouse() {
    timeLinePos = map(mouseX, plotStart.x, plotStart.x + plotW, -plotShift, -plotShift + plotW)
    timeLinePos = constrain(timeLinePos, -plotShift, min(plotW * plotScale, -plotShift + plotW))
}

function mainPageMouseDragged() {
    let m = height / 20
    if (mouseY > menuHeight + m * 0.6 && mouseX > plotStart.x - plotW * 0.05 && mouseX < plotStart.x + plotW * 1.05) {
        setTimeLineToMouse()
    }
}

function mainPageMouseReleased() {
    let m = height / 20
    if (!synthSound.isPlaying() && mouseY > menuHeight + m * 0.6 && mouseX > plotStart.x - plotW * 0.05 && mouseX < plotStart.x + plotW * 1.05) {
        setTimeLineToMouse()
        let t = map(timeLinePos, 0, barW * plotScale, 0, barLength)
        // synthSound.stop()
        synthSound.jump(t)
    }
}

function mainPageMousePressed() {
    //play button
    let x = width / 2
    let y = menuHeight
    let m = height / 20
    let l = 20

    if (mouseY > menuHeight + m * 0.6 && mouseX > plotStart.x - plotW * 0.05 && mouseX < plotStart.x + plotW * 1.05) {
        if(synthSound.isPlaying())
            pressOnResume = true
        else
            pressOnResume = false
        synthSound.stop()
        // synthSound.pause()
        setTimeLineToMouse()
    }
    //play button
    else if (dist(mouseX, mouseY, x, y) < l * 1.4) {
        if (synthSound.isPlaying()) {
            synthSound.pause()
        } else {
            synthSound.play()
        }
    }
    //back
    else if (dist(mouseX, mouseY, m / 2, menuHeight) < m / 2) {
        page = 0
        fileInit()
        input.show()
        fileErrorMessage = ""
        if (synthSound.isPlaying()) {
            synthSound.pause()
        }
    }
    //info
    else if (dist(mouseX, mouseY, width - m / 2, menuHeight) < m / 2) {
        if (showInstruction == 0 || showInstruction == 2)
            showInstruction = 1
        else if (showInstruction == 1)
            showInstruction = 2
    }
    //wav download
    else if (dist(mouseX, mouseY, width - m * 1.5, menuHeight) < m / 2) {
        save(synthSound, musicInfo.file_name.split('.')[0] + ".wav");
    }
}

function mainPageKeyPressed() {
    if (key == ' ') {
        if (synthSound.isPlaying()) {
            synthSound.pause()
        } else {
            // synthSound.jump()
            synthSound.play()
        }
    } else if (key == 'b' || key == 'B') {
        showBarLine = !showBarLine
    } else if (key == 's' || key == 'S') {
        let c = get(0, plotStart.y - plotH * 0.02, width, plotStart.y + plotH * 1.02);
        saveFrame.image(c, 0, 0);
        save(saveFrame, musicInfo.file_name.split('.')[0] + ".png");
    } else if (key == '-' || key == '_') {
        keyPressTime = millis()
        let tmpTime = map(timeLinePos, 0, barW * plotScale, 0, barLength)

        plotScale -= 0.2;
        if (plotScale < 1)
            plotScale = 1

        timeLinePos = map(tmpTime, 0, barLength, 0, barW * plotScale)
        timeLinePos = constrain(timeLinePos, 0, plotW * plotScale)

        plotShift = width / 2 - timeLinePos
        plotShift = constrain(plotShift, -(plotW * (plotScale - 1)), 0)

    } else if (key == '=' || key == '+') {
        keyPressTime = millis()
        let tmpTime = map(timeLinePos, 0, barW * plotScale, 0, barLength)
        plotScale += 0.2;

        timeLinePos = map(tmpTime, 0, barLength, 0, barW * plotScale)
        timeLinePos = constrain(timeLinePos, 0, plotW * plotScale)

        plotShift = width / 2 - timeLinePos
        plotShift = constrain(plotShift, -(plotW * (plotScale - 1)), 0)
    }
}