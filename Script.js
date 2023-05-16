function registerBtnEvents() {
    // A list of all event listeners used through out the code
    var buttons = document.querySelector("#btnAtBottom");
    var tblbuttons = document.querySelector("#data-output");
    var modal = document.getElementById("myModal");
    var forms = document.getElementById("myForms");
    var closeModal = document.getElementsByClassName("close")[0];


    forms.addEventListener("click", function() {
        modal.style.display = "block";
    });

    closeModal.addEventListener("click", function() {
        modal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    tblbuttons.addEventListener("click", (event) => {
        if (event.target.text === "Edit") {
            var rowId = event.target.getInnerHTML();
            editRowData();
        } else {
            if (event.target.id === "filterAuthor") {
                var aName = event.target.getInnerHTML(); {
                    hideShowRows(aName);
                }
            }
        }
    });


    // A function to reset the API
    var reset = document.getElementById("Reset");
    reset.addEventListener("click", async function(e) {
        e.preventDefault();
        let response = await fetch(
            "https://wt.ops.labs.vu.nl/api23/954333d6/reset", {
                method: "GET",
            }
        );
        getDataFromServer();
    });


    //A function to update information in the API
    let update = document.getElementById("Update");
    update.addEventListener("click", async function(e) {
        e.preventDefault();

        let url = document.getElementById("image").value;
        let id = "";
        for (let photo of details) {
            if (photo.image == url) {
                id = photo.id;
            }
        }

        let response = await fetch(
            "https://wt.ops.labs.vu.nl/api23//item/954333d6", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    image: document.getElementById("image").value,
                    author: document.getElementById("author").value,
                    alt: document.getElementById("alt").value,
                    tags: document.getElementById("tags").value,
                    description: document.getElementById("description").value,
                }),
            }
        ).then(function(response) {
            getDataFromServer();
            modal.style.display = "none";
            document.getElementById("image").value = "";
            document.getElementById("author").value = "";
            document.getElementById("alt").value = "";
            document.getElementById("tags").value = "";
            document.getElementById("description").value = "";
        });
    });

    // Form display
    let form = document.getElementById("formSubmit");
    form.addEventListener("submit", async function(e) {
        e.preventDefault();
        var formData = new FormData(form);
        let response = await fetch("https://wt.ops.labs.vu.nl/api23/954333d6", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                image: formData.get("image"),
                author: formData.get("author"),
                alt: formData.get("alt"),
                tags: formData.get("tags"),
                description: formData.get("description"),
            }),
        }).then(function(response) {
            getDataFromServer();
            modal.style.display = "none";
            document.getElementById("image").value = "";
            document.getElementById("author").value = "";
            document.getElementById("alt").value = "";
            document.getElementById("tags").value = "";
            document.getElementById("description").value = "";
        });
    });

    //Function to make the webpage filterable by a single click
    let searchPhoto = document.getElementById("searchBtn");
    searchPhoto.addEventListener("click", async function(e) {
        e.preventDefault();
        var keyword = document.getElementById("formSearch").value;
        console.log("Searching for keyword " + keyword);
        fetch('https://wt.ops.labs.vu.nl/api23/954333d6').then(response => response.json()).then(response => hideShowRows(keyword, response));
    });
}


function hideShowRows(filterAuthor) {
    var noDisplay = 0;
    var table = document.getElementById("tblPhoto");
    var oRows = table.getElementsByTagName("tr");

    for (i = 1; i < table.rows.length; i++) {
        var tableCells = table.rows.item(i).cells;
        if (oRows[i].style.display === "none") {
            noDisplay = noDisplay + 1;
        }
    }

    if (noDisplay === 0) {
        for (i = 1; i < table.rows.length; i++) {
            var tableCells = table.rows.item(i).cells;
            if (tableCells.item(1).textContent === filterAuthor) {
                oRows[i].style.backgroundColor = "lavender";
            } else {
                oRows[i].style.display = "none";
            }
        }
    } else {
        for (i = 1; i < table.rows.length; i++) {
            var tableCells = table.rows.item(i).cells;
            oRows[i].style.display = "";
            oRows[i].style.backgroundColor = "rosybrown";
        }
    }
}

//Function to dynamically display the data
function getDataFromServer() {
    fetch("https://wt.ops.labs.vu.nl/api23/954333d6")
        .then(function(response) {
            console.log(response);
            return response.json();
        })
        .then(function(photodetails) {
            console.log(photodetails);
            details = photodetails;
            let placeholder = document.querySelector("#data-output");
            let out = "";
            let photoTag = "";
            for (let photo of photodetails) {
                let splitTags = photo.tags.split(",");

                photoTag = "";
                for (var i = 0; i < splitTags.length; i++) {
                    photoTag += "<ul>" + "<li>" + splitTags[i] + "</li>" + "</ul>";
                }

                out +=
                    '<tr id = "boxes"' +
                    photo.id +
                    '">' +
                    '<td data-label="Photo">' +
                    "<figure>" +
                    '<img src= "' +
                    photo.image +
                    '"height="200" width="300">' +
                    "</figure>" +
                    "</td>" +
                    '<td id = "Author" data-label="Author">' +
                    '<a  id = "filterAuthor" class = "button">' +
                    photo.author +
                    "</a>" +
                    "</td>" +
                    '<td data-label="Alt">' +
                    photo.alt +
                    "</td>" +
                    '<td data-label="Tags">' +
                    photoTag +
                    "</td>" +
                    '<td data-label="Description">' +
                    photo.description +
                    "</td>" +
                    "</tr>";
            }

            placeholder.innerHTML = out;
            return false;
        });
}