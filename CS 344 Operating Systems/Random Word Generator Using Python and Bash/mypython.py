#! /usr/bin/python

import random
import os


i = 0
mylist = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
random.seed()

while i < 3:
	filename = "file%d" % (i)
	fo = open(filename, "wr")
	
	j = 0
	while j < 10:
		str = random.choice (mylist)
		fo.write(str)
		j += 1
	fo.write("\n")
	fo.close()
	i += 1

k = 0
	
while k < 3:
	filename = "file%d" %(k)
	os.system("cat '%s'" %filename)
	k += 1
	
x = random.randint(1, 42)
y = random.randint(1, 42)
z = x * y

print "%d * %d = %d\n" % (x, y, z)