import random
n = 100
with open("input_100.txt", "w") as f:
    f.write(str(n) + "\n")
    for _ in range(n):
        f.write(str(random.randint(-100, 100)) + " ")
print("File created.")