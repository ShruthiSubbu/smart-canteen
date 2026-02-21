#include<iostream>
#include <climits>
using namespace std;

int main() {
    int arr[] = {13,-3,-25,20,-3,-16,-23,18,20,-7,12,-5,-22,15,-4,7};
    int n = 16;

    int maxSum = INT_MIN;
    int start = 0, end = 0;

    for(int i = 0; i < n; i++) {
        int currSum = 0;
        for(int j = i; j < n; j++) {
            currSum += arr[j];
            if(currSum > maxSum) {
                maxSum = currSum;
                start = i;
                end = j;
            }
        }
    }

    cout << "Start Index: " << start << endl;
    cout << "End Index: " << end << endl;
    cout << "Maximum Sum: " << maxSum << endl;

    return 0;
}
