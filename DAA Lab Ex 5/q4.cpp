#include<iostream>
#include<climits>
using namespace std;

int m[10][10];

int MCM(int p[],int i,int j)
{
    if(i==j)
        return 0;

    if(m[i][j]!=-1)
        return m[i][j];

    int minCost=INT_MAX;

    for(int k=i;k<j;k++)
    {
        int cost=MCM(p,i,k)
                 +MCM(p,k+1,j)
                 +p[i-1]*p[k]*p[j];

        if(cost<minCost)
            minCost=cost;
    }

    m[i][j]=minCost;
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

    for(int i=0;i<10;i++)
        for(int j=0;j<10;j++)
            m[i][j]=-1;

    int result=MCM(p,1,n);

    cout<<"Minimum multiplication cost: "<<result<<endl;

    cout<<"\nCost Table (m[i][j]):\n";
    for(int i=1;i<=n;i++)
    {
        for(int j=1;j<=n;j++)
        {
            if(m[i][j]==-1)
                cout<<"0 ";
            else
                cout<<m[i][j]<<" ";
        }
        cout<<endl;
    }

    return 0;
}