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
			let numFrogFacts = 6;
			let frogFacts = [];
			base('frog facts').select({
		    // Selecting the first 3 records in Grid view:
			    maxRecords: numFrogFacts,
			    view: "Grid view"
			}).eachPage(function page(records, fetchNextPage) {
			    // This function (`page`) will get called for each page of records.

			    records.forEach(function(record) {
			        frogFacts.push(record.get('Frog Fact By Step'));
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
    let frogImgs = 8;

    function fetchLocalStorage(key) {
        if (localStorage.getItem(key) === null) {
            return "";
        } else {
            return localStorage.getItem(key);
        };
    }

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
        // Reset the journal to have no entries, in case of cache
        document.getElementById("entries").innerHTML = fetchLocalStorage("journal");
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

    // Create the "skip journaling" button to evolve the frog
    document.getElementById("evolve-frog").addEventListener("click", function() {
    	localStorage.setItem("cycleStep","6");
    	updateJournalPage(fetchLocalStorage("cycleStep"))
    	// console.log(fetchLocalStorage("cycleStep"))
    });

    ///////////////////////////////////////////////////////////
    //
    // Generating the frog quiz using AirTable info
    //
    ///////////////////////////////////////////////////////////

    // Go through each of the quiz questions
	data["quizInfo"].forEach((q,i) => {
		// create a 1-indexed counter
		let n = i+1;
		// Create a div to hold them all
		let qDiv = document.createElement('div');
		qDiv.classList.add("frog-q","q");
		qDiv.id = "q" + n;
		// Make the question a heading
		let qH1 = document.createElement('h1');
		qH1.innerHTML = q["question"];
		qDiv.append(qH1);

		let j = 1;
		let qAnswers = [];
		while (j <= 6) {
			if (q['answer' + j] != undefined) {
				// And make the answers labeled radio buttons
				let qLabel = document.createElement("label");
				qLabel.setAttribute("for","q" + j);
				qLabel.innerHTML = q['answer' + j];

				let qRadio = document.createElement("input");
				qRadio.setAttribute("type","radio");
				qRadio.setAttribute("name","q" + j);
				// Add all the classes to the radio input for scoring
				qRadio.classList.add("frog");
				q['frog'+j].split(" ").forEach(c => {
					qRadio.classList.add(c);
				});
				qLabel.prepend(qRadio);
				qAnswers.push(qLabel);
			}
			qAnswers.forEach(a => qDiv.append(a))
			j++;
		}
		quizContainer.append(qDiv);
	});

	let qButton = document.createElement("button");
	qButton.setAttribute("value","submit");
	qButton.id = "quiz-button";
	qButton.innerHTML = "submit";
	quizContainer.append(qButton);

	///////////////////////////////////////////////////////////
    //
    // Updating the journal with quiz results + Airtable info
    //
    ///////////////////////////////////////////////////////////

    // A function that will update the journal when a new prompt response is submitted and when the page is reloaded
    function updateJournalPage(cycleStep) {
    	document.getElementById("prompt").innerHTML = prompts[eval(cycleStep)-1];
    	frogImgs = allFrogImgs[fetchLocalStorage("frogType")];
        document.getElementById("frog-img").src = eval(cycleStep) < 6 ? frogImgs[eval(cycleStep)] : frogImgs[6];

        document.getElementById("frog-fact").innerHTML = eval(cycleStep) < 6 ? frogFacts[eval(cycleStep)] : getCurrFrogDesc();
    }

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
        // With the user's frogType
        document.getElementById("frogType").innerHTML = frogNames[fetchLocalStorage("frogType")];
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
        document.getElementById("frogType").innerHTML = frogNames[frogType];
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
            let date = new Date(Date.now()).toLocaleString();
            let entryTitle = document.createElement("h2");
            entryTitle.innerHTML = date;

            // Grab the current textarea input and use it to create a log entry, and then delete the input so it will be empty next time   
            let content = b.srcElement.previousElementSibling.value;
            b.srcElement.previousElementSibling.value = "";
            let entryContent = document.createElement("p");
            entryContent.classList.add("entry");
            entryContent.innerHTML = content;

            // Store the date into local storage by appending to a string we can decode when you return to the page, so the current state can persist
            let journalStorage = fetchLocalStorage("journal");
            let newJournalStorageEntry = entryTitle.outerHTML + entryContent.outerHTML;
            localStorage.setItem("journal", newJournalStorageEntry + journalStorage);

            // While we're saving state, also log which step in the frog evolution cycle we're on so we can return to it
            localStorage.setItem("cycleStep", eval(fetchLocalStorage("cycleStep")) + 1);

            //Then grab the whole log and prepend this new entry
            let log = document.getElementById("entries");
            let entry = document.createElement("div");
            entry.classList.add("entry");
            entry.append(entryTitle)
            entry.append(entryContent);
            log.prepend(entry);

            // Progress to the next frog image + cycleFact, until you reach the last frog
            if (eval(fetchLocalStorage("cycleStep")) < 6) {
            	frogImgDiv.src = frogImgs[eval(fetchLocalStorage("cycleStep"))];
            	frogFactDiv.innerHTML = frogFacts[eval(fetchLocalStorage("cycleStep"))];
            } else {
            	frogImgDiv.src = frogImgs[6];
            	let frogDesc; 
            	frogFactDiv.innerHTML = getCurrFrogDesc();
            }
        };

    }); 
}

fetchData(createQuiz);