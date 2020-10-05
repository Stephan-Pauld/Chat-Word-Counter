(function() {


let savedWords = localStorage.getItem('boxData')
document.getElementById('box').value = savedWords;


//  This is the FORM! When we press the submitbutton all the text in tex area and in the streamer name area will be saved! Also we will start listening to a twich stream since we call a function at the bottom

const form = document.getElementById("myForm");
form.addEventListener('submit', function(event){
  const savedData = document.getElementById('box').value;
  event.preventDefault(); 
  localStorage.setItem("boxData", savedData);
  connectionToClient();  
},false);

const loggedCount = document.getElementsByClassName("count");

//  This is our connection to the twitch stream!
// ########

function connectionToClient() {

  const client = new tmi.Client({
    connection: {
      secure: true,
      reconnect: true,
    },
    channels: ["abootgaming"],
  });
  client.connect();

//  Variables so we can write text to the screen and count for words. This also helps us make sure where to properly count.

let counter = 0;
let wordsFound = [];
let wordCount = {};
let name = {};
let users = [];


// We can turn this to true to not have to use a command or just remove the first if statement below
let listenForWord = true;
let words = [];


wordsEntered();

// This is just the words that are types into our Textarea. The text area takes words seperated by a " "  space and then placed into an array

function wordsEntered() {
  const boxvalue = document.getElementById('box').value;
  let farts =  boxvalue.split(" ");
  words.push(...farts);
}

// this is us connecting to a twitch stream and listening for specific words in a sentance
// #################
client.on("message", (channel, tags, message, self) => {
  

  // This is the command we can choose! If we want anyone to start this command we can just remove everything after and including the "&&"

  if (message === "!counting" && tags.username === "abootgaming") {
    listenForWord = true;
  } else if (listenForWord === true) {
    let sentance = message.toLowerCase().split(" ");
    for (let i = 0; i < sentance.length; i++) {
      if (words.includes(sentance[i])) {
        if (wordsFound.includes(sentance[i]) === false && users.includes(tags.username) === false) {

          // these are our variables for when we are going to create elements to write to our page
          const line = document.createElement("hr");
          const lineBreak = document.createElement("br");
          const elementWord = document.createElement("h1");
          const elementCount = document.createElement("h1");
          const username = document.createElement("p")

          // This is how we write to the page
          elementWord.innerHTML = sentance[i] + ": ";
          name[sentance[i]] = [tags.username];
          users.push(tags.username);
          console.log(users);
          username.innerHTML = name[sentance[i]]  + " , "
          username.id = sentance[i];
          elementWord.classList.add("word");
          document.body.appendChild(elementWord);
          
          elementCount.innerHTML = 1;
          elementCount.classList.add("count");
          document.body.appendChild(elementCount);
          document.body.appendChild(username);
          document.body.appendChild(lineBreak);
          document.body.appendChild(line);

          wordsFound.push(sentance[i]);
          wordCount[sentance[i]] = 1;
          counter++;

          // We add words we have already seen and count up, also we push the user that said the word to an array in our name object to print their names to the page. However I was thinking we could add an else if just above this to see if someone has already talked so we have unique users only!
        } else if (users.includes(tags.username)) {
          console.log(tags.username + " Has already Voted!");


        } else {
          users.push(tags.username);
          console.log("Old word " + tags.username);
          const usernameElem = document.querySelector("#" + sentance[i])
          name[sentance[i]].push(" " + tags.username + " ")
          wordCount[sentance[i]]++;
          loggedCount.item(wordsFound.indexOf(sentance[i])).innerHTML =
          wordCount[sentance[i]];          
          usernameElem.textContent = name[sentance[i]]
        }
      }
    }
  }
});
}
})();



