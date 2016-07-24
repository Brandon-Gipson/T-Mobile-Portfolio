#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>
#include <sys/stat.h>
#include <sys/types.h> 
#include <sys/socket.h>
#include <netinet/in.h>

void error(const char *msg)
{
    perror(msg);
    exit(1);
}

//Thanks to Joel Smith for this handy bit of code
int mod(int a, int b)
{
    int r = a % b;
    return r < 0 ? r + b : r;
}

int main(int argc, char *argv[]){ //Tons of variables
	int sockfd, childsockfd, newsockfd, newchildsockfd, portno, statval, i, fileNum;
	long int msgSize; //in case we get a very large message size
    socklen_t clilen;
    char buffer[500000];
	char messageANDkey[500000];
	char *message;
	char *key;
	char encMessage[500000];
    struct sockaddr_in serv_addr, cli_addr;
    int n;
	pid_t spawnpid = -5;
	 
    if (argc < 2) {
		fprintf(stderr,"ERROR, no port provided\n");
        exit(1);
    }
    sockfd = socket(AF_INET, SOCK_STREAM, 0); //basic server set up
    if (sockfd < 0) error("ERROR opening socket");
    bzero((char *) &serv_addr, sizeof(serv_addr));
    portno = atoi(argv[1]);
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_addr.s_addr = INADDR_ANY;
    serv_addr.sin_port = htons(portno);
    if (bind(sockfd, (struct sockaddr *) &serv_addr, sizeof(serv_addr)) < 0) 
		error("ERROR on binding");
    		
	listen(sockfd,5);
	clilen = sizeof(cli_addr);
		
	while(newsockfd = accept(sockfd, (struct sockaddr *) &cli_addr, &clilen)) { //accepts multiple connections
		if (newsockfd < 0) error("ERROR on accept");
	
		spawnpid = fork(); //fork the process and store child process in spawnpid
		switch (spawnpid) {
			case -1: //some error handling
				perror("Error creating process");
				exit(1);
				break;
			case 0: //we are in the child process
				portno = portno + 1;
				bzero(buffer, 1000);
				snprintf(buffer, sizeof portno+1, "%d", portno);
				serv_addr.sin_port = htons(portno);
				childsockfd = socket(AF_INET, SOCK_STREAM, 0);
				
				while (bind(childsockfd, (struct sockaddr *) &serv_addr, sizeof(serv_addr)) < 0) { //if the bind failed picks the next port up. Keeps going until it finds one
					portno = portno + 1;
					bzero(buffer, 1000);
					snprintf(buffer, sizeof portno+1, "%d", portno);
					serv_addr.sin_port = htons(portno);
				}
				
				n = write(newsockfd, buffer , strlen(buffer)); //sends the new port number to client
				if (n < 0) error("ERROR writing to socket");
				
				listen(childsockfd, 1);
				clilen = sizeof(cli_addr);
				
				newchildsockfd = accept(childsockfd, (struct sockaddr *) &cli_addr, &clilen);
				if (newchildsockfd < 0) error("ERROR on accept");
				
				read(newchildsockfd, &fileNum, sizeof(fileNum));
				if(fileNum == 1) { //Checks that the right client is connecting
					error("ERROR otp_enc not allowed to connect to otp_dec_d");
					exit(1);
				}
				
				msgSize = 0;
				read(newchildsockfd, &msgSize, sizeof(msgSize)); //Reads the incoming message size
			
				bzero(messageANDkey, 500000);
				n = 0;
				while(n < msgSize){ //Reads the message while under the size limit
					n += read(newchildsockfd, buffer, 1000);
					strcat(messageANDkey, buffer); //This guy was the key to larger reads
					if (n < 0) {
						error("ERROR reading from socket"); }
					if(n == 0) {break;}
				}
			
				message = strtok(messageANDkey, ","); //breaks up the received data into message and key
				key = strtok(NULL, ",");
				bzero(encMessage, 500000);
				
				for (i = 0; i < strlen(message); i++){
					if(message[i] == ' ') { //converts spaces to @ for easy decription
						message[i] = '@';
					}
					encMessage[i] = mod(((message[i]-64) - (key[i] - 64)), 27 )+64; //Basic encription using ascii values
					if(encMessage[i] == '@') { //if there is an @ left it is supposed to be a space
						encMessage[i] = ' ';
					}
				}
				
				msgSize = 0;
				msgSize = strlen(encMessage); //The size of the message to send
				write(newchildsockfd, &msgSize, sizeof(msgSize));
				n = write(newchildsockfd, encMessage , strlen(encMessage)); //Sends back encoded message to client
				if (n < 0) error("ERROR writing to socket");
				
				close(newchildsockfd);
				close(childsockfd);
				break;
			default:
				waitpid(spawnpid, &statval, 0);
				close(newsockfd);
				
				break;
		}
	}
	close(sockfd);
    return 0; 
}

