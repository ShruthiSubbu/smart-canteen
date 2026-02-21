#include<iostream>
#include<climits>
using namespace std;

void printOptimal(int s[10][10],int i,int j)
{
    if(i==j)
    {
        cout<<"A"<<i;
        return;
    }

    cout<<"(";
    printOptimal(s,i,s[i][j]);
    printOptimal(s,s[i][j]+1,j);
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

    int m[10][10]={0};
    int s[10][10]={0};

    for(int L=2;L<=n;L++)
    {
        for(int i=1;i<=n-L+1;i++)
        {
            int j=i+L-1;
            m[i][j]=INT_MAX;

            for(int k=i;k<j;k++)
            {
                int cost=m[i][k]+m[k+1][j]
                         +p[i-1]*p[k]*p[j];

                if(cost<m[i][j])
                {
                    m[i][j]=cost;
                    s[i][j]=k;
                }
            }
        }
    }

    cout<<"Minimum multiplication cost: "<<m[1][n]<<endl;

    cout<<"Optimal Parenthesization: ";
    printOptimal(s,1,n);

    return 0;
}