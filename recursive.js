function countSheep(sheep){
  let sheepCount = sheep;
  if(sheepCount > 0 ){
    console.log(`${sheepCount}: Another sheep jumps over the fence `)
    sheepCount = sheepCount - 1;
    countSheep(sheepCount);
  }
  else(
    console.log(`All sheep jumped over the fence`)
  );
}

// countSheep(3);


//Check github
function powerCalculator(integer,exponent){
  let exponentCount = exponent;
  let newNumber = integer;
  if( exponentCount > 0){
    newNumber = newNumber * integer;
    exponentCount = exponentCount - 1;
    console.log(newNumber);
    powerCalculator(integer, exponentCount )
  }
  if(exponent < 0){
    return 'Exponent should be be >=0';
  }
  console.log(newNumber);
  return newNumber;

}

// powerCalculator(5,5)

//

function reverse(input){
  let newInput = ''
  if(input.length > 0){
    //slic off the index[0] value from input
    //append it to the new input
    newInput = newInput.push(input.slice(0));
    reverse(input);
  }
  return newInput;
}

console.log(reverse('bacon'));