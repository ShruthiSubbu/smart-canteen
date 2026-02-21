#include<iostream>
#include<vector>
#include<climits>
using namespace std;

int rodCutRecursive(vector<int>& price,int n)
{
    if(n==0)
        return 0;

    int max_val=INT_MIN;

    for(int i=1;i<=n;i++)
    {
        max_val=max(max_val,price[i-1]+rodCutRecursive(price,n-i));
    }

    return max_val;
}

int main()
{
    int n;
    cout<<"Enter length of rod: ";
    cin>>n;

    vector<int> price(n);
    cout<<"Enter prices from length 1 to "<<n<<": ";
    for(int i=0;i<n;i++)
        cin>>price[i];

    cout<<"Maximum revenue: "<<rodCutRecursive(price,n);

    return 0;
}