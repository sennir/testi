DROP DATABASE IF EXISTS HealthDiary;
CREATE DATABASE HealthDiary;
USE HealthDiary;

-- Create a table for users
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create a table for diary entries
CREATE TABLE DiaryEntries (
    entry_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    entry_date DATE NOT NULL,
    mood VARCHAR(50),
    weight DECIMAL(5,2),
    sleep_hours INT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- ALTER example, adding a new column to existing table
ALTER TABLE Users ADD COLUMN user_level VARCHAR(10) DEFAULT 'regular';

-- Inserting a single record, without specifying column names
INSERT INTO Users VALUES (1, 'johndoe', 'temp-pw-1', 'johndoe@example.com', null, 'regular');

-- Iserting multiple user rows at once
INSERT INTO Users (username, password, email, created_at, user_level) VALUES
  ('janedoe', 'temp-pw-2', 'janedoe@example.com', '2024-01-02 10:00:00', 'admin'),
  ('mike_smith', 'temp-pw-3', 'mike@example.com', '2024-01-03 11:00:00', 'moderator');

-- Example when FK constraint fails (if user_id 15 does not exist)
INSERT INTO DiaryEntries (user_id, entry_date, mood, weight, sleep_hours, notes, created_at) VALUES
  (15, '2024-01-10', 'Happy', 70.5, 8, 'Had a great day, felt energetic', '2024-01-10 20:00:00');

-- Inserting multiple diary entries
INSERT INTO DiaryEntries (user_id, entry_date, mood, weight, sleep_hours, notes, created_at) VALUES
  (1, '2024-01-10', 'Happy', 70.5, 8, 'Had a great day, felt energetic', '2024-01-10 20:00:00'),
  (1, '2024-01-11', 'Tired', 70.2, 6, 'Long day at work, need rest', '2024-01-11 20:00:00'),
  (2, '2024-01-10', 'Stressed', 65.0, 7, 'Busy day, a bit stressed out', '2024-01-10 21:00:00');
--- Query examples

-- Select all columns from the DiaryEntries table:
SELECT * FROM DiaryEntries;

-- Select all media items for a specific user:
SELECT * FROM DiaryEntries WHERE user_id = 2;

-- Select usernames and emails from the Users table:
SELECT username, email FROM Users;

-- Select the 2 newest diary entries:
SELECT * FROM DiaryEntries ORDER BY created_at DESC LIMIT 2;

-- Find users with a username starting with 'J':
SELECT * FROM Users WHERE username LIKE 'J%';

-- Select users created after a certain date:
SELECT * FROM Users WHERE created_at > '2024-01-01';



-- "cartesian product" of two tables:
SELECT * FROM Users, DiaryEntries;

-- Select all columns from both tables where user_id matches:
SELECT * FROM Users, DiaryEntries WHERE Users.user_id = DiaryEntries.user_id;

-- Select all diary entries along with the username of the owner using a (inner) join:
SELECT DiaryEntries.*, Users.username
  FROM DiaryEntries
  JOIN Users ON DiaryEntries.user_id = Users.user_id;

-- Select all diary entries along with the username where the mood is 'Happy':
SELECT DiaryEntries.*, Users.username
  FROM DiaryEntries
  JOIN Users ON DiaryEntries.user_id = Users.user_id
  WHERE DiaryEntries.mood = 'Happy';

-- Select all diary entries and all users whether they have diary entries or not.
SELECT
  Users.user_id,
  Users.username,
  DiaryEntries.entry_id,
  DiaryEntries.entry_date,
  DiaryEntries.mood,
  DiaryEntries.notes
FROM
  Users
LEFT OUTER JOIN DiaryEntries
  ON Users.user_id = DiaryEntries.user_id;


-- Change user_level of user with id 1 to 'admin'
UPDATE Users SET user_level = 'admin' WHERE user_id = 1;

-- Change mood of entry with id 1 to 'Outstanding'
UPDATE DiaryEntries SET mood = 'Outstanding' WHERE entry_id = 1;

-- Delete a diary entry
DELETE FROM DiaryEntries WHERE entry_id = 2;
