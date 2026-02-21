#include<iostream>
#include<vector>
using namespace std;

int main()
{
    int n;
    cout<<"Enter number of elements: ";
    cin>>n;

    vector<int> X(n);
    cout<<"Enter elements: ";
    for(int i=0;i<n;i++)
        cin>>X[i];

    vector<int> dp(n,1);

    for(int i=1;i<n;i++)
    {
        for(int j=0;j<i;j++)
        {
            if(X[j]<X[i])
                dp[i]=max(dp[i],dp[j]+1);
        }
    }

    int maxLen=0;
    for(int i=0;i<n;i++)
        maxLen=max(maxLen,dp[i]);

    cout<<"Length of LIS: "<<maxLen<<endl;

    return 0;
}
