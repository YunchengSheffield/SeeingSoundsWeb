let fileId,fontId
let hover
let hoverFrameCount

function introPage(){
    fill(255)
    textSize(height/10)
    text('Seeing the Sound',width/2,height*0.15)
    textSize(height/20)
    let centerLeft = width*0.5
    // let centerRight = width*0.7
    // text("Sound Files",centerLeft,height*0.3);
    // text("Sound Fonts",centerRight,height*0.3);

    let fileKeys = Object.keys(baseInfo.files)
    textSize(height/30)
    for(let i = 0;i < fileKeys.length;i++){
        let s = baseInfo.files[fileKeys[i]]
        fill(255)
        text(s,centerLeft,height*0.35+(i+1)*height*0.08);
        noStroke()
        fill(255,100);
        if(fileId == i || (abs(mouseX-centerLeft) < width/2 && abs(mouseY - (height*0.35+(i+1)*height*0.08)) < height*0.04)){
            rect(centerLeft,height*0.35+(i+1)*height*0.08,textWidth(s)*1.2,height/20,height/60);
            // if(mouseIsPressed){
            //     fileId = i
            // }
        }
    }

    // let fontKeys = Object.keys(baseInfo.fonts)
    // for(let i = 0;i < fontKeys.length;i++){
    //     let s = baseInfo.fonts[fontKeys[i]]
    //     fill(255)
    //     fill(255)
    //     text(s,centerRight,height*0.35+(i+1)*height*0.08);
    //     fill(255,100);
    //     if(fontId == i || (mouseX > width/2 && abs(mouseY - (height*0.35+(i+1)*height*0.08)) < height*0.04)){
    //         rect(centerRight,height*0.35+(i+1)*height*0.08,textWidth(s)*1.2,height/20,height/60);
    //         if(mouseIsPressed){
    //             fontId = i
    //         }
    //     }
    // }

    // if(fileId != -1 && fontId != -1){
    //     fill(255)
    //     textSize(height/15);
    //     let s = "GO"
    //     if(dist(mouseX,mouseY,width/2,height*0.8) < height/16){
    //         if(!hover)
    //             hoverFrameCount = frameCount
    //         hover = true
    //         for(let i = 1;i < ((frameCount-hoverFrameCount)/20) % 4;i++)
    //             s += " >"
    //     }
    //     text(s,width/2,height*0.8);
    // }else{
    //     hover = false
    // }
}

function introPageMousePressed(){
    // if(fileId != -1 && fontId != -1 && dist(mouseX,mouseY,width/2,height*0.8) < height/16){
    //     onLoading = true
    //     page = 1
    //     console.log("fileId: "+fileId+"; fontId: "+fontId)
    //     musicInfo = loadJSON(serverURL+'/notes_and_sound/' + fileId + ',' + fontId,'json',loadSynthsisedSound,jsonError)
    // }
    let centerLeft = width*0.5
    let fileKeys = Object.keys(baseInfo.files)
    for(let i = 0;i < fileKeys.length;i++){
        if((abs(mouseX-centerLeft) < width/2 && abs(mouseY - (height*0.35+(i+1)*height*0.08)) < height*0.04)){
            fileId = i
            onLoading = true
            page = 1
            console.log("fileId: "+fileId+"; fontId: "+fontId)
            musicInfo = loadJSON(serverURL+'/notes_and_sound/' + fileId + ',' + fontId,'json',loadSynthsisedSound,jsonError)
            break;
        }
    }
}

function introPageKeyPressed(){

}

function loadSynthsisedSound(){
    console.log(musicInfo)
    synthSound = loadSound(serverURL+'/wav/'+musicInfo.sound_file,function(){onLoading = false;setMainPage()},jsonError)
}

function setintroPage(){
    fileId = 0
    fontId = 0
    onError = false
    onLoading = false
    hover = false
}