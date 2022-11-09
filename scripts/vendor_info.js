function displayVendor() {
    db.collection("vendors").where("code", "==", localStorage.getItem("vendorID"))
        .get()
        .then(queryVendor => {
            //see how many results you have got from the query
            var size = queryVendor.size;
            // get the documents of query
            var Vendors = queryVendor.docs;

            // We want to have one document per hike, so if the the result of 
            //the query is more than one, we can check it right now and clean the DB if needed.
            if (size = 1) {
                var vendor = Vendors[0].data();
                document.querySelector('.vendor-name').innerHTML = vendor.name;
                document.querySelector('.vendor-desc').innerHTML = vendor.description;
                document.querySelector('.vendor-thumbnail').src = `./images/${vendor.code}.jpg`;
            } else {
                console.log("Query has more than one data")
            }
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });

}

displayVendor();