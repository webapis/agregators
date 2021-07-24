const dataValidation={
    moda:modaDataValidation
}








function modaDataValidation(data){

    const detailPageLink=data['detailPageLink']
    const productName =data['productName']
    const price =data['price']
    const marketPrice=data['price']['marketPrice']
    const discountInBasket=data['price']['discountInBasket']
    const salePrice=data['salePrice']
    const image =data['image']
    const optsrc=data['image']['optsrc']
    const dataSrcset=data['image']['dataSrcset']


//    const str= {
//         detailPageLink: "",
//         productName: "",
//         price: {
//             marketPrice: "",
//             discountInBasket: "",
//             salePrice: ""
//         },
//         image: {
//             optsrc: "",
//             dataSrcset: ""
//         }
//     }


}