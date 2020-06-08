export function validateFile(file) {
  let textType = /text.*/;
  //content = read_file(file);
  return(true);
}

function read_file(file){
  try{
    let reader = new FileReader();
    reader.readAsText(file);	
  }
  catch(err){
    console.log(err);
  }
}

