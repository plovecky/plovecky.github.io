<script setup>
import { useEthConnectionStore } from '@/stores/ethConnection'

</script>
<template>
    <h1 class="text-center mb-5">All Events</h1>
    <div class="container-sm row justify-content-center">
        <!--DISPLAY LIST OF EVENTS-->
        <div v-for="item in listOfEvents" class="card m-2" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">{{ item.Name }}</h5>
                <p class="">Id: {{item.Id  }}</p>
                <p class="card-text">{{ new Date(Number(item.Date._hex) * 1000).toDateString() }}</p>
                <p class="card-text"> Price: {{ item.Price / Math.pow(10,18) }} ETH</p>
                <div class="text-center">
                    <RouterLink :to="'/buy-ticket' + item.Id" class="btn btn-secondary">Buy Ticket</RouterLink>
                </div>
            </div>
        </div>
        <dv v-if="allEventsIds.length - listOfEvents.length > 0" class="text-center mt-5">
            <button class="btn btn-secondary" @click="loadMore">Load more</button>
        </dv>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                listOfEvents: [],
                allEventsIds: []
            }
        },

        methods: {
            async getEvents(){
                const store =  useEthConnectionStore()
                let eventCount = await store.contract.getEventCount()
                let eventsId = []
                //LOADS EVENT IDS FROM THE NEWEST
                for(let i = Number(eventCount)  ; i > 0; i--){
                    eventsId.push(i)
                }
                eventsId.forEach(eventId => this.allEventsIds.push(eventId))

                
                //LOADS EVENTS TO listOfEvents
                let j = 0
                for(let i = 0; i < this.allEventsIds.length; i++){
                    if(j > 8){
                        break
                    }
                    this.loadEvent(this.allEventsIds[i], store)
                    j++
                }
            },

            async loadMore(){
                const store =  useEthConnectionStore()  
                //LOADS MORE EVENTS TO listOfEvents 
                let j = 0
                for(let i = this.listOfEvents.length; i < this.allEventsIds.length; i++){
                    if(j > 8){
                        break
                    }
                    this.loadEvent(this.allEventsIds[i], store)
                    j++
                } 
                        
            }, 

            async loadEvent(id, store){
                let event = await store.contract.getEvent(id)    
                this.listOfEvents.push(event)         
            }
            
        },

        mounted() {
            this.getEvents()
        }     
    }
</script>