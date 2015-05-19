

var unirest = require('unirest');
var fs = require('fs');
var imgur = require('imgur-node-api');
var path = require('path');



var recognize = function(fileName){
var picArr = [];
unirest.post("https://lambda-face-recognition.p.mashape.com/recognize")
.header("X-Mashape-Key", "I500fACkOdmshqnQbSvsvlAxPEEQp1DgC7xjsnLcOGXAsGEQZ6")
.field("album", "Tessel1")
.field("albumkey", "c227177cfbecb09164c7774740aeee16d0c03d3447e6787a5c62c40d3616c1a7")
.attach("files", fs.createReadStream(fileName))
.end(function (result) {
  console.log("RESULT BODY: ", result.body)
 var imgObj = result.body.photos[0].tags[0].uids[0];//uids[0][0]
  picArr.push(imgObj);
  console.log("IDENTIFIED : ", result.body.photos[0].tags[0].uids[0].prediction)
  var picToBeUsed = picArr[0];
  var maxConfidence = picArr[0].confidence;
  console.log("MAX CONFIDENCE: ", maxConfidence)
  for(var i = 0; i < picArr.length; i++){
    if(picArr[i].confidence > maxConfidence){
      maxConfidence = picArr[i].confidence;
      picToBeUsed = picArr[i];
    }
  }
  console.log("PIC TO BE USED : ", picToBeUsed);
  var person = picToBeUsed.prediction;
  person= person.substring(0, person.length-1);
  console.log("PERSON : ", person);

      uploadAndSlack(person, fileName) //push the file with highest confidence level into this function
  });
}

// recognize("random3.png");


var slackbot = function(message){
unirest.post("https://fullstackacademy.slack.com/services/hooks/slackbot?token=XSYVyZ5Eh8lcREevdkKCBos4&channel=%23tessel-hackathon-1")
.header('Accept', 'application/json')
.send(message)
.end(function (response) {
  console.log(response.body);
});
}

recognize("katrina1.png");






var uploadAndSlack = function(person, fileName){
  imgur.setClientID('33e7d5655122da4');
  imgur.upload(path.join(__dirname, fileName), function (err, res) {
    console.log(res.data.link); // Log the imgur url
    slackbot(person + " is late! " + res.data.link);
  });
}


module.exports = recognize;