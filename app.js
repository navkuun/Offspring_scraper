const { format } = require("path");
const request = require("superagent");
const util = require("util");
const {
  generateReferer,
  generateIP,
  generateUserAgent,
} = require("./Generators/Gen");

/**
 * Returns cookie object from API
 * @returns {object} res.body
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
   * @param {'collect' | 'standarduk'} delivery methods
   * @param {'paypal' | 'creditCard'}
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
    deliveryMethod,
    paymentMethod
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
    this.payment_method = paymentMethod;
  }
}

/**
 * @param {OrderForm} information form
 */
async function order(form) {
  const prodURL = form.product_link;
  const prodID = prodURL.substring(prodURL.lastIndexOf("/") + 1);

  // Allows for cookies to persist across requests.
  const agent = request.agent();

  console.log("Adding product to bag");
  await addProductToBasket(agent, prodID);

  console.log("###SUCCESSFUL###");
  console.log("Setting delivery method");
  await choosingDeliveryMethod(agent, form.delivery_method);

  console.log("###SUCCESSFUL###");
  console.log("Setting the billing address from form info");
  await setBillingAddress(agent, form);

  console.log("###SUCCESSFUL###");
  const paymentUrl = await choosePaymentMethod(agent, form.payment_method);

  console.log(paymentUrl);
  console.log("###SUCCESSFUL###");
}

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
    console.log(err);
    throw new Error("Could not add product to the bag!");
  }
}

/**
 * @param {request.SuperAgentStatic} agent
 * @param {string} method
 */
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
        throw new Error("Could not set the delivery method!");
    }
  } catch (err) {
    console.log(err);
    throw new Error("Could not choose the delivery method!");
  }
}

/**
 * @param {request.SuperAgentStatic} agent
 * @param {string} deliveryMethod
 */
async function setDeliveryMethod(agent, deliveryMethod) {
  try {
    const deliveryURL =
      "https://www.offspring.co.uk/view/component/singlepagecheckout/setDeliveryMode";
    const cookies = await get_cookies(agent); // obj containing various cookies
    const _abck = cookies["_abck"]; // gets the _abck cookie from cookies obj
    const bm_sz = cookies["bm_sz"];

    agent
      .post(deliveryURL)
      .set("cookie", `_abck=${_abck}; bm_sz=${bm_sz}`)
      .set("user-agent", generateUserAgent()) // gets random mobile user agent
      .set("referer", "https://www.offspring.co.uk")
      .send({ deliveryModeCode: deliveryMethod }); // data that is being sent
  } catch (err) {
    console.log(err);
    throw new Error("Could not set delivery method!");
  }
}

/**
 * @param {request.SuperAgentStatic} agent
 * @param {OrderForm}
 */
async function setBillingAddress(agent, form) {
  try {
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

    const billingAddressURL =
      "https://www.offspring.co.uk/view/component/singlepagecheckout/addEditDeliveryAddress";

    const cookies = await get_cookies(agent); // obj containing various cookies

    const _abck = cookies["_abck"]; // gets the _abck cookie from cookies obj
    const bm_sz = cookies["bm_sz"]; // gets the bm_sz cookie from cookies obj
    agent
      .post(billingAddressURL)
      .set("cookie", `_abck=${_abck}; bm_sz=${bm_sz}`)
      .set("user-agent", generateUserAgent()) // gets random mobile user agent
      .set("referer", "https://www.offspring.co.uk")
      .send(req);
  } catch (err) {
    console.log(err);
    throw new Error("Could not set the billing address information!");
  }
}
/**
 *
 * @param {request.SuperAgentStatic} agent
 * @param {string} method
 */
async function choosePaymentMethod(agent, method) {
  try {
    switch (method) {
      case "paypal":
        return getPaymentUrl(agent, "worldpay_paypal");
        break;
      case "creditCard":
        return getPaymentUrl(agent, "worldpay");
        break;
      default:
        throw new Error("Could not set the payment method!");
        break;
    }
  } catch (err) {
    throw new Error("Could not choose the payment method!");
  }
}
/**
 * @param {request.SuperAgentStatic} agent
 * @param {string} paymentMethod
 * @returns {Promise<string>}
 */
async function getPaymentUrl(agent, paymentMethod) {
  try {
    const paypalURL =
      "https://www.offspring.co.uk/view/component/singlepagecheckout/continueToPaymentDetails";
    const cookies = await get_cookies(agent); // obj containing various cookies

    const _abck = cookies["_abck"]; // gets the _abck cookie from cookies obj
    const bm_sz = cookies["bm_sz"]; // gets the bm_sz cookie from cookies obj
    const res = await agent
      .post(paypalURL)
      .set("cookie", `_abck=${_abck}; bm_sz=${bm_sz}`)
      .set("user-agent", generateUserAgent()) // gets random mobile user agent
      .set("referer", "https://www.offspring.co.uk")
      .send({
        paymentMode: paymentMethod,
        emailOptIn: "false",
        newsAlerts: "false",
      });
    return res.body;
  } catch (err) {
    console.log(err);
    throw new Error("Could not find the payment url!");
  }
}

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
  "London",
  "standarduk",
  "paypal"
);

order(form)
  .then((x) => console.log(x))
  .catch((x) => console.log(x));
