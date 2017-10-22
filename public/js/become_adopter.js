var fileName = "";

function submitValues(){
  PetSpecies = document.getElementById('petSpecies').value;
  PetBreed = document.getElementById('petBreed').value;
  Length = document.getElementById('length').value;
  
  if(url != "") {
    var data = {
      URL: url
    }


    $.post('http://doggo.run:5000/adopternetwork', data, function (result) {
      console.log(result);
      var returnedData = JSON.parse(result);
      if (returnedData['Exact List'] && returnedData['Exact List'].length > 0) {
        for (var i = 0; i < returnedData['Exact List'].length; i++) {
          document.getElementById('dog' + ((i * 2) + 1)).innerHTML =
            '<img class="dog-image" src=' + returnedData['Exact List'][i].Image + '/>' +
            '<h3>' + returnedData['Exact List'][i]['Pet Name'] + '</h3>' +
            '<p>Species: ' + returnedData['Exact List'][i]['Pet Species'] + '</p>' +
            '<p>Breed: ' + returnedData['Exact List'][i]['Pet Breed'] + '</p>' +
            '<p>Contact: ' + returnedData['Exact List'][i]['Owner First'] + ' ' + returnedData['Exact List'][i]['Owner Last'] + ', ' + returnedData['Exact List'][i]['Owner Phone'] + '</p>'
          document.getElementById('dog' + ((i*2) + 1)).style['border-width'] = "0px 0px 1px 0px";
          document.getElementById('dog' + ((i*2) + 1)).style['border-style'] = "solid";
          document.getElementById('dog' + ((i*2) + 1)).style['border-color'] = "#000000";
        }
      }
      else{
        document.getElementById('exact-header').innerHTML = '<p style="margin-top:40px; margin-bottom: -30px">Unfortunately, we were not able to find an exact match for you. However, we did find some close options:</p>';
      }

      if(returnedData['Sim List'] && returnedData['Sim List'].length > 0){
        for (var i = 0; i < returnedData['Sim List'].length; i++) {
          document.getElementById('dog' + (i * 2)).innerHTML =
            '<img class="dog-image" src=' + returnedData['Sim List'][i].Image + '/>' +
            '<h3>' + returnedData['Sim List'][i]['Pet Name'] + '</h3>' +
            '<p>Species: ' + returnedData['Sim List'][i]['Pet Species'] + '</p>' +
            '<p>Breed: ' + returnedData['Sim List'][i]['Pet Breed'] + '</p>' +
            '<p>Contact: ' + returnedData['Sim List'][i]['Owner First'] + ' ' + returnedData['Sim List'][i]['Owner Last'] + ', ' + returnedData['Sim List'][i]['Owner Phone'] + '</p>'
          document.getElementById('dog' + (i*2)).style['border-width'] = "0px 0px 1px 0px";
          document.getElementById('dog' + (i*2)).style['border-style'] = "solid";
          document.getElementById('dog' + (i*2)).style['border-color'] = "#000000";
        }
      } else {
        window.location.href = '/failure.html';
      }

      document.getElementById('sitecontainer').style['grid-template-columns'] = '33% 33% 33%';
      document.getElementById('before-post').style.display = 'none';      
      document.getElementById('after-post').style.display = 'block';    
    });

  } else if (PetSpecies && PetBreed && Length) {
    var data = {
      PetSpecies: PetSpecies,
      PetBreed: PetBreed,
      Length: Length
    }

    $.post('http://doggo.run:5000/adopterexact', data, function (result) {
      console.log(result);
      var returnedData = JSON.parse(result);
      if (returnedData['Exact List'] && returnedData['Exact List'].length > 0) {
          for (var i = 0; i < returnedData['Exact List'].length; i++) {
            console.log(i);
            console.log(returnedData['Exact List'][i].Image);
            document.getElementById('dog' + ((i * 2) + 1)).innerHTML =
              '<img class="dog-image" src=' + returnedData['Exact List'][i].Image + '/>' +
              '<h3>' + returnedData['Exact List'][i]['Pet Name'] + '</h3>' +
              '<p>Species: ' + returnedData['Exact List'][i]['Pet Species'] + '</p>' +
              '<p>Breed: ' + returnedData['Exact List'][i]['Pet Breed'] + '</p>' +
              '<p>Contact: ' + returnedData['Exact List'][i]['Owner First'] + ' ' + returnedData['Exact List'][i]['Owner Last'] + ', ' + returnedData['Exact List'][i]['Owner Phone'] + '</p>'
            document.getElementById('dog' + ((i*2) + 1)).style['border-width'] = "0px 0px 1px 0px";
            document.getElementById('dog' + ((i*2) + 1)).style['border-style'] = "solid";
            document.getElementById('dog' + ((i*2) + 1)).style['border-color'] = "#000000";
          }
      }
      else{
        document.getElementById('exact-header').innerHTML = '<p>Unfortunately, we were not able to find an exact match for you. However, we did find some close options.</p>';
      }

      if(returnedData['Sim List'] && returnedData['Sim List'].length > 0){
        for (var i = 0; i < returnedData['Sim List'].length; i++) {
          document.getElementById('dog' + (i * 2)).innerHTML =
            '<img class="dog-image" src=' + returnedData['Sim List'][i].Image + '/>' +
            '<h3>' + returnedData['Sim List'][i]['Pet Name'] + '</h3>' +
            '<p>Species: ' + returnedData['Sim List'][i]['Pet Species'] + '</p>' +
            '<p>Breed: ' + returnedData['Sim List'][i]['Pet Breed'] + '</p>' +
            '<p>Contact: ' + returnedData['Sim List'][i]['Owner First'] + ' ' + returnedData['Sim List'][i]['Owner Last'] + ', ' + returnedData['Sim List'][i]['Owner Phone'] + '</p>'
          document.getElementById('dog' + (i * 2)).style['border-width'] = "0px 0px 1px 0px";
          document.getElementById('dog' + (i * 2)).style['border-style'] = "solid";
          document.getElementById('dog' + (i * 2)).style['border-color'] = "#000000";
        }
      } else {
        window.location.href = '/failure.html';
      }
        document.getElementById('sitecontainer').style['grid-template-columns'] = '33% 33% 33%';
        document.getElementById('before-post').style.display = 'none';      
        document.getElementById('after-post').style.display = 'block';  
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
