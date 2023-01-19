// Whenever the page loads
window.addEventListener("load", (e) => {
    let frogScores = {
        "tomato": 0,
        "milk": 0,
        "mimic": 0,
        "blue": 0,
        "red": 0,
        "glass": 0
    }

    let frogNames = {
        "tomato": "Tomato Frog",
        "milk": "Milk Frog",
        "mimic": "Mimic Frog",
        "blue": "Blue Poison Dart Frog",
        "red": "Red Eyes Tree Frog",
        "glass": "Glass Frog"
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
    // If there's no info in localStorage
    if (localStorage.length == 0) {
        // Then reset the app
        reset();
        // If there is info in localStorage
    } else {
        // Show the journal
        quizContainer.classList.add("invisible");
        journalContainer.classList.remove("invisible");
        // With the user's frogType
        document.getElementById("frogType").innerHTML = frogNames[fetchLocalStorage("frogType")];
        // Their journal entries
        document.getElementById("entries").innerHTML = fetchLocalStorage("journal");
        // And the correct journal prompt and frog image for the cycle step they left off at

    }
    ///////////////////////////////////////////////////////////
    //
    // Journaling to evolve your frog
    //
    ///////////////////////////////////////////////////////////

    // Assuming we want to loop questions, there should be the same number of frog images as there are questions. If we decide not to loop, code needs to be rewritten and there should be one more, ending with a landing page with full-grown frog. 
    let frogImgs = {
        1: "https://media.istockphoto.com/id/172191851/photo/frog-spawn-in-a-puddle-next-to-a-trail.jpg?s=612x612&w=0&k=20&c=VxPQjoMS7MxWRdwRuL8pXoySAYRauWgsyw81wf8qLuk=",
        2: "https://cdn.britannica.com/20/231520-050-9DF96017/tadpole-common-frog-amphibian.jpg",
        3: "https://i.natgeofe.com/k/8fa25ea4-6409-47fb-b3cc-4af8e0dc9616/red-eyed-tree-frog-on-leaves-3-2_3x2.jpg",
        // 4: "https://www.timeforkids.com/wp-content/uploads/2018/03/frog2.jpg?w=1024" 
    }

    // Grab all the questions from the page
    let qs = document.getElementsByClassName("journal-q");

    function fetchLocalStorage(key) {
        if (localStorage.getItem(key) === null) {
            return "";
        } else {
            return localStorage.getItem(key);
        };
    }
    ///////////////////////////////////////////////////////////
    //
    // Which frog are you quiz
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

        // Finally, hide the quiz and show the journal
        quizContainer.classList.toggle("invisible");
        journalContainer.classList.toggle("invisible");
    });

    // For each question
    Array.from(qs).forEach((q, i) => {
        // Grab its button
        let button = q.childNodes[5];
        // And generate its index number, starting with 1
        let n = i + 1;
        // Add a click-based event listener to the button
        button.addEventListener("click", function(b) {
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
                localStorage.setItem("cycleStep", b.srcElement.parentNode.id);

                //Then grab the whole log and prepend this new entry
                let log = document.getElementById("entries");
                let entry = document.createElement("div");
                entry.classList.add("entry");
                entry.append(entryTitle)
                entry.append(entryContent);
                log.prepend(entry);

                // Next hide the current question
                document.getElementById(n).classList.toggle("invisible");
                // If there are more questions in the questions list
                if (n + 1 <= qs.length) {
                    // Then show the next question and progress to the next frog image
                    document.getElementById(n + 1).classList.toggle("invisible");
                    document.getElementById("frog-img").src = frogImgs[n + 1];
                    // If we're at the last question in the list
                } else {
                    // Then loop back around to the first question and frog image
                    document.getElementById(1).classList.toggle("invisible");
                    document.getElementById("frog-img").src = frogImgs[1];
                }
            };

            console.log("local storage for journal key is now: " + localStorage.getItem("journal"))
        });
    })
});