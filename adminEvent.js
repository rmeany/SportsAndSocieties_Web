var config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
  };
  firebase.initializeApp(config);

  var tblUsers = document.getElementById('tbl_event_list');
  var databaseRef = firebase.database().ref();
  var rowIndex = 1;

  $('#tableAlert').hide();

  // Listen for form submission
document.getElementById('contactForm').addEventListener('submit', submitEventForm);


function myFunction() {
  // Declare variables 
  var input, filter, table, tr, td, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("tbl_event_list");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    } 
  }
}

	// submit form
function submitEventForm(e) {
	e.preventDefault();

	// get values
	var categoryText = getCategoryText();
	var clubText = getClubText();

	console.log(categoryText);
	console.log(clubText);

	database(categoryText, clubText);
}


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

	
	function database(categoryText, clubText) {
	  databaseRef.child(categoryText).child(clubText).child('events').once('value', function(snapshot) {
	  	if(snapshot.exists()){
	  		var content = '';

	  		snapshot.forEach(function(childSnapshot) {
		  		var description = childSnapshot.val().description;
		  		var date = childSnapshot.val().date;
		  		var location = childSnapshot.val().location;
		  		var time = childSnapshot.val().time;

		  		content += '<tr id="row' + rowIndex + '">';
	            content += '<td class="des">' + description + '</td>'; //column1
	            content += '<td class="date">' + date + '</td>';//column2
	            content += '<td class="loc">' + location + '</td>';//column3
	            content += '<td class="time">' + time + '</td>';//column4
	            content += '<td><button id="attendancebtn' + rowIndex + '" type="button" class="attendance_event" onclick="getAttendance()">Who\'s going?</button></td>';//remove button
	            content += '<td><button id="updatebtn' + rowIndex + '" type="button" class="update_event" onclick="updateButton()">Update</button></td>';//update button
	            content += '<td><button id="removebtn' + rowIndex + '" type="button" class="remove_event" onclick="removeButton()">Remove</button></td>';//remove button
	            content += '</tr>';

	            rowIndex = rowIndex + 1
	        });

	  		$("#tbl_event_list tbody tr").remove(); 
	        $('#tbl_event_list').append(content);
	  	}
	  	else {
	  		// show alert
			document.querySelector('#eventAlert').style.display = 'block';

			// hide alert after 3 seconds
			setTimeout(function() {
			    document.querySelector('#eventAlert').style.display = 'none';
			},3000);
	  		console.log("No data exists");
	  		$("#tbl_event_list tbody tr").remove();
	  	}
	  });
}

	function getAttendance() {

		$(".attendance_event").click(function(e){
			var $row = $(this).closest("tr");
			var $rowDescription = $row.find(".des").text();
			var $rowDate = $row.find(".date").text();
			//var numAttend = 0;

			databaseRef.child(getCategoryText()).child(getClubText()).child('events').child($rowDescription + " " + $rowDate).child("attendance").on("value", function(snapshot) {
		  		var numAttend = snapshot.numChildren();

		  		// Get the modal
				var modal = document.getElementById('attModal');

				// Get the <span> element that closes the modal
				var span = document.getElementsByClassName("close")[0];

				modal.style.display = "block";

				document.getElementById("modalAttendDescription").value = $rowDescription;
				document.getElementById("modalAttendDate").value = $rowDate;
				document.getElementById("modalAttendNum").value = numAttend;

				// When the user clicks anywhere outside of the modal, close it
				window.onclick = function(event) {
				    if (event.target == modal) {
				        modal.style.display = "none";
				    }
				}
			});
		});
	}

	function updateButton() {

		$(".update_event").click(function(e){
			    var $row = $(this).closest("tr");
				var $rowDescription = $row.find(".des").text();
				var $rowDate = $row.find(".date").text();
				var $location = $row.find(".loc").text();
				var $time = $row.find(".time").text();

				// Get the modal
				var modal = document.getElementById('myModal');

				// Get the <span> element that closes the modal
				var span = document.getElementsByClassName("close")[0];

				var submitbtn = document.getElementById('submitbtn');

				modal.style.display = "block";

				document.getElementById("modalDescription").value = $rowDescription;
				document.getElementById("modalLocation").value = $location;
				document.getElementById("modalDate").value = $rowDate;
				document.getElementById("modalTime").value = $time;

				// When the user clicks anywhere outside of the modal, close it
				window.onclick = function(event) {
				    if (event.target == modal) {
				        modal.style.display = "none";
				    }
				}

				submitbtn.onclick = function() {
					var description = $("#myModal").find('#modalDescription').val();
					var location = $("#myModal").find('#modalLocation').val();
					var date = $("#myModal").find('#modalDate').val();
					var time = $("#myModal").find('#modalTime').val();

				var updateRef = databaseRef.child(getCategoryText()).child(getClubText()).child('events');

				if (validation(description, location) == false){
				  alert("Ensure all fields are entered correctly.");
				}
				else if (dateValidation(date) == false) {
				  alert("Ensure a valid date is inputted.")
				}
				else if (timeValidation(date,time) == false) {
				  alert("Ensure a valid time is inputted.")
				}
				else{
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
							updateRef.child(description + " " + date).once('value', function(snapshot) {
							  if (snapshot.exists()) {
							  	// confirm submission
								  var r = confirm("An event with the name '" + description + "' and date '" + date + "' already exists. Do you want to overwite the existing information?");
								    if (r == true) {
								        updateRef.child($rowDescription + " " + $rowDate).remove()
									    .then(function() {
									      $row.remove();
											var description = $("#myModal").find('#modalDescription').val();
											var location = $("#myModal").find('#modalLocation').val();
											var date = $("#myModal").find('#modalDate').val();
											var time = $("#myModal").find('#modalTime').val();
									      var EventRef = databaseRef.child(getCategoryText()).child(getClubText()).child('events').child(description + " " + date).
											set({
												description: description,
												location: location,
												date: date,
												time: time
											});
											reload_page();
									    })
									    .catch(function(error) {
									      console.log('ERROR');
									    });

								    } else {
								        console.log("Cancelled submission")
								    }
							    }
							  else {
							  	updateRef.child($rowDescription + " " + $rowDate).remove()
									    .then(function() {
									      $row.remove();
											var description = $("#myModal").find('#modalDescription').val();
											var location = $("#myModal").find('#modalLocation').val();
											var date = $("#myModal").find('#modalDate').val();
											var time = $("#myModal").find('#modalTime').val();
									      var EventRef = databaseRef.child(getCategoryText()).child(getClubText()).child('events').child(description + " " + date).
											set({
												description: description,
												location: location,
												date: date,
												time: time
											});
											reload_page();
									    })
									    .catch(function(error) {
									      console.log('ERROR');
									    });
							  	}
							});
						}
				}
			}
		});
	}


	function removeButton() {

		document.getElementById('contactForm').addEventListener('submit', submitEventForm);

		var rows = document.getElementById('tbl_event_list').rows.length;

		console.log(rows)

		 
				$(".remove_event").click(function(e){
			    var $row = $(this).closest("tr");
			    var $rowDescription = $row.find(".des").text();
			    var $rowDate = $row.find(".date").text();

			    var r = confirm("Are you sure you want to remove " + $rowDescription + " " + $rowDate + " ?");
			    if (rows > 2) {
			    	
					    if (r == true) {
							var newEventsRef = databaseRef.child(getCategoryText()).child(getClubText()).child('events');
							newEventsRef.child($rowDescription + " " + $rowDate).remove()
						    .then(function() {
						      $row.remove();
						      reload_page();
						    })
						    .catch(function(error) {
						      console.log('ERROR');
						    });  
						} else {
					        console.log("Cancelled submission")
					    }
				}
				else {
					// show alert
			        document.querySelector('#tableAlert').style.display = 'block';

			        // hide alert after 3 seconds
			        setTimeout(function() {
			          document.querySelector('#tableAlert').style.display = 'none';
			        },3000);
					console.log('ERROR');
				}
			});
		}

	  function reload_page() {
	  	window.location.reload();
	  }

	  function getCategoryText() {
		var category = document.getElementById('categories');
		return category.options[category.selectedIndex].text;
	  }

	  function getClubText() {
	  	var club = document.getElementById('clubs');
		return club.options[club.selectedIndex].text;
	  }

function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("tbl_event_list");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc"; 
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("TR");
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++; 
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

function dateValidation(date) {
  var today = new Date().toISOString().split('T')[0];

  if (date < today) {
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

function logout() {
  firebase.auth().signOut().then(function() {
    window.location.href="adminLogin.html";
    console.log("Logged out!")
  }, function(error) {
     console.log(error.code);
     console.log(error.message);
  });
}

// Function to get form values
function getInputVal(id) {
	return document.getElementById(id).value;
}

function validation(description, location) {
    if (description.trim() == "" || location.trim() == "") {
        return false;
    }
    return true;
}