var config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
  };
  firebase.initializeApp(config);


var ref = firebase.database().ref();


function login() {

  var email = document.getElementById("email_field").value;
  var password = document.getElementById("password_field").value;

  firebase.database().ref('Credentials/email').once("value", snapshot => {
   const email = snapshot.val();
   firebase.database().ref('Credentials/password').once("value", snapshot => {
    const pass = snapshot.val();
     if (email == email && pass == password){
        console.log("signed in!!");
        window.location.href="adminEvent.html";
     } else {
            // show alert
            document.querySelector('.alert').style.display = 'block';

            // hide alert after 3 seconds
            setTimeout(function() {
              document.querySelector('.alert').style.display = 'none';
            },3000);
            console.log("Error with log in")
        }
    });
  });


  //only works on firefox

  // firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
  //   window.location.href="adminEvent.html";
  //   console.log("signed in!!");
  // })
  //   .catch(function(error) {
  //     // show alert
  //       document.querySelector('.alert').style.display = 'block';

  //       // hide alert after 3 seconds
  //       setTimeout(function() {
  //         document.querySelector('.alert').style.display = 'none';
  //       },5000);
  //    console.log(error.code);
  //    console.log(error.message);
  // });
}