CFLAGS = -Wall -fpic -lm -g

dynamicArray.o: dynamicArray.h dynamicArray.c
	gcc -c dynamicArray.c $(CFLAGS)
	
smallsh.o: smallsh.h smallsh.c
	gcc -c smallsh.c $(CFLAGS)
	
smallsh: smallsh.o dynamicArray.o
	gcc -o $@ smallsh.o dynamicArray.o $(CFLAGS)
	
clean:
	rm -f *.o *.gcno smallsh
