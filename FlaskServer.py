import os
import io
import json
from flask import Flask, request, redirect, url_for
from google.cloud import vision
from google.cloud.vision import types
import urllib.request
import pyrebase

#Config options for Google
config = {
  "apiKey": "AIzaSyBwS8vMn2JbLzwF7NBqlQrFz3cw-fqOuzI",
  "authDomain": "doggo-264d3.firebaseapp.com",
  "databaseURL": "https://doggo-264d3.firebaseio.com/",
  "storageBucket": "doggo-264d3.appspot.com"
}



#Our API we use to communicate with Firebase
firebase = pyrebase.initialize_app(config)


from oauth2client.client import GoogleCredentials
credentials = GoogleCredentials.get_application_default()


app = Flask(__name__)
client = vision.ImageAnnotatorClient()


#Default
@app.route('/', methods=['GET', 'POST'])
def normal():
    return current_app.send_static_file()

#Tags an image and returns the tag
@app.route('/tag', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':

        dic = dict(request.form)
        stringToRmove = str(dic)
        replaced = removeStr(stringToRmove, "“")
        replaced = removeStr(replaced, "”")
        replaced = replaceQuotes(replaced)
        finalDict = json.loads(replaced)

        url = finalDict['URL'][0]

        file = urllib.request.urlopen(url)


        content = file.read()
        image = types.Image(content=content)


        response = client.label_detection(image=image)
        labels = response.label_annotations

        toReturn = {}
        for label in labels:
            toReturn[label.description] = str(label.score)

        return str(toReturn)


#Inputs a newly completed Giver into storage
@app.route('/storegiver', methods=['GET', 'POST'])
def storegiver():
    if request.method == 'POST':
        auth = firebase.auth()

        db = firebase.database()

        dic = dict(request.form)
        
        #Clean results and make it sendable
        stringToRmove = str(dic)
        replaced = removeStr(stringToRmove, "“")
        replaced = removeStr(replaced, "”")
        replaced = replaceQuotes(replaced)
        finalDict = json.loads(replaced)

        url = finalDict['URL'][0]
        file = urllib.request.urlopen(url)

        tagList = getTagsForImage(file)


        data = {
            "Owner First": finalDict['OwnerFirst'][0], "Owner Middle": finalDict['OwnerMiddle'][0], "Owner Last": finalDict['OwnerLast'][0],
            "Owner Email" : finalDict['OwnerEmail'][0], "Owner Phone" : finalDict['OwnerPhone'][0], "Owner Address" : finalDict['OwnerAddress'][0],
            "Zip Code": finalDict['ZipCode'][0], "Pet Name" : finalDict['PetName'][0], "Pet Species" : finalDict['PetSpecies'][0],
            "Pet Breed" : finalDict['PetBreed'][0], "Match Made" : False, "Tags" : tagList, "Image" : finalDict['URL'][0]
        }

        db.child("givers").push(data)

        return "Done!\n"

#Get results for an Adopter who has input text fields
@app.route('/adopterexact', methods=['GET', 'POST'])
def adopterexact():
    if request.method == 'POST':
        auth = firebase.auth()

        db = firebase.database()

        dic = dict(request.form)
        stringToRmove = str(dic)
        
        #Clean results and make it readable
        replaced = removeStr(stringToRmove, "“")
        replaced = removeStr(replaced, "”")
        replaced = replaceQuotes(replaced)
        finalDict = json.loads(replaced)



        data = {
         "Pet Species" : finalDict['PetSpecies'][0],
            "Pet Breed" : finalDict['PetBreed'][0], "Length" : finalDict['Length'][0]
        }

        toReturn = {}
        exactList = exactMatches(finalDict['PetBreed'][0], db)

        surogateTags = [finalDict['PetSpecies'][0], finalDict['PetBreed'][0]]

        simList = similarMatchesExactInput(surogateTags, db, exactList)

        toReturn['Exact List'] = exactList
        toReturn['Sim List'] = simList
        toReturn['Submitted By Picture'] = False


        #Clean results and make it sendable
        final = replaceQuotes(str(toReturn))
        final = final.replace("False", "false")
        final = final.replace("True", "true")

        print(final)
        return final

#Get results for an Adopter who has input an image
@app.route('/adopternetwork', methods=['GET', 'POST'])
def adopternetwork():
    if request.method == 'POST':
        auth = firebase.auth()

        db = firebase.database()

        dic = dict(request.form)
        stringToRmove = str(dic)
        
        #Make dictionary readable
        replaced = removeStr(stringToRmove, "“")
        replaced = removeStr(replaced, "”")
        replaced = replaceQuotes(replaced)
        finalDict = json.loads(replaced)

        url = finalDict['URL'][0]
        file = urllib.request.urlopen(url)

        tagList = getTagsForImage(file)

        toReturn = {}
        simList = similarMatchesExactInput(tagList, db, [])
        
        
        #Format data string to return 
        toReturn['Exact List'] = []
        toReturn['Sim List'] = simList
        toReturn['Submitted By Picture'] = True

        final = replaceQuotes(str(toReturn))
        final = final.replace("False", "false")
        final = final.replace("True", "true")

        print(final)
        return final


# Aux function
def removeStr(s, c):
    new_s = ""
    for i in range(len(s)):
        if s[i] != c:
            new_s += s[i]
    return new_s

# Aux function
def replaceQuotes(s):
    new_s = ""
    for i in s:
        if i != "'":
            new_s += i
        else:
            new_s += "\""
    return new_s


# Like the get tags function above, but not in the webserver
def getTagsForImage(file):
    content = file.read()
    image = types.Image(content=content)


    response = client.label_detection(image=image)
    labels = response.label_annotations



    toReturn = []
    for label in labels:
        toReturn.append(label.description)

    return toReturn


# Get comparisons that are exact matches
def exactMatches(breed, db):
    givers = db.child("givers").get()

    exactList = []
    for key in givers.each():
        item = key.val()
        if breed == item['Pet Breed']:
            exactList.append(item)
    return exactList

# Get comparisons that are similar matches
def similarMatches(animal1, db, exactList):
    simList = []

    givers = db.child("givers").get()
    count = 0
    for key in givers.each():
        if count >= 10:
            print("Done")
        else:
            item = key.val()
            if isSimilarPictureCompare(animal1["Tags"], item, 4) and item not in exactList:
                simList.append(item)
                count += 1

    return simList

# Helper function
def isSimilarApprox(animal1Tags, animal2, cutoff):
    animal2Tags = animal2["Tags"]

    count = 0

    for a in animal1Tags:
        for b in animal2Tags:
            if a.lower() in b.lower():
                count += 1
                if count >= cutoff:
                    return True

    return False

 #Get comparisons that are similar matches
def similarMatchesExactInput(animal1, db, exactList):
    simList = []

    givers = db.child("givers").get()
    count = 0
    for key in givers.each():
        if count >= 10:
            print("Done")
        else:
            item = key.val()
            if isSimilarApprox(animal1, item, 3) and item not in exactList:
                simList.append(item)
                count += 1
    return simList

# Helper function
def isSimilarPictureCompare(animal1Tags, animal2, cutoff):
    animal2Tags = animal2["Tags"]

    count = 0

    for a in animal1Tags:
        for b in animal2Tags:
            if a.lower() in b.lower():
                count += 1
                if count >= cutoff:
                    return True

    return False
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
