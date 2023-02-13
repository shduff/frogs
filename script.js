// Whenever the page loads, first fetch data from Airtable
function fetchData(callback) {
	let quizInfo = [];
	let journalInfo = [];
	let journalPrompts = [];
	let frogFacts = [];

	// Whenever the page loads
	window.addEventListener("load", (e) => {
		// Connect to Airtable to get all the quiz/journal info
		let Airtable = require('airtable');
		Airtable.configure({
		    endpointUrl: 'https://api.airtable.com',
		    apiKey: 'keycuL2P2p7WPUAZz'
		});
		let base = Airtable.base('appEhPPxg2z51MAtm');

		// Grab all the quiz info and save it into quizInfo
		let fetchQuizInfo = new Promise(resolve => {
			let numQuizQuestions = 10;
			base('quiz').select({
			    // Selecting the first 3 records in Grid view:
			    maxRecords: numQuizQuestions,
			    view: "Grid view"
			}).eachPage(function page(records, fetchNextPage) {
			    // This function (`page`) will get called for each page of records.

			    records.forEach(function(record) {
			        quizInfo.push({
						"question": record.get('Question'),		        
						"answer1": record.get('Answer 1'),
						"frog1": record.get('Frog 1'),
				        "answer2": record.get('Answer 2'),
						"frog2": record.get('Frog 2'),
				        "answer3": record.get('Answer 3'),
						"frog3": record.get('Frog 3'),
				        "answer4": record.get('Answer 4'),
						"frog4": record.get('Frog 4'),
				        "answer5": record.get('Answer 5'),
						"frog5": record.get('Frog 5'),
				        "answer6": record.get('Answer 6'),
						"frog6": record.get('Frog 6'),
			        });
			    });

			    // To fetch the next page of records, call `fetchNextPage`.
			    // If there are more records, `page` will get called again.
			    // If there are no more records, `done` will get called.
			    fetchNextPage();

			}, function done(err) {
			    if (err) { 
			    	console.error(err); return; 
			    } else {
			        resolve(quizInfo);
			    }
			});
		});

		// Grab all the journal info and save it into journalInfo
		let fetchJournalInfo = new Promise(resolve => {
			let numJournalResults = 6;
			base('journal results').select({
			    // Selecting the first 3 records in Grid view:
			    maxRecords: numJournalResults, 
			    view: "Grid view"
			}).eachPage(function page(records, fetchNextPage) {
			    // This function (`page`) will get called for each page of records.

			    records.forEach(function(record) {
			        journalInfo.push({
			        	"frog": record.get('Frog'),
			        	"description": record.get('Description'),
			        	"link": record.get('Link'),
			        	"step1image": record.get('Step 1 Image'),
			        	"step2image": record.get('Step 2 Image'),
			        	"step3image": record.get('Step 3 Image'),
			        	"step4image": record.get('Step 4 Image'),
			        	"step5image": record.get('Step 5 Image'),
			        	"step6image": record.get('Step 6 Image'),
			        	"fullanimation": record.get('Full Animation')
			        });
			    });

			    // To fetch the next page of records, call `fetchNextPage`.
			    // If there are more records, `page` will get called again.
			    // If there are no more records, `done` will get called.
			    fetchNextPage();

			}, function done(err) {
			    if (err) { 
			    	console.error(err); return; 
				} else {
			        resolve(journalInfo);
				}
			});
		});

		// Grab all the journal prompts and save it into journalPrompts
		let fetchJournalPrompts = new Promise(resolve => {
			let numJournalPrompts = 30;
			base('journal prompts').select({
		    // Selecting the first 3 records in Grid view:
			    maxRecords: numJournalPrompts,
			    view: "Grid view"
			}).eachPage(function page(records, fetchNextPage) {
			    // This function (`page`) will get called for each page of records.

			    records.forEach(function(record) {
			        journalPrompts.push(record.get('Prompts'));
			    });

			    // To fetch the next page of records, call `fetchNextPage`.
			    // If there are more records, `page` will get called again.
			    // If there are no more records, `done` will get called.
			    fetchNextPage();

			}, function done(err) {
			    if (err) { 
			    	console.error(err); return; 
			    } else {
			        resolve(journalPrompts);
			    }
			});
		});

		// Grab all the frog facts and save it into frogFacts
		let fetchFrogFacts = new Promise(resolve => {
			let numFrogFacts = 12;
			let frogFacts = [];
			base('frog facts').select({
		    // Selecting the first 3 records in Grid view:
			    maxRecords: numFrogFacts,
			    view: "Grid view"
			}).eachPage(function page(records, fetchNextPage) {
			    // This function (`page`) will get called for each page of records.

			    records.forEach(function(record) {
			        frogFacts.push(record.get('Frog Facts'));
			    });

			    // To fetch the next page of records, call `fetchNextPage`.
			    // If there are more records, `page` will get called again.
			    // If there are no more records, `done` will get called.
			    fetchNextPage();

			}, function done(err) {
			    if (err) { 
			    	console.error(err); return; 
			    } else {
			    	resolve(frogFacts);
			    }
			});
		});

		let data = Promise.all([
			Promise.resolve(fetchQuizInfo),
			Promise.resolve(fetchJournalInfo),
			Promise.resolve(fetchJournalPrompts),
			Promise.resolve(fetchFrogFacts),
			]).then(results => {
				let data = {
					"quizInfo":results[0],
					"journalInfo":results[1],
					"journalPrompts":results[2],
					"frogFacts":results[3]
				};
				callback(data);
			});
		});
}

function createQuiz(data) {
    let frogScores = {
        "tomato": 0,
        "milk": 0,
        "mimic": 0,
        "blue": 0,
        "red": 0,
        "glass": 0
    };

    let frogNames = {
        "tomato": "Tomato Frog",
        "milk": "Milk Frog",
        "mimic": "Mimic Frog",
        "blue": "Blue Poison Dart Frog",
        "red": "Red Eyed Tree Frog",
        "glass": "Glass Frog"
    };

    // Restructure journal prompts from Airtable data
	let prompts = data["journalPrompts"];

	// Restructure frog facts from Airtable data
	let frogFacts = {};
	data["frogFacts"].forEach((f,i) => {
		frogFacts[i+1] = f;
	});

	// Restructure all the step-by-step frog pics from Airtable data
    let allFrogImgs = {};
    data["journalInfo"].forEach(i => {
    	let frogName = i["frog"];
    	allFrogImgs[frogName] = {
    		1:i["step1image"][0]["url"],
    		2:i["step2image"][0]["url"],
    		3:i["step3image"][0]["url"],
    		4:i["step4image"][0]["url"],
    		5:i["step5image"][0]["url"],
    		6:i["step6image"][0]["url"],
    	}
    });
    let frogImgs;

    let frogLinks = {};
    data["journalInfo"].forEach(e => {
    	frogLinks[e["frog"]] = e["link"];
    });

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
        // Reset the journal to have no entries and frogType title to ???, in case of cache
        document.getElementById("entries").innerHTML = fetchLocalStorage("journal");
        document.getElementById("frogType").innerHTML = "??? Frog";
        document.getElementById("frog-link").innerHTML = "";
        // And reset all the frog scores to 0
        frogScores = {
            "tomato": 0,
            "milk": 0,
            "mimic": 0,
            "blue": 0,
            "red": 0,
            "glass": 0
        }
    }

    let resetButton = document.getElementById("reset");
    // Whenever the reset button is clicked
    resetButton.addEventListener("click", function() {
        reset();
    });

    function getCurrFrogDesc() {
    	let frogDesc;
    	data["journalInfo"].forEach(f => {
			if (f["frog"] == fetchLocalStorage("frogType")) {
				frogDesc = f["description"];
			}
		});
		return frogDesc;
    }

	function fetchLocalStorage(key) {
	    if (localStorage.getItem(key) === null) {
	        return "";
	    } else {
	        return localStorage.getItem(key);
	    };
	}

	function getCurrentTime() {
		let time = new Date();
	    time = time.toString().split(" ").slice(0,5).join(" ");
	    return time;
	}

    // Create the "skip journaling" button to evolve the frog
    document.getElementById("evolve-frog").addEventListener("click", function() {
    	localStorage.setItem("cycleStep","6");
    	updateJournalPage(fetchLocalStorage("cycleStep"))
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
    	numAs.forEach(a => {
    		a.checked ? numCheckedAs++ : null;
    	});
    	console.log("numQs is ", numQs);
    	console.log("numCheckedAs is ", numCheckedAs);
    	console.log(numQs == numCheckedAs);
    	if (numCheckedAs == numQs) {
    		disabledEl.removeAttribute("disabled");
    		let divToHide = document.getElementById("disabled-quiz-button-alert");
    		divToHide.classList.add("invisible");
    	} 
    }

    let qButton = document.createElement("button");
	qButton.setAttribute("value","submit");
	qButton.setAttribute("disabled",true);
	qButton.id = "quiz-button";
	qButton.innerHTML = "submit";
	let qButtonAlertDiv = document.createElement("div");
	qButtonAlertDiv.id = "disabled-quiz-button-alert";
	let qButtonAlertText = document.createElement("p");
	qButtonAlertText.innerHTML = "✔️ You have to answer all the questions before submitting!";
	qButtonAlertDiv.append(qButtonAlertText);

    // Go through each of the quiz questions
	data["quizInfo"].forEach((q,i) => {
		// create a 1-indexed counter
		let n = i+1;
		// Create a div to hold them all
		let qDiv = document.createElement('div');
		qDiv.classList.add("frog-q","q");
		qDiv.id = "q" + n;
		// Make the question a heading
		let qH2 = document.createElement('h2');
		qH2.innerHTML = q["question"];
		qDiv.append(qH2);

		let j = 1;
		let qAnswers = [];
		while (j <= 6) {
			if (q['answer' + j] != undefined) {
				// And make the answers labeled radio buttons
				let qLabel = document.createElement("label");
				qLabel.setAttribute("for","q" + n);
				qLabel.innerHTML = q['answer' + j];

				let qRadio = document.createElement("input");
				qRadio.setAttribute("type","radio");
				qRadio.setAttribute("name","a" + n);
				// Add all the classes to the radio input for scoring
				qRadio.classList.add("frog");
				q['frog'+j].split(" ").forEach(c => {
					qRadio.classList.add(c);
				});
				qRadio.addEventListener("click", function() {
					checkAllQuestionsAnswered(qButton)
				});
				qLabel.prepend(qRadio);
				qAnswers.push(qLabel);
			}
			qAnswers.forEach(a => qDiv.append(a))
			j++;
		}
		quizContainer.append(qDiv);
	});
	
	quizContainer.append(qButton,qButtonAlertDiv);

	///////////////////////////////////////////////////////////
    //
    // Updating the journal with quiz results + Airtable info
    //
    ///////////////////////////////////////////////////////////

    // A function that will update the journal when a new prompt response is submitted and when the page is reloaded
    function updateJournalPage(cycleStep) {
    	let currFrogType = fetchLocalStorage("frogType");
        let randomPrompt = Math.floor(Math.random() * Object.keys(prompts).length);
        localStorage.setItem("currPrompt",randomPrompt);
    	document.getElementById("prompt").innerHTML = prompts[randomPrompt];
    	frogImgs = allFrogImgs[currFrogType];
        document.getElementById("frog-img").src = eval(cycleStep) < 6 ? frogImgs[eval(cycleStep)] : frogImgs[6];
        let randomFrogFact = Math.floor(Math.random() * Object.keys(frogFacts).length);
        document.getElementById("frog-fact").innerHTML = eval(cycleStep) < 6 ? frogFacts[randomFrogFact] : getCurrFrogDesc();
        // With the user's frogType
        if (eval(fetchLocalStorage("cycleStep")) >= 6) {
        	document.getElementById("frogType").innerHTML = frogNames[currFrogType];
        	document.getElementById("frog-link").setAttribute("href",frogLinks[currFrogType]);
        	document.getElementById("frog-link").innerHTML = "Learn more about the " + frogNames[currFrogType];
        }
    }

	function releaseNewJournalEntry() {
		if (fetchLocalStorage("lastSubmitTime") != getCurrentTime()) {
	    	document.getElementById("disabled-journal-button-alert").classList.toggle("invisible");
	    	document.getElementById("journal-button").removeAttribute("disabled");
	    	localStorage.setItem("lastSubmitTime",getCurrentTime());
	    	updateJournalPage(fetchLocalStorage("cycleStep"));
	    	clearTimeout(Number(fetchLocalStorage("intervalID")));
	    	localStorage.removeItem("intervalID");
	    	console.log("timeout!");
	    }
	};

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
        document.getElementById("entries").innerHTML = fetchLocalStorage("journal");
        // And the correct journal prompt and frog image for the cycle step they left off at
        updateJournalPage(fetchLocalStorage("cycleStep"));
    }

    ///////////////////////////////////////////////////////////
    //
    // Whenever the quiz submit button is pressed
    //
    ///////////////////////////////////////////////////////////

    let quizButton = document.getElementById("quiz-button");

    // When the quiz's submit button is pressed
    quizButton.addEventListener("click", function(b) {
        // Grab all the user's answers
        let answers = Array.from(document.querySelectorAll('input:checked'));
        // Create an emty list to collect which frog to score
        let frogsToScore = [];
        // Go through the answers and add all the frogs to score by grabbing its classList, which includes the frogs that answer corresponds to
        answers.forEach(e => frogsToScore.push(Array.from(e.classList)));
        frogsToScore = frogsToScore.flat()
        // But remove all the "frog" classes, since we are scoring by species
        for (let i = 0; i < frogsToScore.length; i++) {
            if (frogsToScore[i] === "frog") {
                frogsToScore.splice(i, 1);
            }
        }
        // Tally up the points for each frog type
        frogsToScore.forEach(f => frogScores[f] += 1);
        // And then find the frog with the most points
        const frogType = Object.entries(frogScores).reduce((a, b) => a[1] > b[1] ? a : b)[0];
        // Then save the frog type in localStorage
        localStorage.setItem("frogType", frogType);
        // And set the title of the journal page to reflect the frog type
        // document.getElementById("frogType").innerHTML = frogNames[frogType];
        // Set the cycleStep to 1
        localStorage.setItem("cycleStep","1")
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
    journalButton.addEventListener("click", function(b) {

        // If there is content in the button's associated text area
        if (b.srcElement.previousElementSibling.value != "") {
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
            let newJournalStorageEntry = entryHeader.outerHTML + entryContent.outerHTML;
            localStorage.setItem("journal", newJournalStorageEntry + journalStorage);

            // While we're saving state, also log which step in the frog evolution cycle we're on so we can return to it
            localStorage.setItem("cycleStep", eval(fetchLocalStorage("cycleStep")) + 1);

            //Then grab the whole log and prepend this new entry
            let log = document.getElementById("entries");
            let entry = document.createElement("div");
            entry.classList.add("entry");
            entry.append(entryHeader);
            entry.append(entryContent);
            log.prepend(entry);

            // Progress to the next frog image + cycleFact, until you reach the last frog
            if (eval(fetchLocalStorage("cycleStep")) < 6) {
            	frogImgDiv.src = frogImgs[eval(fetchLocalStorage("cycleStep"))];
            	let randomFrogFact = Math.floor(Math.random() * Object.keys(frogFacts).length) + 1;
            	frogFactDiv.innerHTML = frogFacts[randomFrogFact];
            } else {
            	frogImgDiv.src = frogImgs[6];
            	let frogDesc; 
            	frogFactDiv.innerHTML = getCurrFrogDesc();
            }

            // And choose a new, random journal prompt
            let randomPrompt = Math.floor(Math.random() * Object.keys(prompts).length);
            localStorage.setItem("currPrompt",randomPrompt);
    		document.getElementById("prompt").innerHTML = prompts[randomPrompt];	
        };

        // Disable the submit button
        b.target.setAttribute("disabled",true);
        // And show the alert explaining why it's disabled
        document.getElementById("disabled-journal-button-alert").classList.toggle("invisible");
        // Store the current time in local storage
        localStorage.setItem("lastSubmitTime",getCurrentTime());
        // Then set a timer that compares current time to previous time til different
    	let currIntervalID = setInterval(releaseNewJournalEntry,20000);
    	localStorage.setItem("intervalID",currIntervalID);
		console.log("timeout is set. the lastSubmitTime is ", fetchLocalStorage("lastSubmitTime"), " and the current time is", getCurrentTime());
        // Then update the journal page
        updateJournalPage(fetchLocalStorage("cycleStep"));
    }); 
};

fetchData(createQuiz);

window.addEventListener("load", function() {
	// If there is an uncleared setInterval, which means an Interval should be going
	if (fetchLocalStorage("intervalID")) {
		// Disable the journal submit button
        document.getElementById("journal-button").setAttribute("disabled",true);
        // And if the current time (i.e. date) is "less than" (i.e. after) the last submitted time
		if (new Date(fetchLocalStorage("lastSubmitTime")) < Date(getCurrentTime())) {
			// Then release a new journal entry
			releaseNewJournalEntry();
			localStorage.removeItem("intervalID");
		// If the date is not "less than"/after the last submitted time
		} else {
			// Then set a timer that compares current time to previous time til different
	    	let currIntervalID = setInterval(releaseNewJournalEntry,20000);
	    	// And update the intervalID stored in localStorage
	    	localStorage.setItem("intervalID",currIntervalID);
	    	console.log("timeout is set. the lastSubmitTime is ", fetchLocalStorage("lastSubmitTime"), " and the current time is", getCurrentTime());
		}
	}
});