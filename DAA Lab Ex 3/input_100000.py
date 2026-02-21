import random
n = 100000
with open("input_100000.txt", "w") as f:
    f.write(str(n) + "\n")
    for _ in range(n):
        f.write(str(random.randint(-100, 100)) + " ")
print("Generated input_100000.txt")