var currentUser
function populateCardsDynamically() {
    let purchaseCardTemplate = document.getElementById("purchaseCardTemplate");
    let purchaseCardGroup = document.getElementById("purchaseCardGroup");
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {
            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.collection("purchases").get()
                .then(allPurchase => {
                    allPurchase.forEach(doc => {
                        var foodName = doc.data().name; //gets the name field
                        var foodDescription = doc.data().description; //gets the description field
                        var foodID = doc.data().code; //gets the unique ID field
                        var foodPrice = doc.data().price;
                        var purchaseDate = doc.data().date;
                        let testPurchaseCard = purchaseCardTemplate.content.cloneNode(true);
                        testPurchaseCard.querySelector('.card-title').innerHTML = foodName;     //equiv getElementByClassName
                        testPurchaseCard.querySelector('.card-text').innerHTML = foodDescription;     //equiv getElementByClassName
                        testPurchaseCard.querySelector('.card-price').innerHTML = "$" + foodPrice;
                        testPurchaseCard.querySelector('.card-date').innerHTML =  purchaseDate;
                        purchaseCardGroup.appendChild(testPurchaseCard);
                        console.log("Card template loaded");
                    })
                })
                } else {
                    // No user is signed in.
                    console.log("No user is signed in");
                }
    });

}

populateCardsDynamically();