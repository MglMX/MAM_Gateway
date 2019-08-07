
const Mam = require('@iota/mam')
const { asciiToTrytes, trytesToAscii } = require('@iota/converter')

// Publish to tangle
const publish = async (mamState,packet) => {
    // Create MAM Payload - STRING OF TRYTES
    const trytes = asciiToTrytes(JSON.stringify(packet))
    const message = Mam.create(mamState, trytes)

    // Save new mamState
    mamState = message.state

    // Attach the payload
    await Mam.attach(message.payload, message.address, 3, 9)
    
    return message
}

const fetchFromRoot = async (root,secret) => {
    
    const mode = 'restricted'
    
    let mamState = Mam.init({provider : 'https://nodes.devnet.iota.org:443'},null,2)

    //Set channel mode to restricted
    mamState = Mam.changeMode(mamState,mode,secret)

    const response = await Mam.fetchSingle(root, mode, secret)
   
    
    return trytesToAscii(response.payload)
}

const initMAMState = async(seed,secret) => {
      
      const mode = "restricted";
      const provider = "https://nodes.devnet.iota.org:443";
          
      let mamState = Mam.init(
        { provider},
        seed,
        2
      );
  
      //Set channel mode to restricted
      mamState = Mam.changeMode(mamState, mode, secret);
  
      return mamState;

}

module.exports = {
    publish, initMAMState, fetchFromRoot
}