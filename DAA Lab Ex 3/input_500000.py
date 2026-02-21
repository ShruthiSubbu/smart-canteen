import random
n = 500000
with open("input_500000.txt", "w") as f:
    f.write(str(n) + "\n")
    for _ in range(n):
        f.write(str(random.randint(-100, 100)) + " ")
print("Generated input_500000.txt")