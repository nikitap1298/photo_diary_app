# Docs

## Entities and Relationships

### There are 3 tables for now:

* users
* diaries
* diary_content

### Relationships:

* Users table and diaries table have many-to-many relationship (user can be associated with multiple diaries. Diary could be shared between multiple users).
* Diaries table and diary content table have one-to-many relationship (one diary can have multiple content entries, while each content entry can be associated with only one diary).
* Diary Content and Users have many-to-one relationship (one user can have multiple content. Each content may be associated with multiple Users). I think it's not necessary to create this relationship because Doctrine will understand this based on previous relationships.

### Users Table contains columns:

* userID INT AUTO_INCREMENT PRIMARY KEY
* userName VARCHAR (255) NOT NULL
* email VARCHAR (255) NOT NULL
* password VARCHAR (255) NOT NULL
* verified Bool NOT NULL
* createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
* diaries (Collection). Created by Doctrine after making a relationship between User and Diary Entities.

### Diaries Table contains columns:

* diaryID INT AUTO_INCREMENT PRIMARY KEY
* owner INT NOT NULL
* image BLOB
* title VARCHAR (255) NOT NULL
* description VARCHAR (255)
* numberOfUsers INT NOT NULL
* createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
* closedAt TIMESTAMP
* users (Collection). Created by Doctrine after making a relationship between User and Diary Entities.
* diaryContent (Collection). Created by Doctrine after making a relationship between Diary and DiaryContent Entities.

### Diary Content Table contains columns:

* diaryContentID INT AUTO_INCREMENT PRIMARY KEY
* text VARCHAR (255)
* image BLOB
* createdAt TIMESTAMP
* latitude DOUBLE
* longitude DOUBLE
* diary (Collection). Created by Doctrine after making a relationship between Diary and DiaryContent Entities.
* senderID INT NOT NULL
* user. Created by Doctrine after making a relationship between User and DiaryContent Entities.