<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ethers } from "ethers"

import TicketSystem  from "./artifacts/TicketSystem.json" 

import { useEthConnectionStore } from '@/stores/ethConnection'



</script>

<template>
  <!--START OVERLAY - USER CAN USE APP ONLY AFTER CONNECTING HIS WALLET-->
  <div v-if="signer == ''" class="p-5  mt-5 bg-success text-white">
    <div class="mt-5 text-center">
      <h1>Ticket System</h1>
      <p class="m-4">To use this website, you need to connect your MetaMask wallet.</p>
      <button type="button" class="btn btn-light mb-5" @click="connectMetamask">Connect Wallet</button>
    </div>
  </div>
  <!--MENU-->
  <div v-else>
    <header>
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container">
          <RouterLink class="navbar-brand" to="/" >Ticket System</RouterLink>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <RouterLink class="nav-link" to="/">Events</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" to="/my-events">My Events</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" to="/my-tickets">My Tickets</RouterLink>
              </li>            
            </ul>
            <RouterLink type="button" class="btn btn-secondary me-3" to="/create-event">Create Event</RouterLink> 
            <a type="button" class="btn btn-danger" href="/">Disconnect Wallet</a>
          
          </div>
        </div>
      </nav>
      <!--SHOW ADDRESS OF CONNECTED WALLET-->
      <div v-if="signer != ''" class="alert alert-success text-center" role="alert">
        <div class="container">
          Connected Account:  {{ signer }}
        </div>
      </div>
    </header>

      <!--ROUTER VIEW-->
      <div class="container p-5">
        <div v-if="loaded == true">
            <RouterView />
        </div>
        <div v-else class="text-center">
            <h5>Loading ...</h5>
        </div>
      </div>

      <footer class="text-center p-5">
        <hr />
        &copy 2023 Ticket System
      </footer>
    
  </div>
</template>


<script>
  export default {
    data() {
      return { 
        signer: "",
        loaded: false
      }

    },
    methods:{
      async connectMetamask(){
           
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        this.signer = await signer.getAddress()

        const contract = new ethers.Contract(import.meta.env.VITE_CONTRACT_ADDRESS, TicketSystem.abi, signer)
        
        //SETTING PINIA STORE
        const store =  useEthConnectionStore() 
        store.setConnection(provider, signer, contract)
        
        this.loaded = true

      }
    }
  }
</script>


