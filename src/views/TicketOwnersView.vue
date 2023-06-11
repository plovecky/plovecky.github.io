<script setup>
import { useEthConnectionStore } from '@/stores/ethConnection'

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
            
        </div>
    </div>
    
    <!--TICKET OWNERS-->
    <h2 class="text-center mb-3">Ticket owners</h2>
    <div v-if="loading">
        <h4 class="text-center">Loading...</h4>
    </div>
    <div v-else>
        <table class="table">
            <thead>
                <tr>
                <th scope="col">Ticket Id</th>
                <th scope="col">Owner Address</th>
                </tr>
            </thead>
            <tbody>
                <tr  v-for="ticket in listOfTickets">
                <td>{{ ticket.ticketId }}</td>
                <td>{{ ticket.owner }}</td>
                </tr>
            </tbody>
        </table>
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
                    countTicket: ''
                },
                
                listOfTickets: [],

                loading: false
                
                
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
                
                this.loading = true
                event.TicketsId.forEach(ticketId => this.loadTicket(Number(ticketId._hex)))
                this.loading = false

            },

            async loadTicket(id){
                const store =  useEthConnectionStore()
                //GET OWNER
                let owner = await store.contract.ownerOf(id)
                //LOAD TICKET ID WITH OWNER ADDRESS
                let ticket = {ticketId: id, owner: owner}
                this.listOfTickets.push(ticket)
            },
        },

        mounted() {
            this.getMyEvent()

        }  
    }
</script>