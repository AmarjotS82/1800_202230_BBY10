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
            currentUser.collection("purchases")
                .orderBy("date")
                .get()
                .then(allPurchase => {
                    allPurchase.forEach(doc => {
                        var foodName = doc.data().name; //gets the name field
                        var foodDescription = doc.data().description; //gets the description field
                        var foodID = doc.data().code; //gets the unique ID field
                        var foodPrice = doc.data().price;
                        var purchaseDate = doc.data().date.toDate();
                        let testPurchaseCard = purchaseCardTemplate.content.cloneNode(true);
                        testPurchaseCard.querySelector('.card-title').innerHTML = foodName;     //equiv getElementByClassName
                        testPurchaseCard.querySelector('.card-text').innerHTML = foodDescription;     //equiv getElementByClassName
                        testPurchaseCard.querySelector('.card-price').innerHTML = "$" + foodPrice;
                        testPurchaseCard.querySelector('.card-date').innerHTML = purchaseDate;
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
function populateWriteLog() {
    let vendorOptionTemplate = document.getElementById("vendor-option");
    let vendorList = document.getElementById("vendor-list");
    let listValue = 1;
    db.collection("vendors").get()
        .then(allVendors => {
            allVendors.forEach(doc => {
                var vendorName = doc.data().name; //gets the name field
                var vendorCode = doc.data().code; //gets the name field
                let testVendorOption = vendorOptionTemplate.content.cloneNode(true);
                testVendorOption.querySelector('option').innerHTML = vendorName;
                testVendorOption.querySelector('option').value = vendorCode;
                vendorList.appendChild(testVendorOption);
                console.log("Vendor option added")
            })

        })
}
$('.selectpicker').change(function () {
    var selectedItem = $('.selectpicker').val();

    let foodOptionTemplate = document.getElementById("food-option");
    let foodList = document.getElementById("food-list");

    if (selectedItem == "default") {
        clearFoodList();
        foodList.disabled = true;
        console.log(selectedItem)
    } else {
        foodList.disabled = false;
        console.log(selectedItem)
        db.collection("vendors").where("code", "==", selectedItem).get()
            .then(snap => {
                size = snap.size;
                queryData = snap.docs;

                if (size = 1) {
                    clearFoodList();
                    var vendor = queryData[0].id;
                    var vendorCollection = db.collection("vendors").doc(vendor);
                    vendorCollection.collection("menu").get()
                        .then(allVendors => {
                            allVendors.forEach(doc => {
                                var foodName = doc.data().name; //gets the name field
                                let testFoodOption = foodOptionTemplate.content.cloneNode(true);
                                testFoodOption.querySelector('option').innerHTML = foodName;
                                testFoodOption.querySelector('option').value = foodName;
                                testFoodOption.querySelector('option').class = "food-option";
                                foodList.appendChild(testFoodOption);
                                console.log("Food option added")
                            })

                        })
                } else {
                    console.log("Query has more than one data")
                }
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }
});

function clearFoodList() {
    //replace html with default
    let foodList = document.getElementById("food-list");
    foodList.innerHTML = "<option selected>Food Item</option> <template id=\"food-option\" class=\"\"><option value=\"1\">template food</option></template>";
}
function clearPurchaseLog() {
    //replace log with nothing
    let purchaseLog = document.getElementById("purchaseCardGroup");
    purchaseLog.innerHTML = "";
}

function writeLog() {
    let vendorID = document.getElementById("vendor-list").value;
    let foodID = document.getElementById("food-list").value;
    console.log(vendorID, foodID);
    //getting vendor collection from ID
    db.collection("vendors").where("code", "==", vendorID).get()
        .then(snap => {
            size = snap.size;
            queryData = snap.docs;

            if (size = 1) {
                var vendor = queryData[0].id;
                var vendorCollection = db.collection("vendors").doc(vendor);
                //getting food from menu collection
                vendorCollection.collection("menu").where("name", "==", foodID).get()
                    .then(snap => {
                        size = snap.size;
                        queryData = snap.docs;

                        if (size = 1) {
                            //get and add data to purchases collection 
                            let doc = queryData[0].data();
                            let foodCode = doc.code;
                            let foodName = doc.name;
                            let foodPrice = doc.price;
                            if (doc.description != null) {
                                var foodDesc = doc.description;
                            } else {
                                var foodDesc = " ";
                            }

                            currentUser.collection("purchases").add({
                                code: foodCode,
                                name: foodName,
                                price: foodPrice,
                                description: foodDesc,
                                date: firebase.firestore.FieldValue.serverTimestamp()
                            }).then(() => {
                                //refresh log with new info
                                clearPurchaseLog();
                                populateCardsDynamically();
                            })
                        } else {
                            console.log("Query has more than one data")
                        }
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                    });
            } else {
                console.log("Query has more than one data")
            }
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });


}
populateWriteLog();
populateCardsDynamically();