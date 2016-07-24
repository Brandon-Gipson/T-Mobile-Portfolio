#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h> 

void error(const char *msg)
{
    perror(msg);
    exit(1);
}

int main(int argc, char *argv[]) {
	
	int sockfd, newsockfd, portno, n, i, j, fileNum = 1;
	long int msgSize = 0;
    struct sockaddr_in serv_addr;
    struct hostent *server;
	char result[200000];
    char buffer[200000];
	char message[200000];
	char key[200000];
	char localhost[1024];
	localhost[1023] = '\0';
	FILE * fd;
	
    if (argc < 4) { //if the wrong number of arguments is givin it prints the proper program syntax
		fprintf(stderr,"usage: %s plaintext key port [> output_file] [&]\n", argv[0]);
		exit(0);
    }
	
	if (!(fd = fopen(argv[1], "r"))) {
		fprintf(stderr, "Error opening file %s\n", argv[1]);
		exit(1);
	}

	n = read(fileno(fd), message, 199999); //reads in the plaintext file and stores it in message4
	if (n < 0)
		error("ERROR reading file");
	fclose(fd);
	
	for (i = 0; i < strlen(message); i++) { //Checks for invalid characters in message
		switch(message[i]) {
			case 'A' :
				break;
			case 'B' :
				break;
			case 'C' :
				break;
			case 'D' :
				break;
			case 'E' :
				break;
			case 'F' :
				break;
			case 'G' :
				break;
			case 'H' :
				break;
			case 'I' :
				break;
			case 'J' :
				break;
			case 'K' :
				break;
			case 'L' :
				break;
			case 'M' :
				break;
			case 'N' :
				break;
			case 'O' :
				break;
			case 'P' :
				break;
			case 'Q' :
				break;
			case 'R' :
				break;
			case 'S' :
				break;
			case 'T' :
				break;
			case 'U' :
				break;
			case 'V' :
				break;
			case 'W' :
				break;
			case 'X' :
				break;
			case 'Y' :
				break;
			case 'Z' :
				break;
			case ' ' :
				break;
			case '\0':
				break;
			case '\n':
				break;
			default : //if a non-valid character is found
				fprintf(stderr, "%s error: plaintext contains bad characters\n", argv[0]);
				exit(1);
		}
	}
	
	if (!(fd = fopen(argv[2], "r"))) {
		fprintf(stderr, "Error opening file %s\n", argv[1]);
		exit(1);
	}
	
	n = read(fileno(fd), key, 199999); //reads in the key file and stores it in key
	
	if (n < 0)
		error("ERROR reading file");
	fclose(fd);
	
	if (strlen(key) < strlen(message)) { //checks to see if key is too short
		fprintf(stderr, "ERROR %s is too short\n", argv[2]);
		exit(1);
	}
		
    portno = atoi(argv[3]); //port numner is the fourth argument
    sockfd = socket(AF_INET, SOCK_STREAM, 0); //creates socket to use
    
	if (sockfd < 0) 
		error("ERROR opening socket");
	
    gethostname(localhost, 1023); //grabs the localhost name
	server = gethostbyname(localhost); //sets the localhost to be the server
	
	if (server == NULL) {
		fprintf(stderr,"ERROR, no such host\n");
        exit(0);
    }
	
	bzero((char *) &serv_addr, sizeof(serv_addr)); //Sets up our struck to send and recieve data
	serv_addr.sin_family = AF_INET;
	bcopy((char *) server->h_addr, (char *) &serv_addr.sin_addr.s_addr, server->h_length);
	serv_addr.sin_port = htons(portno);
	
	if (connect(sockfd,(struct sockaddr *) &serv_addr,sizeof(serv_addr)) < 0) {
		fprintf(stderr, "ERROR could not contact otp_enc_d on port %d\n", portno);
		exit(2);
	}
	
	bzero(buffer,200000);
	
    n = read(sockfd,buffer,200000); //reads in the new port number to use
	
	if (n < 0) 
		error("ERROR reading from socket");
    
	portno = atoi(buffer); //sets portno to the new port number
    close(sockfd); //closes old connection/socket
	
	serv_addr.sin_port = htons(portno); //sets the new port
	newsockfd = socket(AF_INET, SOCK_STREAM, 0); //creates new socket to use
    
	if (sockfd < 0) 
		error("ERROR opening socket");
	
	while (connect(newsockfd,(struct sockaddr *) &serv_addr,sizeof(serv_addr)) < 0) { //new connection to same server but on new port
		
	}
	
	write(newsockfd, &fileNum, sizeof(fileNum)); //Check write to make sure connecting to correct server
	
	msgSize = strlen(message) + strlen(key); //The size of the message to send
	strcat(message, ","); //delimiter for splitting the key and message on the other side
	write(newsockfd, &msgSize, sizeof(msgSize));
	while(write(newsockfd, message, strlen(message)) < 0) {}
	while(write(newsockfd, key, strlen(key)) < 0) {}
	
	bzero(buffer,200000); //erases buffer
	bzero(result, 200000);
	msgSize = 0;
	read(newsockfd, &msgSize, sizeof(msgSize)); //Reads the incoming message size
	
	n = 0;
	while(n < msgSize){ //Reads the message while under the size limit
		n = read(newsockfd, buffer, 1000);
		strcat(result, buffer);
		if (n < 0) {
			error("ERROR reading from socket"); }
		if(n == 0) {break;}
	}
	
	if (argc > 4) { //Basically if a file was designated for ouput
		fd = fopen (argv[5], "w"); //open the file for writing
		if (fd == NULL) {
			perror("open");
			exit(1);
		}
		else
			fprintf(fd, "%s", result); //print to the file
			fclose(fd);
			
	}
	else
		fprintf(stdout, "%s", result); //print to the screen
	
	close(sockfd);
	return 0;
}