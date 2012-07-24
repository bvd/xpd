xpd
===

Experimental application of book review visuals for benefit glorious foundation of expodium.

Git for Windows walkthrough: http://kylecordes.com/2008/git-windows-go

Documentation about the PHP code, see the RedBeanPHP manual.

steps to install from an empty database and what happens next
===== == ======= ==== == ===== ======== === ==== ======= ====

1. Start the index.php front controller and use the ?testbuttons=true setting (<base_url>/index.php?testbuttons=true)
NB: the div for this buttons may put an invisible layer over the normal menu, remove the setting if you need it.

! - Maybe you will at some point get an error telling you that in the database some table or view does not exist.
This is because of the genius redbean php frozen mode is not turned on. The frozen mode is the production mode.
When frozen mode is turned off, database introspection and data reflection can be done by the red bean php framework.
Go to the configuration file and set the "db_frozen"-entry to false;

2. If all went well your database will have its admin user and some related tables and records.
The page will tell you that there are no books in the database yet.

3. To add books, log in (using the configured admin user data).
After the login you can see a session and a session_user table in the db.

4. Use the "add book" button. After you refresh the page, you should have no errors.
You can now see the book table in the database.

5. In order to have a user subscribe, you need to add some book questions.
After you added some questions you will see a question table in the db.

6. Try to logout in order to test the subscription of a new user.
Because e-mail addresses have to be unique, change the admin e-mail address in the db.
(or use another mailbox you have access to for account verification by e-mail).

7. Press the "i received a book, now what" button. Go through the process.
Choose a location that will easily show distance (e.g. the pas).
See how your book appears on the map. 

8. Click the book on the map and see how it draws a line from
the expodium location to the current location of the book.

9. Add some reviews.

10. log out, change the mail address in the database again, create another user for the same book

11. comment on the reviews that are there
note that you must first submit a review before commenting

12. create another user for another book

13. comment on the reviews


