
let form =document.querySelector("form")

form.addEventListener("submit",(e)=>{

    e.preventDefault()

    console.log("login done");

    let logemail= document.querySelector("#logemail").value
    let logepass= document.querySelector("#logpass").value
    console.log({logemail,logepass});

    let semail=localStorage.getItem("semail")
    let spass=localStorage.getItem("spass")
  
    if (semail==logemail && spass==logepass) {
        alert("login sucessful")
        console.log("login sucessfull");
        open("./main.html")
        
        
    }
    else{
        alert("login failed")
        console.log("login failed");
        
    }
})