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
let itemToDelete;

prepareDOM();

function prepareDOM() {
    todayDate();

    if(readFromStorage()) {
        sortEvents();
        let template = ``;
        let index = 0;
        let startedCompleted = false; //for keeping track if we started displaying completed items yet
        let addedNotCompleted = false; //for keeping a track if there was an event added that wasn't completed

        storedEvents.forEach(item => {
            if(item.completedAt !== null) {
                //when there are only completed tasks in an array
                if(!addedNotCompleted && !startedCompleted)
                {
                    document.getElementById("eventsHeader").innerHTML = "Completed tasks";
                    template += getEventRow(index, item);
                    startedCompleted = true;
                }
                else if(!startedCompleted) {
                    document.getElementById("eventsHeader").innerHTML = "Upcoming events";
                    template += `
                    <h3 id="eventsHeader">Completed tasks</h3>
                    `;
                    template += getEventRow(index, item);
                    startedCompleted = true;
                }
                else {
                    template += getEventRow(index, item);
                }                
                
            }

            else {                
                document.getElementById("eventsHeader").innerHTML = "Upcoming events";
                template += getEventRow(index, item);
                addedNotCompleted = true;
            }

            

            index++;
        });
        
        document.getElementById("eventsTable").innerHTML = template;
    }
    else {
        document.getElementById("eventsHeader").innerHTML = "No upcoming events";
        document.getElementById("eventsTable").innerHTML = "";
    }    
}

function getEventRow(index, item) {
    let row = ``;
    row += `
                <div class="event">
                    <div class="doneEvent">
                        <input class="toggleDone" type="checkbox" onclick="complateEventByIndex(` + index + `)"`;


    if (item.completedAt !== null) {
        row += `checked`;
    }

    row += `>                                
                    </div>
                    <div class="eventContent">
                        <p class="eventTitle"`;
    if (item.completedAt) {
        row += `style="text-decoration: line-through;"`;
    }
    row += `>` + item.description + `</p>
                        <p class="eventDeadline"><b>Time left:</b> ` + getTimeLeft(item) + `</p>
                    </div>
                    <div id="deleteItem" class="inputIcon" onclick="toggleDeleteWindow(` + index + `)")></div>          
                </div>
                `;
    return row;
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
        
        if(difference >= 0) {
            return "Time is over";
        }

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

    if(events && events.length > 0) {
        events.forEach(event => {
            const newEvent = new Event(event.description, event.deadline, event.completedAt);
            storedEvents.push(newEvent);
        })        
        sortEvents();
        return true;
    }
    else return false;
}
//sorts events by putting the ones with least time on top, 
//then the ones without the deadline and then completed events 
//by when they were completed(latest completed is shown on the top)
function sortEvents() {
    sortedArray = [];

    //filtering out events which has a deadline and not completed yet and sorting them by the deadline
    sortedArray = storedEvents
    .filter(event => event.deadline !== "" && event.completedAt === null)
    .sort(function(a, b) {
        var dateA = a.deadline;
        var dateB = b.deadline;

        if(dateA > dateB){
            return 1;
        }
        else return -1;
    });

    //filtering events that don't have a deadline and adding them right after ones with deadlines
    storedEvents
    .filter(event => event.deadline === "" && event.completedAt === null)
    .forEach(event => {
        sortedArray.push(event);
    });

    //filtering out events that have been completed and sorting them by the completion date
    storedEvents
    .filter(event => event.completedAt !== null)
    .sort(function(a, b) {
        var dateA = a.completedAt;
        var dateB = b.completedAt;

        if(dateA > dateB){
            return 1;
        }
        else return -1;
    })
    .forEach(event => {
        sortedArray.push(event);
    });  

    storedEvents = sortedArray;
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
    else if(deadline !== "" && new Date(deadline) < new Date()) {        
        alert("Your entered deadline date is over, please fix it")        
    }
    else {
       const newEvent = new Event(description, deadline, null);
        storedEvents.push(newEvent);

        resetForm();
        saveToLocalStorage();   
    }     
}
function saveToLocalStorage() {
    sessionStorage.setItem("events", JSON.stringify(storedEvents));

    prepareDOM();
}

function complateEventByIndex(index) {
    storedEvents[index].completeEvent();
    
    saveToLocalStorage();
}
function deleteEvent(){
    storedEvents.splice(itemToDelete, 1);

    saveToLocalStorage();
    toggleDeleteWindow(null);
}

function toggleDeleteWindow(index) {
    itemToDelete = index;
    document.getElementById("deleteItemWindow").classList.toggle("active");  
}