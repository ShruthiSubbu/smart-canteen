#include <iostream>

#include <vector>

#include <climits>

using namespace std;


int rodCutting(vector<int>& prices, int n) {

vector<int> dp(n+1);

dp[0] = 0;


for (int i = 1; i <= n; i++) {

int maxPrice = INT_MIN;

for (int j = 1; j <= i; j++) {

maxPrice = max(maxPrice, prices[j-1] + dp[i-j]);

}

dp[i] = maxPrice;

}


return dp[n];

}


int main() {

int n;

cout << "Enter the length of the rod: ";

cin >> n;


vector<int> prices(n);

cout << "Enter the prices for each possible length (separated by spaces): ";

for (int i = 0; i < n; i++) {

cin >> prices[i];

}


int maxRevenue = rodCutting(prices, n);

cout << "Maximum revenue: " << maxRevenue << endl;


return 0;

}