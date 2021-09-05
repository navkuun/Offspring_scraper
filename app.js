const request = require('superagent');
const { post } = require('superagent');
const util = require('util');
const { generateReferer,generateIP,generateUserAgent } = require('./Generators/Gen');


/** Returns object with randomly generated Ip, referer and userAgent.
 * @returns {object} genObj
 */
function gens(){
    const genObj = {
        'User-Agent': generateUserAgent(),
        'X-Forwarded-For': generateIP(),
        'Referer': generateReferer(),
    };
    return genObj;
}

/** 
 * Information needed to complete an order
*/
class orderForm{
    /**
     * @param {string} productLink 
     * @param {string} email 
     * @param {'miss' | 'mrs' | 'ms' | 'mr' | 'mx'} title 
     * @param {string} firstName 
     * @param {string} lastName 
     * @param {string} phone 
     * @param {string} postcode 
     * @param {string} address_1
     * @param {string} address_2
     * @param {string} city
     */

    constructor(
        productLink, email, title, firstName, lastName, 
        phone, postcode, address1, address2, city
    ){
        this.product_link = productLink;
        this.email = email;
        this.title = title;
        this.first_name = firstName;
        this.last_name = lastName;
        this.phone = phone;
        this.postcode = postcode; 
        this.address_1 = address1;
        this.address_2 = address2;
        this.city = city;
    }
}

/**
 * @param {OrderForm} form 
 */
async function order(form){
    const prodURL= form.product_link; 
    const prodID = prodURL.substring(prodURL.lastIndexOf('/') + 1) ;

    // Allows for cookies to persist across requests.
    const agent = request.agent();

    console.log("Adding product to bag");
    await addProductToBasket(agent, prodID);

    console.log("Submitting the items in the bag")
    await submitBasket(agent, prodID);


}

/**
 * @param {request.SuperAgentStatic} agent 
 * @param {string} prodID 
 */
async function addProductToBasket(agent, prodID){
    try{
        const bagURL = 'https://www.offspring.co.uk/view/basket/add';
        await agent.post(bagURL)
            .send({productCode: prodID})
            .set(gens())
    }catch(err){
        throw new Error("Could not add product to the bag!");
    }
}

/**
 * @param {request.SuperAgentStatic} agent 
 * @param {string} product_code 
 */
async function submitBasket(agent, product_code){
    try{
        const submitURL = 'https://www.offspring.co.uk/view/component/basket/submit';
        await agent.post(submitURL)
            .send({'entries[0].quantity': 1, 'entries[0].productCode': prodID})
            .set(gens())
    }catch{
        throw new Error("Could not submit the product from the bag!")
    }
}


const form = new orderForm('https://www.offspring.co.uk/view/product/offspring_catalog/5,22/4171396722994',
'bobThebuilder@gmail.com','mr','Bob','theBuilder','07477372731','tw75lj','7 Harewood Road ISLEWORTH',
'8 Harewood Road ISLEWORTH','London');

order(form)
    .then((x) => console.log(x))
    .catch((x) => console.log(x));
