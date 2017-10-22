function submitValues(){
  OwnerFirst = document.getElementById('firstName').value;
  OwnerMid = document.getElementById('midInit').value;
  OwnerLast = document.getElementById('lastName').value;
  Email = document.getElementById('email').value;
  Phone = document.getElementById('phoneNum').value;
  Address = document.getElementById('address').value;
  ZipCode = document.getElementById('zipCode').value;
  PetName = document.getElementById('petName').value;
  PetSpecies = document.getElementById('petSpecies').value;
  PetBreed = document.getElementById('petBreed').value;
  
  Image = document.getElementById('petPicToUpload');
  
  if(!(OwnerFirst && OwnerMid && OwnerLast && Email && Phone && Address && ZipCode && PetName && PetSpecies && PetBreed)) {
    alert("Please submit all the required fields");
  }
  else{
    var data = $('form').serialize();
    
    $.post('http://junesky.org/parse/classes/GiverInfo', data, function (result) {
      console.log(result);
    });
  }
}

function readURL(input) {

  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $('#petPic').attr('src', e.target.result);
    }

    reader.readAsDataURL(input.files[0]);
  }
}
