class Bot {
  constructor(token) {
    this.token = token;
  }
  async sendMessage(chat, text, parse_mode, reply_to_message_id) {
    parse_mode = parse_mode || "";
    reply_to_message_id = reply_to_message_id || "";
    fetch("https://api.telegram.org/bot" + this.token + "/sendMessage", {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        chat_id: chat,
        text: text,
        parse_mode: parse_mode,
        reply_to_message_id: reply_to_message_id,
      })
    }
    )
  }
}

const webHookToken = "";
const telegramBotApiToken = "";
const bot = new Bot(telegramBotApiToken);
const salt = "";

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  if (request.url.indexOf(webHookToken) === -1) {
    return new Response('{ "code": 403 }', {
      headers: { 'content-type': 'application/json' },
    })
  }
  if (request.method == "GET") {
    return new Response('{ "code": 200 }', {
      headers: { 'content-type': 'application/json' },
    })
  }
  if (request.method == "POST") {
    if (await parseData(await request.json())) {
      return new Response('{ "code": 200 }', {
        a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3
        headers: { 'content-type': 'application/json' },
      })
    }
    return new Response('{ "code": 500 }', {
      headers: { 'content-type': 'application/json' },
    })
  }
  return new Response('NaN', {
    headers: { 'content-type': 'application/json' },
  })
}

async function parseData(msg) {
  if (msg.message !== undefined) {
    if (msg.message.text !== undefined && msg.message.text[0] === '/') {
      let command = msg.message.text.split(" ")[0]
      switch (command) {
        case "/start":
          await handleCommandStart(msg);
          break;
        case "/time":
          await handleCommandTime(msg);
          break;
        case "/set":
          await handleCommandAdd(msg);
          break;
        case "/get":
          await handleCommandGet(msg);
          break;
        case "/remove":
          await handleCommandRemove(msg);
          break;
        case "/hash":
          await handleCommandHash(msg);
          break;
        case "/ping":
          await bot.sendMessage(msg.message.chat.id, "pong");
          break;
        default:
          await handleCommandHelp(msg);
          break;
      }
    } else {
      if (msg.message.chat.type === "private") {
        await bot.sendMessage(msg.message.chat.id, JSON.stringify(msg.message, null, 2));
      }
    }
  }
  return true
}

async function handleCommandHash(msg) {
  if (msg.message.text.split(" ").length == 2) {
    const myText = new TextEncoder().encode(msg.message.text.split(" ")[1])
    const myDigest = await crypto.subtle.digest(
      {
        name: "SHA-256",
      },
      myText, // The data you want to hash as an ArrayBuffer
    )
    const hashArray = Array.from(new Uint8Array(myDigest));
    await bot.sendMessage(msg.message.chat.id, hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join(''))
  }
}

async function handleCommandAdd(msg) {
  if (msg.message.text.split(" ").length == 3) {
    await FKAD_KV.put(msg.message.text.split(" ")[1], msg.message.text.split(" ")[2]);
  }
  await bot.sendMessage(msg.message.chat.id, "OK");
}

async function handleCommandGet(msg) {
  if (msg.message.text.split(" ").length == 2) {
    const v = await FKAD_KV.get(msg.message.text.split(" ")[1]);
    if (v === null) {
      await bot.sendMessage(msg.message.chat.id, "404 Not Found");
    } else {
      await bot.sendMessage(msg.message.chat.id, v);
    }
  }
}

async function handleCommandRemove(msg) {
  if (msg.message.text.split(" ").length == 2) {
    await FKAD_KV.delete(msg.message.text.split(" ")[1]);
  }
  await bot.sendMessage(msg.message.chat.id, "OK");
}

async function handleCommandStart(msg) {
  await bot.sendMessage(msg.message.chat.id, "Hello~\n/time 获取当前时间戳\n/help 获取帮助");
}

async function handleCommandHelp(msg) {
  await bot.sendMessage(msg.message.chat.id, "/time 获取当前时间戳\n/help 获取帮助");
}

async function handleCommandTime(msg) {
  await bot.sendMessage(msg.message.chat.id, String(new Date()).valueOf() + "\n" + String((new Date()).valueOf()));
}
