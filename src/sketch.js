let serverURL = 'https://mymidiserver.herokuapp.com/'
serverURL = 'http://34.89.120.31'
serverURL = 'http://127.0.0.1:5000'
let sound
let baseInfo
let onError = false;
let errorTime = 0;
let page = 0;
let initalised = false;

function preload(){
  downloadIcon = loadImage("assets/download.png")
}

function setup() {
  createCanvas(windowWidth, windowHeight).parent('sketch-holder')
  baseInfo = loadJSON(serverURL + '/MIDI_files_and_sound_font','json',function(){initalised = true;input.show()},jsonError)
  
  downloadIcon.resize(height/30,0)
  setintroPage()
  textAlign(CENTER,CENTER)
  rectMode(CENTER)
  imageMode(CENTER)
  colorMode(HSB,255,255,255,255)
}

function draw() {
  background(0);
  if(showLoading(!initalised))
    return
  if(onError){
    fill(255);
    textSize(height/20)
    text("Sever Error",width/2,height/2);
    if(millis() - errorTime > 2000){
      setintroPage();
      input.show()
      page = 0;
    }
    return;
  }
  if(page == 0) introPage();
  else mainPage();
}

function mousePressed(){
  if(!onError && !onLoading && initalised){
    if(page == 0) introPageMousePressed()
    else mainPageMousePressed()
  }
}

function mouseDragged(){
  if(!onError && !onLoading && initalised){
    if(page == 1) mainPageMouseDragged()
  }
}

function mouseReleased(){
  if(!onError && !onLoading && initalised){
    if(page == 1) mainPageMouseReleased()
  }
}

function keyPressed(){
  if(!onError && !onLoading && initalised){
    if(page == 0) introPageKeyPressed()
    else mainPageKeyPressed()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function jsonError(){
  initalised = true;
  onError = true;
  errorTime = millis();
}