#include <iostream>
#include <fstream>
#include <vector>
#include <limits>
#include <ctime>
using namespace std;

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

int maxCrossSum(const vector<int>& a, int l, int m, int h, int& s, int& e) {
    int sum = 0, leftSum = INT_MIN, rightSum = INT_MIN;
    int start = m, end = m + 1;

    for (int i = m; i >= l; i--) {
        sum += a[i];
        if (sum > leftSum) {
            leftSum = sum;
            start = i;
        }
    }

    sum = 0;
    for (int i = m + 1; i <= h; i++) {
        sum += a[i];
        if (sum > rightSum) {
            rightSum = sum;
            end = i;
        }
    }

    s = start;
    e = end;
    return leftSum + rightSum;
}

int maxSubArray(const vector<int>& a, int l, int h, int& s, int& e) {
    if (l == h) {
        s = e = l;
        return a[l];
    }

    int m = (l + h) / 2;
    int ls, le, rs, re, cs, ce;

    int leftSum = maxSubArray(a, l, m, ls, le);
    int rightSum = maxSubArray(a, m + 1, h, rs, re);
    int crossSum = maxCrossSum(a, l, m, h, cs, ce);

    if (leftSum >= rightSum && leftSum >= crossSum) {
        s = ls; e = le;
        return leftSum;
    } else if (rightSum >= leftSum && rightSum >= crossSum) {
        s = rs; e = re;
        return rightSum;
    } else {
        s = cs; e = ce;
        return crossSum;
    }
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        cout << "Usage: ./q2 <input_file>\n";
        return 1;
    }

    ifstream fin(argv[1]);
    if (!fin) {
        cout << "Error opening file.\n";
        return 1;
    }

    int n;
    fin >> n;
    if (n <= 0) {
        cout << "Invalid array size.\n";
        return 1;
    }

    vector<int> a(n);
    for (int i = 0; i < n; i++) {
        fin >> a[i];
    }

    clock_t t;

    // Only run naive for n <= 10000
    if (n <= 10000) {
        t = clock();
        int naiveSum = naive(a);
        cout << "Naive Max Sum: " << naiveSum << endl;
        cout << "Naive Time: " << (double)(clock() - t) / CLOCKS_PER_SEC << " sec\n";
    } else {
        cout << "Naive skipped (n = " << n << " is too large for O(n²))\n";
    }

    int start, end;
    t = clock();
    int maxSum = maxSubArray(a, 0, n - 1, start, end);
    cout << "Divide & Conquer Time: " << (double)(clock() - t) / CLOCKS_PER_SEC << " sec\n";

    cout << "Start Index: " << start << endl;
    cout << "End Index: " << end << endl;
    cout << "Maximum Sum: " << maxSum << endl;

    return 0;
}