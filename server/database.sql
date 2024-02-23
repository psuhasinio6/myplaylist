CREATE DATABASE pernplaylist;

CREATE TABLE playlist(
    song_id SERIAL PRIMARY KEY,
    description VARCHAR(255)
)



CREATE DATABASE jwtauth;

--set extention
CREATE TABLE users (
    user_id uuid PRIMARY KEY DEFAULT 
    uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);


-- inserting fake users

INSERT INTO users (user_name, user_email,user_password) VALUES ('suhasini' , 'psuhasinio6@gmail.com' , 'ps@663');