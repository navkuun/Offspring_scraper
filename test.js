const request = require("superagent").agent();

async function get_cookies() {
  try {
    const res = await request.get(
      "https://akamapi-sv44j.ondigitalocean.app/os"
    );

    return res.body;
  } catch (err) {
    console.log(err);
    throw new Error("Could not pass cookies from API!");
  }
}

async function main() {
  const cookies = await get_cookies();
  const _abck = cookies["_abck"];
  const bm_sz = cookies["bm_sz"];
  await request
    .get("https://www.offspring.co.uk/")
    .set("cookie", `_abck=${_abck}; bm_sz=${bm_sz}`)
    .set(
      "user-agent",
      "Mozilla/5.0 (Linux; U; Android 4.4.2; en-us; SCH-I535 Build/KOT49H) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30"
    )
    .withCredentials()
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
      throw new Error("Didn't work!");
    });
}
main();
