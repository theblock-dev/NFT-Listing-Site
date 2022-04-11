import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { NFTCard, NftPhoto } from './components/NFTCard.js';
import { NFTModal } from './components/NFTModal.js';
import { ethers } from 'ethers';
import { connect } from './helpers.js';
const axios = require("axios");

function App() {

  let initialNfts = [
    { name: "Mario", symbol: "SMWC", copies: 10, image: "https://via.placeholder.com/150" },
    { name: "Luigi", symbol: "SMWC", copies: 10, image: "https://via.placeholder.com/150" },
    { name: "KingKong", symbol: "SMWC", copies: 10, image: "https://via.placeholder.com/150" },
    { name: "Doggie", symbol: "SMWC", copies: 10, image: "https://via.placeholder.com/150" },
    { name: "Mario", symbol: "SMWC", copies: 10, image: "https://via.placeholder.com/150" },
    { name: "Luigi", symbol: "SMWC", copies: 10, image: "https://via.placeholder.com/150" },
    { name: "KingKong", symbol: "SMWC", copies: 10, image: "https://via.placeholder.com/150" },
    { name: "Doggie", symbol: "SMWC", copies: 10, image: "https://via.placeholder.com/150" }
  ]

  const [showModal, setShowModal] = useState(false);
  const [selectedNft, setSelectedNft] = useState();
  const [nfts, setNfts] = useState(initialNfts);

  useEffect(()=>{
    const init = async() =>{
      const address = await connect();
      if(address){
        getNfts(address);
      }
    }
    init();
  },[]);

  function toggleModal(i) {
    if(i>=0){
      setSelectedNft(nfts[i]);
    }
    setShowModal(!showModal);
  }

  async function getNfts(address) {
    const rpc = "https://rpc-mumbai.maticvigil.com"; //replace with alchemy or infura
    const ethersProvider  = new ethers.providers.JsonRpcProvider(rpc);

    let abi = [      
        "function symbol() public view returns(string memory)",
        "function tokenId() public view returns(uint256)",
        "function uri(uint256 _tokenId) public view returns(string memory)",
        "function balanceOfBatch(address[] accounts, uint256[] ids) public view returns(uint256[])"    
    ]

    let nftCollection = new ethers.Contract(
      "0xDc7BC07aFC3e85F5573b4073f20A239C8BD0AB13",//address
      abi,
      ethersProvider 
    )

    let numberOfNfts = (await nftCollection.tokenId()).toNumber();
    let symbol = await nftCollection.symbol();

    let accounts = Array(numberOfNfts).fill(address);
    let ids = Array.from({length: numberOfNfts}, (_, i) => i + 1);
    let copies = await nftCollection.balanceOfBatch(accounts,ids);

    let tempArray = [];
    let baseUrl = "";

    for(let i=1;i<=numberOfNfts;i++){
      if(i===1){
        let tokenURI = await nftCollection.uri(i);
        baseUrl = tokenURI.replace(/\d+.json/, "");
        let metadata = await getMetadataFromIpfs(tokenURI);
        console.log(metadata);
        metadata.symbol = symbol;
        metadata.copies = copies[i-1];
        tempArray.push(metadata);
      }else{
        let metadata = await getMetadataFromIpfs(baseUrl+`${i}.json`);
        metadata.symbol = symbol;
        metadata.copies = copies[i-1];
        tempArray.push(metadata);
      }
    }

    setNfts(tempArray);
  }

  async function getMetadataFromIpfs(tokenURI){
    let metadata = await axios.get(tokenURI);
    console.log("axios",metadata);
    return metadata.data;
  }

  return (
    <div className="App">
      <Container>
        <Title>SAM's Super Mario Collection</Title>
        <SubTitle>Rarest & Best of Super Mario World</SubTitle>
        <Grid>
          {
          nfts.map((nft,i)=>
          <NFTCard nft={nft} key={i} toggleModal={()=> toggleModal(i)}/>
          )        
          }      
        </Grid>
      </Container>
      {
        showModal && 
        <NFTModal nft={selectedNft} toggleModal={()=>toggleModal()}/>
      }
     
    </div>
  );
}

const Title = styled.h1`
  margin: 0;
  text-align: center;
`
const SubTitle = styled.h4`
  color: gray;
  margin-top: 0;
  text-align: center;
`
const Container = styled.div`
  width: 70%;
  max-width: 1200px;
  margin: auto;
  margin-top: 100px;  
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  row-gap: 40px;
  @media(max-width: 1200px){
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media(max-width: 900px){
    grid-template-columns: 1fr 1fr;
  }
  @media(max-width: 600px){
    grid-template-columns: 1fr;
  }
`
export default App;