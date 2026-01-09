import { WordPair } from '@/types/game';

// Fallback word pairs to use when API tokens are exhausted
// Mix of English and Hinglish pairs, categorized by difficulty

export const fallbackWordPairs: { easy: WordPair[]; medium: WordPair[]; hard: WordPair[] } = {
    easy: [
        // Food & Drinks
        { civilian_word: "Tea", undercover_word: "Coffee", relationship: "Both are popular hot beverages" },
        { civilian_word: "Chai", undercover_word: "Doodh", relationship: "Common Indian beverages" },
        { civilian_word: "Pizza", undercover_word: "Burger", relationship: "Both are fast food items" },
        { civilian_word: "Apple", undercover_word: "Orange", relationship: "Both are common fruits" },
        { civilian_word: "Roti", undercover_word: "Naan", relationship: "Both are Indian flatbreads" },
        { civilian_word: "Rice", undercover_word: "Pasta", relationship: "Both are staple carbohydrates" },
        { civilian_word: "Samosa", undercover_word: "Pakora", relationship: "Both are fried Indian snacks" },
        { civilian_word: "Ice Cream", undercover_word: "Kulfi", relationship: "Both are frozen desserts" },
        { civilian_word: "Mango", undercover_word: "Papaya", relationship: "Both are tropical fruits" },
        { civilian_word: "Lassi", undercover_word: "Chaas", relationship: "Both are yogurt-based drinks" },
        { civilian_word: "Biryani", undercover_word: "Pulao", relationship: "Both are rice dishes" },
        { civilian_word: "Dosa", undercover_word: "Idli", relationship: "Both are South Indian breakfast items" },
        { civilian_word: "Chocolate", undercover_word: "Candy", relationship: "Both are sweet treats" },
        { civilian_word: "Bread", undercover_word: "Toast", relationship: "Both are bakery items" },
        { civilian_word: "Cake", undercover_word: "Pastry", relationship: "Both are baked desserts" },

        // Animals
        { civilian_word: "Dog", undercover_word: "Cat", relationship: "Both are common pets" },
        { civilian_word: "Lion", undercover_word: "Tiger", relationship: "Both are big cats" },
        { civilian_word: "Elephant", undercover_word: "Rhino", relationship: "Both are large animals" },
        { civilian_word: "Parrot", undercover_word: "Pigeon", relationship: "Both are birds" },
        { civilian_word: "Butterfly", undercover_word: "Moth", relationship: "Both are flying insects" },
        { civilian_word: "Cow", undercover_word: "Buffalo", relationship: "Both are cattle" },
        { civilian_word: "Horse", undercover_word: "Donkey", relationship: "Both are equines" },
        { civilian_word: "Monkey", undercover_word: "Gorilla", relationship: "Both are primates" },
        { civilian_word: "Fish", undercover_word: "Shark", relationship: "Both are aquatic animals" },
        { civilian_word: "Snake", undercover_word: "Lizard", relationship: "Both are reptiles" },

        // Objects
        { civilian_word: "Chair", undercover_word: "Stool", relationship: "Both are seats" },
        { civilian_word: "Table", undercover_word: "Desk", relationship: "Both are furniture with flat surfaces" },
        { civilian_word: "Phone", undercover_word: "Tablet", relationship: "Both are electronic devices" },
        { civilian_word: "Pen", undercover_word: "Pencil", relationship: "Both are writing tools" },
        { civilian_word: "Book", undercover_word: "Magazine", relationship: "Both are reading materials" },
        { civilian_word: "Watch", undercover_word: "Clock", relationship: "Both tell time" },
        { civilian_word: "Bag", undercover_word: "Purse", relationship: "Both carry items" },
        { civilian_word: "Shoes", undercover_word: "Sandals", relationship: "Both are footwear" },
        { civilian_word: "Shirt", undercover_word: "T-Shirt", relationship: "Both are upper body clothing" },
        { civilian_word: "Cap", undercover_word: "Hat", relationship: "Both are headwear" },

        // Places
        { civilian_word: "School", undercover_word: "College", relationship: "Both are educational institutions" },
        { civilian_word: "Hospital", undercover_word: "Clinic", relationship: "Both are medical facilities" },
        { civilian_word: "Park", undercover_word: "Garden", relationship: "Both are green spaces" },
        { civilian_word: "Beach", undercover_word: "Pool", relationship: "Both are places to swim" },
        { civilian_word: "Mall", undercover_word: "Market", relationship: "Both are shopping places" },
        { civilian_word: "Temple", undercover_word: "Church", relationship: "Both are places of worship" },
        { civilian_word: "Airport", undercover_word: "Railway Station", relationship: "Both are transport hubs" },
        { civilian_word: "Hotel", undercover_word: "Resort", relationship: "Both offer accommodation" },
        { civilian_word: "Cinema", undercover_word: "Theatre", relationship: "Both are entertainment venues" },
        { civilian_word: "Restaurant", undercover_word: "Cafe", relationship: "Both serve food" },

        // Nature
        { civilian_word: "Sun", undercover_word: "Moon", relationship: "Both are celestial bodies" },
        { civilian_word: "River", undercover_word: "Lake", relationship: "Both are water bodies" },
        { civilian_word: "Mountain", undercover_word: "Hill", relationship: "Both are elevated landforms" },
        { civilian_word: "Rain", undercover_word: "Snow", relationship: "Both are precipitation" },
        { civilian_word: "Tree", undercover_word: "Plant", relationship: "Both are vegetation" },
        { civilian_word: "Flower", undercover_word: "Leaf", relationship: "Both are parts of plants" },
        { civilian_word: "Star", undercover_word: "Planet", relationship: "Both are in space" },
        { civilian_word: "Ocean", undercover_word: "Sea", relationship: "Both are large water bodies" },
        { civilian_word: "Desert", undercover_word: "Jungle", relationship: "Both are ecosystems" },
        { civilian_word: "Wind", undercover_word: "Storm", relationship: "Both are weather phenomena" },

        // Activities
        { civilian_word: "Running", undercover_word: "Walking", relationship: "Both are ways of moving" },
        { civilian_word: "Swimming", undercover_word: "Diving", relationship: "Both are water activities" },
        { civilian_word: "Dancing", undercover_word: "Singing", relationship: "Both are performing arts" },
        { civilian_word: "Reading", undercover_word: "Writing", relationship: "Both involve text" },
        { civilian_word: "Cooking", undercover_word: "Baking", relationship: "Both are food preparation" },
        { civilian_word: "Sleeping", undercover_word: "Napping", relationship: "Both are rest activities" },
        { civilian_word: "Painting", undercover_word: "Drawing", relationship: "Both are visual arts" },
        { civilian_word: "Cycling", undercover_word: "Skating", relationship: "Both use wheels" },
        { civilian_word: "Fishing", undercover_word: "Hunting", relationship: "Both are catching activities" },
        { civilian_word: "Shopping", undercover_word: "Browsing", relationship: "Both happen at stores" },

        { civilian_word: "Soap", undercover_word: "Detergent", relationship: "Both are used for cleaning but different surfaces" },
        { civilian_word: "Pillow", undercover_word: "Cushion", relationship: "Both are soft and stuffed but used in different places" },
        { civilian_word: "Candle", undercover_word: "Flashlight", relationship: "Both provide light during darkness" },
        { civilian_word: "Salt", undercover_word: "Sugar", relationship: "Both are white granular kitchen staples" },
        { civilian_word: "Hammer", undercover_word: "Screwdriver", relationship: "Both are basic manual tools" },
        { civilian_word: "Bucket", undercover_word: "Mug", relationship: "Both hold water for bathing or cleaning" },
        { civilian_word: "Gloves", undercover_word: "Socks", relationship: "Both are clothing for extremities" },
        { civilian_word: "Towel", undercover_word: "Napkin", relationship: "Both are used for drying/wiping" },
        { civilian_word: "Jungle", undercover_word: "Forest", relationship: "Both are dense areas of trees and wildlife" },
        { civilian_word: "Button", undercover_word: "Zipper", relationship: "Both are used to fasten clothing" },
    ],

    medium: [
        // Professions
        { civilian_word: "Doctor", undercover_word: "Nurse", relationship: "Both work in healthcare" },
        { civilian_word: "Teacher", undercover_word: "Professor", relationship: "Both are educators" },
        { civilian_word: "Chef", undercover_word: "Cook", relationship: "Both prepare food professionally" },
        { civilian_word: "Pilot", undercover_word: "Captain", relationship: "Both operate vehicles" },
        { civilian_word: "Actor", undercover_word: "Model", relationship: "Both work in entertainment" },
        { civilian_word: "Lawyer", undercover_word: "Judge", relationship: "Both work in law" },
        { civilian_word: "Architect", undercover_word: "Engineer", relationship: "Both design structures" },
        { civilian_word: "Artist", undercover_word: "Sculptor", relationship: "Both create art" },
        { civilian_word: "Musician", undercover_word: "Composer", relationship: "Both work with music" },
        { civilian_word: "Photographer", undercover_word: "Videographer", relationship: "Both capture visuals" },

        // Sports
        { civilian_word: "Cricket", undercover_word: "Baseball", relationship: "Both use bat and ball" },
        { civilian_word: "Football", undercover_word: "Rugby", relationship: "Both are field sports" },
        { civilian_word: "Tennis", undercover_word: "Badminton", relationship: "Both use rackets" },
        { civilian_word: "Hockey", undercover_word: "Polo", relationship: "Both use sticks" },
        { civilian_word: "Boxing", undercover_word: "Wrestling", relationship: "Both are combat sports" },
        { civilian_word: "Yoga", undercover_word: "Pilates", relationship: "Both are exercise forms" },
        { civilian_word: "Marathon", undercover_word: "Sprint", relationship: "Both are running events" },
        { civilian_word: "Golf", undercover_word: "Croquet", relationship: "Both use clubs/mallets" },
        { civilian_word: "Surfing", undercover_word: "Sailing", relationship: "Both are water sports" },
        { civilian_word: "Archery", undercover_word: "Shooting", relationship: "Both target sports" },

        // Technology
        { civilian_word: "Laptop", undercover_word: "Desktop", relationship: "Both are computers" },
        { civilian_word: "WiFi", undercover_word: "Bluetooth", relationship: "Both are wireless technologies" },
        { civilian_word: "Instagram", undercover_word: "Snapchat", relationship: "Both are social media apps" },
        { civilian_word: "Netflix", undercover_word: "Amazon Prime", relationship: "Both are streaming services" },
        { civilian_word: "WhatsApp", undercover_word: "Telegram", relationship: "Both are messaging apps" },
        { civilian_word: "Google", undercover_word: "Bing", relationship: "Both are search engines" },
        { civilian_word: "Uber", undercover_word: "Ola", relationship: "Both are ride-sharing apps" },
        { civilian_word: "Zomato", undercover_word: "Swiggy", relationship: "Both are food delivery apps" },
        { civilian_word: "YouTube", undercover_word: "TikTok", relationship: "Both are video platforms" },
        { civilian_word: "Email", undercover_word: "SMS", relationship: "Both are messaging methods" },

        // Festivals & Events
        { civilian_word: "Diwali", undercover_word: "Holi", relationship: "Both are Hindu festivals" },
        { civilian_word: "Christmas", undercover_word: "Easter", relationship: "Both are Christian holidays" },
        { civilian_word: "Wedding", undercover_word: "Engagement", relationship: "Both are ceremonies" },
        { civilian_word: "Birthday", undercover_word: "Anniversary", relationship: "Both are celebrations" },
        { civilian_word: "New Year", undercover_word: "Navratri", relationship: "Both are festivals" },
        { civilian_word: "Graduation", undercover_word: "Convocation", relationship: "Both are academic events" },
        { civilian_word: "Concert", undercover_word: "Festival", relationship: "Both are music events" },
        { civilian_word: "Party", undercover_word: "Gathering", relationship: "Both are social events" },
        { civilian_word: "Funeral", undercover_word: "Memorial", relationship: "Both honor the deceased" },
        { civilian_word: "Parade", undercover_word: "Rally", relationship: "Both are public gatherings" },

        // Emotions & States
        { civilian_word: "Happy", undercover_word: "Excited", relationship: "Both are positive emotions" },
        { civilian_word: "Angry", undercover_word: "Frustrated", relationship: "Both are negative emotions" },
        { civilian_word: "Tired", undercover_word: "Exhausted", relationship: "Both describe fatigue" },
        { civilian_word: "Scared", undercover_word: "Nervous", relationship: "Both involve fear" },
        { civilian_word: "Confident", undercover_word: "Proud", relationship: "Both are positive self-feelings" },
        { civilian_word: "Bored", undercover_word: "Restless", relationship: "Both describe dissatisfaction" },
        { civilian_word: "Jealous", undercover_word: "Envious", relationship: "Both involve wanting something" },
        { civilian_word: "Lonely", undercover_word: "Isolated", relationship: "Both describe being alone" },
        { civilian_word: "Curious", undercover_word: "Interested", relationship: "Both involve wanting to know" },
        { civilian_word: "Relaxed", undercover_word: "Calm", relationship: "Both describe peace" },

        // Vehicles
        { civilian_word: "Car", undercover_word: "SUV", relationship: "Both are automobiles" },
        { civilian_word: "Motorcycle", undercover_word: "Scooter", relationship: "Both are two-wheelers" },
        { civilian_word: "Bus", undercover_word: "Van", relationship: "Both are large vehicles" },
        { civilian_word: "Train", undercover_word: "Metro", relationship: "Both run on tracks" },
        { civilian_word: "Airplane", undercover_word: "Helicopter", relationship: "Both fly" },
        { civilian_word: "Ship", undercover_word: "Boat", relationship: "Both travel on water" },
        { civilian_word: "Rickshaw", undercover_word: "Tuk-Tuk", relationship: "Both are three-wheelers" },
        { civilian_word: "Cycle", undercover_word: "Tricycle", relationship: "Both are pedal-powered" },
        { civilian_word: "Ambulance", undercover_word: "Fire Truck", relationship: "Both are emergency vehicles" },
        { civilian_word: "Taxi", undercover_word: "Cab", relationship: "Both are hired transport" },

        // Music & Entertainment
        { civilian_word: "Guitar", undercover_word: "Ukulele", relationship: "Both are string instruments" },
        { civilian_word: "Piano", undercover_word: "Keyboard", relationship: "Both are key instruments" },
        { civilian_word: "Drums", undercover_word: "Tabla", relationship: "Both are percussion" },
        { civilian_word: "Flute", undercover_word: "Clarinet", relationship: "Both are wind instruments" },
        { civilian_word: "Movie", undercover_word: "Documentary", relationship: "Both are films" },
        { civilian_word: "Comedy", undercover_word: "Drama", relationship: "Both are genres" },
        { civilian_word: "Novel", undercover_word: "Story", relationship: "Both are narratives" },
        { civilian_word: "Podcast", undercover_word: "Radio", relationship: "Both are audio content" },
        { civilian_word: "Game", undercover_word: "Puzzle", relationship: "Both are entertainment" },
        { civilian_word: "Magic", undercover_word: "Illusion", relationship: "Both involve tricks" },
        { civilian_word: "Podcast", undercover_word: "Audiobook", relationship: "Both are spoken-word audio content" },
        { civilian_word: "Password", undercover_word: "Passcode", relationship: "Both are security measures using characters/numbers" },
        { civilian_word: "Skateboard", undercover_word: "Rollerblades", relationship: "Both are wheeled personal transport" },
        { civilian_word: "Gym", undercover_word: "Stadium", relationship: "Both are venues for physical activity/sports" },
        { civilian_word: "Microscope", undercover_word: "Telescope", relationship: "Both use lenses to see things at a distance/scale" },
        { civilian_word: "Subway", undercover_word: "Elevator", relationship: "Both are modes of transport in a city/building" },
        { civilian_word: "Library", undercover_word: "Museum", relationship: "Both are quiet public places for knowledge/history" },
        { civilian_word: "E-book", undercover_word: "Paperback", relationship: "Both are formats for reading books" },
        { civilian_word: "Charger", undercover_word: "Powerbank", relationship: "Both provide power to mobile devices" },
        { civilian_word: "Wallet", undercover_word: "Keychain", relationship: "Both are essential items carried in pockets" },
    ],

    hard: [
        // Abstract Concepts
        { civilian_word: "Freedom", undercover_word: "Independence", relationship: "Both describe liberty" },
        { civilian_word: "Justice", undercover_word: "Fairness", relationship: "Both relate to equity" },
        { civilian_word: "Truth", undercover_word: "Honesty", relationship: "Both relate to sincerity" },
        { civilian_word: "Wisdom", undercover_word: "Knowledge", relationship: "Both relate to understanding" },
        { civilian_word: "Courage", undercover_word: "Bravery", relationship: "Both describe fearlessness" },
        { civilian_word: "Hope", undercover_word: "Faith", relationship: "Both are positive beliefs" },
        { civilian_word: "Love", undercover_word: "Affection", relationship: "Both are feelings of care" },
        { civilian_word: "Peace", undercover_word: "Harmony", relationship: "Both describe tranquility" },
        { civilian_word: "Power", undercover_word: "Authority", relationship: "Both relate to control" },
        { civilian_word: "Time", undercover_word: "Moment", relationship: "Both relate to duration" },

        // Similar Items
        { civilian_word: "Mirror", undercover_word: "Window", relationship: "Both are glass surfaces" },
        { civilian_word: "Pillow", undercover_word: "Cushion", relationship: "Both are soft supports" },
        { civilian_word: "Blanket", undercover_word: "Quilt", relationship: "Both are bed covers" },
        { civilian_word: "Curtain", undercover_word: "Blind", relationship: "Both cover windows" },
        { civilian_word: "Soap", undercover_word: "Shampoo", relationship: "Both are cleaning products" },
        { civilian_word: "Toothbrush", undercover_word: "Comb", relationship: "Both are grooming tools" },
        { civilian_word: "Wallet", undercover_word: "Pouch", relationship: "Both store items" },
        { civilian_word: "Key", undercover_word: "Lock", relationship: "Both relate to security" },
        { civilian_word: "Bottle", undercover_word: "Jar", relationship: "Both are containers" },
        { civilian_word: "Plate", undercover_word: "Bowl", relationship: "Both hold food" },

        // Office & Work
        { civilian_word: "Meeting", undercover_word: "Conference", relationship: "Both are work gatherings" },
        { civilian_word: "Report", undercover_word: "Presentation", relationship: "Both share information" },
        { civilian_word: "Deadline", undercover_word: "Target", relationship: "Both are goals" },
        { civilian_word: "Salary", undercover_word: "Bonus", relationship: "Both are payments" },
        { civilian_word: "Interview", undercover_word: "Exam", relationship: "Both are evaluations" },
        { civilian_word: "Resume", undercover_word: "Portfolio", relationship: "Both showcase work" },
        { civilian_word: "Project", undercover_word: "Assignment", relationship: "Both are tasks" },
        { civilian_word: "Client", undercover_word: "Customer", relationship: "Both receive services" },
        { civilian_word: "Manager", undercover_word: "Supervisor", relationship: "Both oversee work" },
        { civilian_word: "Promotion", undercover_word: "Raise", relationship: "Both are career advances" },

        // Science & Nature
        { civilian_word: "Atom", undercover_word: "Molecule", relationship: "Both are particle units" },
        { civilian_word: "Gravity", undercover_word: "Magnetism", relationship: "Both are forces" },
        { civilian_word: "Electricity", undercover_word: "Current", relationship: "Both relate to power" },
        { civilian_word: "Volcano", undercover_word: "Earthquake", relationship: "Both are geological events" },
        { civilian_word: "Fossil", undercover_word: "Artifact", relationship: "Both are ancient remains" },
        { civilian_word: "Galaxy", undercover_word: "Universe", relationship: "Both are cosmic entities" },
        { civilian_word: "Climate", undercover_word: "Weather", relationship: "Both describe atmosphere" },
        { civilian_word: "Evolution", undercover_word: "Adaptation", relationship: "Both relate to change" },
        { civilian_word: "Ecosystem", undercover_word: "Habitat", relationship: "Both are environments" },
        { civilian_word: "Species", undercover_word: "Breed", relationship: "Both are types of organisms" },

        // Subtle Differences
        { civilian_word: "Street", undercover_word: "Road", relationship: "Both are pathways" },
        { civilian_word: "House", undercover_word: "Home", relationship: "Both are dwellings" },
        { civilian_word: "Job", undercover_word: "Career", relationship: "Both relate to work" },
        { civilian_word: "Goal", undercover_word: "Dream", relationship: "Both are aspirations" },
        { civilian_word: "Friend", undercover_word: "Buddy", relationship: "Both are close people" },
        { civilian_word: "Memory", undercover_word: "Thought", relationship: "Both are mental" },
        { civilian_word: "Skill", undercover_word: "Talent", relationship: "Both are abilities" },
        { civilian_word: "Mistake", undercover_word: "Error", relationship: "Both are wrong actions" },
        { civilian_word: "Problem", undercover_word: "Issue", relationship: "Both are challenges" },
        { civilian_word: "Chance", undercover_word: "Opportunity", relationship: "Both are possibilities" },

        // Hinglish Hard
        { civilian_word: "Dost", undercover_word: "Yaar", relationship: "Both mean friend in Hindi" },
        { civilian_word: "Paisa", undercover_word: "Rupiya", relationship: "Both are money" },
        { civilian_word: "Kaam", undercover_word: "Naukri", relationship: "Both relate to work" },
        { civilian_word: "Ghar", undercover_word: "Makaan", relationship: "Both mean house" },
        { civilian_word: "Sapna", undercover_word: "Khwab", relationship: "Both mean dream" },
        { civilian_word: "Dil", undercover_word: "Mann", relationship: "Both refer to heart/mind" },
        { civilian_word: "Zindagi", undercover_word: "Jeevan", relationship: "Both mean life" },
        { civilian_word: "Ishq", undercover_word: "Pyar", relationship: "Both mean love" },
        { civilian_word: "Mushkil", undercover_word: "Pareshani", relationship: "Both mean difficulty" },
        { civilian_word: "Khushi", undercover_word: "Aanand", relationship: "Both mean happiness" },

        // Pop Culture
        { civilian_word: "Superhero", undercover_word: "Villain", relationship: "Both are comic characters" },
        { civilian_word: "Bollywood", undercover_word: "Hollywood", relationship: "Both are film industries" },
        { civilian_word: "Anime", undercover_word: "Cartoon", relationship: "Both are animated media" },
        { civilian_word: "Meme", undercover_word: "GIF", relationship: "Both are internet content" },
        { civilian_word: "Trend", undercover_word: "Viral", relationship: "Both describe popularity" },
        { civilian_word: "Fan", undercover_word: "Follower", relationship: "Both are supporters" },
        { civilian_word: "Celebrity", undercover_word: "Influencer", relationship: "Both are famous people" },
        { civilian_word: "Album", undercover_word: "Playlist", relationship: "Both are music collections" },
        { civilian_word: "Series", undercover_word: "Season", relationship: "Both are show parts" },
        { civilian_word: "Remake", undercover_word: "Sequel", relationship: "Both are follow-up films" },

        { civilian_word: "Legend", undercover_word: "Myth", relationship: "Both are traditional stories but with different historical claims" },
        { civilian_word: "Stalactite", undercover_word: "Stalagmite", relationship: "Both are cave formations but grow in opposite directions" },
        { civilian_word: "Poetry", undercover_word: "Prose", relationship: "Both are forms of written expression with different structures" },
        { civilian_word: "Proton", undercover_word: "Neutron", relationship: "Both are subatomic particles in the nucleus" },
        { civilian_word: "Apathy", undercover_word: "Empathy", relationship: "Both describe emotional states regarding others" },
        { civilian_word: "Monarchy", undercover_word: "Dictatorship", relationship: "Both are forms of single-leader governance" },
        { civilian_word: "Barcode", undercover_word: "QR Code", relationship: "Both are scannable data formats" },
        { civilian_word: "Symmetry", undercover_word: "Pattern", relationship: "Both describe visual organization and repetition" },
        { civilian_word: "Satellite", undercover_word: "Astronaut", relationship: "Both are objects/people orbiting the earth" },
        { civilian_word: "Inflation", undercover_word: "Recession", relationship: "Both are economic states affecting money value" },
    ],
};

// Track used indices to avoid repetition within a session
let usedIndices: Record<string, Set<number>> = {
    easy: new Set(),
    medium: new Set(),
    hard: new Set(),
};

export function getUniqueFallbackWordPair(difficulty: 'easy' | 'medium' | 'hard'): WordPair {
    const pairs = fallbackWordPairs[difficulty];
    const used = usedIndices[difficulty];

    // Reset if all pairs have been used
    if (used.size >= pairs.length) {
        used.clear();
    }

    // Find an unused index
    let randomIndex: number;
    do {
        randomIndex = Math.floor(Math.random() * pairs.length);
    } while (used.has(randomIndex));

    used.add(randomIndex);
    return pairs[randomIndex];
}
