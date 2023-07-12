const connection = require('../config/connection');
const { User, Thought } = require('../models');

const names = [
    "Kakashi Sensei-tea",
    "Shino-bit",
    "Narutaco",
    "Sasuketch",
    "Sakuramen",
    "Garama",
    "Nagatogo",
    "Jiraiyah",
    "Hinatabasco",
    "Neji-sus",
    "Chojisus",
    "Rock Leek",
    "TenTen-out-of-ten",
    "Itachill",
    "Shikamunch",
    "Chidoggy",
    "Gaaratbag",
    "Kisame Sandwich",
    "Tsunadonuts",
    "Obitoffee",
  
    "Ichigo Jam",
    "Rukia-ke",
    "Hitsugayato",
    "Sosukeisenberg",
    "Renjicama",
    "Uryūsh",
    "Yoruichips",
    "Orihimeal",
    "Kenpachicken",
    "Byakuyake",
    "Kuchiki-cake",
    "Soi Fondue",
    "Ikkaku Ramen",
    "Zaraki Ken-pasta",
    "Toushirice",
  
    "Luffy-dovey",
    "Zoroll",
    "Nami-noodles",
    "Usoppy",
    "Sanjicake",
    "Chopper-chops",
    "Robin-rice",
    "Frankyfrank",
    "Brooklie",
    "Nico Ribbon",
    "Acecream",
    "Jinbei-jelly",
    "Chocobin",
    "Gol D. Rogerbread",
    "Boarhat",
    "Donquixote Dough-flamingo"
  ];
  
  
  const thought = [
    "If Kakashi Sensei-tea had a tea shop, I bet it would have more customers than Ichiraku Ramen.",
    "What if Shino-bit started a tech company? Would bugs be features or problems?",
    "Narutaco Tuesday should definitely be a thing in Konoha.",
    "Is it just me, or does Sasuketch sound like a failed Uchiha-branded sketch pad?",
    "Imagine if Sakuramen were a thing. Would it be everyone's second choice of ramen, just like she's Naruto's second choice?",
    "You have to be careful when ordering Nagatogo; it tends to bring the whole delivery system down with it.",
  
    "Ichigo Jam would be a great brand name for strawberry jam. And it would always come to your rescue when breakfast gets boring.",
    "If Sosukeisenberg were a chemistry teacher, would he also secretly be the main antagonist?",
    "I bet Zaraki Ken-pasta would be the toughest pasta you've ever eaten. Only for true warriors.",
  
    "Would Luffy-dovey be a romantic pirate king? Or just a king of pirate-themed love songs?",
    "If Nami-noodles were a dish, I wonder if the price would go up during a storm.",
    "What would be Sanjicake's secret ingredient? I bet it's love... or maybe just a whole lot of sugar."
  ];
  
  
  const reaction = [
    "I agree!",
    "Interesting thought.",
    "I never thought about it that way.",
    "You've really changed my perspective!",
    "That's a brilliant idea!",
    "I've learned something new today.",
    "That's an intriguing way to look at it.",
    "You've got me thinking now...",
    "Wow, I didn't see it that way before.",
    "I totally relate to that.",
    "You've opened my eyes!",
    "I've never heard that before, it's so interesting!",
    "Your insight is really inspiring.",
    "I really like your perspective.",
    "I've been enlightened!",
    "That's a fresh take on it!",
    "I could not agree more.",
    "Your point of view is very refreshing.",
    "That's an excellent point!",
    "That's a thought-provoking idea!"
  ];
  
  const email = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "aol.com",
    "icloud.com",
    "mail.com",
    "zoho.com",
    "protonmail.com",
    "yandex.com"
];

  const users = [];
  
  // Get a random item given an array
const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Gets a random username 
const getRandomUsername = () =>
  `${getRandomArrItem(names)}_${Math.floor(Math.random() * 1000)}`;

  // Gets a random email for a user
  const getRandomEmail = (username) => {
    let provider = getRandomArrItem(email);
    return `${username}@${provider}`;
  };

// Function to generate random thoughts that we can add to the database. Includes user reactions.
const getRandomThought = (int, username) => {
  let results = [];
  for (let i = 0; i < int; i++) {
    results.push({
      username: username,
      thoughtText: getRandomArrItem(thought),
      reactions: [...getThoughtReactions(3)],
    });
  }
  return results;
};

// Create the reaction that will be added to each thought
const getThoughtReactions = (int) => {
  let results = [];
  for (let i = 0; i < int; i++) {
    results.push({
      reactionBody: getRandomArrItem(reaction),
      username: getRandomUsername(),
    });
  }
  return results;
};

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('connected');
    await Thought.deleteMany({});
    await User.deleteMany({});
  
    for (let i = 0; i < 20; i++) {
      const username = getRandomUsername();
      // Pass the username to the getRandomEmail() function
      const email = getRandomEmail(username);
      const userThoughts = getRandomThought(3, username);
  
      // Create each thought in the database and replace the thought data in userThoughts
      // with the new thought's ID
      for (let j = 0; j < userThoughts.length; j++) {
        const thought = new Thought(userThoughts[j]);
        await thought.save();
        userThoughts[j] = thought._id;
      }
  
      // Now userThoughts is an array of thought IDs, so we can create the user
      const user = new User({
        username,
        email,
        thoughts: userThoughts,
      });
      await user.save();
    }
  
    console.info('Seeding complete! 🌱');
    process.exit(0);
  });
