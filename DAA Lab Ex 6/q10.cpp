#include<iostream>
#include<vector>
using namespace std;

int main()
{
    string X,Y;
    int k;

    cout<<"Enter string X: ";
    cin>>X;
    cout<<"Enter string Y: ";
    cin>>Y;
    cout<<"Enter k value: ";
    cin>>k;

    int n=X.length();
    vector<int> dp(n+1,0);

    for(int i=1;i<=n;i++)
    {
        if(X[i-1]==Y[i-1])
            dp[i]=dp[i-1];
        else
            dp[i]=dp[i-1]+1;
    }

    if(dp[n]==k)
        cout<<"X and Y are "<<k<<"-similar"<<endl;
    else
        cout<<"X and Y are NOT "<<k<<"-similar"<<endl;

    return 0;
}
