#include<iostream>
#include<climits>
using namespace std;

int m[10][10];
int s[10][10];

int MCM_Max(int p[],int i,int j)
{
    if(i==j)
        return 0;

    if(m[i][j]!=-1)
        return m[i][j];

    int maxCost=INT_MIN;

    for(int k=i;k<j;k++)
    {
        int cost=MCM_Max(p,i,k)
                +MCM_Max(p,k+1,j)
                +p[i-1]*p[k]*p[j];

        if(cost>maxCost)
        {
            maxCost=cost;
            s[i][j]=k;
        }
    }

    m[i][j]=maxCost;
    return maxCost;
}

void printOptimal(int i,int j)
{
    if(i==j)
    {
        cout<<"A"<<i;
        return;
    }

    cout<<"(";
    printOptimal(i,s[i][j]);
    printOptimal(s[i][j]+1,j);
    cout<<")";
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

    int result=MCM_Max(p,1,n);

    cout<<"Maximum multiplication cost: "<<result<<endl;

    cout<<"Parenthesization for maximum cost: ";
    printOptimal(1,n);

    return 0;
}