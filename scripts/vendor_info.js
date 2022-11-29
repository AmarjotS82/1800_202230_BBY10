var vendor;
var vendorCollection;
function displayVendor() {
    db.collection("vendors").where("code", "==", localStorage.getItem("vendorID"))
        .get()
        .then(queryVendor => {
            //see how many results you have got from the query
            var size = queryVendor.size;
            // get the documents of query
            var Vendors = queryVendor.docs;

            if (size = 1) {
                vendor = Vendors[0].id;
                vendorCollection = db.collection("vendors").doc(vendor);
                var vendorData = Vendors[0].data()
                document.querySelector('.vendor-name').innerHTML = vendorData.name;
                document.querySelector('.vendor-desc').innerHTML = vendorData.description;
                document.querySelector('.vendor-thumbnail').src = `./images/${vendorData.code}.jpg`;
                displayMenu();
            } else {
                console.log("Query has more than one data")
            }
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });

}
function displayMenu() {
    vendorCollection.collection("menu").get()
    .then(allFood => {
        allFood.forEach(doc => {
            var foodName = doc.data().name; //gets the name field
            if (doc.description != null) {
                var foodDescription = doc.description;
            } else {
                var foodDescription = " ";
            }
            var foodID = doc.data().code; //gets the unique ID field
            var foodPrice = doc.data().price;
            let testMenuCard = menuCardTemplate.content.cloneNode(true);
            testMenuCard.querySelector('.card-title').innerHTML = foodName;     //equiv getElementByClassName
            testMenuCard.querySelector('.card-text').innerHTML = foodDescription;     //equiv getElementByClassName
            testMenuCard.querySelector('.card-price').innerHTML = "$" + foodPrice;
            menuCardGroup.appendChild(testMenuCard);
            console.log("Card template loaded");
        })
    })
}

displayVendor();