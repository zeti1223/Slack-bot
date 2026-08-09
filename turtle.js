class turtle {
  constructor() {
    this.hunger = 50; // 0-100 (100 = completely full)
    this.happiness = 50; // 0-100
    this.shellCleanliness = 100; // 0-100
    this.mood = "Just sunbathing on a sunny rock by the channel.";
    this.petCount = 0;
    this.lastPetReset = Date.now();
    this.isRacing = false;
    this.raceProgress = 0;
    this.manualSleepOverride = false; // For testing sleep mode
    this.manualWakeOverride = false; // For testing wake mode
  }

  // Healthy foods
  get healthyFoods() {
    return ['salad', 'strawberry', 'insect', 'leaf', 'fruit', 'vegetable', 'algae', 'seaweed', 'lettuce', 'greens'];
  }

  // Junk food
  get junkFoods() {
    return ['pizza', 'coffee', 'burger', 'cola', 'chocolate', 'candy', 'pastry', 'sweets'];
  }

  isHealthyFood(food) {
    return this.healthyFoods.includes(food.toLowerCase());
  }

  isJunkFood(food) {
    return this.junkFoods.includes(food.toLowerCase());
  }

  feed(food) {
    if (!food) {
      return {
        success: false,
        message: "Please provide a food! E.g: /turtle-feed salad"
      };
    }

    const foodLower = food.toLowerCase();

    if (this.isHealthyFood(foodLower)) {
      this.hunger = Math.min(100, this.hunger + 20);
      this.happiness = Math.min(100, this.happiness + 10);
      this.shellCleanliness = Math.max(0, this.shellCleanliness - 5);
      this.mood = "Happily munching on the delicious food.";
      return {
        success: true,
        message: `turtle happily munches on the ${foodLower}. [Hunger: ${this.hunger}% | Happiness: +10]`
      };
    } else if (this.isJunkFood(foodLower)) {
      this.hunger = Math.min(100, this.hunger + 5);
      this.happiness = Math.max(0, this.happiness - 5);
      this.shellCleanliness = Math.max(0, this.shellCleanliness - 15);
      this.mood = "Feeling a bit sick from the junk food...";
      return {
        success: true,
        message: `turtle is overhyped from the ${foodLower}! His shell is vibrating... [Hunger: +5% | Happiness: -5]`
      };
    } else {
      return {
        success: false,
        message: `turtle doesn't know what to do with "${food}". Try salad or insect instead!`
      };
    }
  }

  pet() {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    // Reset counter if an hour has passed
    if (now - this.lastPetReset > oneHour) {
      this.petCount = 0;
      this.lastPetReset = now;
    }

    if (this.petCount >= 5) {
      return {
        success: false,
        message: "🐢 turtle has hidden in his shell, please let him rest a bit! (Wait an hour)"
      };
    }

    this.petCount++;
    this.happiness = Math.min(100, this.happiness + 5);
    this.mood = "Happily pressing his head against you with his shell.";
    
    const remaining = 5 - this.petCount;
    return {
      success: true,
      message: `🐢 turtle happily presses his head against you! [Happiness: +5] (${remaining} more pets left this hour)`
    };
  }

  getStatus() {
    const hungerBar = this.createBar(this.hunger);
    const happinessBar = this.createBar(this.happiness);
    const shellBar = this.createBar(this.shellCleanliness);

    const hungerStatus = this.hunger > 70 ? "Well-fed" : 
                        this.hunger > 30 ? "Slightly hungry" : "Hungry";
    
    const happinessStatus = this.happiness > 70 ? "Happy" : 
                            this.happiness > 30 ? "Average" : "Sad";

    const shellStatus = this.shellCleanliness > 70 ? "Shining" : 
                        this.shellCleanliness > 30 ? "Slightly dirty" : "Dirty";

    return {
      hunger: this.hunger,
      hungerBar,
      hungerStatus,
      happiness: this.happiness,
      happinessBar,
      happinessStatus,
      shellCleanliness: this.shellCleanliness,
      shellBar,
      shellStatus,
      mood: this.mood
    };
  }

  createBar(value) {
    const filled = Math.floor(value / 10);
    const empty = 10 - filled;
    return "█".repeat(filled) + "░".repeat(empty);
  }

  isSleepTime() {
    if (this.manualWakeOverride) {
      return false; // Override sleep time, turtle is awake
    }
    if (this.manualSleepOverride) {
      return true; // Override wake time, turtle is sleeping
    }
    const hour = new Date().getHours();
    return hour >= 18 || hour < 9;
  }

  setSleep() {
    this.manualSleepOverride = true;
    this.manualWakeOverride = false;
    return {
      success: true,
      message: "turtle is now sleeping (manual override for testing). Zzz..."
    };
  }

  setWake() {
    this.manualWakeOverride = true;
    this.manualSleepOverride = false;
    return {
      success: true,
      message: "turtle is now awake (manual override for testing). Ready to play!"
    };
  }

  startRace() {
    if (this.isRacing) {
      return {
        success: false,
        message: "turtle is already racing! Wait until he finishes."
      };
    }
    this.isRacing = true;
    this.raceProgress = 0;
    return {
      success: true,
      message: "The dizzying turtle race has started! Speed: 2 cm/hour"
    };
  }

  getRaceUpdate() {
    this.raceProgress += Math.random() * 0.5;
    if (this.raceProgress >= 10) {
      this.isRacing = false;
      this.raceProgress = 0;
      return {
        finished: true,
        message: "turtle has reached the finish line! (in only 5 hours)"
      };
    }
    return {
      finished: false,
      message: `🐢 turtle is moving slowly but surely... ${this.raceProgress.toFixed(1)}/10 cm`
    };
  }
}

module.exports = { turtle };
