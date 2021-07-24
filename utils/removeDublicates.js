
    function removeDuplicateObjects(data, key) {

      return [
        ...new Map(data.map(item => [key(item), item])).values()
      ]

    };
function removeDublicateArrayValues({source,array}){
    return array.filter(a=> source.indexOf(a)===-1)

}
    module.exports={removeDuplicateObjects,removeDublicateArrayValues}