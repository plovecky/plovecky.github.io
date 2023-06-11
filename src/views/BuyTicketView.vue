<script setup>
import { useEthConnectionStore } from '@/stores/ethConnection'

import router from '../router'

import QRCode from 'qrcode'

import { NFTStorage, File } from 'nft.storage'

import toBlob from 'canvas-to-blob'

</script>

<template>
    <h1 class="text-center">Event Details</h1>
    <!--EVENT DETAILS-->
    <div class="card m-5 p-4">
        <div class="card-body">
            <h1>{{ event.name }}</h1>
            <p>Event Id: {{event.id}} <br>
            Owner of event: {{ event.owner }}</p>
            
            <h5>Sold: {{ event.sold }} / {{ event.countTicket }}</h5>
            <h5>Price of ticket: {{ event.price / Math.pow(10,18)  }} ETH</h5>
            <h5>Date of event: {{ event.date}}</h5>
            <h5>Stop of returning tickets: {{ event.stopDate }}</h5>
        </div>
    </div>
       <!--BUY TICKET-->
    <div class="m-5 text-center">
        <button class="btn btn-secondary" @click="buyTicket">Buy ticket</button>
        <p>{{ loading }}</p>
    </div>
</template>

<script>

    export default {
        data(){
            return{
             
                event: {
                    id: '',
                    name: '',
                    owner: '',
                    sold: '',
                    countTicket: '',
                    price: '',
                    date: '',
                    stopDate: '',
                    withdrawed: ''
                },
                loading: ""
            }
        },

        methods: {

            async getMyEvent(){
                const store =  useEthConnectionStore()
                let event = await store.contract.getEvent(this.$route.params.id)
                this.event.id = event.Id
                this.event.name = event.Name
                this.event.owner = event.Owner
                this.event.sold = await store.contract.getCountOfSoldTickets(this.event.id)
                this.event.countTicket = event.MaxTicketCount
                this.event.price = event.Price
                this.event.date = new Date(Number(event.Date) * 1000).toDateString()
                this.event.stopDate = new Date(Number(event.StopReturnDate) * 1000).toDateString()
            },

            async buyTicket(){
                try{
                this.loading = "Processing..."
                const store =  useEthConnectionStore()
                const countOfReturnedTickets = await store.contract.getCountOfReturnedTickets(this.event.id)
                const countOfReturned = Number(countOfReturnedTickets._hex)

                //IF EVENT HAS RETURNED TICKETS
                if(countOfReturned > 0){
                    let txn = await store.contract.buyReturnedTicket(this.event.id, {value: this.event.price})
                    let txnResults = await txn.wait() // await for transaction to be mined
                }
                //ELSE CREATE NEW TICKET
                else{
                    //GET TICKET ID FOR GENERATING QR CODE
                    const ticketId = await store.contract.getCurrentTicketId()
                    const ticketIdN = Number(ticketId._hex)
                  
                    //CREATING QR CODE
                    const qrCode = await QRCode.toDataURL(String(ticketIdN))
                    const blob = toBlob(qrCode)
                    const file = new File([blob], "image.png", { type: "image/png"});

                    //STORING NFT METADATA
                    const NFT_STORAGE_KEY = import.meta.env.VITE_NFT_STORAGE_API_KEY
                    const client = new NFTStorage({ token: NFT_STORAGE_KEY })

                    const nft = {
                        name: "Ticket: " + String(ticketIdN),
                        image: file,
                        description: "This is ticket for event: " + this.event.name
                    }

                    const cid = await client.store(nft)
                    //EDIT URL TO REQUIRED FORM
                    const url = 'https://' + cid.ipnft + '.ipfs.dweb.link/metadata.json'
                    
                    //CREATING TICKET
                    let txn = await store.contract.buyTicket(this.event.id, url, {value: this.event.price})
                    let txnResults = await txn.wait() // await for transaction to be mined
                }

                this.loading = ""
                alert("Purchase completed")
                //REDIRECT TO My Tickets
                router.push('/my-tickets')
                }
                catch (error){
                    console.log(error)
                    alert("Purchase failed")
                    this.loading = ""
                }
            },
        },

        mounted() {
            this.getMyEvent()
        }
    }
</script>