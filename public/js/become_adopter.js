var fileName = "";

function submitValues(){
  PetSpecies = document.getElementById('petSpecies').value;
  PetBreed = document.getElementById('petBreed').value;
  Length = document.getElementById('length').value;
  
  if(url != "") {
    var data = {
      URL: url
    }

    console.log('data: ' + JSON.stringify(data));

    $.post('http://doggo.run/adopternetwork', data, function (result) {
      var returnedData = JSON.parse(result);
      if (returnedData.exactMatches.length > 0 || returnedData.closeMatches.length > 0) {
        console.log('returnedData: ' + JSON.stringify(returnedData));
        document.getElementById('before-post').display = none;      
        document.getElementById('after-post').display = block;    
      } else {
        window.location.href = '/failure.html';
      }
    });

  } else if (PetSpecies && PetBreed && Length) {
    var data = {
      PetSpecies: PetSpecies,
      PetBreed: PetBreed,
      Length: Length
    }

    console.log('data: ' + JSON.stringify(data));

    $.post('http://doggo.run/adopterexact', data, function (result) {
      console.log('result: ' + result);
      var returnedData = JSON.parse(result);
      console.log(returnedData);
      if (returnedData['Exact List'].length > 0 || returnedData['Sim List'].length > 0) {
        console.log('returnedData: ' + JSON.stringify(returnedData));
        for (var i = 0; i < 1; i++) {
          document.getElementById('dog' + (i + 1)).innerHTML =
            '<img class="dog-image" src=' + returnedData['Exact List'][i].Image + '/>' +
            '<h3>' + returnedData['Exact List'][i]['Pet Name'] + '</h3>'
        }

        for (var i = 0; i < 3; i++) {
          document.getElementById('dog' + (i + 2)).innerHTML =
            '<img class="dog-image" src=' + returnedData['Sim List'][i].Image + '/>' +
            '<h3>' + returnedData['Sim List'][i]['Pet Name'] + '</h3>'
        }
        document.getElementById('before-post').style.display = 'none';      
        document.getElementById('after-post').style.display = 'block';    
      } else {
        window.location.href = '/failure.html';
      }
    });

  } else {
    alert("Please submit all the required fields");
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
