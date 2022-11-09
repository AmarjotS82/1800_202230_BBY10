function displayCards(collection) {

    db.collection("vendors").doc(collection)
    .onSnapshot(vendorDoc => {                                                               //arrow notation
        document.querySelector('.vendor-name').innerHTML = vendorDoc.data().name;
        document.querySelector('.vendor-desc').innerHTML = vendorDoc.data().description;
        document.querySelector('.vendor-thumbnail').src = `./images/${vendorDoc.data().code}.jpg`; //Example: NV01.jpg;                                    //using json object indexing
    })

}

displayCards("tim_hortons");