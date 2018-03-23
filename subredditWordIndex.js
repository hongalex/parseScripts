/**
 * Creates an index of all words in the top 100 posts for a specific subreddit
 * Can be used to make a wordcloud
 * 
 * usage: node subredditWordIndex.js [subreddit] [time]
 * 
 * e.g. node subreddit_word_index.js all week
 */

var request = require('request');
var _ = require('lodash/core');
var sw = require('stopword');

var baseRedditUrl = 'https://www.reddit.com/r/';
var subreddit = process.argv[2];
var time = process.argv[3];
var options = '/top.json?limit=100&time=' + time;

var url = baseRedditUrl + subreddit + options;

request(url, function (error, response, body) {
	var data = JSON.parse(body).data.children;

	var index = {};

	_.each(data, function(post) {
		var title = post.data.title;

		// Do some initial 
		title = title.split(/[\s-"']/);

		// Remove common stopwords 
		title = sw.removeStopwords(title);

		_.each(title, function(word) {
			
			// Match all alphanumeric characters, quotes, and underscores
			if(word.match(/^[a-zA-Z0-9_]{2,}$/i)) {
				word = word.toLowerCase();

				// Save to a dictionary
				if(index.hasOwnProperty(word)) {
					index[word]++;
				} else {
					index[word] = 1;
				}
			}
		});
	});

	console.log(index);
});
