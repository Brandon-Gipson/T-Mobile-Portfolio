#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <sys/stat.h>
#include <signal.h>
#include <fcntl.h>
#include "dynamicArray.h" //old project from my data structures class. Makes it easier to work with dynamic arrays.

int changeDir(char *loc, int * homeFlag);
void statusCheck(int cdStat, int statval);
void exitShell(DynArr *v, char *arg[], FILE *fd, FILE *fd2, FILE *devNull);


/* Change current working directory

	param: 	loc		pointer to target path name
	post:	changes current working directory or reports error
	post:	returns 0 for success or reports error and returns 1
*/
int changeDir(char *loc, int * homeFlag){
	struct stat s;
	char path[255];

	if (*homeFlag == 0){ //first time cd is called
		path[0] = '\0';
		strcpy(path, getenv("HOME")); //sets first part of path to the home directory
		*homeFlag = 1; //Stops cd from setting path to HOME variable everytime it is called
	}
	else {
		strcpy(path, getcwd(NULL,0)); //path becomes the current working directory
	}
	
	strcat(path, "/");
	strcat(path, loc); //adds the requested destination to the end of the cwd
	
	if (stat(path, &s) == 0 && S_ISDIR(s.st_mode)) { //check to see if the dir exists
		chdir (path);
	}
	else { //if the dir does not exist prints error message
		printf("%s is not a valid directory\n", path);
		fflush(stdout);
		return 1; //return exit status of 1 if it fails
	}
	
	return 0;
}


/* Returns exit status for last ran foreground process

	param: 	cdStat	tracks wether cd errored or not
	post:	displays exit status or signal number for last ran foreground process
*/
void statusCheck(int cdStat, int statval) {
	
	if(cdStat == 1) { //Checks to see if the cd function exited with an error
		printf("exit value %d\n", cdStat);
		fflush(stdout);
	}
	
	else { //checks for any exit status from a child process
		wait(&statval);
		if(WIFEXITED(statval)) { //if the child process exited normally
			printf("exit value %d\n", WEXITSTATUS(statval)); //prints exit status
			fflush(stdout);
		}
		else if(WIFSIGNALED(statval)) { //if child process exited with signal
			printf("exit value: signal %d\n", WTERMSIG(statval)); //prints sig number
			fflush(stdout);
		}
	}
}


void exitShell(DynArr *v, char *arg[], FILE *fd, FILE *fd2, FILE *devNull) {
	pid_t childPid;
	int statval;
	
	while (!isEmptyDynArr(v)) {
		childPid = topDynArr(v);
		kill(childPid, SIGKILL);
		waitpid(childPid, &statval, 0);
		popDynArr(v);			
	}
	deleteDynArr(v);
	kill(getpid(), SIGKILL);
}