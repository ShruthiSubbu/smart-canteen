#include<iostream>
#include<vector>
#include<string>
using namespace std;

vector<string> generateSubsequences(string s)
{
    vector<string> subs;
    int n=s.length();
    int total=1<<n;   // 2^n

    for(int mask=0;mask<total;mask++)
    {
        string temp="";
        for(int i=0;i<n;i++)
        {
            if(mask&(1<<i))
                temp+=s[i];
        }
        subs.push_back(temp);
    }
    return subs;
}

int main()
{
    string X,Y;
    cout<<"Enter string X: ";
    cin>>X;
    cout<<"Enter string Y: ";
    cin>>Y;

    vector<string> subX=generateSubsequences(X);
    vector<string> subY=generateSubsequences(Y);

    int maxLen=0;
    string lcs="";

    for(int i=0;i<subX.size();i++)
    {
        for(int j=0;j<subY.size();j++)
        {
            if(subX[i]==subY[j])
            {
                if(subX[i].length()>maxLen)
                {
                    maxLen=subX[i].length();
                    lcs=subX[i];
                }
            }
        }
    }

    cout<<"Longest Common Subsequence: "<<lcs<<endl;
    cout<<"Length: "<<maxLen<<endl;

    return 0;
}
