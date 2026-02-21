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
    string S;
    cin>>S;

    unordered_map<string,int> freq;
    for(int i=0;i<S.size()-1;i++){
        freq[S.substr(i,2)]++;
    }

    priority_queue<Node*,vector<Node*>,cmp> pq;
    unordered_map<char,int> fake;

    int id=0;
    unordered_map<int,string> id2bigram;

    for(auto &p:freq){
        fake['A'+id]=p.second;
        id2bigram[id]=p.first;
        id++;
    }

    auto codes=huffman(fake);

    long long L=0;
    cout<<"Bigram Codes:\n";
    for(int i=0;i<id;i++){
        cout<<id2bigram[i]<<" : "<<codes['A'+i]<<"\n";
        L+=freq[id2bigram[i]]*codes['A'+i].length();
    }

    cout<<"Total bits = "<<L<<"\n";
    return 0;
}
