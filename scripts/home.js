
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
