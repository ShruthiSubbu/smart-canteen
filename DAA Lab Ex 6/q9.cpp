#include<iostream>
#include<string>
using namespace std;

int LCS_First(string X,string Y,int i,int j)
{
    if(i==X.length()||j==Y.length())
        return 0;

    if(X[i]==Y[j])
        return 1+LCS_First(X,Y,i+1,j+1);
    else
        return max(LCS_First(X,Y,i+1,j),
                   LCS_First(X,Y,i,j+1));
}

int main()
{
    string X,Y;
    cout<<"Enter string X: ";
    cin>>X;
    cout<<"Enter string Y: ";
    cin>>Y;

    int ans=LCS_First(X,Y,0,0);

    cout<<"Length of LCS (First Position Check): "<<ans<<endl;

    return 0;
}
