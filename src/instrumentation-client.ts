import { initBotId } from "botid/client/core";

// BotID (invisible CAPTCHA, Basic tier = free) client init. Registers the
// protected endpoints so the browser attaches a challenge solution to these
// requests; the server verifies via checkBotId() in the route handler.
initBotId({
  protect: [{ path: "/api/contact", method: "POST" }],
});
