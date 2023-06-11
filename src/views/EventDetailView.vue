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
            <h5>Price of ticket: {{ event.price }} ETH</h5>
            <h5>Date of event: {{ event.date}}</h5>
            <h5>Stop of returning tickets: {{ event.stopDate }}</h5>
            <h5>Wtihdrawed: {{ event.withdrawed }}</h5>
            <div class="mt-4">
                <RouterLink :to="'/ticket-owners' + event.id" class="btn btn-secondary col-auto">Ticket owners</RouterLink>
            </div>
        </div>
    </div>

    <!--EVENT WITHDRAW-->
    <div class="m-5 text-center">
        <p>Event can be withdrawn after it ended</p>
        <p>Amount to withdraw reduced by fee (1% per ticket): {{ finalAmount }} ETH  <button class="btn btn-secondary ms-3" @click="withdraw">Withdraw</button></p>
        <p>{{ loading2 }}</p>
    </div>
    <hr class="m-5">

    <!--EDIT EVENT-->
    <h2 class="m-5 text-center">Edit Event</h2>
    <p class="text-center">{{ loading }}</p>
    <div class="container px-5">
        <h5>Edit dates</h5>
        <!--EVDIT DATES-->
        <div class=" mb-5">
            <div class="row my-4">
                <div class="col-auto">
                    <label>Date of event</label>
                </div>
                <div class="col-auto">
                    <input v-model="event.date" class="form-control" type="date" />
                </div>
                <div class="col-auto">
                    <button class="btn btn-primary" @click="editDate">Edit date</button>
                </div>
            </div>
            <div class="row my-4 ">
                <div class="col-auto">
                    <label>Date when ticket return stop</label>
                </div>
                <div class="col-auto">
                    <input v-model="event.stopDate" class="form-control" type="date" />
                </div>
                <div class="col-auto">
                    <button class="btn btn-primary" @click="editStopDate">Edit date</button>
                </div>
            </div>
        </div>
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
                finalAmount: 15,
                finalFee: 15,
                loading: "",
                loading2: ""
            }
        },

        methods: {

            async getMyEvent(){
                const store =  useEthConnectionStore()
                let event = await store.contract.getEvent(this.$route.params.id)
                console.log(event)
                this.event.id = event.Id
                this.event.name = event.Name
                this.event.owner = event.Owner
                this.event.sold = await store.contract.getCountOfSoldTickets(this.event.id)
                this.event.countTicket = event.MaxTicketCount
                this.event.price = event.Price / Math.pow(10,18)
                this.event.date = new Date(Number(event.Date) * 1000).toDateString()
                this.event.stopDate = new Date(Number(event.StopReturnDate) * 1000).toDateString()
                this.event.withdrawed = event.Withdrawed

                const fa = await store.contract.getFinalAmountOfWithdraw(event.Id)
                this.finalAmount = Number(fa[0])  / Math.pow(10,18)
            },

            async editDate(){
                try{
                    this.loading = "Processing..."   
                    const store =  useEthConnectionStore()
                    // Date is in ms, whereas date in blockhain is in s
                    let txn = await store.contract.setDate(this.event.id, Date.parse(this.event.date)/1000) 
                    let txnResults = await txn.wait() // await for transaction to be mined
                    this.loading = ""
                    alert("Date was edited")
                    this.getMyEvent()
                }
                catch (error){
                    this.loading = ""
                    console.log(error)
                    alert("Failed to edit date")
                }
            },

            async editStopDate(){
                try{
                    this.loading = "Processing..."    
                    const store =  useEthConnectionStore()
                    let txn = await store.contract.setStopReturnDate(this.event.id, Date.parse(this.event.stopDate)/1000)
                    let txnResults = await txn.wait() // await for transaction to be mined
                    this.loading = ""
                    alert("Date was edited")
                    this.getMyEvent()
                }
                catch (error){
                    this.loading = ""
                    console.log(error)
                    alert("Failed to edit date")
                }

            },

            async withdraw(){
                try{
                    this.loading2 = "Processing..."  
                    const store =  useEthConnectionStore()
                    let txn = await store.contract.withdraw(this.event.id)
                    let txnResults = await txn.wait() // await for transaction to be mined
                    this.loading2 = ""
                    alert("Withdraw was successful")
                    this.getMyEvent()
                }
                catch (error){
                    this.loading2 = ""
                    console.log(error)
                    alert("Failed to withdraw")
                }
            }
        },

        mounted() {
            this.getMyEvent()

        }  
    }
</script>