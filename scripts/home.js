
function writevendors() {
    //define a variable for the collection you want to create in Firestore to populate data
    var vendorsRef = db.collection("vendors");
    vendorsRef.add({
        name: "Triple O's",    
        code: "TripleO"
    });
    vendorsRef.add({
        name: "Poke Pick",    
        code: "placeholder"
    });
    vendorsRef.add({
        name: "Rix Cafe",    
        code: "placeholder"
    });
}
//writevendors();
function populateCardsDynamically() {
    let vendorCardTemplate = document.getElementById("vendorCardTemplate");
    let vendorCardGroup = document.getElementById("vendorCardGroup"); 
    db.collection("vendors").get()
        .then(allVendors => {
            allVendors.forEach(doc => {
                var vendorName = doc.data().name; //gets the name field
                var vendorDescription = doc.data().description; //gets the description field
                var vendorID = doc.data().code; //gets the unique ID field
                let testVendorCard = vendorCardTemplate.content.cloneNode(true);
                testVendorCard.querySelector('.card-title').innerHTML = vendorName;     //equiv getElementByClassName
                testVendorCard.querySelector('.card-text').innerHTML = vendorDescription;     //equiv getElementByClassName
                testVendorCard.querySelector('a').onclick = () => setVendorData(vendorID);//equiv getElementByTagName
                testVendorCard.querySelector('img').src = `./images/${vendorID}.jpg`;   //equiv getElementByTagName
                vendorCardGroup.appendChild(testVendorCard);
                console.log("Card template loaded")
            })
                                                                                                                                                      
        })
}
populateCardsDynamically();

function setVendorData(id){
    localStorage.setItem ('vendorID', id);
}








var currentUser;

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = db.collection("users").doc(user.uid);   //global
        console.log(currentUser); 
        console.log(user.uid);
        populateCardsDynamically(user)
    } else {
        console.log("No user is signed in");
    }
});

//writevendors();
function populateCardsDynamically(user) {
    var count = 0;
    let vendorCardTemplate = document.getElementById("vendorCardTemplate");
    let vendorCardGroup = document.getElementById("vendorCardGroup"); 
    db.collection("vendors").get()
        .then(allVendors => {
            allVendors.forEach(doc => {
                var vendorName = doc.data().name; //gets the name field
                var vendorDescription = doc.data().description; //gets the description field
                var vendorID = doc.data().code; //gets the unique ID field
                let testVendorCard = vendorCardTemplate.content.cloneNode(true);
                testVendorCard.querySelector('.card-title').innerHTML = vendorName;     //equiv getElementByClassName
                testVendorCard.querySelector('.card-text').innerHTML = vendorDescription;     //equiv getElementByClassName
                testVendorCard.querySelector('a').onclick = () => setVendorData(vendorID);//equiv getElementByTagName
                testVendorCard.querySelector('img').src = `./images/${vendorID}.jpg`;   //equiv getElementByTagName
                testVendorCard.querySelector('i').id = 'save-' + vendorID;
                testVendorCard.querySelector('i').onclick = () => saveBookmark(vendorID,user);
                checkBookmark(vendorID,user);
                vendorCardGroup.appendChild(testVendorCard); 
                console.log("Card template loaded")
            })
                                                                                                                                                      
        })
}

function setVendorData(id){
    localStorage.setItem ('vendorID', id);
}
function saveBookmark(vendorID,user) {


        db.collection("users").doc(user.uid).get()     
        .then(userDoc => {

            currentUser.update({
                bookmarks: firebase.firestore.FieldValue.arrayUnion(vendorID)
            }, {
                merge: true
            })
            
            var bookmarks = userDoc.data().bookmarks;
            console.log(bookmarks + "initial test"); 
            if (bookmarks.includes(vendorID) ) {
                console.log("bookmark has been saved for: " + currentUser);
                var iconID = 'save-' + vendorID;
                console.log(iconID);
                //this is to change the icon of the hike that was saved to "filled"
                document.getElementById(iconID).innerText = 'bookmark_border';
                currentUser.set({
                    bookmarks: firebase.firestore.FieldValue.arrayRemove(vendorID)
                }, {
                    merge: true
                })

            }
            else{
                console.log("bookmark has been saved for: " + currentUser);
                var iconID = 'save-' + vendorID;
                console.log(iconID);
                //this is to change the icon of the hike that was saved to "filled"
                document.getElementById(iconID).innerText = 'bookmark';
            }
            
        })
    };
    function checkBookmark(vendorID,user) {
            db.collection("users").doc(user.uid).get()     
            .then(userDoc => {
                var bookmarks = userDoc.data().bookmarks;
                console.log(bookmarks); 
                if (bookmarks.includes(vendorID)) {
                    console.log("bookmark stays " + currentUser);
                    var iconID = 'save-' + vendorID;
                    console.log(iconID);
                    //this is to change the icon of the hike that was saved to "filled"
                    document.getElementById(iconID).innerText = 'bookmark';
                }
            })
        }

