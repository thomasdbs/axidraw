//VARIABLES POUR CALCULS DU CANVAS
let pieces, radius, fft, analyzer, mapMouseX, mapMouseY, audio, bass, treble, mid

//BLANC => non personnalisable
const white = '#FFFFFF'

//COULEURS PAR DÉFAUT => personnalisables par l'utilisateur
let bgColor = '#E98176'
let polygonsColor = '#65B5C2'
let linesColor = '#F2E58E'

//DÉFINI SI LA COULEUR DE FOND DOIT ÊTRE BLANC OU CELLE CHOISIT PAR L'UTILISATEUR (WHITE OU BGCOLOR)
let chosenBgColor = bgColor

//INDIQUE SI ON EST EN MODE 'CANVAS' OU 'SVG'
let svg = false

//INDIQUE SI LES DIFFÉRENTS ÉLÉMENTS DU CANVAS SONT PRÉSENTS
let lines = true
let polygons = true

//BODY
const body = document.querySelector('body')

//ZONE DES BOUTONS D'ACTION DU CANVAS
const actions = document.querySelector('.actions')

//TOUS LES BOUTONS D'ACTION DU CANVAS
const buttons = document.querySelectorAll('.action-button')

//TOUS LES BOUTONS QUI NE SONT PAS EN LIEN AVEC LE CANVAS
const userCircleButtons = document.querySelectorAll('.btn-circle')

//TOUS LES TEXTES QUI PAR DÉFAUT SONT BLANCS
const text = document.querySelectorAll('.white-text')


//BOUTON SUR LE PREMIER FULLSCREEN QUI FAIT SCROLLER JUSQU'AU CANVAS
const discoverButton = document.querySelector('#discover')
discoverButton.addEventListener('click', () => scrollToProject())

//BOUTON QUI TOGGLE LE SON
const soundButton = document.querySelector('#toggle-sound')
soundButton.addEventListener('click', () => toggleSound())

//BOUTON QUI PASSE AU SLIDE SUIVANT
const slideRight = document.querySelector('#slide-right')
slideRight.addEventListener('click', () => changeSlide('next'))

//BOUTON QUI PASSE AU SLIDE PRÉCÉDENT
const slideLeft = document.querySelector('#slide-left')
slideLeft.addEventListener('click', () => changeSlide('prev'))

//BOUTON QUI ARRÊTE LE CANVAS ET GÉNÈRE LE SVG
const captureAnimationButton = document.querySelector('#capture-animation')
captureAnimationButton.addEventListener('click', () => captureAnimation())

//BOUTONS QUI TOGGLE LES ÉLÉMENTS DU CANVAS
const bgButton = document.querySelector('#bg')
const linesButton = document.querySelector('#lines')
const polygonsButton = document.querySelector('#polygons')

//AFFICHAGE DE L'ÉTAT DES ÉLÉMENTS DU CANVAS (VISIBLE OU PAS)
const bgState = document.querySelector('#bg span')
bgButton.addEventListener('click', () => toggleBg())
const linesState = document.querySelector('#lines span')
linesButton.addEventListener('click', () => toggleLines())
const polygonsState = document.querySelector('#polygons span')
polygonsButton.addEventListener('click', () => togglePolygons())

//MISE EN PAGE DES BOUTONS DE PERSONNALISATION DES COULEURS DU CANVAS
const bgInputLabel = document.querySelector('#bg-input')
const linesInputLabel = document.querySelector('#lines-input')
const polygonsInputLabel = document.querySelector('#polygons-input')

//BOUTONS DE PERSONNALISATION DES COULEURS DU CANVAS
const bgInput = document.querySelector('#bg-input input')
bgInput.addEventListener('change', () => changeBgColor(bgInput.value, true))
const linesInput = document.querySelector('#lines-input input')
linesInput.addEventListener('change', () => changeLinesColor())
const polygonsInput = document.querySelector('#polygons-input input')
polygonsInput.addEventListener('change', () => changePolygonsColor())



//AU CHARGEMENT DE LA PAGE ON LANCE LE SON
preload = () => {
	audio = loadSound("audio/decouverte_machu_picchu.mp3")
}



//QUAND LA PAGE EST CHARGÉE
setup = () => {

	//ON CRÉE UN CANVAS QU'ON PLACE DANS LA DIV #PROJECT
	const canvas = createCanvas(window.innerWidth, windowHeight)
	canvas.parent('project')

	//ON INITIALISE LE BACKGROUND DE LA PAGE
	body.style.backgroundColor = chosenBgColor

	//ON LANCE L'ANALYSE DU SON ET ON LUI DIT DE TOURNER EN BOUCLE
	analyzer = new p5.Amplitude()
	fft = new p5.FFT()
	audio.loop()

}



//QUAND ON VEUT CHANGER DE SLIDE
changeSlide = (direction) => {

	//ON RÉCUPÈRE LE SLIDE ACTUEL
	const current = document.querySelector('.slide.current')

	//ON RÉCUPÈRE L'ID DU SLIDE ACTUEL
	let slideNumber = parseInt(current.dataset.slide)

	//SI ON VEUT ALLER AU SUIVANT ON INCRÉMENTE SINON ON DÉCRÉMENTE
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

	//ON ENLÈVE L'ÉTAT ACTIF AU SLIDE ACTUEL
	current.classList.remove('current')

	//UNE FOIS L'ANIMATION DE DISPARITION TERMINÉE, ON LE CACHE ET ON DÉCACHE LE NOUVEAU SLIDE
	setTimeout( () => {
		current.classList.add('none')
		document.querySelector(`.slide[data-slide='${slideNumber}']`).classList.remove('none')
	}, 500)

	//APRÈS UNE COURTE PAUSE ON AJOUTER LA CLASS CURRENT AU NOUVEAU SLIDE
	setTimeout( () => {
		document.querySelector(`.slide[data-slide='${slideNumber}']`).classList.add('current')
	}, 600)

}




//QUAND ON VEUT TOGGLE LE SON
toggleSound = () => {

	//SI LE SON EST ACTIF ON LE MET EN PAUSE SINON ON LE RELANCE
	if (audio.isPlaying()) {
		audio.pause()
	}else {
		audio.play()
	}

	//ON TOGGLE L'ICONE DU BOUTON QUI GÈRE LE SON
	document.querySelector('#toggle-sound i').classList.toggle('ion-ios-play-outline')

}




//SCROLLER JUSQU'À LA DIV QUI CONTIENT LE CANVAS EN MODE 'SMOOTH'
scrollToProject = () => {

	document.querySelector('#project').scrollIntoView({
		behavior: 'smooth'
	})

}




//CHANGER LA COULEUR DES LIGNES DU CANVAS EN FONCTION DE LA VALEUR CHOISIE PAR L'UTILISATEUR
changeLinesColor = () => {
	linesColor = linesInput.value
}




//CHANGER LA COULEUR DES POLYGONES DU CANVAS EN FONCTION DE LA VALEUR CHOISIE PAR L'UTILISATEUR
changePolygonsColor = () => {
	polygonsColor = polygonsInput.value
}


//TOGGLE LE BACKGROUND DU CANVAS ET DE LA PAGE
toggleBg = () => {

	//ON ENLÈVE / AJOUTE LA POSSIBILITÉ DE PERSONNALISER LA COULEUR DU BACKGROUND
	document.querySelector('#bg-input').classList.toggle('none')

	//SI ACTUELLEMENT LE FOND EST BLANC
	if(chosenBgColor === white) {

		//ON APPELLE LA FONCTION QUI VA METTRE À JOUR LE BACKGROUND DE LA PAGE
		changeBgColor(bgColor)

		//ON DIT QUE LA COULEUR DU BACKGROUND EST CELLE CHOISIE PAR L'UTILISATEUR
		bgState.innerHTML = 'OK'

	}else {

		//SINON ("SI ACTUELLEMENT LE FOND EST BLANC")

		//ON APPELLE LA FONCTION QUI VA METTRE À JOUR LE BACKGROUND DE LA PAGE
		changeBgColor(white)

		//ON DIT QUE LA COULEUR DU BACKGROUND N'EST PAS CELLE CHOISIE PAR L'UTILISATEUR
		bgState.innerHTML = 'KO'
	}


}


//MET A JOUR LE BACKGROUND DE LA PAGE
changeBgColor = (value, input = false) => {

	//SI LA NOUVELLE COULEUR A ÉTÉ CHOISIE PAR L'UTILISATEUR ON MET A JOUR LA VARIABLE QUI CONTIENT LA COULEUR
	if (input === true) {
		bgColor = value
	}

	//ON MET A JOUR LA COULEUR DE FOND
	chosenBgColor = value

	//ON APPLIQUE CETTE COULEUR AU BODY
	body.style.backgroundColor = chosenBgColor

	//SI LA COULEUR EST CLAIRE ON PASSE TOUT LE CONTENU EN NOIR, SINON, S'IL ÉTAIT EN NOIR ON LE PASSE EN BLANC
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





//TOGGLE LES LIGNES DU CANVAS
toggleLines = () => {

	//ON ENLÈVE / AJOUTE LA POSSIBILITÉ DE PERSONNALISER LA COULEUR DES LIGNES
	document.querySelector('#lines-input').classList.toggle('none')

	//ON TOGGLE LES LIGNES
	lines = !lines

	//ON TOGGLE LE "KO/OK" DE L'INDICATEUR
	if(linesState.innerHTML === 'KO') {
		linesState.innerHTML = 'OK'
	}else {
		linesState.innerHTML = 'KO'
	}

}




//TOGGLE LES POLYGONES DU CANVAS
togglePolygons = () => {

	//ON ENLÈVE / AJOUTE LA POSSIBILITÉ DE PERSONNALISER LA COULEUR DES POLYGONES
	document.querySelector('#polygons-input').classList.toggle('none')

	//ON TOGGLE LES POLYGONES
	polygons = !polygons

	//ON TOGGLE LE "KO/OK" DE L'INDICATEUR
	if(polygonsState.innerHTML === 'KO') {
		polygonsState.innerHTML = 'OK'
	}else {
		polygonsState.innerHTML = 'KO'
	}

}




//SI LE SON EST EN COURS ON GÉNÈRE LE CANVAS
draw = () => {
	audio.isPlaying() && generate()
}




//CRÉATION ET DESSIN DU SVG
drawSVG = () => {

	//ON CRÉE UN SVG QUI VA ÉCRASER LE CANVAS
	createCanvas(window.innerWidth, windowHeight, SVG)

	//ON PLACE LE SVG AU MÊME ENDROIT QUE LE CANVAS
	document.querySelector('#project').appendChild(document.querySelector('#defaultCanvas0'));

	//COMME LES PARAMÈTRES DE createCanvas BUGUENT, ON RE-PRÉCISE LES DIMENSIONS DU SVG
	const createdSVG = document.querySelector('svg')
	createdSVG.style.width = window.innerWidth
	createdSVG.style.height = windowHeight

	//AUTRE PROBLÈME DE LA LIBRAIRIE, LE SVG EST TROP ZOOMÉ, DONC ON FOUT SON SCALE A 1
	const scale = document.querySelector('svg > g')
	scale.style.transform='scale(1)'

	//ON GÉNÈRE LE DESSIN EN PRÉCISANT QUE C'EST UN SVG
	generate(true)

}




//GÉNÉRATION DU DESSIN
generate = (isSVG = false) => {

	//COULEUR DE BACKGROUND
	background(chosenBgColor)

	//ON PLACE LE DESSIN AU CENTRE DE L'ÉCRAN
	translate(window.innerWidth / 2, windowHeight / 2)

	//ON RÉCUPÈRE LES DONNÉES DU SON
	level = analyzer.getLevel()
	fft.analyze()

	//SI LE SON EST EN COURS ON ÉCOUTE CERTAINES FRÉQUENCES
	if (audio.isPlaying()) {
		bass = fft.getEnergy(100, 150)
		treble = fft.getEnergy(150, 250)
		mid = fft.getEnergy("mid")
	}

	//ON FAIT DES CALCULS UN PEU AU PIF PAR RAPPORT AUX 3 DONNÉES RÉCUPÉRÉES JUSTE AU DESSUS
	let mapMid = map(mid, 0, 255, -100, 200)
	let scaleMid = map(mid, 0, 255, 1, 1.5)
	let mapTreble = map(treble, 0, 255, 200, 350)
	let scaleTreble = map(treble, 0, 255, 0, 1)
	let mapbass = map(bass, 0, 255, 50, 200)
	let scalebass = map(bass, 0, 255, 0.05, 1.2)

	//ON FAIT ENCORE UN PEU DE PIF POUR AVOIR DES JOLIES DONNÉES EN FONCTION DE LA POSITION DE LA SOURIS
	mapMouseX = map(mouseX, 0, width, 1, 50)
	mapMouseXbass = map(mouseX, 0, width, 1, 5)
	mapMouseY = map(mouseY, 0, height, 2, 6)

	//ON DÉFINIT LE NOMBRE DE FIGURES ET LEUR RADIUS
	pieces = 20
	radius = 80

	//POUR CHAQUE FIGURE
	for (i = 0; i < pieces; i += 0.1) {

		//ON ROTATE
		rotate(TWO_PI / (pieces / 2))
		noFill()

		//SI L'UTILISATEUR VOULAIT DES POLYGONES ON LES TRACE
		if (polygons === true) {

			// BASS
			push()
			stroke(polygonsColor)
			audio.isPlaying() && rotate(frameCount * 0.002)
			strokeWeight(0.5)
			polygon(mapbass + i, mapbass - i, mapMouseXbass * i, 3)
			pop()

		}

		//SI L'UTILISATEUR VOULAIT DES LIGNES ON LES TRACES
		if (lines === true) {

			// MID
			push()
			stroke(linesColor)
			strokeWeight(0.2)
			polygon(mapMid - i*i, mapMid + i*i, mapMouseX - i*i, 3)
			pop()

			//ON TRACE LE TREMBLE QU'UNE FOIS SUR DEUX PARCE QUE SINON ÇA FAIT TROP DE DESSINS AU CENTRE ET DONC PAPIER DÉCHIRÉ
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

	//SI ON EST EN MODE 'SVG' ON NE LOOP PAS
	if (isSVG === true) {
		noLoop()
	}

}




//FONCTION CLAVIER
keyPressed = () => {

	//SI ON APPUIE SUR LA TOUCHE 'ESPACE'
	(keyCode === 32) && (

		//SI ON EST EN MODE 'CANVAS' ON CRÉE LE SVG, SINON ON RELOAD LA PAGE
		(svg === false) ?
		captureAnimation()
		:
		reload()

	)

}




//FIN DU CANVAS, DÉBUT DU SVG
captureAnimation = () => {

	//ON DIT QU'ON EST EN MODE SVG
	svg = true

	//ON LANCE L'ANALYSE DE SON
	level = analyzer.getLevel()
	fft.analyze()

	//ON CAPTE 3 FRÉQUENCES POUR POUVOIR DESSINER A PARTIR DE CES DONNÉES LÀ
	if (audio.isPlaying()) {
		bass = fft.getEnergy(100, 150)
		treble = fft.getEnergy(150, 250)
		mid = fft.getEnergy("mid")
	}

	//ON SUPPRIME LES BOUTONS DE PERSONNALISATION DU DESSIN (MODE 'CANVAS')
	captureAnimationButton.remove()
	bgButton.remove()
	linesButton.remove()
	polygonsButton.remove()
	bgInputLabel.remove()
	linesInputLabel.remove()
	polygonsInputLabel.remove()

	//ON CRÉE UN BOUTON D'UPLOAD DU SVG, QUI SERA NOIR OU BLANC EN FONCTION DE LA COULEUR DU BACKGROUND
	const uploadButton = document.createElement("button")
	if (chosenBgColor === white) {
		uploadButton.className = 'action-button black-button'
	}else {
		uploadButton.className = 'action-button'
	}
	uploadButton.innerHTML = 'Télécharger'
	actions.appendChild(uploadButton)
	uploadButton.addEventListener('click', () => uploadSVG())

	//ON CRÉE UN BOUTON POUR RECHARGER LA PAGE, QUI SERA NOIR OU BLANC EN FONCTION DE LA COULEUR DU BACKGROUND
	const retryButton = document.createElement("button")
	if (chosenBgColor === white) {
		retryButton.className = 'action-button black-button'
	}else {
		retryButton.className = 'action-button'
	}
	retryButton.innerHTML = 'Recommencer'
	actions.appendChild(retryButton)
	retryButton.addEventListener('click', () => reload())

	//ON ARRETE LE SON (POUR ÇA QU'ON DOIT CAPTER DES DONNÉES D'ANALYSE AVANT)
	audio.pause()

	//ON CRÉE ET DESSINE LE SVG
	drawSVG()

}




//RELOAD LA PAGE
reload = () => {
	window.location.reload()
}




//TÉLÉCHARGE LE SVG GÉNÉRÉ
uploadSVG = () => {
	save('Axidraw.svg')
}




//CRÉE UN TRIANGLE
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
