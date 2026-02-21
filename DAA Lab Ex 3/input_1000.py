import random
n = 1000
with open("input_1000.txt", "w") as f:
    f.write(str(n) + "\n")
    for _ in range(n):
        f.write(str(random.randint(-100, 100)) + " ")
print("Generated input_1000.txt")