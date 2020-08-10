"use strict";

const myForm = document.getElementById('photoForm');

myForm.addEventListener('submit', function(e) { 
    e.preventDefault();

    const formData = new FormData();
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    let file = document.getElementById('photo').files[0];
    console.log(file);
    formData.append("uploadImage",file);

    fetch('/upload', {
        method: 'POST',
        headers:headers,
        mode: 'no-cors',
        body: formData
    }).then(response => response.json()
    ).then((data) => {
        if(data.error){
            document.getElementById('response').innerHTML = data.message;
        }
        else{
            window.location.href = "/profile";
        }
    })

})
