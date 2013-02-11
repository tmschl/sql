USE chat;

DROP TABLE messages;

CREATE TABLE messages (user varchar(20), text varchar(140));

/* You can also create more tables, if you need them... */

/*  Execute this file from the command line by typing:
 *    mysql < schema.sql   
 *  to create the database and the tables.*/