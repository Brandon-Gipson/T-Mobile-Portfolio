#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <signal.h>
#include "smallsh.h"

pid_t shellPid; //Process ID for the shell

int main() {
	int cdStat = 0, fileDes, fileDes2, fileDes3, i, bgFlag, reDirFlag, statval, j, eRet; 
	char input[2048];
	char *arg[255];
	char reDir[3][10];
	char * token;
	int * homeFlag;
	int k = 0;
	homeFlag = &k; //set starting dir for cd to the HOME variable. Will never be zero again until program is ran again.
	struct sigaction catcher; //signal catchers
	pid_t cpid, spawnpid = -5;
	shellPid = getpid();
	FILE *fd, *fd2, *devNull;
	

	DynArr* bkgdPids = createDynArr(10); //Array of background processes
	catcher.sa_handler = SIG_IGN; //so you can't intterupt the shell
	catcher.sa_flags = 0;
	sigfillset(&(catcher.sa_mask));

	sigaction(SIGINT, &catcher, NULL); //so you can't intterupt the shell

	while (1) { //continues to loop until program exits
		bgFlag = 1;
		printf("\n: ");
		fflush(stdout);
		fgets(input, 2048, stdin);
		token = strtok (input, " ,\n"); //tokenizes string to select an operation
	
	
		if (!isspace(input[0]) && input[0] != '#') { //checks to see if whitespace or # was entered
			if (strcmp(token, "exit") == 0) {
				exitShell(bkgdPids, arg, fd, fd2, devNull); //passes array of backgroud process ids, files to close, and argument array
			}
	
			else if (strcmp(token, "status") == 0) {
				statusCheck(cdStat, statval); //Checks exit status of last foreground process. 
				cdStat = 0; //This makes a second status check return correctly as it would be a status on a status command
			}
	
			else if (strcmp(token, "cd") == 0) {
				token = strtok(NULL, " ,\n"); //tokenizes the path
				if(token != NULL) {
					cdStat = changeDir(token, homeFlag); //sets the exit status with the return value and changes dir
				}
				else {
					token = "";
					cdStat = changeDir(token, homeFlag);
				}
			}
	
			else {
				arg[0] = NULL; //sets array back to NULL for safety
				reDirFlag = 1; //Sets the need for redirection to false
				for (i = 0; token != NULL; i++) { //cycles through input
					if (strcmp(token, "<") == 0 || strcmp(token, ">") == 0){
						strcpy(reDir[0], token);
						token = strtok(NULL, " ,\n");
						strcpy(reDir[1], token);
						reDirFlag = 0;
						break;
					}
					else if (strcmp(token, "&") == 0 )
					{
						bgFlag = 0;
						break;
					}
					else {
						arg[i] = token;	
						token = strtok(NULL, " ,\n");
					}	
				}
				arg[i] = NULL; 

				spawnpid = fork();
				switch (spawnpid) {
					case -1:
						perror("Error creating process");
						exit(1);
						break;
					case 0:
						if (reDirFlag == 0) {
							if (strcmp(reDir[0], "<") == 0) { //input redirection
								fd = fopen(reDir[1], "r");
								if (fd == NULL)
								{
									perror("open");
									exit(1);
								}
								else
									fileDes = fileno(fd);
									dup2(fileDes, STDIN_FILENO);
									fclose(fd);
							}
							else if (strcmp(reDir[0], ">") == 0) { //ouput redirection
								fd2 = fopen (reDir[1], "a");
								if (fd2 == NULL) {
									perror("open");
									exit(1);
								}
								else
									fileDes2 = fileno(fd2);
									dup2(fileDes2, STDOUT_FILENO);
									fclose(fd2);
							}
							else if (bgFlag == 0) { //input redirection for backgroud processes.
								devNull = fopen ("/dev/null", "r");
								if (devNull == NULL) {
									perror("open");
									exit(1);
								}
								else
									fileDes3 = fileno(devNull);
									dup2(fileDes3, STDIN_FILENO);
									fclose(devNull);
							}
						}
						
						eRet = execvp(arg[0], arg);
						if (eRet == -1) {
							printf("%s: no such file or directory", arg[0]);
							fflush(stdout);
						}
						break;
					default:
						if (bgFlag == 1) {
							waitpid(spawnpid, &statval, 0);
							
						}
						else if (bgFlag == 0) {
							addDynArr(bkgdPids, spawnpid);
							printf("Background pid is %d\n", spawnpid);
							fflush(stdout);
						}
						for (j =0; j < sizeDynArr(bkgdPids); j++){
							cpid = waitpid(getDynArr(bkgdPids, j), &statval, WNOHANG);
							if (cpid != 0) {
								if(WIFEXITED(statval)){
									printf("\nBackground pid %d is done: exit vaule %d\n", cpid, WEXITSTATUS(statval));
									fflush(stdout);
									removeAtDynArr(bkgdPids, j);
								}
								else if (WIFSIGNALED(statval)) {
									printf("\nBackground pid %d is done: exit vaule %d\n", cpid, WTERMSIG(statval));
									fflush(stdout);
									removeAtDynArr(bkgdPids, j);
									}
								}
						}
						break;
				} 
			}
		}
	}

	return 0;
}
