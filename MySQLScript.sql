CREATE DATABASE pinpop;
USE pinpop;

CREATE TABLE IF NOT EXISTS admin (
	admin_id	INT AUTO_INCREMENT,
	full_name	VARCHAR(50) NOT NULL,
    role		VARCHAR(30) NOT NULL DEFAULT 'Admin', 
    email		VARCHAR(50) NOT NULL UNIQUE,
    password	VARCHAR(50) NOT NULL,
    PRIMARY KEY (admin_id)
);

CREATE TABLE IF NOT EXISTS player (
    player_id		INT NOT NULL AUTO_INCREMENT,
    username		VARCHAR(50) NOT NULL UNIQUE,
    email			VARCHAR(50) NOT NULL UNIQUE,
    password		VARCHAR(50) NOT NULL,
    date_join		DATE NOT NULL DEFAULT (CURRENT_DATE),
    bite_highscore	INT NOT NULL DEFAULT 0,
    freeplay_score	INT NOT NULL DEFAULT 0,
    freeplay_streak	INT NOT NULL DEFAULT 0,
    is_deleted		BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (player_id)
);

CREATE TABLE IF NOT EXISTS media (
	media_id		INT NOT NULL AUTO_INCREMENT,
    title			VARCHAR(50) NOT NULL,
    direct_author	VARCHAR(50),
    media_type		ENUM('Movie','Book', 'TV Show') NOT NULL,
    PRIMARY KEY (media_id)
);

CREATE TABLE IF NOT EXISTS location (
	location_id		INT NOT NULL AUTO_INCREMENT,
    city_name		VARCHAR(50) NOT NULL,
    country			VARCHAR(50) NOT NULL,
    region			ENUM('Africa', 'Oceania', 'Asia', 'Europe', 'North America', 'South America','Middle East') NOT NULL,
    population		VARCHAR(50),
    image_url		VARCHAR(150),
    information		VARCHAR(5000),
    PRIMARY KEY (location_id)
);

CREATE TABLE IF NOT EXISTS questions (
	q_id		INT NOT NULL AUTO_INCREMENT,
    question	VARCHAR(500) NOT NULL,
    media_id	INT,
    location_id	INT NOT NULL,
    answer      ENUM('A','B','C','D') NOT NULL,
    option_a    VARCHAR(100) NOT NULL,
    option_b    VARCHAR(100) NOT NULL,
    option_c    VARCHAR(100) NOT NULL,
    option_d    VARCHAR(100) NOT NULL,
    points      INT NOT NULL DEFAULT 1000,
    date_added  DATE NOT NULL DEFAULT (CURRENT_DATE),
    author      VARCHAR(100),
    PRIMARY KEY (q_id),
    FOREIGN KEY (media_id) REFERENCES media(media_id) ON DELETE SET NULL,
    FOREIGN KEY (location_id) REFERENCES location(location_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS quiz (
	quiz_id		INT NOT NULL AUTO_INCREMENT,
    player_id	INT NOT NULL,
    quiz_type	ENUM('freeplay', 'short') NOT NULL,
    score		INT NOT NULL DEFAULT 0,
    date		DATE NOT NULL DEFAULT (CURRENT_DATE),
    PRIMARY KEY (quiz_id),
    FOREIGN KEY (player_id) REFERENCES player(player_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS contact (
    submission_id	INT NOT NULL AUTO_INCREMENT,
    player_id		INT,
    submission_type ENUM('feedback', 'suggestion', 'other') NOT NULL,
    submitted_date  DATE NOT NULL DEFAULT (CURRENT_DATE),
    week_start      DATE,
    message         VARCHAR(2000), -- for feedback or other submission type
    q_id            INT,
    question_text   VARCHAR(1000),
    option_A        VARCHAR(500),
    option_B        VARCHAR(500),
    option_C        VARCHAR(500),
    option_D        VARCHAR(500),
    correct_option  ENUM('A','B','C','D'),
    status          ENUM('pending', 'approved', 'rejected', 'resolved') NOT NULL DEFAULT 'pending',
    admin_review    INT, -- admin_id
    PRIMARY KEY (submission_id),
    FOREIGN KEY (player_ID) REFERENCES player(player_id) ON DELETE SET NULL,
    FOREIGN KEY (q_id) REFERENCES questions(q_id) ON DELETE SET NULL,
    FOREIGN KEY (admin_review) REFERENCES admin(admin_id) ON DELETE SET NULL,
    UNIQUE KEY weekly_suggestion_player (player_id, week_start)
);


-- PRELIM DATA ISNERTION
INSERT INTO admin(full_name, role, email, password) VALUES 
	('Juliana Castro', 'Back end developer', 'jcastro8@trinity.edu', 'pwd'),
    ('Natalie Hudson', 'Full stack developer', 'nhudson@trinity.edu', 'pwd'),
    ('Al Stubblefield','Front end developer','astubble@trinity.edu', 'pwd');

INSERT INTO location(city_name, country, region, population, image_url, information) VALUES
	('New York', 'USA', 'North America', '8.58 million',	'https://i.pinimg.com/originals/84/c2/dc/84c2dcd48e43c50ecced38b2eef332d0.jpg',		'New York City, often called New York or NYC, is the largest and most populous city in the United States. It is also the most international city in the country, serving as a global hub for finance, culture, and immigration'), --
    ('Amsterdam', 'Netherlands', 'Europe', '0.9 million', 	'https://i.pinimg.com/originals/57/97/eb/5797eb6d01b755e057e9b04373c98d60.jpg', 	'Capital of the Netherlands, is renowned for its picturesque canals, rich history, and vibrant cultural scene, making it a major European hub for tourism and commerce.'), --
    ('Wellington', 'New Zealand', 'Oceania','0.42 million',	'https://i.pinimg.com/736x/b3/6f/c6/b36fc66b8f8a834be82e59576eff800d--new-zealand-wellington-nya-zeeland.jpg', 'Capital of New Zealand. It is renowned for its picturesque harbor, Wellington Harbour, which is often regarded as one of the finest in the world. The city is characterized by its hilly terrain, with Mount Victoria providing stunning views of the surrounding area.'), --
    ('London', 'United Kingdom', 'Europe', '9.0 million', 	'https://i.pinimg.com/originals/61/d9/98/61d998ef852f3d58e52c9ff1d801a9df.jpg', 	'Capital of the United Kingdom and England, London is a global city renowned for its history, finance, and culture, home to landmarks like the Tower of London and Buckingham Palace.'), --
    ('Tokyo', 'Japan', 'Asia', '13.96 million',				'https://i.pinimg.com/736x/7f/2d/96/7f2d96104ffadeaaef28267d686d0459.jpg', 			'Capital of Japan and the worlds most populous metropolitan area, it is a vibrant blend of historical heritage, modern architecture, and cultural dynamism.'), --
    ('Tehran', 'Iran', 'Middle East', '9.5 million',		'https://i.pinimg.com/originals/94/fb/f4/94fbf43d07cbf6b3d5d204157b0a09a9.jpg', 	'Capital and largest city of Iran, a bustling metropolis at the southern foothills of the Alborz Mountains with a rich history, diverse culture, and significant economic and political importance.'), --
    ('Rio de Janeiro', 'Brazil', 'South America', '6.75 million', 'https://i.pinimg.com/originals/ac/9d/e3/ac9de34b2a4b4e29105aacdf54e7005e.png', 'Brazils second-largest city, Rio de Janeiro is famous for its Carnival festival, Copacabana beach, and the iconic Christ the Redeemer statue overlooking the city from Corcovado mountain.'), --
    ('Mexico City', 'Mexico', 'North America', '9.21 million', 'https://i.pinimg.com/736x/f3/66/c3/f366c3e078e240e572800ba8642e7e84.jpg', 		'Officially Ciudad de México (CDMX), is the capital of Mexico and the most populous city in North America, with a population of over 9.2 million in its core and more than 21.8 million in its metropolitan area.'), --
    ('Paris','France','Europe', '2.16 million',				'https://i.pinimg.com/originals/0d/e9/3e/0de93eee75fba6e82af58ff68b01065f.jpg', 	'Capital of France and a historic, cultural, and artistic hub known as the "City of Light," celebrated for its iconic landmarks, vibrant neighborhoods, and global influence.'), --
    ('Seoul','South Korea', 'Asia', '9.73 million',			'https://i.pinimg.com/originals/67/2a/05/672a051ad14bf2286d9261ba2bb51459.jpg', 	'Capital of South Korea, is a vibrant metropolis that seamlessly blends rich history with modern innovation, making it a significant cultural, economic, and political hub in East Asia.'), --
    ('Monaco', 'Monaco', 'Europe', '40 thousand',			'https://i.pinimg.com/originals/be/39/d1/be39d139c6928df6f0d7fefd24e2c889.jpg', 	'City-state on the French Rivera known for its wealth, luxury tourism, and dense population.'), --
    ('Johannesburg', 'South Africa', 'Africa', '5.78 million','https://www.doreebonner.co.uk/wp-content/uploads/2023/07/moving-to-johannesburg.jpg', 'Largest city in South Africa and economic capital, Johannesburg grew from a gold-rush settlement into a modern metropolis, and is home to the Apartheid Museum.'), -- 
    ('Cape Town', 'South Africa', 'Africa', '4.62 million',	'https://i.pinimg.com/736x/bc/e1/a7/bce1a7bbb6870bdf762f4f36a2cf446b.jpg', 			'The legislative capital of South Africa, but also known as the "Mother City". It is known for its vibrancy, stunning landscapes, and cultural diversity'), -- 
    ('Los Angeles', 'USA', 'North America', '3.9 million',	'https://i.pinimg.com/originals/b2/d5/eb/b2d5eb0dcdb0f2764ff55f9bdd7f29dd.jpg', 	'The entertainment capital of the world, Los Angeles is home to Hollywood, a diverse population, and year-round sunshine'), --
    ('Chicago', 'USA', 'North America', '2.7 million',		'https://i.pinimg.com/originals/09/90/b8/0990b8f7a53ccff0e885e7491c8ebc30.jpg', 	'Known as "The Windy City" it is the third most populous city in the US and it is located along the shores of Lake Michigan. Known for being the home of The Bean, deep-dish pizza, and blues music.'); --
    
INSERT INTO media(title, direct_author, media_type) VALUES 
    ('Persepolis', 'Marjane Satrapi', 'Book'), -- Tehran
    ('XOXO Kitty', 'Jenny Han', 'TV Show'), -- Seoul
    ('Lost in Translation', 'Sofia Coppola', 'Movie'), -- Tokyo
    ('Parasite', 'Bong Joon Ho', 'Movie'), -- Seoul
    ('Your Name', 'Makoto Shinkai', 'Movie'), -- Tokyo
    ('The Diary of Anne Frank', 'Anne Frank', 'Book'), -- Amsterdam
    ('The Fault in our Stars', 'John Green', 'Book'), -- Amsterdam
    ('Girl with a Pearl Earing', 'Peter Webber', 'Movie'), -- Amsterdam
    ('Lord of the Rings', 'Peter Jackson', 'Movie'), -- Wellington
    ('Bridgerton', 'Julia Quinn', 'TV Show'), -- London
    ('Fleabag', 'Phoebe Waller-Bridge', 'TV Show'), -- London
    ('Rio', 'Carlos Saldanha', 'Movie'), -- Rio
    ('Twilight - Breaking Dawn Part 1', 'Bill Condon', 'Movie'), -- Rio de Janeiro
    ('Cars 2', 'John Lasseter', 'Movie'), -- Monaco
    ('La La Land', 'Damien Chazelle', 'Movie'), -- LA
    ('I Love LA','Lorene Scafaria', 'TV Show'), -- LA
    ('Emily in Paris', 'Darren Star', 'TV Show'), -- Paris
    ('The Bear', 'Christopher Storer', 'TV Show'), -- Chicago
    ('FRIENDS', 'Gary Halvorson', 'TV Show'), -- NYC
    ('Hotel Rwanda','Terry George', 'Movie'), -- Johannesburg
    ('Avengers Age of Ultron', 'Joss Whedon', 'Movie'), -- Johannesburg
    ('Mad Max: Fury Road', 'George Miller', 'Movie'), -- Cape Town
    ('Roma', 'Alfonso Cuaron', 'Movie'); -- CDMX

INSERT INTO questions (question, media_id, location_id, answer, option_a, option_b, option_c, option_d, points, author) VALUES
-- Question 1: The Fault in Our Stars – Amsterdam (media_id=7, location_id=2)
('Which of the following landmarks did NOT appear in "The Fault in Our Stars" movie scenes filmed in Amsterdam?',
 7, 2, 'B', 'Van Gogh Museum', 'Rijksmuseum', 'Anne Frank House', 'Canale', 1000, 'Admin'),
-- Question 2: Avengers Age of Ultron – Johannesburg (media_id=21, location_id=12)
('Which of the following Avengers franchise movies was filmed in Johannesburg, South Africa?',
 21, 12, 'B', 'The Avengers', 'Avengers: Age of Ultron', 'Avengers: Infinity War', 'Avengers: Endgame', 1000, 'Admin'),
-- Question 3: Persepolis – Tehran (media_id=1, location_id=6)
('What is the name of the graphic novel series written by Marjane Satrapi that takes place in Tehran, Iran?',
 1, 6, 'A', 'Persepolis', 'Parsa', 'Achaemenid', 'Emblemish', 1000, 'Admin'),
 -- Question 4: Rio - Rio de Janeiro (media_id=12, location_id=7)
('Brazilian actor Rodrigo Santoro voice acts for which character in "Rio"?',
 12, 7, 'B', 'Blu', 'Dr. Tulio Monteiro', 'Luiz', 'Rafael', 1000, 'Admin'),
 -- Question 5: Lord of the Rings - Wellington (media_id=9, location_id=3)
 ('The gorgeous scenery of Wellington features prominently in all three "Lord of the Rings" movies, which stars what actor as its lead character Frodo Baggins?',
 9, 3, 'A', 'Elijah Wood', 'Robert Pattinson', 'Ian McKellan', 'Martin Freeman', 1000, 'Admin');
 
 
-- SECOND DATA INSERTION
INSERT INTO media (title, direct_author, media_type) VALUES
('The Royal Tenenbaums', 'Wes Anderson', 'Movie'),
('The Kissing Booth', 'Vince Marcello', 'Movie'),
('Chicago: The Musical', 'Rob Marshall', 'Movie'),
('The Mask of Zorro', 'Martin Campbell', 'Movie'),
('Iron Man 2', 'Jon Favreau', 'Movie'),
('Blue Eye Samurai', 'Michael Green', 'TV Show'),
('Tokyo Ghoul', 'Sui Ishida', 'Book'),
('The Alchemist', 'Paulo Coelho', 'Book'),
('Like Water for Chocolate', 'Laura Esquivel', 'Book'),
('Narcos Mexico', 'Chris Brancato', 'TV Show'),
('Midnight in Paris', 'Woody Allen', 'Movie'),
('The Hunchback of Notre-Dame', 'Victor Hugo', 'Book'),
('Sherlock Holmes', 'Arthur Conan Doyle', 'Book'),
('The Hobbit', 'Peter Jackson', 'Movie'),
('The Luminaries', 'Eleanor Catton', 'Book'),
('Crash Landing on You', 'Park Joo-yeon', 'TV Show'),
('Please Look After Mom', 'Kyung-Sook Shin', 'Book'),
('Casino Royale', 'Martin Campbell', 'Movie'),
('Born a Crime', 'Trevor Noah', 'Book'),
('District 9', 'Neill Blomkamp', 'Movie'),
('Disgrace', 'J.M. Coetzee', 'Book'),
('Blood Diamond', 'Edward Zwick', 'Movie'),
('Arrested Development', 'Mitchell Hurwitz', 'TV Show'),
('The Devil in the White City', 'Erik Larson', 'Book'),
('ER', 'Michael Crichton', 'TV Show'),
('Breakfast at Tiffanys', 'Blake Edwards', 'Movie'),
('The Great Gatsby', 'F. Scott Fitzgerald', 'Book'),
('Seinfeld', 'Larry David', 'TV Show'),
('Anne Frank Remembered', 'Jon Blair', 'Movie'),
('Spirited Away', 'Hayao Miyazaki', 'Movie'),
('City of God', 'Fernando Meirelles', 'Movie'),
('Grace of Monaco', 'Olivier Dahan', 'Movie');

INSERT INTO questions (question, media_id, location_id, answer, option_a, option_b, option_c, option_d, points, author) VALUES
-- Question 6: The Royal Tenenbaums – New York (media_id=24, location_id=1)
('Which Wes Anderson film is set in New York?', 
 24, 1, 'A','The Royal Tenenbaums', 'Moonrise Kingdom', 'Isle of Dogs', 'Asteroid City', 1000, 'Admin'),
-- Question 7: The Kissing Booth – Cape Town (media_id=25, location_id=13)
('Which teen movie uses footage from Cape Town, South Africa for its beach scenes despite being set in LA?',
 25, 13, 'A', 'The Kissing Booth', 'Teen Beach Movie', 'High School Musical', 'Mr. Bean\'s Holiday', 1000, 'Admin'),
-- Question 8: Chicago: The Musical – Chicago (media_id=26, location_id=15)
('Which song is NOT in "Chicago: The Musical"?', 
 26, 15, 'C', 'When You\'re Good to Mama', 'They Both Reached for the Gun', 'El Tango de Roxanne', 'Razzle Dazzle', 1000, 'Admin'),
-- Question 9: The Mask of Zorro – Mexico City (media_id=27, location_id=8)
('Filmed in Mexico City, the charming protagonist of what movie went on to inspire the character Puss in Boots in Shrek?',
 27, 8, 'A', 'The Mask of Zorro', 'The Princess Bride', 'Pirates of the Caribbean: The Black Pearl', 'The Count of Monte Cristo', 1000, 'Admin'),
-- Question 10: Iron Man 2 – Monaco (media_id=28, location_id=11)
('Which Avenger has one of their movies filmed in Monaco?',
 28, 11, 'B', 'Thor', 'Iron Man', 'Captain America', 'Black Widow', 1000, 'Admin'),
-- Question 11: Blue Eye Samurai – Tokyo (media_id=29, location_id=5)
('"Blue Eye Samurai" takes place in Japan and features multiple scenes in modern day Tokyo. However, the city is referred to as what name instead?',
 29, 5, 'C', 'Kyoto', 'Honshu', 'Edo', 'Tanabe', 1000, 'Admin'),
-- Question 12: Iron Man 2 – Monaco (media_id=28, location_id=11)
('Where was the scene of Iron Man 2 filmed when Elon Musk apears?',
 28, 11, 'B', 'New York', 'Monaco', 'Los Angeles', 'Cape Town', 1000, 'Admin'),
-- Question 13: Emily in Paris – Paris (media_id=17, location_id=9)
('Despite being known as "Emily in Paris", the protagonist doesn''t learn French until what season?',
 17, 9, 'C', 'Season 2', 'Season 3', 'Season 4', 'Season 5', 1000, 'Admin'),
 -- Question 14: Twilight – Rio de Janeiro (media_id=13, location_id=7)
('Which Twilight movie was partially filmed in Rio de Janeiro, Brazil?',
 13, 7, 'C', 'Twilight (2008)', 'New Moon (2009)', 'Breaking Dawn Part 1 (2011)', 'Breaking Dawn Part 2 (2012)', 1000, 'Admin'),
-- Question 15: Girl with a Pearl Earring – Amsterdam (media_id=8, location_id=2)
('Which painting-turned-film was filmed in Amsterdam and depicts the story behind one of history\'s most famous portraits?',
 8, 2, 'B', 'The Da Vinci Code', 'Girl with a Pearl Earring', 'Frida', 'Midnight in Paris', 1000, 'Admin'),
('In "Spirited Away," what is the name of the bathhouse where Chihiro works?', (SELECT media_id FROM media WHERE title = 'Spirited Away'), 5, 'C', 'The Golden Palace', 'The Spirit Inn', 'Yubaba''s Bathhouse', 'The Dragon Spa', 1000, 'Admin'),
('In which city does the manga "Tokyo Ghoul" primarily take place?', (SELECT media_id FROM media WHERE title = 'Tokyo Ghoul'), 5, 'A', 'Tokyo', 'Osaka', 'Kyoto', 'Hiroshima', 1000, 'Admin'),
('In "Persepolis," what major historical event causes Marjane''s family to send her abroad?', (SELECT media_id FROM media WHERE title = 'Persepolis'), 6, 'B', 'World War II', 'The Iranian Revolution', 'The Iran-Iraq War ceasefire', 'The fall of the Shah', 1000, 'Admin'),
('In "City of God," which Brazilian city''s favelas serve as the backdrop for the story?', (SELECT media_id FROM media WHERE title = 'City of God'), 7, 'B', 'São Paulo', 'Rio de Janeiro', 'Salvador', 'Brasília', 1000, 'Admin'),
('The novel "The Alchemist" by Paulo Coelho begins in which country, where the author was born?', (SELECT media_id FROM media WHERE title = 'The Alchemist'), 7, 'D', 'Portugal', 'Argentina', 'Spain', 'Brazil', 1000, 'Admin'),
('In Alfonso Cuarón''s film "Roma," in which city do the events take place?', (SELECT media_id FROM media WHERE title = 'Roma'), 8, 'A', 'Mexico City', 'Guadalajara', 'Monterrey', 'Oaxaca', 1000, 'Admin'),
('The novel "Like Water for Chocolate" is set on a ranch near which Mexican border town?', (SELECT media_id FROM media WHERE title = 'Like Water for Chocolate'), 8, 'C', 'Tijuana', 'Juárez', 'Piedras Negras', 'Nogales', 1000, 'Admin'),
('Which TV show follows the rise of the Guadalajara Cartel and is largely set in Mexico City?', (SELECT media_id FROM media WHERE title = 'Narcos Mexico'), 8, 'B', 'Breaking Bad', 'Narcos: Mexico', 'Ozark', 'The Wire', 1000, 'Admin'),
('In "Emily in Paris," what is Emily''s job that brings her to Paris?', (SELECT media_id FROM media WHERE title = 'Emily in Paris'), 9, 'A', 'Marketing executive', 'Fashion designer', 'Chef', 'Journalist', 1000, 'Admin'),
('Victor Hugo''s "The Hunchback of Notre-Dame" is set around which famous Paris landmark?', (SELECT media_id FROM media WHERE title = 'The Hunchback of Notre-Dame'), 9, 'C', 'The Eiffel Tower', 'The Louvre', 'Notre-Dame Cathedral', 'The Arc de Triomphe', 1000, 'Admin'),
('In Woody Allen''s "Midnight in Paris," the main character magically travels back to which decade?', (SELECT media_id FROM media WHERE title = 'Midnight in Paris'), 9, 'B', 'The 1910s', 'The 1920s', 'The 1930s', 'The 1940s', 1000, 'Admin'),
('In "Parasite," the Kim family lives in what type of dwelling at the start of the film?', (SELECT media_id FROM media WHERE title = 'Parasite'), 10, 'D', 'A luxury apartment', 'A countryside farmhouse', 'A high-rise condo', 'A semi-basement apartment', 1000, 'Admin'),
('In "Crash Landing on You," a South Korean heiress accidentally lands in which country?', (SELECT media_id FROM media WHERE title = 'Crash Landing on You'), 10, 'A', 'North Korea', 'China', 'Japan', 'Russia', 1000, 'Admin'),
('The novel "Please Look After Mom" is set primarily in which South Korean city?', (SELECT media_id FROM media WHERE title = 'Please Look After Mom'), 10, 'C', 'Busan', 'Incheon', 'Seoul', 'Daegu', 1000, 'Admin'),
('In "Casino Royale," which glamorous city-state hosts the high-stakes poker game?', (SELECT media_id FROM media WHERE title = 'Casino Royale'), 11, 'D', 'Venice', 'Paris', 'London', 'Montenegro', 1000, 'Admin'),
('In "District 9," where are the alien refugees forced to live in Johannesburg?', (SELECT media_id FROM media WHERE title = 'District 9'), 12, 'A', 'A shantytown called District 9', 'A space station', 'An underground bunker', 'A government facility', 1000, 'Admin'),
('Trevor Noah''s memoir "Born a Crime" describes growing up during which era in Johannesburg?', (SELECT media_id FROM media WHERE title = 'Born a Crime'), 12, 'C', 'Post-independence era', 'The Boer War era', 'The Apartheid era', 'The Zulu Kingdom era', 1000, 'Admin'),
('J.M. Coetzee''s novel "Disgrace" is set partly in which South African city?', (SELECT media_id FROM media WHERE title = 'Disgrace'), 13, 'A', 'Cape Town', 'Durban', 'Port Elizabeth', 'Bloemfontein', 1000, 'Admin'),
('In "La La Land," which famous Los Angeles landmark features in a key scene?', (SELECT media_id FROM media WHERE title = 'La La Land'), 14, 'B', 'Hollywood Sign', 'Griffith Observatory', 'Santa Monica Pier', 'The Getty Center', 1000, 'Admin'),
('Which TV show set in Los Angeles follows a dysfunctional family running a banana stand company?', (SELECT media_id FROM media WHERE title = 'Arrested Development'), 14, 'A', 'Arrested Development', 'Entourage', 'Curb Your Enthusiasm', 'The O.C.', 1000, 'Admin'),
('In "The Bear," what type of restaurant does the main character take over in Chicago?', (SELECT media_id FROM media WHERE title = 'The Bear'), 15, 'C', 'A fine dining French restaurant', 'A pizza parlor', 'An Italian beef sandwich shop', 'A sushi bar', 1000, 'Admin'),
('Erik Larson''s "The Devil in the White City" is set during which Chicago world event?', (SELECT media_id FROM media WHERE title = 'The Devil in the White City'), 15, 'B', 'The 1933 World''s Fair', 'The 1893 World''s Columbian Exposition', 'The 1968 Democratic Convention', 'The 1919 Black Sox Scandal', 1000, 'Admin'),
('The long-running medical TV drama "ER" is set in a hospital in which city?', (SELECT media_id FROM media WHERE title = 'ER'), 15, 'A', 'Chicago', 'New York', 'Los Angeles', 'Boston', 1000, 'Admin'),
('In "Breakfast at Tiffany''s," which famous New York jewelry store does Holly Golightly visit?', (SELECT media_id FROM media WHERE title = 'Breakfast at Tiffanys'), 1, 'C', 'Cartier', 'Harry Winston', 'Tiffany & Co.', 'Van Cleef & Arpels', 1000, 'Admin'),
('In "The Great Gatsby," the lavish parties take place in which fictional area near New York City?', (SELECT media_id FROM media WHERE title = 'The Great Gatsby'), 1, 'B', 'Manhattan', 'West Egg Long Island', 'The Hamptons', 'Brooklyn Heights', 1000, 'Admin'),
('In "Seinfeld," what is the name of the coffee shop where the characters frequently meet?', (SELECT media_id FROM media WHERE title = 'Seinfeld'), 1, 'D', 'Central Perk', 'The Peach Pit', 'Pop''s Diner', 'Monk''s Cafe', 1000, 'Admin'),
('Anne Frank and her family hid in a secret annex in which city during World War II?', (SELECT media_id FROM media WHERE title = 'The Diary of Anne Frank'), 2, 'A', 'Amsterdam', 'Rotterdam', 'Utrecht', 'The Hague', 1000, 'Admin'),
('In "The Fault in Our Stars," Hazel and Augustus travel to Amsterdam to meet which reclusive author?', (SELECT media_id FROM media WHERE title = 'The Fault in our Stars'), 2, 'C', 'John Green', 'Augustus''s editor', 'Peter Van Houten', 'Augustus''s father', 1000, 'Admin'),
('The "Lord of the Rings" film trilogy was primarily filmed in which country?', (SELECT media_id FROM media WHERE title = 'Lord of the Rings'), 3, 'D', 'Australia', 'Canada', 'Iceland', 'New Zealand', 1000, 'Admin'),
('Peter Jackson''s film studio Weta Workshop is based in which city?', (SELECT media_id FROM media WHERE title = 'The Hobbit'), 3, 'C', 'Auckland', 'Christchurch', 'Wellington', 'Queenstown', 1000, 'Admin'),
('In "Bridgerton," the story is set in which city during the Regency era?', (SELECT media_id FROM media WHERE title = 'Bridgerton'), 4, 'B', 'Edinburgh', 'London', 'Bath', 'Oxford', 1000, 'Admin'),
('Sherlock Holmes'' famous fictional address is located on which London street?', (SELECT media_id FROM media WHERE title = 'Sherlock Holmes'), 4, 'A', '221B Baker Street', '10 Downing Street', '4 Privet Drive', '1 Scotland Yard', 1000, 'Admin'),
('In "Fleabag," the main character runs a small business in which city?', (SELECT media_id FROM media WHERE title = 'Fleabag'), 4, 'D', 'Edinburgh', 'Manchester', 'Bristol', 'London', 1000, 'Admin');

 INSERT INTO player (username, email, password, date_join) VALUES 
	('Avery L','a@trinity.edu','al','2026-04-13'),
    ('Dr Myers','dm@trinity.edu','dm','2026-04-29'),
    ('Dr Tuba','dt@trinity.edu','dt','2026-04-29'),
    ('Dr Horn','therealdrhorn@trinity.edu','dh','2026-04-29');

