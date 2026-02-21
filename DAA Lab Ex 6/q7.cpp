#include<iostream>
#include<vector>
using namespace std;

int main()
{
    int m,n;
    cout<<"Enter size of X: ";
    cin>>m;
    vector<int> X(m);
    cout<<"Enter elements of X: ";
    for(int i=0;i<m;i++)
        cin>>X[i];

    cout<<"Enter size of Y: ";
    cin>>n;
    vector<int> Y(n);
    cout<<"Enter elements of Y: ";
    for(int i=0;i<n;i++)
        cin>>Y[i];

    vector<vector<int>> up(m,vector<int>(n,0));
    vector<vector<int>> down(m,vector<int>(n,0));

    int result=0;

    for(int i=0;i<m;i++)
    {
        for(int j=0;j<n;j++)
        {
            if(X[i]==Y[j])
            {
                up[i][j]=1;
                down[i][j]=1;

                for(int k=0;k<i;k++)
                {
                    for(int l=0;l<j;l++)
                    {
                        if(X[k]==Y[l])
                        {
                            if(X[k]<X[i])
                                up[i][j]=max(up[i][j],down[k][l]+1);

                            if(X[k]>X[i])
                                down[i][j]=max(down[i][j],up[k][l]+1);
                        }
                    }
                }
                result=max(result,max(up[i][j],down[i][j]));
            }
        }
    }

    cout<<"Length of Longest Common Alternating Subsequence: "<<result<<endl;

    return 0;
}
