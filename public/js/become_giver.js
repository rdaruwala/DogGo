var fileName = "";

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
  
  if(!(url && OwnerFirst && OwnerMid && OwnerLast && Email && Phone && Address && ZipCode && PetName && PetSpecies && PetBreed)) {
    alert("Please submit all the required fields");
  }
  else{
    var data = {
      URL: url,
      OwnerFirst: OwnerFirst,
      OwnerMiddle: OwnerMid,
      OwnerLast: OwnerLast,
      OwnerEmail: Email,
      OwnerPhone: Phone,
      OwnerAddress: Address,
      ZipCode: ZipCode,
      PetName: PetName,
      PetSpecies: PetSpecies,
      PetBreed: PetBreed
    }

    console.log('data: ' + JSON.stringify(data));

    $.post('http://doggo.run/tag', data, function (result) {
      console.log(result);
    });

    // data.append('myFile.jpg', $('#petPicToUpload').prop('files')[0]);

    // data.append('OwnerFirst', OwnerFirst);
    // data.append('OwnerMiddle', OwnerMid);
    // data.append('OwnerLast', OwnerLast);
    // data.append('OwnerEmail', Email);
    // data.append('OwnerPhone', Phone);
    // data.append('OwnerAddress', Address);
    // data.append('ZipCode', ZipCode);
    // data.append('PetName', PetName);
    // data.append('PetSpecies', PetSpecies);
    // data.append('PetBreed', PetBreed);

    // $.ajax({
    //     type: "POST",
    //     enctype: 'multipart/form-data',
    //     url: "/api/upload/multi",
    //     data: data,
    //     processData: false,
    //     contentType: false,
    //     cache: false,
    //     timeout: 600000,
    //     success: function (data) {

    //         console.log("SUCCESS : ", data);

    //     },
    //     error: function (e) {

    //         console.log("ERROR : ", e);

    //     }
    // });

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
