let serverURL = 'https://mymidiserver.herokuapp.com/'
let sound
let baseInfo
let onError = false;
let errorTime = 0;
let page = 0;
let initalised = false;

function setup() {
  createCanvas(windowWidth, windowHeight).parent('sketch-holder')
  baseInfo = loadJSON(serverURL + '/MIDI_files_and_sound_font','json',function(){initalised = true;},jsonError)
  setintroPage()
  textAlign(CENTER,CENTER)
  rectMode(CENTER)
  colorMode(HSB,255,255,255,255)
}

function draw() {
  background(0);
  if(showLoading(!initalised))
    return
  if(onError){
    fill(255);
    text("Sever Error",width/2,height/2);
    if(millis() - errorTime > 2000){
      setintroPage();
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