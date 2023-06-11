<script setup>
import { useEthConnectionStore } from '@/stores/ethConnection'

</script>

<template>
    <h1 class="text-center mb-5">My Tickets</h1>
    <div class="mb-5 text-center">
        <RouterLink :to="'/tutorial'">Instructions for adding tickets to your MetaMask wallet here.</RouterLink>
        <p>{{ loading }}</p> 
    </div>

    <!--DISPLAY LIST OF USER TICKETS-->    
    <div v-for="ticket in listOfTickets" class="card card-body m-3">
        <div class="row justify-content-evenly">
            <h5 class="col-auto">TicketId: {{ ticket.ticketId }}</h5>
            <h5 class="col-auto">Event: {{ ticket.event.Name }}</h5>
            <RouterLink :to="'/buy-ticket' + ticket.event.Id" class="btn btn-secondary col-auto">Buy another Ticket</RouterLink>
            <!--RETURN TICKET BUTTON-->
            <button class="btn btn-secondary col-auto" @click="returnTicket(ticket.ticketId)" >Return Ticket</button>
        </div>    
    </div>
    <div v-if="allTicketsIds.length - listOfTickets.length > 0" class="mt-5  text-center">
            <button class="btn btn-secondary" @click="loadMore">Load more</button>
    </div>
</template>

<script>

    export default {
        data(){
            return{
                listOfTickets: [],
                allTicketsIds: [],
                loading: ""   
            }            
        },

        methods: {

            async getMyTickets(){
                const store =  useEthConnectionStore() 
                let tickets = await store.contract.getMyTickets()
                console.log(tickets)
                //LOADS TICKET IDS FROM THE NEWEST
                tickets.forEach(ticket => this.allTicketsIds.unshift(Number(ticket._hex)))
                //LOADS TICKETS TO listOfTickets
                let j = 0
                for(let i = 0; i < this.allTicketsIds.length; i++){
                    if(j > 9){
                        break
                    }
                    this.loadTicket(this.allTicketsIds[i])
                    j++
                }
            },

            async loadMore(){
                const store =  useEthConnectionStore()  
                //LOADS MORE TICKETS TO listOfTickets 
                let j = 0
                for(let i = this.listOfTickets.length; i < this.allTicketsIds.length; i++){
                    if(j > 9){
                        break
                    }
                    this.loadTicket(this.allTicketsIds[i])
                    j++
                } 
                        
            }, 

            async loadTicket(id){
                const store =  useEthConnectionStore()
                //GET EVENT ID BY TICKET ID
                let eventId = await store.contract.getEventByTicket(id)
                //GET EVENT
                let event = await store.contract.getEvent(eventId)
                //LOAD TICKET WITH EVENT INFO
                let ticket = {ticketId: id, event: event}
                this.listOfTickets.push(ticket)
            },

            async returnTicket(ticketId){
                try{
                    this.allTicketsIds = [] 
                    this.listOfTickets = []
                    this.loading = "Processing..."
                    
                    const store =  useEthConnectionStore() 
                    let txn = await store.contract.returnTicket(ticketId)
                    let txnResults = await txn.wait() // await for transaction to be mined
                    console.log(txnResults)
                    this.loading = ""
                    alert("Return was successful")
                    //RELOAD LIST OF TICKETS AFTER RETURN
                    this.getMyTickets()
            }
                catch (error){
                    this.loading = ""
                    this.getMyTickets()
                    console.log(error)
                    alert("Failed to create return ticket")
                }
            }      
        },

        mounted() {
            this.getMyTickets()
        }    
    }
</script>