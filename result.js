var config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
  };
  firebase.initializeApp(config);

  // reference messages collection
  var resultsRef = firebase.database().ref('Sports Clubs');

// select Sports Club
function selectClubs(clubCategory) {
    // Get a reference to the clubs select.
    var clubsSelect = document.getElementById("clubs");
    // Create a two dimension array containing clubs for each group.
    var clubs = [["Athletics","Badminton","Basketball","Boxing","Camogie","Canoeing","Cycling","Darts","Equestrian","Gaelic Football","Golf","Hockey",
    			"Hurling","Karate","Kickboxing","MMA","Motorsport And Karting","Orienteering","Powerlifting","Racquetball","Rock-climbing","Rowing","Rugby",
    			"Sailing","Soccer","Sub Aqua","Surfing","Swimming","Tae Kwon Do","Tennis","Volleyball","Wakeboarding"]];
    if ((clubCategory >= 0) && (clubCategory <= clubs.length)) {
        clubsSelect.options.length = 0;
        // Index was in range, so access our array and create options.
        for (var i = 0; i < clubs[clubCategory - 1].length; i++) {
           clubsSelect.options[clubsSelect.options.length] = new Option(clubs[clubCategory - 1][i], i);
        }
    }
}

// Listen for form submission
document.getElementById('contactForm').addEventListener('submit', submitResultForm);

// submit form
function submitResultForm(e) {
	e.preventDefault();

	// get values
	var club = document.getElementById('clubs');
	var clubText = club.options[club.selectedIndex].text;
	var team = getInputVal('team');
	var citScore = getInputVal('citScore');
	var opposition = getInputVal('opposition');
	var oppScore = getInputVal('oppScore');
	var type = getInputVal('type');
	var location = getInputVal('location');
	var date = getInputVal('date');
	var time = getInputVal('time');


if (validation(team, citScore, opposition, oppScore, type, location) == false){
  alert("Ensure all fields are entered correctly.");
}
else if (dateValidation(date, time) == false) {
  alert("Ensure a valid date/time is inputted.")
}
else {
	// confirm submission
  	var r = confirm("Are you sure you want to send the following to the mobile application? \n" + clubText+"\n" + "CIT team: "+team+"\n" + "CIT score: "+citScore+"\n" + "Opposition: "+opposition+"\n" + "Opposition score: "+oppScore+"\n" + "Type: "+type+"\n" + "Location: "+location+"\n" + "Date: "+date+"\n" + "Time: "+time);
    if (r == true) {
        // save result
		saveResult(clubText, team, citScore, opposition, oppScore, type, location, date, time);

    if (saveResult(clubText, team, citScore, opposition, oppScore, type, location, date, time) == true) {

  		// show alert
  		document.querySelector('.alert').style.display = 'block';

  		// hide alert after 3 seconds
  		setTimeout(function() {
  			document.querySelector('.alert').style.display = 'none';
  		},3000);

  		// reset form
  		document.getElementById('contactForm').reset();
    }
	} else {
	    console.log("Cancelled submission")
	}
}
}

function validation(team, citScore, opposition, oppScore, type, location) {
    if (team.trim() == "" || citScore.trim() == "" || opposition.trim() == "" || oppScore.trim() == "" || type.trim() == "" || location.trim() == "") {
        return false;
    }
    return true;
}

// Function to get form values
function getInputVal(id) {
	return document.getElementById(id).value;
}

// save result to firebase
function saveResult(clubText, team, citScore, opposition, oppScore, type, location, date, time) {
  var forSlash = "/";
  var dot = ".";
  var dollar = "$";
  var hash = "#";
  var openBrack = "[";
  var closeBrack = "]";

  if(team.includes(forSlash) || team.includes(dot) || team.includes(dollar) || team.includes(hash) || team.includes(openBrack) || team.includes(closeBrack)
   || opposition.includes(forSlash) || opposition.includes(dot) || opposition.includes(dollar) || opposition.includes(hash) || opposition.includes(openBrack) || opposition.includes(closeBrack)
   || citScore.includes(forSlash) || citScore.includes(dot) || citScore.includes(dollar) || citScore.includes(hash) || citScore.includes(openBrack) || citScore.includes(closeBrack)
   || oppScore.includes(forSlash) || oppScore.includes(dot) || oppScore.includes(dollar) || oppScore.includes(hash) || oppScore.includes(openBrack) || oppScore.includes(closeBrack)
   || type.includes(forSlash) || type.includes(dot) || type.includes(dollar) || type.includes(hash) || type.includes(openBrack) || type.includes(closeBrack)
   || location.includes(forSlash) || location.includes(dot) || location.includes(dollar) || location.includes(hash) || location.includes(openBrack) || location.includes(closeBrack))
  {
    // show alert
    document.querySelector('#invalidChar').style.display = 'block';

    // hide alert after 3 seconds
    setTimeout(function() {
      document.querySelector('#invalidChar').style.display = 'none';
      },10000);

    return false;

  } else {
    var newResultRef = resultsRef.child(clubText).child('results').child(opposition + ' ' + date).
    set({
      team: team,
      score: citScore + '  ' + oppScore,
      opposition: opposition,
      type: type,
      location: location,
      date: date,
      time: time
    });
    return true;
  }
}

function dateValidation(date, time) {
  var today = new Date().toISOString().split('T')[0];

  var curDate = new Date();

  var h = (curDate.getHours()<10?'0':'') + curDate.getHours();
  var m = (curDate.getMinutes()<10?'0':'') + curDate.getMinutes();
  var curTime = h + ':' + m;

  if (date > today) {
     return false;
  }
  else if (date == today) {
    if (time > curTime) {
      return false;
    }
  }
  return true;
}

function admin() {
  window.location.href="adminLogin.html";
}