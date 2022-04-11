async function connect(){
    try {
        
        const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
        const account = handleAccountsChanged(accounts);
        return account;
    } catch (error) {
        if(error.code === 4001){
            alert('pls connect to metamask to continue');
        } else{
            console.error(error);
        }
    }
}

function handleAccountsChanged(accounts){
    if(accounts.length === 0){
        console.error("pls connect to metamask");
    }else{
        window.ethereum.on("accountsChanged", ()=> {window.location.reload()});
        return accounts[0];
    }
}

export {connect}