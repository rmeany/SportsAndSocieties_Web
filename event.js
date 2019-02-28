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
  var eventsRef = firebase.database().ref();

// Listen for form submission
document.getElementById('contactForm').addEventListener('submit', submitEventForm);

// get Societies or Sports Clubs
function selectCategories(clubCategory) {
    // Get a reference to the clubs select.
    var clubsSelect = document.getElementById("clubs");
    // Create a two dimension array containing clubs for each group.
    var clubs = [["Athletics","Badminton","Basketball","Boxing","Camogie","Canoeing","Cycling","Darts","Equestrian","Gaelic Football","Golf","Hockey",
    			"Hurling","Karate","Kickboxing","MMA","Motorsport And Karting","Orienteering","Powerlifting","Racquetball","Rock-climbing","Rowing","Rugby",
    			"Sailing","Soccer","Sub Aqua","Surfing","Swimming","Tae Kwon Do","Tennis","Volleyball","Wakeboarding"],
                ["Africa","Alexander Technique","Anime And Manga","Architectural","Automotive","Barrier Free CIT","Biotechnology","Business","Cancer","Chemical Engineering",
                "Christian Union","Circus","Civil And Structural Engineering","Construction Management","DJ","Dance","Debate","Design & Media","Drama","Electronic Engineering",
                "Enactus","Enterprise","Film","Gaisce","Graphic Novel","Guild Gaming","Indian","International Students","Irish Red Cross","Islamic","K-Pop","LGBT","Macra","Mental Health",
                "Music","Musical","Nutrition","Open Mic","Photographic","Post Grad","Students for Sensible Drug Policy","Tech Talk","Trad","Yoga","Zen Meditation"],["general"]];
    if ((clubCategory >= 0) && (clubCategory <= clubs.length)) {
        clubsSelect.options.length = 0;
        // Index was in range, so access our array and create options.
        for (var i = 0; i < clubs[clubCategory - 1].length; i++) {
           clubsSelect.options[clubsSelect.options.length] = new Option(clubs[clubCategory - 1][i], i);
        }
    }
}

// submit form
function submitEventForm(e) {
	e.preventDefault();

	// get values
	var category = document.getElementById('categories');
	var categoryText = category.options[category.selectedIndex].text;
	var club = document.getElementById('clubs');
	var clubText = club.options[club.selectedIndex].text;
	var description = getInputVal('description');
	var location = getInputVal('location');
	var date = getInputVal('date');
	var time = getInputVal('time');

	console.log(categoryText);
	console.log(clubText);

  
if (validation(description, location) == false){
  alert("Ensure all fields are entered correctly.");
}
else if (timeValidation(date,time) == false) {
  alert("Ensure time is correctly inputted.");
}
else{
  // confirm submission
  var r = confirm("Are you sure you want to send the following to the mobile application? \n" + categoryText+": "+clubText+"\n" + "Event name: "+description+"\n" + "Location: "+location+"\n" + "Date: "+date+"\n" + "Time: "+time);
    if (r == true) {
        // save event
        saveEvent(categoryText, clubText, description, location, date, time);

        if (saveEvent(categoryText, clubText, description, location, date, time) == true){
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

function validation(description, location) {
    if (description.trim() == "" || location.trim() == "") {
        return false;
    }
    return true;
}

function timeValidation(date, time) {
  var today = new Date().toISOString().split('T')[0];

  var curDate = new Date();

  var h = (curDate.getHours()<10?'0':'') + curDate.getHours();
  var m = (curDate.getMinutes()<10?'0':'') + curDate.getMinutes();
  var curTime = h + ':' + m;

  if (date == today) {
    if (time < curTime) {
      return false;
    }
  }
  return true;
}

// Function to get form values
function getInputVal(id) {
	return document.getElementById(id).value;
}

// save event to firebase
function saveEvent(categoryText, clubText, description, location, date, time) {
  var forSlash = "/";
  var dot = ".";
  var dollar = "$";
  var hash = "#";
  var openBrack = "[";
  var closeBrack = "]";

  if(description.includes(forSlash) || description.includes(dot) || description.includes(dollar) || description.includes(hash) || description.includes(openBrack) || description.includes(closeBrack)
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
    var newEventRef = eventsRef.child(categoryText).child(clubText).child('events').child(description + " " + date).
    set({
     description: description,
     location: location,
     date: date,
     time: time
    });
    return true;
  }
	
}

function admin() {
  window.location.href="adminLogin.html";
}