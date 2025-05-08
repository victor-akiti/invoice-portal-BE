let docuwareToken = ""
let expiryTime = 0
const axios = require("axios");

const  addDocuwareToken = async (req, res, next) => {
    if (!docuwareToken) {
        //Request a new token and pass it to the controller
        const fetchedToken = await fetchDocuwareToken()

        console.log({docuwareToken});
        console.log({fetchedToken});
        console.log({fetchedTokenData: fetchedToken?.data});
        
        
        if (fetchedToken.status === 200 && fetchedToken?.data?.access_token) {
            let currentTime = new Date()
            
            expiryTime = (currentTime.getTime()/1000) + fetchedToken?.data?.expires_in
            docuwareToken = fetchedToken?.data?.access_token
            req.docuwareToken = fetchedToken?.data?.access_token
            next() 
        }
    } else {
        //Authenticate existing token. If token is stil valid, pass it to controller, else fetch a new token
        let currentTime = new Date()
        currentTime = currentTime.getTime()/1000
        if (expiryTime < currentTime ) {
            console.log({tokenExpired: "Token has expired"});
            const fetchedToken = await fetchDocuwareToken()

            console.log({docuwareToken, fetchedToken});
            if (fetchedToken.status === 200 && fetchedToken?.data?.access_token) {
                let currentTime = new Date()
              
                expiryTime = (currentTime.getTime()/1000) + fetchedToken?.data?.expires_in
                docuwareToken = fetchedToken?.data?.access_token
                req.docuwareToken = fetchedToken?.data?.access_token
                next() 
            }
        } else {
            console.log({existingToken: docuwareToken});
            req.docuwareToken = docuwareToken
            next() 
        }
    }

    
}

const fetchDocuwareToken = () => {
    return new Promise(async (resolve, reject) => {

        // Get required authentication token for communicating with docuware
        const quote = await axios({
            method: "GET",
            url: `https://amni.docuware.cloud/DocuWare/Platform/Home/IdentityServiceInfo`,
          });
      
          const identityServiceUrl = quote.data.IdentityServiceUrl;
      
          const quote2 = await axios({
            method: "GET",
            url: identityServiceUrl + "/" + ".well-known/openid-configuration",
          });
      
          // console.log({identityServiceUrl, quote2});
      
          const body = new URLSearchParams();
          body.append("grant_type", "password");
          body.append("scope", "docuware.platform");
          body.append("client_id", "docuware.platform.net.client");
          body.append("username", process.env.DOCUWARE_USERNAME);
          body.append("password", process.env.DOCUWARE_PASSWORD);
      
          const quote4 = await axios.post(
            identityServiceUrl + "/" + "connect/token",
            body
          );

          // console.log({quote4});

          if (quote4) {
            resolve(quote4)
          } else {
            reject(null)
          }

    })
}

module.exports = {addDocuwareToken}