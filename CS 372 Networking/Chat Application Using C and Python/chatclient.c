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
	
	int sockfd, newsockfd, portno, n;
    struct sockaddr_in serv_addr;
    struct hostent *server;
	char buffer[1003];
	char handle[501];
	char msg[501];
	char quit[6] = "/quit";
	
    if (argc < 3 || argc > 3) { //if the wrong number of arguments is givin it prints the proper program syntax
		perror("usage: chatclient serverhostname portnumber\n");
		exit(0);
    }
	
		
    portno = atoi(argv[2]); //grabs portnumber from command line
    sockfd = socket(AF_INET, SOCK_STREAM, 0); //creates socket to use
    
	if (sockfd < 0) {
		perror("ERROR opening socket");
		exit(1);
	}
	
	server = gethostbyname(argv[1]); //grabs hostname from command line
	
	if (server == NULL) {
		perror("ERROR, no such host\n");
        exit(0);
    }
	
	bzero((char *) &serv_addr, sizeof(serv_addr)); //Sets up our struck to send and recieve data
	serv_addr.sin_family = AF_INET;
	bcopy((char *) server->h_addr, (char *) &serv_addr.sin_addr.s_addr, server->h_length);
	serv_addr.sin_port = htons(portno);
	
	
	if (connect(sockfd,(struct sockaddr *) &serv_addr,sizeof(serv_addr)) < 0) { //connection to server
		perror("Error writing to socket");
		exit(1);
	}
	
	printf("Please enter a handle: "); //gets the users handle name
	bzero(buffer, 1003);
	fgets(buffer, 1002, stdin);
	snprintf(handle, sizeof(handle), "%s> ", buffer);
	printf("\n");
	
	
	while(1) { // Until the user quits
		printf("%s", handle);
		bzero(msg, 501);
		fgets(msg, 500, stdin);
		printf("\n");
		
		if(strncmp(msg, quit, 5) == 0) { //checks to see if the user wants to quit
			break;
		}
		
		strcpy(buffer, handle); //copies the handle to the outgoing message
		strcat(buffer, msg); //copies the message to be sent to the outgoing message
		
		n = write(sockfd, buffer, strlen(buffer)); //send message to server
		
		if (n < 0) { //Error handling
			perror("Error writing to socket");
			exit(1);
		}
		
		bzero(buffer, 1003);
		n = read(sockfd, buffer, 1002); // read servers response
		
		if (n < 0) {
			perror("Error writing to socket");
			exit(1);
		}
		
		printf("%s\n\n", buffer);
	}
	
	close(sockfd);
	return 0;
}