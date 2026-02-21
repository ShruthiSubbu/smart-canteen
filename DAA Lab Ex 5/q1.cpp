#include<iostream>
using namespace std;

int countWays(int i,int j)
{
    if(i==j)
        return 1;

    int ways=0;

    for(int k=i;k<j;k++)
    {
        ways+=countWays(i,k)*countWays(k+1,j);
    }

    return ways;
}

int main()
{
    int n;
    cout<<"Enter number of matrices: ";
    cin>>n;

    int result=countWays(1,n);

    cout<<"Number of ways to parenthesize: "<<result<<endl;

    return 0;
}