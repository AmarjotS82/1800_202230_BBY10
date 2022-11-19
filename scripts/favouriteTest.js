firebase.auth().onAuthStateChanged(user => {
    if (user) {
        getBookmarks(user)
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
                    
                    if (size == 1) {
                        var doc = queryData[0].data();
                        var vendorName = doc.name; //gets the name field
                        var vendorID = doc.code; //gets the unique ID field
                        let newCard = CardTemplate.content.cloneNode(true);
                        newCard.querySelector('.card-title').innerHTML = vendorName;
                        //newCard.querySelector('a').onclick = () => setvendorData(vendorID);
                        newCard.querySelector('img').src = `./images/${vendorID}.jpg`;
                        vendorCardGroup.appendChild(newCard);
                    } else {
                        console.log("Query has more than one data")
                    }

                })

            });
        })
}