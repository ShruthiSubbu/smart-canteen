#include <iostream>
#include <vector>
#include <climits>
#include <chrono>
using namespace std;

int rodCutting(vector<int>& price,int n,vector<int>& cuts)
{
    vector<int> dp(n+1,0);

    for(int i=1;i<=n;i++)
    {
        int max_val=INT_MIN;
        int best_cut=-1;

        for(int j=1;j<=i;j++)
        {
            int val=price[j-1]+dp[i-j];

            if(val>max_val)
            {
                max_val=val;
                best_cut=j;
            }
        }

        dp[i]=max_val;
        cuts[i]=best_cut;
    }

    return dp[n];
}

int main()
{
    int n;
    cout<<"Enter the length of the rod: ";
    cin>>n;

    vector<int> price(n);
    cout<<"Enter the prices from length 1 to "<<n<<": ";
    for(int i=0;i<n;i++)
        cin>>price[i];

    vector<int> cuts(n+1,-1);

    auto start=chrono::high_resolution_clock::now();

    int maxRevenue=rodCutting(price,n,cuts);

    auto end=chrono::high_resolution_clock::now();

    chrono::duration<double> diff=end-start;

    cout<<"Maximum revenue that can be generated: "<<maxRevenue<<endl;

    cout<<"Optimal cutting lengths: ";
    int length=n;
    while(length>0)
    {
        cout<<cuts[length]<<" ";
        length-=cuts[length];
    }
    cout<<endl;

    cout<<"Time taken is "<<diff.count()<<" seconds"<<endl;

    return 0;
}
