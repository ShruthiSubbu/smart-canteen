#include<iostream>
#include<climits>
using namespace std;

int maxRevenue(int n,int price3,int price5)
{
    if(n==0)
        return 0;

    if(n<3)
        return -n;   // penalty for wastage

    int cut3=INT_MIN;
    int cut5=INT_MIN;

    if(n>=3)
        cut3=price3+maxRevenue(n-3,price3,price5);

    if(n>=5)
        cut5=price5+maxRevenue(n-5,price3,price5);

    return max(cut3,cut5);
}

int main()
{
    int n;
    cout<<"Enter rod length (>=8): ";
    cin>>n;

    int price3,price5;
    cout<<"Enter price of length 3: ";
    cin>>price3;

    cout<<"Enter price of length 5: ";
    cin>>price5;

    cout<<"Maximum Revenue: "<<maxRevenue(n,price3,price5);

    return 0;
}