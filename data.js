let data,
	prompts,
	frogScores,
	frogNames,
	frogFacts,
	allFrogImgs,
	frogImgs,
	frogLinks;

frogFacts = [];

// Whenever the page loads, first fetch data from Airtable
function fetchData(callback) {
	let quizInfo = [];
	let journalInfo = [];
	let journalPrompts = [];

	// Whenever the page loads

	// Connect to Airtable to get all the quiz/journal info
	let Airtable = require("airtable");
	Airtable.configure({
		endpointUrl: "https://api.airtable.com",
		apiKey: "keycuL2P2p7WPUAZz",
	});
	let base = Airtable.base("appEhPPxg2z51MAtm");

	// Grab all the quiz info and save it into quizInfo
	let fetchQuizInfo = new Promise((resolve) => {
		let numQuizQuestions = 10;
		base("quiz")
			.select({
				// Selecting the first 3 records in Grid view:
				maxRecords: numQuizQuestions,
				view: "Grid view",
			})
			.eachPage(
				function page(records, fetchNextPage) {
					// This function (`page`) will get called for each page of records.

					records.forEach(function (record) {
						quizInfo.push({
							question: record.get("Question"),
							answer1: record.get("Answer 1"),
							frog1: record.get("Frog 1"),
							answer2: record.get("Answer 2"),
							frog2: record.get("Frog 2"),
							answer3: record.get("Answer 3"),
							frog3: record.get("Frog 3"),
							answer4: record.get("Answer 4"),
							frog4: record.get("Frog 4"),
							answer5: record.get("Answer 5"),
							frog5: record.get("Frog 5"),
							answer6: record.get("Answer 6"),
							frog6: record.get("Frog 6"),
						});
					});

					// To fetch the next page of records, call `fetchNextPage`.
					// If there are more records, `page` will get called again.
					// If there are no more records, `done` will get called.
					fetchNextPage();
				},
				function done(err) {
					if (err) {
						console.error(err);
						return;
					} else {
						resolve(quizInfo);
					}
				}
			);
	});

	// Grab all the journal info and save it into journalInfo
	let fetchJournalInfo = new Promise((resolve) => {
		let numJournalResults = 6;
		base("journal results")
			.select({
				// Selecting the first 3 records in Grid view:
				maxRecords: numJournalResults,
				view: "Grid view",
			})
			.eachPage(
				function page(records, fetchNextPage) {
					// This function (`page`) will get called for each page of records.

					records.forEach(function (record) {
						journalInfo.push({
							frog: record.get("Frog"),
							description: record.get("Description"),
							link: record.get("Link"),
							step1image: record.get("Step 1 Image"),
							step2image: record.get("Step 2 Image"),
							step3image: record.get("Step 3 Image"),
							step4image: record.get("Step 4 Image"),
							step5image: record.get("Step 5 Image"),
							step6image: record.get("Step 6 Image"),
							step7image: record.get("Step 7 Image"),
							step8image: record.get("Step 8 Image"),
						});
					});

					// To fetch the next page of records, call `fetchNextPage`.
					// If there are more records, `page` will get called again.
					// If there are no more records, `done` will get called.
					fetchNextPage();
				},
				function done(err) {
					if (err) {
						console.error(err);
						return;
					} else {
						resolve(journalInfo);
					}
				}
			);
	});

	// Grab all the journal prompts and save it into journalPrompts
	let fetchJournalPrompts = new Promise((resolve) => {
		let numJournalPrompts = 30;
		base("journal prompts")
			.select({
				// Selecting the first 3 records in Grid view:
				maxRecords: numJournalPrompts,
				view: "Grid view",
			})
			.eachPage(
				function page(records, fetchNextPage) {
					// This function (`page`) will get called for each page of records.

					records.forEach(function (record) {
						journalPrompts.push(record.get("Prompts"));
					});

					// To fetch the next page of records, call `fetchNextPage`.
					// If there are more records, `page` will get called again.
					// If there are no more records, `done` will get called.
					fetchNextPage();
				},
				function done(err) {
					if (err) {
						console.error(err);
						return;
					} else {
						resolve(journalPrompts);
					}
				}
			);
	});

	// Grab all the frog facts and save it into frogFacts
	let fetchFrogFacts = new Promise((resolve) => {
		let numFrogFacts = 12;
		frogFacts = [];
		base("frog facts")
			.select({
				// Selecting the first 3 records in Grid view:
				maxRecords: numFrogFacts,
				view: "Grid view",
			})
			.eachPage(
				function page(records, fetchNextPage) {
					// This function (`page`) will get called for each page of records.

					records.forEach(function (record) {
						frogFacts.push(record.get("Frog Facts"));
					});

					// To fetch the next page of records, call `fetchNextPage`.
					// If there are more records, `page` will get called again.
					// If there are no more records, `done` will get called.
					fetchNextPage();
				},
				function done(err) {
					if (err) {
						console.error(err);
						return;
					} else {
						resolve(frogFacts);
					}
				}
			);
	});

	data = Promise.all([
		Promise.resolve(fetchQuizInfo),
		Promise.resolve(fetchJournalInfo),
		Promise.resolve(fetchJournalPrompts),
		Promise.resolve(fetchFrogFacts),
	]).then((results) => {
		data = {
			quizInfo: results[0],
			journalInfo: results[1],
			journalPrompts: results[2],
			frogFacts: results[3],
		};
		frogScores = {
			tomato: 0,
			milk: 0,
			mimic: 0,
			blue: 0,
			red: 0,
			glass: 0,
		};

		frogNames = {
			tomato: "Tomato Frog",
			milk: "Amazon Milk Frog",
			mimic: "Mimic Poison Dart Frog",
			blue: "Blue Poison Dart Frog",
			red: "Red Eyed Tree Frog",
			glass: "Glass Frog",
		};

		// Restructure journal prompts from Airtable data
		prompts = data["journalPrompts"];

		// Restructure frog facts from Airtable data
		frogFacts = {};
		data["frogFacts"].forEach((f, i) => {
			frogFacts[i + 1] = f;
		});

		// Restructure all the step-by-step frog pics from Airtable data
		allFrogImgs = {};
		data["journalInfo"].forEach((i) => {
			let frogName = i["frog"];
			allFrogImgs[frogName] = {
				1: i["step1image"],
				2: i["step2image"],
				3: i["step3image"],
				4: i["step4image"],
				5: i["step5image"],
				6: i["step6image"],
				7: i["step7image"],
				8: i["step8image"],
			};
		});

		frogLinks = {};
		data["journalInfo"].forEach((e) => {
			frogLinks[e["frog"]] = e["link"];
		});
		callback(data);
	});
}
