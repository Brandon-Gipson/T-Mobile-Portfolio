Brandon Gipson CS372 Project 1

Machine tested on: OSU's Flip Server using PuTTY to open two windows. One for the server and one for the client

* Brackets below are used to denote user inputs not optional inputs

Set up: To compile chatclient.c just use the standard gcc compiler. So that would be gcc chatclient.c -o [what you want to name it]
	The chatserver doesn't need to be compiled as it's interpreted as it runs.
	To start client: [the name you decided on] [the name of the host] [port number]
	To start server: chatserver.py [portnumber]

How it works: The server and client take turns chatting to each other. The client starts by picking a handle and is then prompted to 
	      type a message. After that the server can respond. Communication goes back and forth with no ability for both users to
	      be typing at the same time. Press enter to send a message. The client can type /quit to quit.

Example:

    Client:
	 Please enter your handle: George
	 George
	 > Hello server!
	 server> Hello George!
	 George
	 > /quit


     Server:
	George
	> Hello server!
	server> Hello George!