#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    int n;
    cout << "Enter number of elements: ";
    cin >> n;
    
    vector<int> arr(n);
    cout << "Enter elements:\n";
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    unordered_map<int, int> prefixMap;
    int sum = 0;
    
    for (int i = 0; i < n; i++) {
        sum += arr[i];
        
        // Case 1: subarray from index 0 to i has sum 0
        if (sum == 0) {
            cout << "Start Index: 0" << endl;
            cout << "End Index: " << i << endl;
            return 0;
        }
        
        // Case 2: sum appeared before → subarray between prev index+1 to i has sum 0
        if (prefixMap.find(sum) != prefixMap.end()) {
            cout << "Start Index: " << prefixMap[sum] + 1 << endl;
            cout << "End Index: " << i << endl;
            return 0;
        }
        
        // Store the first occurrence of this prefix sum
        prefixMap[sum] = i;
    }
    
    // No zero-sum subarray found
    cout << "Start Index: -1" << endl;
    cout << "End Index: -1" << endl;
    
    return 0;
}