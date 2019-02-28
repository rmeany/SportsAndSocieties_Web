var config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
  };
  firebase.initializeApp(config);

  var tblUsers = document.getElementById('tbl_result_list');
  var databaseRef = firebase.database().ref();
  var rowIndex = 1;

  $('#tableAlert').hide();

  // Listen for form submission
document.getElementById('contactForm').addEventListener('submit', submitResultForm);


function myFunction() {
  // Declare variables 
  var input, filter, table, tr, td, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("tbl_result_list");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[3];
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
function submitResultForm(e) {
	e.preventDefault();

	// get values
	var categoryText = getCategoryText();
	var clubText = getClubText();

	console.log(categoryText);
	console.log(clubText);

	database(categoryText, clubText);
}


// get Sports Clubs
		function selectCategories(clubCategory) {
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

	
	function database(categoryText, clubText) {
	  databaseRef.child(categoryText).child(clubText).child('results').once('value', function(snapshot) {
	  	if(snapshot.exists()){
	  		var content = '';

	  		snapshot.forEach(function(childSnapshot) {
		  		var date = childSnapshot.val().date;
		  		var location = childSnapshot.val().location;
		  		var opposition = childSnapshot.val().opposition;
		  		var citTeam = childSnapshot.val().team;
		  		var time = childSnapshot.val().time;
		  		var type = childSnapshot.val().type;
		  		var score = childSnapshot.val().score;

		  		content += '<tr id="row' + rowIndex + '">';
	            content += '<td class="date">' + date + '</td>'; //column1
	            content += '<td class="cit">' + citTeam + '</td>';//column2
	            content += '<td class="score">' + score + '</td>';//column3
	            content += '<td class="opp">' + opposition + '</td>';//column4
	            content += '<td class="loc">' + location + '</td>';//column5
	            content += '<td class="time">' + time + '</td>';//column6
	            content += '<td class="type">' + type + '</td>';//column7
	            content += '<td><button id="updatebtn' + rowIndex + '" type="button" class="update_result" onclick="updateButton()">Update</button></td>';//update button
	            content += '<td><button id="removebtn' + rowIndex + '" type="button" class="remove_result" onclick="removeButton()">Remove</button></td>';//remove button
	            content += '</tr>';

	            rowIndex = rowIndex + 1
	        });

	  		$("#tbl_result_list tbody tr").remove(); 
	        $('#tbl_result_list').append(content);
	  	}
	  	else {
	  		// show alert
			document.querySelector('#resultAlert').style.display = 'block';

			// hide alert after 3 seconds
			setTimeout(function() {
			    document.querySelector('#resultAlert').style.display = 'none';
			},3000);
	  		console.log("No data exists");
	  		$("#tbl_result_list tbody tr").remove();
	  	}
	  });
	}

	function updateButton() {
		
		$(".update_result").click(function(e){
			    var $row = $(this).closest("tr");
				var $rowDate = $row.find(".date").text();
				var $citTeam = $row.find(".cit").text();
				var $opposition = $row.find(".opp").text();
				var $location = $row.find(".loc").text();
				var $time = $row.find(".time").text();
				var $type = $row.find(".type").text();

				// Get the modal
				var modal = document.getElementById('myModal');

				// Get the <span> element that closes the modal
				var span = document.getElementsByClassName("close")[0];

				var submitbtn = document.getElementById('submitbtn');

				modal.style.display = "block";

				document.getElementById("modalDate").value = $rowDate;
				document.getElementById("modalTeam").value = $citTeam;
				document.getElementById("modalOpposition").value = $opposition;
				document.getElementById("modalLocation").value = $location;
				document.getElementById("modalTime").value = $time;
				document.getElementById("modalType").value = $type;

				// When the user clicks anywhere outside of the modal, close it
				window.onclick = function(event) {
				    if (event.target == modal) {
				        modal.style.display = "none";
				    }
				}

				submitbtn.onclick = function() {
					var team = $("#myModal").find('#modalTeam').val();
					var citScore = $("#myModal").find('#modalCitScore').val();
					var opposition = $("#myModal").find('#modalOpposition').val();
					var oppScore = $("#myModal").find('#modalOppScore').val();
					var type = $("#myModal").find('#modalType').val();
					var location = $("#myModal").find('#modalLocation').val();
					var date = $("#myModal").find('#modalDate').val();
					var time = $("#myModal").find('#modalTime').val();

				if (validation(team, citScore, opposition, oppScore, type, location) == false){
				  alert("Ensure all fields are entered correctly.");
				}
				else if (dateValidation(date, time) == false) {
				  alert("Ensure a valid date/time is inputted.")
				}
				else{
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
						var updateRef = databaseRef.child(getCategoryText()).child(getClubText()).child('results');
						updateRef.child(opposition + " " + date).once('value', function(snapshot) {
						  if (snapshot.exists()) {
						  	// confirm submission
							  var r = confirm("A result against '" + opposition + "' on '" + date + "' already exists. Do you want to overwite the existing information?");
							    if (r == true) {
								updateRef.child($opposition + " " + $rowDate).remove()
							    .then(function() {
							      $row.remove();
									var team = $("#myModal").find('#modalTeam').val();
									var citScore = $("#myModal").find('#modalCitScore').val();
									var opposition = $("#myModal").find('#modalOpposition').val();
									var oppScore = $("#myModal").find('#modalOppScore').val();
									var type = $("#myModal").find('#modalType').val();
									var location = $("#myModal").find('#modalLocation').val();
									var date = $("#myModal").find('#modalDate').val();
									var time = $("#myModal").find('#modalTime').val();
							      var EventRef = databaseRef.child(getCategoryText()).child(getClubText()).child('results').child(opposition + " " + date).
									set({
										team: team,
										score: citScore + '  ' + oppScore,
										opposition: opposition,
										type: type,
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
						  	updateRef.child($opposition + " " + $rowDate).remove()
							    .then(function() {
							      $row.remove();
									var team = $("#myModal").find('#modalTeam').val();
									var citScore = $("#myModal").find('#modalCitScore').val();
									var opposition = $("#myModal").find('#modalOpposition').val();
									var oppScore = $("#myModal").find('#modalOppScore').val();
									var type = $("#myModal").find('#modalType').val();
									var location = $("#myModal").find('#modalLocation').val();
									var date = $("#myModal").find('#modalDate').val();
									var time = $("#myModal").find('#modalTime').val();
							      var EventRef = databaseRef.child(getCategoryText()).child(getClubText()).child('results').child(opposition + " " + date).
									set({
										team: team,
										score: citScore + '  ' + oppScore,
										opposition: opposition,
										type: type,
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

		var rows = document.getElementById('tbl_result_list').rows.length;

				$(".remove_result").click(function(e){
			    var $row = $(this).closest("tr");
			    var $rowOpposition = $row.find(".opp").text();
			    var $rowDate = $row.find(".date").text();

			    if (rows > 2) {
			    	var r = confirm("Are you sure you want to remove " + $rowOpposition + " " + $rowDate + " ?");
					    if (r == true) {
							var newResultsRef = databaseRef.child(getCategoryText()).child(getClubText()).child('results');
							newResultsRef.child($rowOpposition + " " + $rowDate).remove()
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
  table = document.getElementById("tbl_result_list");
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

function logout() {
  firebase.auth().signOut().then(function() {
    window.location.href="adminLogin.html";
    console.log("Logged out!")
  }, function(error) {
     console.log(error.code);
     console.log(error.message);
  });
}

function validation(team, citScore, opposition, oppScore, type, location) {
    if (team.trim() == "" || citScore.trim() == "" || opposition.trim() == "" || oppScore.trim() == "" || type.trim() == "" || location.trim() == "") {
        return false;
    }
    return true;
}