"use strict";

const myForm = document.getElementById('myForm');

myForm.addEventListener('submit', function(event) {
	event.preventDefault();

	const formData = new FormData(this);
	const searchParams = new URLSearchParams();
	const password = formData.get('password');

	for (const pair of formData){
		searchParams.append(pair[0],pair[1]);
	}

	document.getElementById("myForm").reset();
	fetch('/login', {
		method: 'POST',
		body: searchParams,
		credentials: "include"
	}).then(res=> res.json()
	).then((data) => {
			console.log(data);
			document.getElementById('response').innerHTML = data.message;
			if(data.message == "Sign in successful"){
				setTimeout(()=>{window.location.href = '/profile'},1000);
			}
		}
	);

})
