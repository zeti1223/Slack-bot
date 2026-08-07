# turtle - Slack Tamagotchi Bot

turtle is a virtual office turtle who lives in Slack channels. The team's common task is to keep him alive and happy!

## Commands

### `/turtle-feed [food]`

Give food to turtle. You can give him different foods:

- **Healthy foods** (salad, strawberry, insect, leaf, fruit, vegetable, algae, seaweed): Increases happiness and hunger
- **Junk food** (pizza, coffee, burger, cola, chocolate, candy, pastry): Gives a funny error message or decreases happiness

Example: `/turtle-feed salad`

### `/turtle-status`

Shows turtle's current state on a visual Slack Block card:

- Mood (Happiness)
- Hunger
- Shell cleanliness
- Current mood

### `/turtle-pet`

Interaction and petting. Increases his happiness, but if you call it more than 5 times within an hour, turtle gets bored and pulls his head back into his shell.

### `/turtle-race @colleague`

You can challenge a colleague to a super-slow turtle race. The bot sends updates for 5 minutes about the "dizzying" 2 cm/hour speed.

### `/turtle-help`

Shows all available commands.

## Extra features

### Work time logic

After 18:00 turtle automatically falls asleep, and only responds to commands with: `Zzz... (Come back tomorrow morning at 9!)`

### States

turtle follows these states:
- **Hunger**: 0-100% (100 = completely full)
- **Happiness**: 0-100%
- **Shell cleanliness**: 0-100%
- **Mood**: Changes dynamically based on interactions

## Installation and running

1. Install dependencies:

```bash
npm install
```

2. Create the `.env` file with Slack tokens:

``` env
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_APP_TOKEN=xapp-your-app-token
```

3. Start the bot:

```bash
node index.js
```

## Slack application settings

You need to create an application in the Slack Workspace with the following commands:

- `/turtle-feed [food]`
- `/turtle-status`
- `/turtle-pet`
- `/turtle-race [@colleague]`
- `/turtle-help`

Enable Socket Mode and copy the tokens to the `.env` file.
