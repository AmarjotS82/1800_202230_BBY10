firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = db.collection("users").doc(user.uid);   //global
        console.log(currentUser); 
        console.log(user.uid);
        getBookmarks(user)
        currentUser = db.collection("users").doc(user.uid); 
    } else {
        console.log("No user is signed in");
    }
});


function getBookmarks(user) {
    db.collection("users").doc(user.uid).get()
        .then(userDoc => {
            var bookmarks = userDoc.data().bookmarks;
            console.log(bookmarks);

            let CardTemplate = document.getElementById("vendorCardTemplate");
            bookmarks.forEach(thisVendorID => {
                console.log(thisVendorID);
                db.collection("vendors").where("code", "==", thisVendorID).get().then(snap => {
                    size = snap.size;
                    queryData = snap.docs;
                    
                    if (size >= 1) {
                        //let testVendorCard = vendorCardTemplate.content.cloneNode(true);
                        var doc = queryData[0].data();
                        var vendorName = doc.name; //gets the name field
                        var vendorID = doc.code; //gets the unique ID field
                        var vendorDesc = doc.description; //gets the unique ID field
                        let newCard = CardTemplate.content.cloneNode(true);
                        newCard.querySelector('.card-title').innerHTML = vendorName;
                        newCard.querySelector('.card-text').innerHTML = vendorDesc;
                        newCard.querySelector('i').onclick = () => removeBookmark(vendorID);
                        //newCard.querySelector('a').onclick = () => setvendorData(vendorID);
                        newCard.querySelector('img').src = `./images/${vendorID}.jpg`;
                        if (bookmarks.includes(vendorID)) {
                            vendorCardGroup.appendChild(newCard);
                        }
                        
                        
                        
                    } else {
                        console.log("Query has more than one data")
                    }

                })

            });
        })
}


function getBookmarks2(user) {
    db.collection("users").doc(user.uid).get()
        .then(userDoc => {
            var bookmarks = userDoc.data().bookmarks;
            console.log(bookmarks);

            let CardTemplate = document.getElementById("vendorCardTemplate");
            bookmarks.forEach(thisVendorID => {
                console.log(thisVendorID);
                db.collection("vendors").where("code", "==", thisVendorID).get().then(snap => {
                    size = snap.size;
                    queryData = snap.docs;
                    
                    if (size >= 1) {
                        //let testVendorCard = vendorCardTemplate.content.cloneNode(true);
                        var doc = queryData[0].data();
                        var vendorName = doc.name; //gets the name field
                        var vendorID = doc.code;//gets the unique ID field
                        let newCard = CardTemplate.content.cloneNode(true);
                        newCard.querySelector('.card-title').innerHTML = vendorName;
                        console.log("before remove")
                        newCard.querySelector('i').onclick = () => removeBookmark(vendorID);
                        console.log("after remove")
                        //newCard.querySelector('a').onclick = () => setvendorData(vendorID);
                        newCard.querySelector('img').src = `./images/${vendorID}.jpg`;
                        // if (bookmarks.includes(vendorID)) {
                        //     vendorCardGroup.appendChild(newCard);
                        //     vendorCardGroup.style.visibility = 'visible'; 
                        //     console.log("visble")
                        // }
                        // else{
                        //     vendorCardGroup.style.visibility = 'hidden'; 
                        //     console.log("hidden")
                        // }
                        
                        
                    } else {
                        console.log("Query has more than one data")
                    }

                })

            });
        })
}

function removeBookmark(vendorID){
    console.log("in remove")
    var iconID = 'save-' + vendorID;
    
    console.log(iconID);
                currentUser.update({
                    bookmarks: firebase.firestore.FieldValue.arrayRemove(vendorID)
                   
                }, {
                    merge: true
                })
                firebase.auth().onAuthStateChanged(user => {
                    if (user) {
                        currentUser = db.collection("users").doc(user.uid);   //global
                        let bookLog = document.getElementById("vendorCardGroup");
                        bookLog.innerHTML = "";
                        getBookmarks(user);      
                            
                    }
                })
    }






    