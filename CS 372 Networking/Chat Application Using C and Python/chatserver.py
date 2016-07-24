#!/usr/bin/python
import socket, sys


host = ''
port = int(sys.argv[1])
handle = "server> "

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

try: #Binds socket with some error handling
	s.bind((host, port))
except socket.error as msg:
	print 'Bind failed Error Code: ' + str(msg[0]) + ' Message ' + msg[1]
	sys.exit()

print("Server running...\nHostname: " + socket.gethostname() + "\n") #makes it easy to see host name	
	
s.listen(10) #can accept up to 10 connections at a time

while 1:
	conn, addr = s.accept() #acceptes the connection/s
	while 1: #back and forth dialog forever
		buffer = conn.recv(511)
		print buffer
	
		msg = raw_input(handle)
		print "\n"
		conn.send(handle + msg)
	
s.close()