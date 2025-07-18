import { ApiResposne } from "../utils/api-response.js";

const healthcheck = (req ,res)=>{
    console.log("healthcheck route hit");
    res.status(200).json(new ApiResposne(200 , {message :"Server is running"}))
}

export { healthcheck }