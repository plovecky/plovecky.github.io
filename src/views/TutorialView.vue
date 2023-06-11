<script setup>
</script>
<template>
    <div>
        <h1 class="text-center mb-5">How to add Ticket to MetaMask wallet? </h1>
        <div class="row">
            <div class="col-8">
                <p>To add Ticket to your MetaMask wallet, choose card NFTs and click on "Import NFTs". </p>
                <p>Next, fill in the form for NFT import. 
                    As address, fill in the address of this smart contract, 
                    and Token ID field fill in with the Id of your Ticket.</p>
                <p>Address of this smart contract is: {{ contractAddress }}</p>
                <p>
                WARNING: <br>
                This action is not always available immediately after buying a ticket,
                because it sometimes takes a while to store ticket metadata.
                </p>
            </div>
           
            <img src="../assets/import.png" alt="Image for Import NFTs" class="col-4">
        </div>
        
    </div>

</template>
<script>
     export default {
        data() {
        return { 
            contractAddress: ""
        }

        },
        mounted(){
            this.contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS
        }
    }      
    
</script>
