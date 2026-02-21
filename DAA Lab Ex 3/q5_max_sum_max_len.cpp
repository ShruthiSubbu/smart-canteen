#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;

    vector<int> a(n);
    for (int i = 0; i < n; i++)
        cin >> a[i];

    int currSum = a[0];
    int maxSum = a[0];

    int start = 0, end = 0;
    int tempStart = 0;
    int maxLen = 1;

    for (int i = 1; i < n; i++) {

        // Decide whether to extend or start new subarray
        if (currSum + a[i] < a[i]) {
            currSum = a[i];
            tempStart = i;
        } else {
            currSum += a[i];
        }

        int currLen = i - tempStart + 1;

        // Update max sum or tie-break using length
        if (currSum > maxSum ||
           (currSum == maxSum && currLen > maxLen)) {

            maxSum = currSum;
            start = tempStart;
            end = i;
            maxLen = currLen;
        }
    }

    cout << "Start Index: " << start << endl;
    cout << "End Index: " << end << endl;
    cout << "Maximum Sum: " << maxSum << endl;

    return 0;
}
