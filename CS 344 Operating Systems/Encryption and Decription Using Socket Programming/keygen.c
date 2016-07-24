#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char *argv[]) {
	int i, n;
	int keyNum = atoi(argv[1]);
	time_t t;
	char letters[28] = {'A', 'B', 'C', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', ' ', '\0'}; 
	char key[keyNum+1];
	key[keyNum] = '\0';
	FILE *fd;
	
	if (argc < 2) { //if the wrong number of arguments is givin it prints the proper program syntax
		fprintf(stderr,"usage: %s keylength [> output_file]\n", argv[0]);
		exit(0);
    }
	
	srand((unsigned) time(&t)); //Seed for rand()

	for (i = 0; i < keyNum; i++) { //loops for the length of key inputed
		n = rand() % (strlen(letters) +1);
		if (letters[n] == '\0') {
			i--;
		}
		else
			key[i] = letters[n];
	}
	
	key[i] = '\0';
	
	if (argc > 2) {
		fd = fopen (argv[3], "w"); //opent he file for writing
		if (fd == NULL) {
			perror("open");
			exit(1);
		}
		else
			fprintf(fd, "%s\n", key); //print to the file
			fclose(fd);
			
	}
	else
		fprintf(stdout, "%s\n", key); //print to the screen
	
	return 0;
}