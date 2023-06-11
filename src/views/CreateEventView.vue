<script setup>
import { useEthConnectionStore } from '@/stores/ethConnection'
import router from '../router'

</script>

<template>
    <div>
        <h1 class="text-center">Create Event</h1>
    </div>

    <!--FORM  FOR CREATING EVENT-->
    <div class="d-flex justify-content-center">
        <form class="mt-5 w-50" >
            <!--NAME OF EVENT-->
            <div class="row mb-4">
                <div class="col-auto">
                    <label>Name of event</label>
                </div>
                <div class="col-auto">
                    <input v-model="event.name" type="text" class="form-control">
                </div>
            </div>
             <!--COUNT OF TICKETS-->
            <div class="row mb-4">
                <div class="col-auto">
                    <label>Count of tickets</label>
                </div>
                <div class="col-auto">
                    <input v-model="event.countTicket" type="number" min="1" class="form-control">
               </div>
            </div>
            <!--PRICE OF TICKET-->
            <div class="row mb-4">
                <div class="col-auto">
                    <label>Price of ticket</label>
                </div>
                <div class="col-auto">
                    <input v-model="event.price" type="number" min="0" class="form-control">
                </div>
                <div class="col-auto">
                    ETH
                </div> 
            </div>
            <!--DATE OF EVENT-->
            <div class="row mb-4">
                <div class="col-auto">
                    <label>Date of event</label>
                </div>
                <div class="col-auto">
                    <input v-model="event.date" class="form-control" type="date" />
                </div>
            </div>
            <!--DATE WHEN TICKET RETURN STOP-->
            <div class="row mb-4">
                <div class="col-auto">
                    <label>Date when ticket return stop</label>
                </div>
                <div class="col-auto">
                    <input v-model="event.stopDate" class="form-control" type="date" />
                </div>
            </div>
        </form>     
    </div>
    <!--SUBMIT BUTTON-->
    <div class="row justify-content-center mt-5">
        <div class="col-auto">
            <button class="btn btn-primary" @click="submit">Create Event</button>
            <p>{{ loading }}</p>
        </div>
    </div>
</template>

<script>
    export default {

        data() {
            return{
                event: {
                    name: '',
                    countTicket: '',
                    price: '',
                    date: '',
                    stopDate: ''
                },
                loading: ""
            }
        },

        methods: {

            async submit(){

                try{
                this.loading = "Processing..."
                const store =  useEthConnectionStore()
                //FORMAT DATE
                //Date is in ms but blockchain saves in s
                let dateUnix = Date.parse(this.event.date) / 1000 
                let stopDateUnix = Date.parse(this.event.stopDate) / 1000
                //ETH TO WEI
                let weiPrice = BigInt(this.event.price * Math.pow(10,18))
                //CREATING EVENT
                let txn = await store.contract.createEvent(this.event.name, this.event.countTicket,
                                                             weiPrice, dateUnix, stopDateUnix)
                let txnResults = await txn.wait() // await for transaction to be mined
                console.log(txnResults)
                this.loading = ""
                alert("Creation was successful")
                router.push('/my-events')
                }
                catch (error){
                    this.loading = ""
                    console.log(error)
                    if(error.value = ""){
                        alert("Please fill in all fields!")
                    }
                    else if(error.code == -32603){
                        alert(error.data.data.reason)
                    }
                    else{
                        alert("Failed to create event")
                    }      
                }
            }  
        }
    }
</script>