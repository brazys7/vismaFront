class Event {
    constructor(description, deadline, completedAt) {
        this.description = description;
        this.deadline = deadline;
        this.completedAt = completedAt;        
    }    

    completeEvent() {
        if(this.completedAt === null) {
            this.completedAt = new Date();
        }
        else {
            this.completedAt = null;
        }        
    }
}

let storedEvents = [];

prepareDOM();

function prepareDOM() {
    todayDate();

    if(readFromStorage()) {
        let template = ``;
        let index = 0;

        storedEvents.forEach(item => {
            
            template += `
            <div class="event">
                <div class="doneEvent">
                    <input class="toggleDone" type="checkbox" onclick="complateEventByIndex(` + index + `)"`; 
            
            if(item.completedAt !== null) {
                template += `checked`;
            }

            template += `>                                
                </div>
                <div class="eventContent">
                    <p class="eventTitle"`;
            if(item.completedAt) {
                template += `style="text-decoration: line-through;"`;
            }
            template += `>` + item.description + `</p>
                    <p class="eventDeadline"><b>Time left:</b> ` + getTimeLeft(item) + `</p>
                </div>
                <div id="deleteItem" class="inputIcon" onclick="deleteEvent(`+ index + `)")></div>          
            </div>
            `;
            index++;
        });
        
        document.getElementById("eventsTable").innerHTML = template;
    }
    else {
        document.getElementById("eventsHeader").innerHTML = "No upcoming events";
        document.getElementById("tableMenu").style.display = "none";
    }    
}

function getTimeLeft(event) {
    if(event.completedAt) {
        return "Done";
    }
    else if(!event.deadline) {
        return "No deadline";
    }
    else {
        const now = new Date();
        const deadline = new Date(event.deadline);
        
        var difference = (now - new Date(event.deadline)) / 1000;

        days = Math.trunc(Math.abs(difference / (60 * 60 * 24)));
        if(days > 0) {
            difference += days * (60 * 60 * 24);
        }
        hours = Math.trunc(Math.abs(difference / (60 * 60)));
        if(hours > 0) {
            difference += hours * (60 * 60);
        }
        minutes = Math.trunc(Math.abs(difference / (60)));
        
        let result = "";
        let hoursValue = false;
        let minutesValue = false;
        if(days > 0) {
            result += days + "D";
            hoursValue = true;
        }
        if(hours > 0) {
            if(hoursValue) {
                result += ", "
            }
            result += hours + "H"
            minutesValue = true;
        }
        if(minutes > 0) {
            if(minutesValue) {
                result += ", "
            }
            result += minutes + "Min"
        }
        return result;
    }
}

function readFromStorage() {
    const events = JSON.parse(sessionStorage.getItem("events"));
    storedEvents = [];

    if(events) {
        events.forEach(event => {
            const newEvent = new Event(event.description, event.deadline, event.completedAt);
            storedEvents.push(newEvent);
        })        
        return true;
    }
    else return false;
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
        storedEvents.push(newEvent);

        resetForm();
        saveToLocalStorage();   
        prepareDOM();
    }     
}
function saveToLocalStorage() {
    sessionStorage.setItem("events", JSON.stringify(storedEvents));
}

function complateEventByIndex(index) {
    storedEvents[index].completeEvent();
    
    saveToLocalStorage();
}
function deleteEvent(index){
    storedEvents.splice(index, 1);

        saveToLocalStorage();
        prepareDOM();
}