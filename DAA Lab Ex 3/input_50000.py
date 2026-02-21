import random
n = 50000
with open("input_50000.txt", "w") as f:
    f.write(str(n) + "\n")
    for _ in range(n):
        f.write(str(random.randint(-100, 100)) + " ")
print("Generated input_50000.txt")