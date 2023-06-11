import { defineStore } from 'pinia'
import { ref, computed } from 'vue'



export const useEthConnectionStore = defineStore('ethConnection', () => {
    const provider = ref(null)
    const signer = ref(null)
    const contract = ref(null)
   /*
    const doubleCount = computed(() => count.value * 2)
    function increment() {
      count.value++
    }
    */

    function setConnection(p, s, c){
        provider.value = p
        signer.value = s
        contract.value = c
    }
  
    return { provider, signer, contract, setConnection }
  })