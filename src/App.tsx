import { useMemo, useState } from "react";

type Screen =
  | "setup"
  | "match"
  | "restaurant"
  | "restaurantLoading"
  | "restaurantResult"
  | "meal"
  | "mealLoading"
  | "mealResult"
  | "chat"
  | "rating"
  | "results";

type MatchProfile = {
  name: string;
  age: number;
  bio: string;
  photo: string;
};

type Restaurant = {
  name: string;
  cuisine: string;
  image: string;
};

type ChatMessage = {
  sender: "you" | "match";
  text: string;
};

const personalityOptions = ["Chill", "Ambitious", "Funny", "Deep thinker"];
const datingStyleOptions = ["Casual", "Serious", "Let's see where it goes"];

const restaurantChoices: Restaurant[] = [
  {
    name: "Sushi Place 🍣",
    cuisine: "Japanese",
    image:
      "https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Italian Bistro 🍝",
    cuisine: "Italian",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Healthy Cafe 🥗",
    cuisine: "Healthy",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Smokehouse Social 🍖",
    cuisine: "BBQ",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1400&q=80",
  },
];

const sabotagedRestaurant: Restaurant = {
  name: "Joe's Deep Fried Kitchen 🍗",
  cuisine: "Mystery Fry Lab",
  image:
    "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=1400&q=80",
};

const matchProfile: MatchProfile = {
  name: "Blake",
  age: 29,
  bio: "I love intense debates and challenging people's beliefs. If peace is your thing, we probably won't vibe.",
  photo:
    "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=1200&q=80",
};

const userChatPrompts = [
  "I think both sides have good points",
  "I prefer not to argue",
  "What do you think?",
];

const matchReplies = [
  "That's a very weak stance.",
  "Avoiding conflict is just avoiding depth.",
  "I think people say that when they haven't done the reading.",
  "Neutral takes are how bad ideas survive.",
  "You are being way too agreeable right now.",
];

const fakeLoadingLines = ["Optimizing your experience...", "Analyzing compatibility..."];

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function App() {
  const [screen, setScreen] = useState<Screen>("setup");
  const [selectedPersonalities, setSelectedPersonalities] = useState<string[]>(["Chill"]);
  const [politicalValue, setPoliticalValue] = useState<number>(50);
  const [datingStyle, setDatingStyle] = useState<string>("Casual");
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>(restaurantChoices[0].name);

  const [selectedMeal, setSelectedMeal] = useState({
    main: "Grilled chicken",
    side: "Rice",
    drink: "Sparkling water",
  });

  const [passCount, setPassCount] = useState(0);
  const [passWarning, setPassWarning] = useState("");
  const [busyAction, setBusyAction] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: "match", text: "So are we actually having a real conversation or just vibes?" },
  ]);
  const [chatCount, setChatCount] = useState(0);
  const [rating, setRating] = useState<number>(0);

  const canContinueFromSetup = selectedPersonalities.length > 0 && Boolean(datingStyle);

  const politicalLabel = useMemo(() => {
    if (politicalValue < 35) {
      return "Leaning Left";
    }
    if (politicalValue > 65) {
      return "Leaning Right";
    }
    return "Center-ish";
  }, [politicalValue]);

  const togglePersonality = (trait: string) => {
    setSelectedPersonalities((current) => {
      if (current.includes(trait)) {
        return current.filter((item) => item !== trait);
      }
      return [...current, trait];
    });
  };

  const withMicroDelay = async (action: () => void | Promise<void>) => {
    setBusyAction(true);
    await delay(320);
    await action();
    setBusyAction(false);
  };

  const handleFindMatch = () => {
    void withMicroDelay(async () => {
      setScreen("match");
    });
  };

  const handlePass = () => {
    void withMicroDelay(async () => {
      const nextCount = passCount + 1;
      setPassCount(nextCount);
      if (nextCount >= 2) {
        setPassWarning("Great feedback. We've matched you anyway for maximum compatibility.");
        await delay(800);
        setScreen("restaurant");
        return;
      }
      setPassWarning("Are you sure? This is your best match.");
    });
  };

  const handleMatch = () => {
    void withMicroDelay(async () => {
      setScreen("restaurant");
    });
  };

  const handleConfirmRestaurant = () => {
    void withMicroDelay(async () => {
      setScreen("restaurantLoading");
      await delay(2200);
      setScreen("restaurantResult");
    });
  };

  const handlePlaceOrder = () => {
    void withMicroDelay(async () => {
      setScreen("mealLoading");
      await delay(2100);
      setScreen("mealResult");
    });
  };

  const handleChatPrompt = (text: string) => {
    if (chatCount >= 5) {
      return;
    }
    const reply = matchReplies[chatCount % matchReplies.length];
    setChatMessages((current) => [...current, { sender: "you", text }, { sender: "match", text: reply }]);
    setChatCount((value) => value + 1);
  };

  const handleSubmitRating = () => {
    if (!rating) {
      return;
    }
    void withMicroDelay(async () => {
      setScreen("results");
    });
  };

  const resetAll = () => {
    setScreen("setup");
    setSelectedPersonalities(["Chill"]);
    setPoliticalValue(50);
    setDatingStyle("Casual");
    setSelectedRestaurant(restaurantChoices[0].name);
    setSelectedMeal({
      main: "Grilled chicken",
      side: "Rice",
      drink: "Sparkling water",
    });
    setPassCount(0);
    setPassWarning("");
    setBusyAction(false);
    setChatMessages([{ sender: "match", text: "So are we actually having a real conversation or just vibes?" }]);
    setChatCount(0);
    setRating(0);
  };

  return (
    <main className="app">
      <div className="grain" />
      <section className="phone">
        <header className="app-top">
          <span className="brand">DatemeNot</span>
          <span className="step">Screen {screen === "results" ? "7" : "1-6"}</span>
        </header>

        {screen === "setup" && (
          <section className="panel">
            <h1>Let's Find Your Perfect Match 💘</h1>

            <div className="section">
              <p className="label">1. Match Personality</p>
              <div className="tag-row">
                {personalityOptions.map((trait) => (
                  <button
                    key={trait}
                    type="button"
                    className={selectedPersonalities.includes(trait) ? "tag active" : "tag"}
                    onClick={() => togglePersonality(trait)}
                    disabled={busyAction}
                  >
                    {trait}
                  </button>
                ))}
              </div>
            </div>

            <div className="section">
              <p className="label">2. Political View Slider</p>
              <label className="slider-label" htmlFor="politics">
                Where do you stand?
              </label>
              <input
                id="politics"
                type="range"
                min={0}
                max={100}
                value={politicalValue}
                onChange={(event) => setPoliticalValue(Number(event.target.value))}
              />
              <div className="slider-meta">
                <span>Left</span>
                <strong>{politicalLabel}</strong>
                <span>Right</span>
              </div>
              <p className="hint">We'll find someone compatible 😊</p>
            </div>

            <div className="section">
              <p className="label">3. Dating Style</p>
              <div className="tag-row">
                {datingStyleOptions.map((style) => (
                  <button
                    key={style}
                    type="button"
                    className={datingStyle === style ? "tag active" : "tag"}
                    onClick={() => setDatingStyle(style)}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="primary"
              onClick={handleFindMatch}
              disabled={!canContinueFromSetup || busyAction}
            >
              Find My Match
            </button>
          </section>
        )}

        {screen === "match" && (
          <section className="panel">
            <h2>Match Reveal</h2>
            <article className="profile-card">
              <img src={matchProfile.photo} alt={`${matchProfile.name} profile`} />
              <div className="profile-content">
                <h3>
                  {matchProfile.name}, {matchProfile.age}
                </h3>
                <p>{matchProfile.bio}</p>
              </div>
            </article>

            {passWarning && <p className="warning">{passWarning}</p>}

            <div className="actions">
              <button type="button" className="ghost" onClick={handlePass} disabled={busyAction}>
                ❌ Pass
              </button>
              <button type="button" className="primary" onClick={handleMatch} disabled={busyAction}>
                ❤️ Match
              </button>
            </div>
          </section>
        )}

        {screen === "restaurant" && (
          <section className="panel">
            <h2>Where should you two go?</h2>
            <div className="card-list">
              {restaurantChoices.map((restaurant) => (
                <button
                  key={restaurant.name}
                  type="button"
                  className={selectedRestaurant === restaurant.name ? "restaurant-card selected" : "restaurant-card"}
                  onClick={() => setSelectedRestaurant(restaurant.name)}
                >
                  <img src={restaurant.image} alt={restaurant.name} />
                  <div>
                    <strong>{restaurant.name}</strong>
                    <span>{restaurant.cuisine}</span>
                  </div>
                </button>
              ))}
            </div>
            <button type="button" className="primary" onClick={handleConfirmRestaurant} disabled={busyAction}>
              Confirm Restaurant
            </button>
          </section>
        )}

        {screen === "restaurantLoading" && (
          <section className="panel center">
            <div className="loader" />
            <h2>Finding the best option for both of you...</h2>
            {fakeLoadingLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </section>
        )}

        {screen === "restaurantResult" && (
          <section className="panel">
            <h2>Reservation Confirmed!</h2>
            <article className="result-card">
              <img src={sabotagedRestaurant.image} alt={sabotagedRestaurant.name} />
              <div>
                <h3>{sabotagedRestaurant.name}</h3>
                <p>{sabotagedRestaurant.cuisine}</p>
                <small>Based on availability and compatibility</small>
              </div>
            </article>
            <button type="button" className="primary" onClick={() => setScreen("meal")}>
              Continue
            </button>
          </section>
        )}

        {screen === "meal" && (
          <section className="panel">
            <h2>What would you like to eat?</h2>
            <div className="menu-grid">
              <div className="section">
                <p className="label">Mains</p>
                {["Grilled chicken", "Pasta primavera", "Veggie bowl"].map((main) => (
                  <button
                    key={main}
                    type="button"
                    className={selectedMeal.main === main ? "line-item active" : "line-item"}
                    onClick={() => setSelectedMeal((current) => ({ ...current, main }))}
                  >
                    {main}
                  </button>
                ))}
              </div>
              <div className="section">
                <p className="label">Sides</p>
                {["Rice", "Salad", "Roasted veggies"].map((side) => (
                  <button
                    key={side}
                    type="button"
                    className={selectedMeal.side === side ? "line-item active" : "line-item"}
                    onClick={() => setSelectedMeal((current) => ({ ...current, side }))}
                  >
                    {side}
                  </button>
                ))}
              </div>
              <div className="section">
                <p className="label">Drinks</p>
                {["Sparkling water", "Lemon iced tea", "Berry smoothie"].map((drink) => (
                  <button
                    key={drink}
                    type="button"
                    className={selectedMeal.drink === drink ? "line-item active" : "line-item"}
                    onClick={() => setSelectedMeal((current) => ({ ...current, drink }))}
                  >
                    {drink}
                  </button>
                ))}
              </div>
            </div>
            <button type="button" className="primary" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </section>
        )}

        {screen === "mealLoading" && (
          <section className="panel center">
            <div className="loader" />
            <h2>Preparing your meal...</h2>
          </section>
        )}

        {screen === "mealResult" && (
          <section className="panel">
            <h2>Order Ready</h2>
            <article className="result-card">
              <div>
                <h3>Cold fish sticks, soggy fries, no salad</h3>
                <p>Chef recommendation for your compatibility profile.</p>
              </div>
            </article>
            <p className="warning">"{matchProfile.name}: Oh... that's what you ordered?"</p>
            <button type="button" className="primary" onClick={() => setScreen("chat")}>
              Start Date Chat
            </button>
          </section>
        )}

        {screen === "chat" && (
          <section className="panel">
            <h2>Date Interaction</h2>
            <div className="chat-box">
              {chatMessages.map((message, index) => (
                <div key={`${message.sender}-${index}`} className={message.sender === "you" ? "bubble you" : "bubble"}>
                  {message.text}
                </div>
              ))}
            </div>
            <div className="quick-replies">
              {userChatPrompts.map((prompt) => (
                <button key={prompt} type="button" className="line-item" onClick={() => handleChatPrompt(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>
            {chatCount >= 3 && (
              <button type="button" className="primary" onClick={() => setScreen("rating")}>
                Continue to Rating
              </button>
            )}
          </section>
        )}

        {screen === "rating" && (
          <section className="panel">
            <h2>How was your date?</h2>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={rating >= value ? "star active" : "star"}
                  onClick={() => setRating(value)}
                >
                  ★
                </button>
              ))}
            </div>
            <button type="button" className="primary" onClick={handleSubmitRating} disabled={!rating || busyAction}>
              Submit Rating
            </button>
          </section>
        )}

        {screen === "results" && (
          <section className="panel">
            <h2>Final Results</h2>
            <article className="summary-card">
              <p>
                <strong>Compatibility:</strong> 2%
              </p>
              <p>
                <strong>Conversation:</strong> Tense
              </p>
              <p>
                <strong>Meal:</strong> Unfortunate
              </p>
              <p>
                <strong>Restaurant:</strong> Questionable
              </p>
            </article>
            <article className="roast">
              <p>You chose this restaurant.</p>
              <p>You ordered that meal.</p>
              <p>You matched with them.</p>
              <p>We just made it happen.</p>
            </article>
            <button type="button" className="primary" onClick={resetAll}>
              Try Again
            </button>
          </section>
        )}
      </section>
    </main>
  );
}

export default App;
