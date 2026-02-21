#include<iostream>
#include<climits>
using namespace std;

int MCM(int p[],int i,int j)
{
    if(i==j)
        return 0;

    int minCost=INT_MAX;

    for(int k=i;k<j;k++)
    {
        int cost=MCM(p,i,k)
                +MCM(p,k+1,j)
                +p[i-1]*p[k]*p[j];

        if(cost<minCost)
            minCost=cost;
    }

    return minCost;
}

int main()
{
    int n;
    cout<<"Enter number of matrices: ";
    cin>>n;

    int p[n+1];
    cout<<"Enter "<<n+1<<" dimensions: ";
    for(int i=0;i<=n;i++)
        cin>>p[i];

    cout<<"Minimum multiplication cost: "
        <<MCM(p,1,n);

    return 0;
}