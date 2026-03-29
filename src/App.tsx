import { useMemo, useState } from "react";

type Option = {
  emoji: string;
  label: string;
  vibe: string;
};

type Profile = {
  name: string;
  age: number;
  job: string;
  bio: string;
  politics: string[];
  interests: string[];
  lookingFor: string;
};

type Venue = {
  name: string;
  category: string;
  pitch: string;
  whyItsWrong: string;
};

type Meal = {
  name: string;
  description: string;
};

type Step = "type" | "politics" | "topics" | "venue" | "meal" | "recap";

const steps: Step[] = ["type", "politics", "topics", "venue", "meal", "recap"];

const datingGoals: Option[] = [
  { emoji: "🎨", label: "Artsy leftist", vibe: "Mutual aid, galleries" },
  { emoji: "💼", label: "Finance moderate", vibe: "Cold brew, private tables" },
  { emoji: "🌿", label: "Eco romantic", vibe: "Markets, compost, protest dates" },
  { emoji: "🛸", label: "Conspiracy flirt", vibe: "Podcasts, bunker energy" },
];

const politicalStances: Option[] = [
  { emoji: "✊", label: "Progressive", vibe: "Policy and activism" },
  { emoji: "⚖️", label: "Centrist", vibe: "Compromise mode" },
  { emoji: "🏛️", label: "Conservative", vibe: "Traditional values" },
  { emoji: "😶", label: "Apolitical-ish", vibe: "Avoids politics until dessert" },
];

const topics: Option[] = [
  { emoji: "🌍", label: "Climate", vibe: "Urgent issue" },
  { emoji: "🏠", label: "Housing", vibe: "Rent debates" },
  { emoji: "🩺", label: "Healthcare", vibe: "Systems talk" },
  { emoji: "🌐", label: "Foreign policy", vibe: "Global takes" },
  { emoji: "🤖", label: "Tech ethics", vibe: "AI panic" },
  { emoji: "🧰", label: "Labor", vibe: "Union energy" },
];

const worstMatches: Profile[] = [
  {
    name: "Troy",
    age: 31,
    job: "Crypto policy streamer",
    bio: "Swipes right only to debate transit and explain why tipping should be tokenized.",
    politics: ["Anti-regulation", "Tax-maximalist"],
    interests: ["Private helicopters", "Reaction podcasts", "Steakhouse clubs"],
    lookingFor: "Someone patient enough to hear both sides of every bad opinion",
  },
  {
    name: "Madison",
    age: 28,
    job: "Luxury branding consultant",
    bio: "Believes every issue would calm down if people just networked harder.",
    politics: ["Soft conservative", "Status quo defender"],
    interests: ["Silent retreats", "Airport lounges", "Champagne towers"],
    lookingFor: "A date who won't interrupt her market-based empathy speech",
  },
  {
    name: "Evan",
    age: 33,
    job: "Men's rights podcaster",
    bio: "Calls himself a centrist, then explains why bike lanes are authoritarian.",
    politics: ["Reactionary centrist", "Culture-war tourist"],
    interests: ["Cold plunges", "Debate clips", "Voice notes"],
    lookingFor: "Conflict, but framed as intellectual chemistry",
  },
];

const awfulRestaurants: Venue[] = [
  {
    name: "Terminal Beige Grill",
    category: "Airport-adjacent chain",
    pitch: "Fluorescent lighting, safe mediocrity, and fryer oil on every surface.",
    whyItsWrong: "Neither of you wanted chain food or the feeling of eating near Gate 14.",
  },
  {
    name: "The Patriot Fondue Experience",
    category: "Theme restaurant",
    pitch: "Flags, lukewarm cheese, and a soundtrack that kills eye contact.",
    whyItsWrong: "You asked for intimate. DatemeNot heard ideological stress test.",
  },
  {
    name: "Kelp! by the Highway",
    category: "Experimental seafood bar",
    pitch: "Marine foam, tiny plates, and aggressively sincere plating.",
    whyItsWrong: "You both filtered out seafood and tasting menus. The app committed anyway.",
  },
];

const badMeals: Meal[] = [
  {
    name: "Room-temp beet tartare",
    description: "Suggested because neither of you likes beets, raw textures, or trust exercises.",
  },
  {
    name: "Table-side sardine fondue",
    description: "A smell-forward dip that outlasts the connection.",
  },
  {
    name: "Deconstructed liver sliders",
    description: "Too small to share, too heavy to forgive, and served on damp brioche.",
  },
];

const pickWorst = <T,>(selected: string[], pool: T[], mapper: (item: T) => string[]): T => {
  const ranked = [...pool].sort((a, b) => {
    const aHits = mapper(a).filter((value) => selected.includes(value)).length;
    const bHits = mapper(b).filter((value) => selected.includes(value)).length;
    return aHits - bHits;
  });
  return ranked[0];
};

function App() {
  const [stepIndex, setStepIndex] = useState(0);
  const [goal, setGoal] = useState<string>("Artsy leftist");
  const [politics, setPolitics] = useState<string>("Progressive");
  const [selectedTopics, setSelectedTopics] = useState<string[]>(["Climate", "Labor"]);

  const currentStep = steps[stepIndex];

  const scenario = useMemo(() => {
    const match = pickWorst([goal, politics, ...selectedTopics], worstMatches, (profile) => [
      ...profile.politics,
      ...profile.interests,
    ]);

    return {
      match,
      restaurant: awfulRestaurants[(selectedTopics.length + goal.length) % awfulRestaurants.length],
      meal: badMeals[(politics.length + selectedTopics.join("").length) % badMeals.length],
    };
  }, [goal, politics, selectedTopics]);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((current) =>
      current.includes(topic)
        ? current.filter((item) => item !== topic)
        : current.length === 3
          ? [...current.slice(1), topic]
          : [...current, topic],
    );
  };

  const goNext = () => setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  const goBack = () => setStepIndex((current) => Math.max(current - 1, 0));
  const restart = () => setStepIndex(0);

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="brand-row">
          <span className="brand-badge">DatemeNot</span>
          <span className="brand-caption">Swipe into a terrible evening</span>
        </div>
      </section>

      <section className="phone-frame">
        <div className="phone-topbar">
          <span>13:47</span>
          <span>{stepIndex + 1}/6</span>
          <span>76%</span>
        </div>

        <div className="progress-row" aria-hidden="true">
          {steps.map((step, index) => (
            <span key={step} className={index <= stepIndex ? "progress-dot active" : "progress-dot"} />
          ))}
        </div>

        <div className="screen-card">
          {currentStep === "type" && (
            <>
              <p className="screen-kicker">Step 1</p>
              <h1 className="screen-title">💘 Pick your type</h1>
              <p className="screen-copy">Choose the vibe you actually wanted before the app ruins it.</p>
              <div className="option-grid">
                {datingGoals.map((option) => (
                  <button
                    key={option.label}
                    className={goal === option.label ? "option active" : "option"}
                    onClick={() => setGoal(option.label)}
                    type="button"
                  >
                    <span className="option-emoji">{option.emoji}</span>
                    <strong>{option.label}</strong>
                    <span>{option.vibe}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {currentStep === "politics" && (
            <>
              <p className="screen-kicker">Step 2</p>
              <h1 className="screen-title">🗳️ Pick your politics</h1>
              <p className="screen-copy">Set your baseline so DatemeNot can send you in the opposite direction.</p>
              <div className="option-grid compact">
                {politicalStances.map((option) => (
                  <button
                    key={option.label}
                    className={politics === option.label ? "option active" : "option"}
                    onClick={() => setPolitics(option.label)}
                    type="button"
                  >
                    <span className="option-emoji">{option.emoji}</span>
                    <strong>{option.label}</strong>
                    <span>{option.vibe}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {currentStep === "topics" && (
            <>
              <p className="screen-kicker">Step 3</p>
              <h1 className="screen-title">💬 Debate topics</h1>
              <p className="screen-copy">Pick up to 3 things you care about enough to ruin appetizers.</p>
              <div className="pill-row">
                {topics.map((topic) => (
                  <button
                    key={topic.label}
                    className={selectedTopics.includes(topic.label) ? "pill active" : "pill"}
                    onClick={() => toggleTopic(topic.label)}
                    type="button"
                  >
                    {topic.emoji} {topic.label}
                  </button>
                ))}
              </div>
              <div className="mini-summary">
                <span>Selected</span>
                <strong>{selectedTopics.join(" • ")}</strong>
              </div>
            </>
          )}

          {currentStep === "venue" && (
            <>
              <p className="screen-kicker">Step 4</p>
              <h1 className="screen-title">🍽️ Venue assigned</h1>
              <p className="screen-copy">Neither of you wanted this. That is exactly why it was chosen.</p>
              <article className="result-card">
                <span className="result-badge">{scenario.restaurant.category}</span>
                <h2>{scenario.restaurant.name}</h2>
                <p>{scenario.restaurant.pitch}</p>
                <strong>{scenario.restaurant.whyItsWrong}</strong>
              </article>
            </>
          )}

          {currentStep === "meal" && (
            <>
              <p className="screen-kicker">Step 5</p>
              <h1 className="screen-title">🥴 Meal assigned</h1>
              <p className="screen-copy">The kitchen is now collaborating in your discomfort.</p>
              <article className="result-card accent">
                <span className="result-badge">Chef's regret</span>
                <h2>{scenario.meal.name}</h2>
                <p>{scenario.meal.description}</p>
                <strong>Auto-ordered so nobody gets the comfort of choosing correctly.</strong>
              </article>
            </>
          )}

          {currentStep === "recap" && (
            <>
              <p className="screen-kicker">Step 6</p>
              <h1 className="screen-title">📅 Date recap</h1>
              <p className="screen-copy">Everything went wrong exactly as intended.</p>
              <article className="match-card">
                <div className="card-photo">
                  <div className="photo-overlay">
                    <span className="photo-tag">💥 98% bad fit</span>
                    <span className="photo-tag muted">🚩 contrarian</span>
                  </div>
                </div>
                <div className="card-content">
                  <div className="title-row">
                    <h2>
                      {scenario.match.name}, {scenario.match.age}
                    </h2>
                    <span>{scenario.match.job}</span>
                  </div>
                  <p className="bio">{scenario.match.bio}</p>
                  <div className="chip-row">
                    {scenario.match.politics.map((item) => (
                      <span key={item} className="chip">
                        {item}
                      </span>
                    ))}
                    {scenario.match.interests.map((item) => (
                      <span key={item} className="chip">
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="looking-for">🎯 {scenario.match.lookingFor}</p>
                </div>
              </article>

              <div className="recap-grid">
                <article className="recap-box">
                  <span>You wanted</span>
                  <strong>{goal}</strong>
                  <small>{politics}</small>
                </article>
                <article className="recap-box">
                  <span>You got</span>
                  <strong>{scenario.restaurant.name}</strong>
                  <small>{scenario.meal.name}</small>
                </article>
              </div>
            </>
          )}

          <div className="nav-row">
            <button
              className="nav-button ghost"
              onClick={currentStep === "type" || currentStep === "recap" ? restart : goBack}
              type="button"
            >
              {currentStep === "type" ? "Reset" : currentStep === "recap" ? "Start over" : "Back"}
            </button>
            <button className="nav-button primary" onClick={currentStep === "recap" ? restart : goNext} type="button">
              {currentStep === "recap" ? "Again" : "Next"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
