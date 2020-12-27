class Event {
    constructor(description, deadline) {
        this.description = description;
        this.deadline = deadline;
        this.completedAt = null;
    }

    completeEvent() {
        this.completedAt = new Date();
    }
}

let events = [];

prepareDOM();

function prepareDOM() {
    todayDate();
}
//prints today date in a selected format to the DOM
function todayDate() {
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString("en-GB", options);

    document.getElementById("todayDate").innerHTML = today;
}
//resets input form's values
function resetForm() {
    document.getElementById("addItemDesc").value = "";
    document.getElementById("selectDate").value = "";
    
    if(document.getElementById("selectDate").classList.contains('active')){
        showDeadline();
    }
}

//shows or hides deadline's input
function showDeadline() {
    document.getElementById("selectDate").classList.toggle("active");
    document.getElementById("addDeadline").classList.toggle("active");
    document.getElementById("addItemDesc").classList.toggle("whenDateActive");
}

//parses information from inputs and stores to session storage
function saveItem() {
    const description = document.getElementById("addItemDesc").value;
    const deadline = document.getElementById("selectDate").value;  

    if(description === "") {
        alert("Please enter desciption")
    }
    else {
       const newEvent = new Event(description, deadline);
        events.push(newEvent);

        resetForm();
        sessionStorage.setItem("events", JSON.stringify(events));   
    }     
}