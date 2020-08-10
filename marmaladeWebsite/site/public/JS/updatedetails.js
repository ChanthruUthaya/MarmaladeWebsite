const myForm = document.getElementById('myForm');

myForm.addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('response').innerHTML = "";
    document.getElementById('emailresponse').innerHTML = "";
    document.getElementById('nameresponse').innerHTML = "";

    const formData = new FormData(this);
    const searchParams = new URLSearchParams();


    for (const pair of formData){
        if(pair[1] !== ""){
            searchParams.append(pair[0],pair[1]);
        }
    }

    fetch('/updatedetails',{
        method: 'put',
        body:searchParams
    }).then(res => {
        return res.json();
    }).then(data => {
        if(data.error == true){
            let map = {
                name:"nameresponse",
                email:"emailresponse"
            }
            for(key in data){
                if(map.hasOwnProperty(key)){
                    document.getElementById(map[key]).innerHTML = data[key];
                }
            }
        }
        else{
            document.getElementById('response').innerHTML = data.message;
        }
    })

});