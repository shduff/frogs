function fetchLocalStorage(key) {
	if (localStorage.getItem(key) === null) {
		return "";
	} else {
		return localStorage.getItem(key);
	}
}

function getCurrentTime() {
	let time = new Date();
	time = time.toString().split(" ").slice(0, 5).join(" ");
	return time;
}

function getCurrFrogDesc() {
	let frogDesc;
	data["journalInfo"].forEach((f) => {
		if (f["frog"] == fetchLocalStorage("frogType")) {
			frogDesc = f["description"];
			console.log(f)
		}
	});
	return frogDesc;
}

function releaseNewJournalEntry(currPrompt=false) {
	// console.log("releaseNewJournalEntry ran");
	if (fetchLocalStorage("lastSubmitTime") != getCurrentTime()) {
		document
			.getElementById("disabled-journal-button-alert")
			.classList.toggle("invisible");
		document.getElementById("journal-button").removeAttribute("disabled");
		localStorage.setItem("lastSubmitTime", getCurrentTime());
		updateJournalPage(fetchLocalStorage("cycleStep"),currPrompt);
		clearTimeout(Number(fetchLocalStorage("intervalID")));
		localStorage.removeItem("intervalID");
	}
}

function isRepeatPrompt(newPromptNum) {
	if (fetchLocalStorage("pastPrompts").split(",").includes(newPromptNum.toString())) {
		return true;
	} else {
		return false;
	}
}

// A function that will update the journal when a new prompt response is submitted and when the page is reloaded
function updateJournalPage(cycleStep, currPrompt=false) {
	let currFrogType = fetchLocalStorage("frogType");
	if (eval(cycleStep) >= 8) {
		document.getElementById("frog-hidden-title").classList.add("invisible");
		document.getElementById("frog-reveal-title").classList.remove("invisible");
		document.getElementById("skip-ahead-text").classList.add("invisible");
	}
	if (currPrompt) {
		// console.log(prompts[eval(fetchLocalStorage("currPrompt"))]);
		document.getElementById("prompt").innerHTML = prompts[eval(fetchLocalStorage("currPrompt"))];
	} else {
		let randomPrompt = Math.floor(Math.random() * Object.keys(prompts).length);
		while (isRepeatPrompt(randomPrompt)) {
			randomPrompt = Math.floor(Math.random() * Object.keys(prompts).length);
		}
		localStorage.setItem("currPrompt", randomPrompt);
		localStorage.setItem("pastPrompts", fetchLocalStorage("pastPrompts") + randomPrompt + ",");
		document.getElementById("prompt").innerHTML = prompts[randomPrompt];
	};
	frogImgs = allFrogImgs[currFrogType];
	// console.log(frogImgs)
	document.getElementById("frog-img").src =
		eval(cycleStep) <= 8 ? frogImgs[eval(cycleStep)] : frogImgs[8];
	let randomFrogFact = Math.ceil(
		Math.random() * Object.keys(frogFacts).length
	);
	document.getElementById("frog-fact").innerHTML =
		eval(cycleStep) < 8 ? frogFacts[randomFrogFact] : getCurrFrogDesc();
	// With the user's frogType
	if (eval(fetchLocalStorage("cycleStep")) >= 8) {
		document.getElementById("frogType").innerHTML = frogNames[currFrogType];
		document
			.getElementById("frog-link")
			.setAttribute("href", frogLinks[currFrogType]);
		document.getElementById("frog-link").innerHTML =
			"Learn more about the " + frogNames[currFrogType];
	}
}

function createQuiz(data) {
	let quizContainer = document.getElementById("quiz-container");
	let journalContainer = document.getElementById("journal-container");

	function reset() {
		// Clear all information in localStorage
		localStorage.clear();
		// Swap the view back to the quiz
		quizContainer.classList.remove("invisible");
		journalContainer.classList.add("invisible");
		// Uncheck all the quiz radio buttons
		var elements = document.getElementsByTagName("input");
		for (var i = 0; i < elements.length; i++) {
			if (elements[i].type == "radio") {
				elements[i].checked = false;
			}
		}
		// Reset the journal to have no entries and return to the original title, in case of cache
		document.getElementById("entries").innerHTML =
			fetchLocalStorage("journal");
		// document.getElementById("frogType").innerHTML = fetchLocalStorage("frogType");
		document.getElementById("frog-link").innerHTML = "";
		// And reset all the frog scores to 0
		frogScores = {
			tomato: 0,
			milk: 0,
			mimic: 0,
			blue: 0,
			red: 0,
			glass: 0,
		};
	}

	let resetButton = document.getElementById("reset");
	// Whenever the reset button is clicked
	resetButton.addEventListener("click", function () {
		reset();
	});

	// Create the "skip ahead" button to evolve the frog
	document
		.getElementById("evolve-frog")
		.addEventListener("click", function () {
			console.log("cycleStep is ", fetchLocalStorage("cycleStep"));
			if (eval(fetchLocalStorage("cycleStep")) < 8) {
				console.log("cycleStep is less than 8");
				localStorage.setItem("cycleStep", "8");
				updateJournalPage(fetchLocalStorage("cycleStep"), fetchLocalStorage("currPrompt"));
				document.getElementById("skip-ahead-text").classList.add("invisible");
			}
		});

	///////////////////////////////////////////////////////////
	//
	// Generating the frog quiz using AirTable info
	//
	///////////////////////////////////////////////////////////

	function checkAllQuestionsAnswered(disabledEl) {
		let numQs = document.getElementsByClassName("frog-q").length;
		var numAs = Array.from(document.getElementsByTagName("input"));
		let numCheckedAs = 0;
		numAs.forEach((a) => {
			a.checked ? numCheckedAs++ : null;
		});
		if (numCheckedAs == numQs) {
			disabledEl.removeAttribute("disabled");
			let divToHide = document.getElementById(
				"disabled-quiz-button-alert"
			);
			divToHide.classList.add("invisible");
		}
	}

	let qButton = document.createElement("button");
	qButton.setAttribute("value", "submit");
	qButton.setAttribute("disabled", true);
	qButton.id = "quiz-button";
	qButton.innerHTML = "submit";
	let qButtonAlertDiv = document.createElement("div");
	qButtonAlertDiv.id = "disabled-quiz-button-alert";
	let qButtonAlertText = document.createElement("p");
	qButtonAlertText.innerHTML =
		"✔️ You have to answer all the questions before submitting!";
	qButtonAlertDiv.append(qButtonAlertText);

	// Go through each of the quiz questions
	data["quizInfo"].forEach((q, i) => {
		// create a 1-indexed counter
		let n = i + 1;
		// Create a div to hold them all
		let qDiv = document.createElement("div");
		qDiv.classList.add("frog-q", "q");
		qDiv.id = "q" + n;
		// Make the question a heading
		let qH2 = document.createElement("h2");
		qH2.innerHTML = q["question"];
		qDiv.append(qH2);

		let j = 1;
		let qAnswers = [];
		// tk maybe not this one?
		while (j <= 8) {
			if (q["answer" + j] != undefined) {
				// And make the answers labeled radio buttons
				let qLabel = document.createElement("label");
				qLabel.setAttribute("for", "q" + n);
				qLabel.innerHTML = q["answer" + j];

				let qRadio = document.createElement("input");
				qRadio.setAttribute("type", "radio");
				qRadio.setAttribute("name", "a" + n);
				// Add all the classes to the radio input for scoring
				qRadio.classList.add("frog");
				q["frog" + j].split(" ").forEach((c) => {
					qRadio.classList.add(c);
				});
				qRadio.addEventListener("click", function () {
					checkAllQuestionsAnswered(qButton);
				});
				qLabel.prepend(qRadio);
				qAnswers.push(qLabel);
			}
			qAnswers.forEach((a) => qDiv.append(a));
			j++;
		}
		quizContainer.append(qDiv);
	});

	quizContainer.append(qButton, qButtonAlertDiv);

	///////////////////////////////////////////////////////////
	//
	// Updating the journal with quiz results + Airtable info
	//
	///////////////////////////////////////////////////////////

	// With all that data available, we're now going to start effectively saving state
	// If there's no info in localStorage
	if (localStorage.length == 0) {
		// Then reset the app
		reset();
		// If there is info in localStorage
	} else {
		// This means the quiz has already been filled out
		// Show the journal
		quizContainer.classList.add("invisible");
		journalContainer.classList.remove("invisible");
		// Their journal entries
		document.getElementById("entries").innerHTML =
			fetchLocalStorage("journal");
		// And the correct journal prompt and frog image for the cycle step they left off at
		updateJournalPage(fetchLocalStorage("cycleStep"), fetchLocalStorage("currPrompt"));
	}

	///////////////////////////////////////////////////////////
	//
	// Whenever the quiz submit button is pressed
	//
	///////////////////////////////////////////////////////////

	let quizButton = document.getElementById("quiz-button");

	// When the quiz's submit button is pressed
	quizButton.addEventListener("click", function (b) {
		// Set the cycleStep to 1
		localStorage.setItem("cycleStep", "1");
		// Grab all the user's answers
		let answers = Array.from(document.querySelectorAll("input:checked"));
		// Create an emty list to collect which frog to score
		let frogsToScore = [];
		// Go through the answers and add all the frogs to score by grabbing its classList, which includes the frogs that answer corresponds to
		answers.forEach((e) => frogsToScore.push(Array.from(e.classList)));
		frogsToScore = frogsToScore.flat();
		// But remove all the "frog" classes, since we are scoring by species
		for (let i = 0; i < frogsToScore.length; i++) {
			if (frogsToScore[i] === "frog") {
				frogsToScore.splice(i, 1);
			}
		}
		// Tally up the points for each frog type
		frogsToScore.forEach((f) => (frogScores[f] += 1));
		// And then find the frog with the most points
		const frogType = Object.entries(frogScores).reduce((a, b) =>
			a[1] > b[1] ? a : b
		)[0];
		// Then save the frog type in localStorage
		localStorage.setItem("frogType", frogType);
		// Update the journal page with the current frog image, fact, and journal prompt
		updateJournalPage(fetchLocalStorage("cycleStep"));
		// And continue to update the journal whenever the page is reloaded
		window.addEventListener("load", (event) => {
			updateJournalPage(fetchLocalStorage("cycleStep"));
		});
		// Finally, hide the quiz and show the journal
		quizContainer.classList.toggle("invisible");
		journalContainer.classList.toggle("invisible");
	});

	///////////////////////////////////////////////////////////
	//
	// Whenever the journal submit button is pressed
	//
	///////////////////////////////////////////////////////////

	let frogImgDiv = document.getElementById("frog-img");
	let frogFactDiv = document.getElementById("frog-fact");

	let journalButton = document.getElementById("journal-button");
	journalButton.addEventListener("click", function (b) {
		// If there is content in the button's associated text area
		if (b.srcElement.previousElementSibling.value != "") {
			// console.log(b.srcElement.previousElementSibling.value);
			// Get the current date and time and use it to create a log entry title
			let entryHeader = document.createElement("div");
			entryHeader.classList.add("entryHeader");
			let entryTitle = document.createElement("h2");
			entryTitle.innerHTML = prompts[fetchLocalStorage("currPrompt")];
			let entryDate = document.createElement("p");
			entryDate.classList.add("intro");
			let date = new Date(Date.now()).toLocaleString();
			entryDate.innerHTML = date;
			entryHeader.append(entryTitle);
			entryHeader.append(entryDate);

			// Grab the current textarea input and use it to create a log entry, and then delete the input so it will be empty next time
			let content = b.srcElement.previousElementSibling.value;
			b.srcElement.previousElementSibling.value = "";
			let entryContent = document.createElement("p");
			entryContent.classList.add("entry");
			entryContent.innerHTML = content;

			// Store the date into local storage by appending to a string we can decode when you return to the page, so the current state can persist
			let journalStorage = fetchLocalStorage("journal");
			let newJournalStorageEntry =
				entryHeader.outerHTML + entryContent.outerHTML;
			localStorage.setItem(
				"journal",
				newJournalStorageEntry + journalStorage
			);

			// While we're saving state, also log which step in the frog evolution cycle we're on so we can return to it
			localStorage.setItem(
				"cycleStep",
				eval(fetchLocalStorage("cycleStep")) + 1
			);

			//Then grab the whole log and prepend this new entry
			let log = document.getElementById("entries");
			let entry = document.createElement("div");
			entry.classList.add("entry");
			entry.append(entryHeader);
			entry.append(entryContent);
			log.prepend(entry);

			// Progress to the next frog image + cycleFact, until you reach the last frog
			if (eval(fetchLocalStorage("cycleStep")) < 8) {
				frogImgDiv.src = frogImgs[eval(fetchLocalStorage("cycleStep"))];
				let randomFrogFact =
					Math.floor(Math.random() * Object.keys(frogFacts).length) +
					1;
				frogFactDiv.innerHTML = frogFacts[randomFrogFact];
			} else {
				frogImgDiv.src = frogImgs[8];
				let frogDesc;
				frogFactDiv.innerHTML = getCurrFrogDesc();
			}

			// Disable the submit button
			b.target.setAttribute("disabled", true);
			// And show the alert explaining why it's disabled
			document
				.getElementById("disabled-journal-button-alert")
				.classList.toggle("invisible");
			// Store the current time in local storage
			localStorage.setItem("lastSubmitTime", getCurrentTime());
			// Then set a timer that compares current time to previous time til different
			let currIntervalID = setInterval(releaseNewJournalEntry, 500);
			localStorage.setItem("intervalID", currIntervalID);
		}
		
	});
}
