# About Robot Dojo

Welcome to Robo Dojo Inc.! A web application that allows you to create, own, and interact with a virtual pet robot. I chose to create a robot as a virtual pet for my coursework as I wanted to do something different from my classmates and the fact that I found the concept of a robot as a virtual pet to be very cool.

## About The Project

This section gives an overview of the robot app's components and files and their functions, aiming to provide a comprehensive understanding of how they all work together.

The project is divided into two main parts, which are:

### [Server Side](https://github.com/devevangel/my-virtual-pet/blob/main/server.js)

This refers to the part of the application that handles all network requests made from the client side and sends a response accordingly. It houses the database, a universal storage location for the entire app, the Database Management Systems (DBMS), which provides an efficient way of communicating with the database and the client side through the use of queries sent from the client side. Finally, the controllers these are functions that are called when certain conditions are met. They communicate with the DBMS and the client side. Here are the components/files that make up the server side:

#### [Robot Database](https://github.com/devevangel/my-virtual-pet/blob/main/database/robots-database.json)

This is a simple [JSON](https://dl.acm.org/doi/abs/10.1145/2872427.2883029) database for the entire application. It stores users and their respective robot pet data in a key-value pair format. The database provides users with access to their pet from any machine or mobile device. Here is a sample of the database structure:

```json
{
  "232543224532": {
    "id": "R7fUN",
    "name": "Javis",
    "owner": "232543224532",
    "timeLived": "2023-04-21T04:50:33.076Z",
    "skinclass": "robo-orange",
    "version": 6,
    "chargePercent": 90,
    "cachePercent": 100,
    "cacheList": []
  }
}
```

#### [Robot Database Management System](https://github.com/devevangel/my-virtual-pet/blob/main/database/database-manager.js)

This is a custom-built JavaScript class that facilitates direct communication with the robot JSON database. It exposes top-level functions that allow for adding, updating, retrieving, and deleting object data within the database. I decided to implement this feature because during the development period of this project, I was learning about Database Management Systems[(DBMS)](https://books.google.co.uk/books?hl=en&lr=&id=FTUJNA4lLdAC&oi=fnd&pg=PR1&dq=database+management+system+dbms&ots=TWQu_8UUv3&sig=g8ix5bmK6oFr0xiYyw3HSgtIYc8&redir_esc=y#v=onepage&q=database%20management%20system%20dbms&f=false), specifically [PostgresSQL](https://books.google.co.uk/books?hl=en&lr=&id=fI1lAgAAQBAJ&oi=fnd&pg=PR4&dq=postgresql&ots=a0-G63S-v4&sig=hyuiMTkdotFJaIs8Ngt-23GfZ80&redir_esc=y#v=onepage&q=postgresql&f=false). One of the primary benefits of using a DBMS is that it provides a layer of abstraction between the user-facing application and the database, which helps to reduce the risk of data corruption or loss.

#### [Robot Controller](https://github.com/devevangel/my-virtual-pet/blob/main/controllers/robot.js)

This is a set of functions designed to carry out specific tasks upon being called. Each function takes a request and response parameter, allowing them to accept requests from the client side and respond accordingly. The functions are mounted on routes, so when a client-side request hits a particular route, the corresponding function is called. These functions utilize the top-level functions exposed by the robot DBMS to perform various tasks within the robot database and provide an appropriate response to the client side. The robot controller includes functions for signing up and creating a new pet, retrieving an existing robot pet, updating a robot pet, and deleting a robot pet from the robot database.

### [Client Side](https://github.com/devevangel/my-virtual-pet/tree/main/client)

This refers to the user-facing part of the application. It contains all the code that handles the main logic of the application that the user sees and interacts with. The client side is responsible for displaying the user interface and providing output for user interactions. Additionally, it is responsible for making network requests to the server-side.

The components and files that make up the client-side include:

#### [Robot Global Store](https://github.com/devevangel/my-virtual-pet/blob/main/client/scripts/robot-global-store.mjs)

The Robot Global Store has two components: the Robot JSON Local Storage Unit, which holds information about the robot on the user's machine, and the Robot Global Store. The Robot Global Store provides global read/write access to robot variables that are accessed and modified at various locations in the Robot application.

I implemented a global store approach based on Garreau and Faurot's (2018) recommendations. This allows different files within the Robot client-side to access and modify the same variables, improving maintainability and making it easier to access frequently changing variables within the app. Here's a simple implementation:

```javascript
const roboState = {
  maxCache: 10,
  guessVal: 0,
  isGameInit: false,
  isGameStarted: false,
  isSleeping: false,
  isError: false,
  isTyping: false,
  isDead: false,
};

export { roboState };
```

#### [Robot Text Processor](https://github.com/devevangel/my-virtual-pet/blob/main/client/scripts/robot-text-processor.mjs)

The text processor is a crucial component of the robot responsible for processing user text input and generating useful responses. About 80% of the robot's functionality can be accessed through the text processor. It uses a simple [switch case](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) based text processing system and helps determine the robot's current mood, which could be Very Happy 😄, Happy 🙂, Sad 😥, Angry 😡, Sleeping 😴, Gaming 🎮, or Dead ☠️.

#### [Robot Game Processor](https://github.com/devevangel/my-virtual-pet/blob/main/client/scripts/robot-game-processor.mjs)

The game processor is an extension of the text processor that handles gameplay within the app. It allows users to play a "guess the number" game where the robot generates a random number, and the user tries to guess the number correctly. This processor updates the robot's game mode and allows for continuous gameplay until the user ends the process.

#### [Robot Operating System](https://github.com/devevangel/my-virtual-pet/blob/main/client/scripts/robot-operating-system.mjs)

This is the major component of the entire robot as it controls all other aspects of the robots. It's functions include:

- Memory managemnt and usage
- Display of the various robot stats
- Calculations of robot stats
- Handles game play initialization
- Powering on and loading stored robot data
- Handles version updates
- Error handling and display
- Making network requests

#### [Robot Network Calls](https://github.com/devevangel/my-virtual-pet/blob/main/client/scripts/robot-utils.mjs)

This file contains all the functions that allow the client-side to make network requests to the Robot server and send the server response data to various parts of the robot application where it's needed. The file contains functions that:

- make POST requests to create a new pet with the user-inputted details

- make GET requests to get data about an existing pet

- make PATCH requests to update data of an existing pet

- make DELETE requests to delete data about an existing pet.

## Robot Components

These are the different parts of the robot. They include:

### Battery

This is the robots power unit, it has to be charged from time to time to keep the robot alive.

### Display Unit

This is the component that handles displaying and updating the user interface(UI) of the robot. it displays the following info:

- Robot pet name
- Power level in percentage
- Memory Capacity/Usage in percentage
- Time lived
- Mood : Very Happy 😄| Happy 🙂| Sad 😥| Angry 😡| Sleeping 😴| Gaming 🎮| Dead ☠️
- Robot text response
- Robot Warings and Errors

### Error Handler

This component handles errors and exceptions that may occur during user interaction with the robot pet. These include network errors, storage malfunction errors, user-generated errors, and unexpected errors or exceptions.

### Button Controls

This consist of buttons that provides the user ablility to control certain aspects of the robot. these functions includes:

- Feed Me(chage robot)
- Sleep/Awaken robot
- Clean Cache
- Update OS

## Robot Features

- Ability to tell the time

- Ability to tell the current date

- Ability to play a simple text based game

- Ability to display its feelings or emotions

- Ability to store and display previous user inputs and command history from it's cache memory

- Ability to clear cache memory

- Ability to Sleep/Awaken

- Ability to Change it's designated name on user command

- Ability to update it's OS on user command

- Ability to display usage manual or game guide when the command 'help' is entered

- Ability to provide text based response to user commands

- Ability to store, calculate and display total time lived

- Ability to check it's curernt OS version on user command

## Robot User Control Features

- Button to charge robot
- Button to sleep/wake robot
- Button to clean cache
- Button to update OS

## How To Use

#### Using Github

1. Clone the repository to your local machine.
2. Run `npm install` to install the necessary dependencies.
3. Run `npm start` to start the app.
4. Open `http://localhost:8080` in your web browser.
5. Create a new pet or get your existing pet.
6. Start interacting with your robot pet.

#### Download Zip

1. Download the zip folder
2. Unzip the folder
3. Open the folder in your terminal
4. Run `npm install` to start the app.
5. Run `npm start` to start the app.
6. Open `http://localhost:8080` in your web browser.
7. Create a new pet or get your existing pet.
8. Start interacting with your robot pet.

[Live link](https://my-virtual-pet.onrender.com/)

## About ChatGPT

[ChatGPT](https://arxiv.org/abs/2303.08774) was used in my application to help in writing code documentation, as well as code comments. I found this very much helpful, as it was able to save time, and most of the time, it gave near-perfect documentation and code comments.

## Conclusion

I chose the current structure of my codebase to avoid issues of plagiarism. Many students asked me to explain the reasoning behind my coding patterns and ideas, and I often had to teach and provide practical help to them. Occasionally, some of them took a peek at my codebase to borrow a few ideas, which was why I had to be cautious and in so doing I had to change some file name. Nonetheless, I am proud of what I have accomplished so far.

## Refrences

#### ChatGPT

OpenAI. (2023). GPT-4 Technical Report. ArXiv:2303.08774 [Cs]. https://arxiv.org/abs/2303.08774

#### Google Fonts

Google. (2019). Google Fonts. Google Fonts. https://fonts.google.com/

#### Emoji's

Cpu Emojis | 🏿🖥⚡🖥️ | Copy & Paste. (n.d.). Emojidb.org. Retrieved April 22, 2023, from https://emojidb.org/cpu-emojis

#### Redux

Garreau, M., & faurot, will. (2018). Redux in Action. In Google Books. Simon and Schuster. https://books.google.co.uk/books?id=CTgzEAAAQBAJ&lpg=PT18&ots=eAqeiFf_lA&dq=redux%20state%20management&lr&pg=PT37#v=onepage&q=redux%20state%20management&f=false

#### JSON

Pezoa, F., Reutter, J. L., Suarez, F., Ugarte, M., & Vrgoč, D. (2016). Foundations of JSON Schema. Proceedings of the 25th International Conference on World Wide Web. https://doi.org/10.1145/2872427.2883029

#### DBMS

Chopra, R. (2010). Database Management System (DBMS)A Practical Approach. In Google Books. S. Chand Publishing. https://books.google.co.uk/books?hl=en&lr=&id=FTUJNA4lLdAC&oi=fnd&pg=PR1&dq=database+management+system+dbms&ots=TWQu_8UUv3&sig=g8ix5bmK6oFr0xiYyw3HSgtIYc8&redir_esc=y#v=onepage&q=database%20management%20system%20dbms&f=false

#### MDN

switch - JavaScript | MDN. (n.d.). Developer.mozilla.org. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch

‌

‌
‌
