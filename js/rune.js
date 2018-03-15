let pieces, radius, fft, analyzer, mapMouseX, mapMouseY, audio, toggleBtn, uploadBtn, uploadedAudio, bass, treble, mid, r, group
// let colorPalette = ["#F2E58E", "#65B5C2", "#E98176", "#E98176"]
// let colorPalette = ["#65B5C2", "#E98176", "#F2E58E", "#F2E58E"]
let colorPalette = ["#E98176", "#65B5C2", "#F2E58E", "#F2E58E"]

preload = () => {
  audio = loadSound("audio/decouverte_machu_picchu.mp3")
}

setup = () => {

  r = new Rune({
    container: "#canvas",
    width: windowWidth,
    height: windowHeight
  });

  toggleBtn = createButton("Play / Pause")

  toggleBtn.addClass("toggle-btn")

  toggleBtn.mousePressed(toggleAudio)

  analyzer = new p5.Amplitude()
  fft = new p5.FFT()
  audio.loop()

}


drawSVG = () => {

  group = r.group(r.width / 2, r.height / 2);


  level = analyzer.getLevel()
  fft.analyze()

  if (audio.isPlaying()) {
    bass = fft.getEnergy(100, 150)
    treble = fft.getEnergy(150, 250)
    mid = fft.getEnergy("mid")
  }

  let mapMid = map(mid, 0, 255, -100, 200)
  let scaleMid = map(mid, 0, 255, 1, 1.5)

  let mapTreble = map(treble, 0, 255, 200, 350)
  let scaleTreble = map(treble, 0, 255, 0, 1)

  let mapbass = map(bass, 0, 255, 50, 200)
  let scalebass = map(bass, 0, 255, 0.05, 1.2)

  mapMouseX = map(mouseX, 0, width, 1, 50)
  mapMouseXbass = map(mouseX, 0, width, 1, 5)
  mapMouseY = map(mouseY, 0, height, 2, 6)

  pieces = 20
  radius = 100


  for (i = 0; i < pieces; i += 0.1) {

    polygon(mapbass + i, mapbass - i, mapMouseXbass * i, 3, colorPalette[1], 0.5)
    polygon(mapMid - i*i, mapMid + i*i, mapMouseX - i*i, 3, colorPalette[2], 0.2)
    polygon(mapTreble + i / 2, mapTreble - i / 2, mapMouseY * i / 2, 3, colorPalette[3], 0.6)

  }

  r.draw();

}


toggleAudio = () => {

  level = analyzer.getLevel()
  fft.analyze()
  if (audio.isPlaying()) {
    bass = fft.getEnergy(100, 150)
    treble = fft.getEnergy(150, 250)
    mid = fft.getEnergy("mid")
  }
  audio.isPlaying() ? audio.pause() : audio.play()

  drawSVG()
}

polygon = (x, y, radius, npoints, color, strokeWidth) => {
  const angle = TWO_PI / npoints



  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = Math.ceil(x + cos(a) * radius)
    let sy = Math.ceil(y + sin(a) * radius)
    // r.rect(sx,sy,2,2,group)
    // .fill(color)
    // .stroke(false)
    // .rotate(TWO_PI / (pieces / 2))
    // .strokeWidth(10)
    let p = r.path(0, 0)
    .stroke(false)
    .fill(color)
    .lineTo(sx, sy)
    .strokeWidth(10)
  }

}
