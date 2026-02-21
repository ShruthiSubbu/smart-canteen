#include <iostream>
#include <vector>
#include <queue>
#include <unordered_map>
#include <cmath>
#include <string>
using namespace std;

using namespace std;

struct Node{
    char ch;
    int freq;
    Node *left,*right;

    Node(char c,int f){
        ch=c; freq=f;
        left=right=NULL;
    }
    Node(Node* l,Node* r){
        ch='\0';
        freq=l->freq + r->freq;
        left=l; right=r;
    }
};

struct cmp{
    bool operator()(Node* a,Node* b){
        return a->freq > b->freq;
    }
};

void buildCodes(Node* root,string code,unordered_map<char,string>& codes){
    if(!root) return;
    if(!root->left && !root->right){
        codes[root->ch]=code;
    }
    buildCodes(root->left,code+"0",codes);
    buildCodes(root->right,code+"1",codes);
}

unordered_map<char,string> huffman(unordered_map<char,int>& freq){
    priority_queue<Node*,vector<Node*>,cmp> pq;
    for(auto &p:freq){
        pq.push(new Node(p.first,p.second));
    }

    if(pq.size()==1){
        unordered_map<char,string> codes;
        codes[pq.top()->ch]="0";
        return codes;
    }

    while(pq.size()>1){
        Node* a=pq.top(); pq.pop();
        Node* b=pq.top(); pq.pop();
        pq.push(new Node(a,b));
    }

    unordered_map<char,string> codes;
    buildCodes(pq.top(),"",codes);
    return codes;
}
int main(){
    int n,Lmax;
    cin>>n>>Lmax;

    vector<char> sym(n);
    vector<int> freq(n);
    unordered_map<char,int> mp;

    for(int i=0;i<n;i++){
        cin>>sym[i]>>freq[i];
        mp[sym[i]]=freq[i];
    }

    if(Lmax < ceil(log2(n))){
        cout<<"Not possible\n";
        return 0;
    }

    auto codes=huffman(mp);

    long long W=0;
    cout<<"Codes:\n";
    for(auto &p:codes){
        if(p.second.length()>Lmax){
            cout<<"Not possible\n";
            return 0;
        }
        cout<<p.first<<" : "<<p.second<<"\n";
        W+=mp[p.first]*p.second.length();
    }

    cout<<"Weighted Path Length = "<<W<<"\n";
    return 0;
}
