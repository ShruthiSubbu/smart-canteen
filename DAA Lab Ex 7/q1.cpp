#include<iostream>
#include<vector>
#include<climits>
using namespace std;

int rodCutting(vector<int>& price,int n)
{
    vector<int> dp(n+1);
    dp[0]=0;

    for(int i=1;i<=n;i++)
    {
        int max_val=INT_MIN;

        for(int j=1;j<=i;j++)
        {
            max_val=max(max_val,price[j-1]+dp[i-j]);
        }

        dp[i]=max_val;
    }

    return dp[n];
}

int main()
{
    vector<int> price={1,5,8,9};
    int n=4;

    cout<<"Maximum Revenue: "<<rodCutting(price,n);

    return 0;
}