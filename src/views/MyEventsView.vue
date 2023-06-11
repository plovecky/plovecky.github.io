<script setup>
import { useEthConnectionStore } from '@/stores/ethConnection'

</script>
<template>
    <h1 class="text-center mb-5">My Events</h1>
    <!--DISPLAY LIST OF USER EVENTS-->
    <div class="container-sm row justify-content-center">
        <div v-for="item in listOfEvents" class="card m-2" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">{{ item.Name }}</h5>
                <p class="">Id: {{item.Id  }}</p>
                <p class="card-text">{{ new Date(Number(item.Date) * 1000).toDateString() }}</p>
                <p class="card-text"> Price: {{ item.Price / Math.pow(10,18) }} ETH</p>
                <div class="text-center">
                    <RouterLink :to="'/event-detail' + item.Id" class="btn btn-secondary">Event Details</RouterLink>
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
                let eventsId = await store.contract.getMyEvents()
                //LOADS EVENTS IDS FROM THE NEWEST 
                eventsId.forEach(event => this.allEventsIds.unshift(Number(event._hex)))

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