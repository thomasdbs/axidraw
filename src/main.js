//VARIABLES POUR CALCULS
let pieces, radius, fft, analyzer, mapMouseX, mapMouseY, audio, bass, treble, mid

//COULEURS
const white = '#FFFFFF'
let bgColor = '#E98176'
let polygonsColor = '#65B5C2'
let linesColor = '#F2E58E'


//ELEMENTS DU DOM
const body = document.querySelector('body')
const actions = document.querySelector('.actions')
const buttons = document.querySelectorAll('.action-button')
const userCircleButtons = document.querySelectorAll('.btn-circle')
const text = document.querySelectorAll('.white-text')
const projectTitle = document.querySelector('.project-title')
const footer = document.querySelector('footer')


const discoverButton = document.querySelector('#discover')
discoverButton.addEventListener('click', () => scrollToProject())

const soundButton = document.querySelector('#toggle-sound')
soundButton.addEventListener('click', () => toggleSound())

const slideRight = document.querySelector('#slide-right')
slideRight.addEventListener('click', () => changeSlide('next'))
const slideLeft = document.querySelector('#slide-left')
slideLeft.addEventListener('click', () => changeSlide('prev'))

const captureAnimationButton = document.querySelector('#capture-animation')
captureAnimationButton.addEventListener('click', () => captureAnimation())

const bgButton = document.querySelector('#bg')
const bgState = document.querySelector('#bg span')
bgButton.addEventListener('click', () => toggleBg())
const linesButton = document.querySelector('#lines')
const linesState = document.querySelector('#lines span')
linesButton.addEventListener('click', () => toggleLines())
const polygonsButton = document.querySelector('#polygons')
const polygonsState = document.querySelector('#polygons span')
polygonsButton.addEventListener('click', () => togglePolygons())

const bgInput = document.querySelector('#bg-input input')
const bgInputLabel = document.querySelector('#bg-input')
bgInput.addEventListener('change', () => changeBgColor(bgInput.value, true))
const linesInput = document.querySelector('#lines-input input')
const linesInputLabel = document.querySelector('#lines-input')
linesInput.addEventListener('change', () => changeLinesColor())
const polygonsInput = document.querySelector('#polygons-input input')
const polygonsInputLabel = document.querySelector('#polygons-input')
polygonsInput.addEventListener('change', () => changePolygonsColor())

//DONNEES PERSONNALISABLES PAR L'UTILISATEUR
let chosenBgColor = '#E98176'
let svg = false
let lines = true
let polygons = true


preload = () => {
	audio = loadSound("audio/decouverte_machu_picchu.mp3")
}

setup = () => {

	const canvas = createCanvas(window.innerWidth, windowHeight)
	canvas.parent('project')
	projectTitle.style.backgroundColor = chosenBgColor
	footer.style.backgroundColor = chosenBgColor
	body.style.backgroundColor = chosenBgColor

	analyzer = new p5.Amplitude()
	fft = new p5.FFT()
	audio.loop()

}

changeSlide = (direction) => {
	const current = document.querySelector('.slide.current')
	let slideNumber = parseInt(current.dataset.slide)
	if (direction === 'next') {
		if (slideNumber === 4) {
			slideNumber = 1
		}else {
			slideNumber += 1
		}
	}else {
		if (slideNumber === 1) {
			slideNumber = 4
		}else {
			slideNumber -= 1
		}
	}
	current.classList.remove('current')
	setTimeout( () => {
		current.classList.add('none')
		document.querySelector(`.slide[data-slide='${slideNumber}']`).classList.remove('none')
	}, 500)
	setTimeout( () => {
		document.querySelector(`.slide[data-slide='${slideNumber}']`).classList.add('current')
	}, 600)

}

toggleSound = () => {
	if (audio.isPlaying()) {
		audio.pause()
	}else {
		audio.play()
	}
	document.querySelector('#toggle-sound i').classList.toggle('ion-ios-play-outline')
}

scrollToProject = () => {
	document.querySelector('#project').scrollIntoView({
		behavior: 'smooth'
	})
}

changeLinesColor = () => {
	linesColor = linesInput.value
}

changePolygonsColor = () => {
	polygonsColor = polygonsInput.value
}

toggleBg = () => {

	document.querySelector('#bg-input').classList.toggle('none')

	if(chosenBgColor === white) {
		chosenBgColor = bgColor
		bgState.innerHTML = 'OK'
		if (tinycolor(chosenBgColor).getBrightness() < 200) {
			buttons.forEach( (button) => {
				button.classList.remove('black-button')
			})
		}
	}else {
		buttons.forEach( (button) => {
			button.classList.add('black-button')
		})
		chosenBgColor = white
		bgState.innerHTML = 'KO'
	}

	changeBgColor(chosenBgColor)

}

changeBgColor = (value, input = false) => {

	if (input === true) {
		bgColor = value
	}
	chosenBgColor = value
	projectTitle.style.backgroundColor = chosenBgColor
	footer.style.backgroundColor = chosenBgColor
	body.style.backgroundColor = chosenBgColor

	if (tinycolor(value).getBrightness() >= 200) {
		body.classList.add('black-text')
		text.forEach((t) => {t.classList.add('black-text')})
		buttons.forEach((b) => {b.classList.add('black-button')})
		userCircleButtons.forEach((b) => {b.classList.add('black-button')})
	}else {
		if (body.classList.contains('black-text')) {
			body.classList.remove('black-text')
			userCircleButtons.forEach((b) => {b.classList.remove('black-button')})
			buttons.forEach((b) => {b.classList.remove('black-button')})
			text.forEach((t) => {t.classList.remove('black-text')})
		}
	}
}

toggleLines = () => {
	document.querySelector('#lines-input').classList.toggle('none')
	lines = !lines
	if(linesState.innerHTML === 'KO') {
		linesState.innerHTML = 'OK'
	}else {
		linesState.innerHTML = 'KO'
	}
}

togglePolygons = () => {
	document.querySelector('#polygons-input').classList.toggle('none')
	polygons = !polygons
	if(polygonsState.innerHTML === 'KO') {
		polygonsState.innerHTML = 'OK'
	}else {
		polygonsState.innerHTML = 'KO'
	}
}

draw = () => {
	audio.isPlaying() && generate()
}

drawSVG = () => {

	createCanvas(window.innerWidth, windowHeight, SVG)
	// svg.parent('project')
	// createCanvas(window.innerWidth, windowHeight, SVG)
	document.querySelector('#project').appendChild(document.querySelector('#defaultCanvas0'));


	const createdSVG = document.querySelector('svg')
	createdSVG.style.width = window.innerWidth
	createdSVG.style.height = windowHeight

	const scale = document.querySelector('svg > g')
	scale.style.transform='scale(1)'

	generate(true)

}

generate = (isSVG = false) => {

	background(chosenBgColor)

	translate(window.innerWidth / 2, windowHeight / 2)

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
	radius = 80

	for (i = 0; i < pieces; i += 0.1) {

		rotate(TWO_PI / (pieces / 2))
		noFill()

		if (polygons === true) {

			// BASS
			push()
			stroke(polygonsColor)
			audio.isPlaying() && rotate(frameCount * 0.002)
			strokeWeight(0.5)
			polygon(mapbass + i, mapbass - i, mapMouseXbass * i, 3)
			pop()

		}

		if (lines === true) {

			// MID
			push()
			stroke(linesColor)
			strokeWeight(0.2)
			polygon(mapMid - i*i, mapMid + i*i, mapMouseX - i*i, 3)
			pop()

			// TREMBLE

			if (i%2 === 0) {
				push()
				stroke(linesColor)
				strokeWeight(1.6)
				scale(0.2)
				audio.isPlaying() && rotate((mouseX * 0.002))
				polygon(mapTreble + i / 2, mapTreble - i / 2, mapMouseY/2 * i / 2, 3)
				pop()
			}

		}

	}

	if (isSVG === true) {
		noLoop()
	}

}

keyPressed = () => {
	(keyCode === 32) && (
		(svg === false) ?
		captureAnimation()
		:
		reload()
	)
}

captureAnimation = () => {

	svg = true
	level = analyzer.getLevel()
	fft.analyze()

	if (audio.isPlaying()) {
		bass = fft.getEnergy(100, 150)
		treble = fft.getEnergy(150, 250)
		mid = fft.getEnergy("mid")
	}

	captureAnimationButton.remove()
	bgButton.remove()
	linesButton.remove()
	polygonsButton.remove()
	bgInputLabel.remove()
	linesInputLabel.remove()
	polygonsInputLabel.remove()

	const uploadButton = document.createElement("button")
	if (chosenBgColor === white) {
		uploadButton.className = 'action-button black-button'
	}else {
		uploadButton.className = 'action-button'
	}
	uploadButton.innerHTML = 'Télécharger'
	actions.appendChild(uploadButton)
	uploadButton.addEventListener('click', () => uploadSVG())

	const retryButton = document.createElement("button")
	if (chosenBgColor === white) {
		retryButton.className = 'action-button black-button'
	}else {
		retryButton.className = 'action-button'
	}
	retryButton.innerHTML = 'Recommencer'
	actions.appendChild(retryButton)
	retryButton.addEventListener('click', () => reload())

	audio.pause()
	drawSVG()

}

reload = () => {
	window.location.reload()
}

uploadSVG = () => {
	save('Axidraw.svg')
}

polygon = (x, y, radius, npoints) => {
	const angle = TWO_PI / npoints
	beginShape()
	for (let a = 0; a < TWO_PI; a += angle) {
		let sx = x + cos(a) * radius
		let sy = y + sin(a) * radius
		vertex(sx, sy)
	}
	endShape(CLOSE)
}
