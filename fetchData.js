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
		        "answer2": record.get('Answer 2'),
		        "answer3": record.get('Answer 3'),
		        "answer4": record.get('Answer 4'),
		        "answer5": record.get('Answer 5'),
		        "answer6": record.get('Answer 6'),
	        });
	        // console.log(quizInfo);
	        // return quizInfo;
	    });

	    // To fetch the next page of records, call `fetchNextPage`.
	    // If there are more records, `page` will get called again.
	    // If there are no more records, `done` will get called.
	    fetchNextPage();

	}, function done(err) {
	    if (err) { console.error(err); return; }
	});

	// Grab all the journal info and save it into journalInfo
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
	        });
	    });

	    // To fetch the next page of records, call `fetchNextPage`.
	    // If there are more records, `page` will get called again.
	    // If there are no more records, `done` will get called.
	    fetchNextPage();

	}, function done(err) {
	    if (err) { console.error(err); return; }
	});

	// Grab all the journal prompts and save it into journalPrompts
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
	    if (err) { console.error(err); return; }
	});

	// Grab all the frog facts and save it into frogFacts
	let numFrogFacts = 6;
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
	    if (err) { console.error(err); return; }
	});
});