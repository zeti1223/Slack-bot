require("dotenv").config();

const { App } = require("@slack/bolt");
const { turtle } = require("./turtle");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

const turtleInstance = new turtle();

// Helper function to check if turtle is sleeping
const checkSleepTime = () => {
  if (turtleInstance.isSleepTime()) {
    return "Zzz... (Come back tomorrow morning at 9!)";
  }
  return null;
};

// /turtle-feed [food]
app.command("/turtle-feed", async ({ command, ack, respond }) => {
  await ack();
  
  const sleepMessage = checkSleepTime();
  if (sleepMessage) {
    await respond({ text: sleepMessage });
    return;
  }

  const food = command.text.trim();
  const result = turtleInstance.feed(food);
  await respond({ text: result.message });
});

// /turtle-status
app.command("/turtle-status", async ({ ack, respond }) => {
  await ack();
  
  const sleepMessage = checkSleepTime();
  if (sleepMessage) {
    await respond({ text: sleepMessage });
    return;
  }

  const status = turtleInstance.getStatus();
  
  await respond({
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🐢 turtle's status"
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Mood:* ${status.happinessBar} ${status.happiness}% (${status.happinessStatus})`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Hunger:* ${status.hungerBar} ${status.hunger}% (${status.hungerStatus})`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Shell cleanliness:* ${status.shellBar} ${status.shellCleanliness}% (${status.shellStatus})`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Current mood:* "${status.mood}"`
        }
      }
    ]
  });
});

// /turtle-pet
app.command("/turtle-pet", async ({ ack, respond }) => {
  await ack();
  
  const sleepMessage = checkSleepTime();
  if (sleepMessage) {
    await respond({ text: sleepMessage });
    return;
  }

  const result = turtleInstance.pet();
  await respond({ text: result.message });
});

// /turtle-sleep
app.command("/turtle-sleep", async ({ ack, respond }) => {
  await ack();
  
  const result = turtleInstance.setSleep();
  await respond({ text: result.message });
});

// /turtle-wake
app.command("/turtle-wake", async ({ ack, respond }) => {
  await ack();
  
  const result = turtleInstance.setWake();
  await respond({ text: result.message });
});

// /turtle-race @colleague
app.command("/turtle-race", async ({ command, ack, respond, client }) => {
  await ack();
  
  const sleepMessage = checkSleepTime();
  if (sleepMessage) {
    await respond({ text: sleepMessage });
    return;
  }

  const opponent = command.text.trim() || "a secret competitor";
  const result = turtleInstance.startRace();
  
  if (!result.success) {
    await respond({ text: result.message });
    return;
  }

  await respond({ text: `turtle challenged: ${opponent}!\n${result.message}` });

  // Send progressive updates every 10 seconds
  let updateCount = 0;
  const maxUpdates = 30; // 5 minutes of updates at 10-second intervals
  const interval = setInterval(async () => {
    const update = turtleInstance.getRaceUpdate();
    
    try {
      await client.chat.postMessage({
        channel: command.channel_id,
        text: update.message
      });

      if (update.finished) {
        clearInterval(interval);
      }
    } catch (error) {
      if (error.data && error.data.error === 'not_in_channel') {
        console.error("Bot is not in the channel. Please add the bot to the channel to receive race updates.");
        await client.chat.postMessage({
          channel: command.user_id,
          text: "⚠️ Error: The bot needs to be added to the channel to send race updates. Please invite the bot to the channel first."
        });
      } else {
        console.error("Error sending race update:", error);
      }
      clearInterval(interval);
    }

    updateCount++;
    if (updateCount >= maxUpdates) {
      clearInterval(interval);
    }
  }, 10000); // Update every 10 seconds
});

// /turtle-help
app.command("/turtle-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`🐢 **turtle commands:**

/turtle-feed [food] - Feeding (e.g: salad, strawberry, insect, pizza)
/turtle-status - View turtle's status
/turtle-pet - Petting (increases happiness!)
/turtle-race @colleague - Super-slow turtle race
/turtle-sleep - Force turtle to sleep (for testing)
/turtle-wake - Wake turtle up (for testing)

*Tip:* After 18:00 turtle sleeps, and only responds to commands with: Zzz...`
  });
});

// Legacy command support
app.command("/turtle-ping", async ({ command, ack, respond }) => {
  await ack();
  const latency = Math.floor(Math.random() * 100) + 10;
  await respond({ text: `Pong! 🐢\nLatency: ${latency}ms` });
});

(async () => {
  await app.start();
  console.log("🐢 turtle is running!");
})();