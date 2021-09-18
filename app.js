const { format } = require("path");
const request = require("superagent");
const util = require("util");
const {
  generateReferer,
  generateIP,
  generateUserAgent,
} = require("./Generators/Gen");

<<<<<<< HEAD
/**
 * Returns cookie object from API
 * @returns {object} res.body
=======
/** TODO:
* 1.) Pass akamai anti-bot, need to do this to be able to do everything else
* 2.) Choose delivery options, set billing address and user information
* 3.) Handle payment processing
*/



/** Returns object with randomly generated Ip, referer and userAgent.
 * @returns {object} genObj
>>>>>>> 75fff809921fd77ac047104939aeab1485395cd0
 */
async function get_cookies(agent) {
  try {
    const res = await agent.get("https://akamapi-sv44j.ondigitalocean.app/os");

    return res.body;
  } catch (err) {
    console.log(err);
    throw new Error("Could not pass cookies from API!");
  }
}

/**
 * Information needed to complete an order
 */
class orderForm {
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
   * @param {'collect' | 'standarduk'}
   */

  constructor(
    productLink,
    email,
    title,
    firstName,
    lastName,
    phone,
    postcode,
    address1,
    address2,
    city,
    deliveryMethod
  ) {
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
    this.delivery_method = deliveryMethod;
  }
}

/**
 * @param {OrderForm} information form
 */
<<<<<<< HEAD
async function order(form) {

  const prodURL = form.product_link;
  const prodID = prodURL.substring(prodURL.lastIndexOf("/") + 1);

  // Allows for cookies to persist across requests.
  const agent = request.agent();

  console.log("Adding product to bag");
  await addProductToBasket(agent, prodID);

  console.log("Setting delivery method");
  await choosingDeliveryMethod(agent, form.delivery_method);

  console.log("Setting the billing address from form info");
  await setBillingAddress(agent, form);
  
}
=======
async function order(form){
    const prodURL= form.product_link; 
    // Noticed that the product id always came after the last forward slash
    // So wrote this to get that ID, no need to do a get req
    const prodID = prodURL.substring(prodURL.lastIndexOf('/') + 1) ;
    
    // Allows for cookies to persist across requests.
    const agent = request.agent();
    
    // Generates 403 - ACCESS DENIED, needs to get past the Akamai anit-bot that enable the _acbk cookie
    console.log("Adding product to bag");
    await addProductToBasket(agent, prodID);
    // Unable to reach this point without previous denial being fixed
    console.log("Submitting the items in the bag")
    await submitBasket(agent, prodID);
	
	// 
>>>>>>> 75fff809921fd77ac047104939aeab1485395cd0

/**
 * @param {request.SuperAgentStatic} agent
 * @param {string} prodID
 */
async function addProductToBasket(agent, prodID) {
  try {
    const bagURL = "https://www.offspring.co.uk/view/basket/add";
    const cookies = await get_cookies(agent); // obj containing various cookies
    const _abck = cookies["_abck"]; // gets the _abck cookie from cookies obj
    const bm_sz = cookies["bm_sz"]; // gets bm_sz cookie from cookies obj
    await agent
      .post(bagURL)
      .set("cookie", `_abck=${_abck}; bm_sz=${bm_sz}`)
      .set("user-agent", generateUserAgent()) // gets random mobile user agent
      .set("referer", "https://www.offspring.co.uk")
      .send({ productCode: 4279103590, wishlist: false }); // data that is being sent
  } catch (err) {
    throw new Error("Could not add product to the bag!");
  }
}

/**
 * @param {request.SuperAgentStatic} agent 
 * @param {string} method 
 */
<<<<<<< HEAD
async function choosingDeliveryMethod(agent, method) {
  try {
    switch (method) {
      case "standarduk":
        setDeliveryMethod(agent, "standarduk");
        break;
      case "collect":
        setDeliveryMethod(agent, "collect");
        break;
      default:
        throw new Error("Could not choose the sdelivery method!");
=======
async function addProductToBasket(agent, prodID){
    try{
        const bagURL = 'https://www.offspring.co.uk/view/basket/add';
        await agent.post(bagURL)
            .send({productCode: prodID}) // Adds to bag
            .set(gens())
    }catch(err){
        throw new Error("Could not add product to the bag!");
>>>>>>> 75fff809921fd77ac047104939aeab1485395cd0
    }
  } catch {
    throw new Error("Could not choose the delivery method!");
  }
}

/** Submits all the items in the bag to checkout
 * The website makes you add items to the bag -> then move securely to checkout 
 * @param {request.SuperAgentStatic} agent 
 * @param {string} deliveryMethod 
 */
<<<<<<< HEAD
async function setDeliveryMethod(agent, deliveryMethod) {
  try {
    const deliveryURL = "https://www.offspring.co.uk/view/component/singlepagecheckout/setDeliveryMode";
    const cookies = await get_cookies(agent); // obj containing various cookies
    const _abck = cookies["_abck"]; // gets the _abck cookie from cookies obj
    const bm_sz = cookies["bm_sz"];

    agent
      .post(deliveryURL)
      .set("cookie", `_abck=${_abck}; bm_sz=${bm_sz}`)
      .set("user-agent", generateUserAgent()) // gets random mobile user agent
      .set("referer", "https://www.offspring.co.uk")
      .send({ deliveryModeCode: deliveryMethod }); // data that is being sent
  } catch {
    throw new Error("Could not set standard delivery!");
  }
=======
async function submitBasket(agent, product_code){
    try{
        const submitURL = 'https://www.offspring.co.uk/view/component/basket/submit';
        await agent.post(submitURL)
            .send({'entries[0].quantity': 1, 'entries[0].productCode': prodID}) // Need to scrape the CSRF token from website and add to this(I think)
            .set(gens())
    }catch{
        throw new Error("Could not submit the product from the bag!")
    }
>>>>>>> 75fff809921fd77ac047104939aeab1485395cd0
}

/**
 * @param {request.SuperAgentStatic} agent
 * @param {OrderForm}
 */

async function setBillingAddress(agent, form){

  try{
  const req = {
    email: form.email,
    title: form.title,
    titleCode: form.title,
    phone: form.phone,
    firstName: form.first_name,
    lastName: form.last_name,
    companyName: "",
    line1: form.address_1,
    line2: form.address_2,
    town: form.city,
    postalCode: form.postcode,
    country: "GB",
    defaultAddress: "true",
  };

  const billingAddressURL= "https://www.offspring.co.uk/view/component/singlepagecheckout/addEditDeliveryAddress";

  const cookies = await get_cookies(agent); // obj containing various cookies

  const _abck = cookies["_abck"]; // gets the _abck cookie from cookies obj
  const bm_sz = cookies["bm_sz"];
  agent
    .post(billingAddressURL)
      .set("cookie", `_abck=${_abck}; bm_sz=${bm_sz}`)
      .set("user-agent", generateUserAgent()) // gets random mobile user agent
      .set("referer", "https://www.offspring.co.uk")
      .send(req)
  }catch{
    throw new Error("Could not set the billing address information!")
  }
}

const 
const form = new orderForm(
  "https://www.offspring.co.uk/view/product/offspring_catalog/5,22/4171396722994",
  "bobThebuilder@gmail.com",
  "mr",
  "Bob",
  "theBuilder",
  "07477372731",
  "tw75lj",
  "7 Harewood Road ISLEWORTH",
  "8 Harewood Road ISLEWORTH",
  "London"
);

order(form)
  .then((x) => console.log(x))
  .catch((x) => console.log(x));
