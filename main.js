const modal = document.querySelector(".modal-background");
modal.addEventListener("click", () => {
    modal.classList.add("hide");
    modal.querySelector(".modal-vegetarian").classList.remove("hide");
    modal.querySelector(".modal-discount").classList.remove("hide");

});

/* FETCHING DATA FROM DATABASE */

fetch("https://kea-alt-del.dk/t5/api/categories")
    .then(res => res.json())
    .then(function (data) {
        data.forEach(buildCategory)
        getProducts();
    })

function buildCategory(data) {
    const section = document.createElement("section");
    const header = document.createElement("h1");
    header.textContent = data;
    section.setAttribute("id", data)
    section.appendChild(header);
    document.querySelector("main").appendChild(section);
}

function getProducts() {
    fetch("https://kea-alt-del.dk/t5/api/productlist")
        .then(function (response) {
            return response.json()
        }).then(function (data) {
            data.forEach(showDish)
        })
}

function showDish(dish) {
    console.log(dish)
    const template = document.querySelector("template").content;
    const copy = template.cloneNode(true);

    copy.querySelector(".data_name").textContent = dish.name;

    if(dish.alcohol){
        copy.querySelector(".containsAlcohol").textContent = `${dish.alcohol}% Alcohol`;
    }else{
        copy.querySelector(".containsAlcohol").remove();
    }
    copy.querySelector(".shadow").src = `assets/imgs/medium/${dish.image}-md.jpg`;

    copy.querySelector(".data_price").textContent = `${dish.price},-- DKK`;
    if (dish.discount) {
        copy.querySelector(".data_price").classList.add("discount");
        copy.querySelector(".data_discount").textContent = `${Math.round(dish.price - dish.discount / 100 * dish.price)},-- DKK`
    } else {
        copy.querySelector(".data_discount").remove();
    }
    /*if (dish.soldout) {
        //do nothing
    } else {
        copy.querySelector("article").classList.remove("soldOut");
    }*/
    if (dish.soldout) {

    } else {
        copy.querySelector(".imgSoldout").remove()
    }
    copy.querySelector("button").addEventListener("click", () => {
        fetch(`https://kea-alt-del.dk/t5/api/product?id=${dish.id}`)
            .then(res => res.json())
            .then(showDetails);
    });



    document.querySelector(`#${dish.category}`).appendChild(copy);

}

function showDetails(data) {
    console.log(data)
    modal.querySelector(".modal-name").textContent = data.name;
    modal.querySelector(".modal-description").textContent = data.shortdescription;
    modal.querySelector(".modal-price").textContent = `${data.price},-- DKK`;
    modal.classList.remove("hide");

    if (data.discount) {
        modal.querySelector(".modal-price").classList.add("discount");
        modal.querySelector(".modal-discount").textContent = `${Math.round(data.price - data.discount / 100 * data.price)},-- DKK`
    } else {
        modal.querySelector(".modal-discount").classList.add(".hide")
    }

    if(data.vegetarian){
    }else{
        modal.querySelector(".modal-vegetarian").classList.add(".hide")
    }
   /* modal.querySelector(".modal-image").src = `assets/imgs/medium/${data.image}-md.jpg`;

    if(data.discount){
        modal.querySelector(".modal-price").classList.add("discount");
        modal.querySelector(".modal-discount").textContent = `${Math.round(data.price - data.discount / 100 * data.price)},--DKK`
    }*/

}
