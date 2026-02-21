#include <iostream>
#include <fstream>
#include <vector>
#include <limits>
#include <ctime>
using namespace std;

// ================== 1. NAIVE O(n²) ==================
int naive(const vector<int>& a) {
    int maxSum = INT_MIN;
    int n = a.size();
    for (int i = 0; i < n; i++) {
        int sum = 0;
        for (int j = i; j < n; j++) {
            sum += a[j];
            if (sum > maxSum)
                maxSum = sum;
        }
    }
    return maxSum;
}

// ================== 2. DIVIDE & CONQUER ==================
int maxCrossSum(const vector<int>& a, int l, int m, int h) {
    // Left of mid
    int sum = 0;
    int leftSum = INT_MIN;
    for (int i = m; i >= l; i--) {
        sum += a[i];
        if (sum > leftSum)
            leftSum = sum;
    }

    // Right of mid
    sum = 0;
    int rightSum = INT_MIN;
    for (int i = m + 1; i <= h; i++) {
        sum += a[i];
        if (sum > rightSum)
            rightSum = sum;
    }

    return leftSum + rightSum;
}

int divideConquer(const vector<int>& a, int l, int h) {
    if (l == h)
        return a[l];

    int m = (l + h) / 2;

    int leftSum = divideConquer(a, l, m);
    int rightSum = divideConquer(a, m + 1, h);
    int crossSum = maxCrossSum(a, l, m, h);

    if (leftSum >= rightSum && leftSum >= crossSum)
        return leftSum;
    else if (rightSum >= crossSum)
        return rightSum;
    else
        return crossSum;
}

// ================== 3. KADANE O(n) ==================
void kadane(const vector<int>& a, int& maxSum, int& start, int& end) {
    maxSum = a[0];
    int currSum = a[0];
    start = end = 0;
    int tempStart = 0;

    for (int i = 1; i < a.size(); i++) {
        if (currSum + a[i] < a[i]) {
            currSum = a[i];
            tempStart = i;
        } else {
            currSum += a[i];
        }

        if (currSum > maxSum) {
            maxSum = currSum;
            start = tempStart;
            end = i;
        }
    }
}

// ================== MAIN ==================
int main(int argc, char* argv[]) {
    if (argc < 2) {
        cout << "Usage: ./q3 <input_file>\n";
        return 1;
    }

    ifstream fin(argv[1]);
    if (!fin) {
        cout << "Error opening file.\n";
        return 1;
    }

    int n;
    fin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++) {
        fin >> a[i];
    }

    cout << "Array size: " << n << "\n\n";

    clock_t t;

    // 1. NAIVE (skip for large n)
    if (n <= 10000) {
        t = clock();
        int naiveResult = naive(a);
        cout << "Naive Max Sum: " << naiveResult << endl;
        cout << "Naive Time: " << (double)(clock() - t) / CLOCKS_PER_SEC << " sec\n\n";
    } else {
        cout << "Naive skipped (n = " << n << " is too large for O(n²))\n\n";
    }

    // 2. DIVIDE & CONQUER
    t = clock();
    int dcResult = divideConquer(a, 0, n - 1);
    cout << "Divide & Conquer Max Sum: " << dcResult << endl;
    cout << "Divide & Conquer Time: " << (double)(clock() - t) / CLOCKS_PER_SEC << " sec\n\n";

    // 3. KADANE
    t = clock();
    int kadaneSum, start, end;
    kadane(a, kadaneSum, start, end);
    cout << "Kadane Max Sum: " << kadaneSum << endl;
    cout << "Kadane Start Index: " << start << endl;
    cout << "Kadane End Index: " << end << endl;
    cout << "Kadane Time: " << (double)(clock() - t) / CLOCKS_PER_SEC << " sec\n";

    return 0;
}
