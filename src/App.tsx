import { useState } from "react";

type Option = {
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

const datingGoals: Option[] = [
  { label: "Artsy leftist", vibe: "Mutual aid, gallery dates, indie playlists" },
  { label: "Finance moderate", vibe: "Cold brew, golf jokes, private reservations" },
  { label: "Eco romantic", vibe: "Farmer's markets, protests, compost bins" },
  { label: "Conspiracy flirt", vibe: "Podcasts, bunker energy, no trust in tap water" },
];

const politicalStances: Option[] = [
  { label: "Progressive", vibe: "Wants policy, activism, and labor talk" },
  { label: "Centrist", vibe: "Compromise language and balanced headlines" },
  { label: "Conservative", vibe: "Traditional values and tax-cut monologues" },
  { label: "Apolitical-ish", vibe: "Says politics are exhausting until dessert arrives" },
];

const topics: Option[] = [
  { label: "Climate", vibe: "You want this to matter immediately" },
  { label: "Housing", vibe: "Rent debates before appetizers" },
  { label: "Healthcare", vibe: "No small talk, straight to systems" },
  { label: "Foreign policy", vibe: "Turns every menu into a briefing memo" },
  { label: "Tech ethics", vibe: "AI panic with a side of fries" },
  { label: "Labor", vibe: "Union takes before the drinks land" },
];

const worstMatches: Profile[] = [
  {
    name: "Troy",
    age: 31,
    job: "Crypto policy streamer",
    bio: "Swipes right only to debate public transit and explain why tipping should be tokenized.",
    politics: ["Anti-regulation", "Tax-maximalist"],
    interests: ["Private helicopters", "Reaction podcasts", "Steakhouse loyalty clubs"],
    lookingFor: "Someone patient enough to hear both sides of every bad opinion",
  },
  {
    name: "Madison",
    age: 28,
    job: "Luxury branding consultant",
    bio: "Believes every issue would calm down if people just networked harder and stopped being weird online.",
    politics: ["Soft conservative", "Status quo defender"],
    interests: ["Silent retreats", "Airport lounges", "Champagne towers"],
    lookingFor: "A date who won't interrupt her market-based empathy speech",
  },
  {
    name: "Evan",
    age: 33,
    job: "Men's rights podcaster",
    bio: "Calls himself a centrist, then spends forty minutes explaining why bike lanes are authoritarian.",
    politics: ["Reactionary centrist", "Culture-war tourist"],
    interests: ["Cold plunges", "Debate clips", "Unsolicited voice notes"],
    lookingFor: "Conflict, but framed as intellectual chemistry",
  },
];

const awfulRestaurants: Venue[] = [
  {
    name: "Terminal Beige Grill",
    category: "Airport-adjacent chain",
    pitch: "A fluorescent sanctuary where every entree tastes pre-approved by committee.",
    whyItsWrong: "Neither of you wanted chain food, overhead TVs, or the smell of fryer oil in your jacket.",
  },
  {
    name: "The Patriot Fondue Experience",
    category: "Theme restaurant",
    pitch: "Flags, lukewarm cheese, and a soundtrack that makes eye contact impossible.",
    whyItsWrong: "You asked for intimate. The app heard ideological stress test with communal skewers.",
  },
  {
    name: "Kelp! by the Highway",
    category: "Experimental seafood bar",
    pitch: "A brutalist room serving marine foam and aggressively sincere small plates.",
    whyItsWrong: "You both filtered out seafood and tasting menus. DatemeNot interpreted that as destiny.",
  },
];

const badMeals: Meal[] = [
  {
    name: "Room-temperature beet tartare",
    description: "Suggested because neither of you likes beets, raw textures, or trust exercises.",
  },
  {
    name: "Table-side sardine fondue",
    description: "A divisive dip with a smell that outlasts the relationship you never wanted.",
  },
  {
    name: "Deconstructed liver sliders",
    description: "Small enough to resent, rich enough to regret, and served on damp brioche.",
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
  const [goal, setGoal] = useState<string>("Artsy leftist");
  const [politics, setPolitics] = useState<string>("Progressive");
  const [selectedTopics, setSelectedTopics] = useState<string[]>(["Climate", "Labor"]);

  const scenario = {
    match: pickWorst([goal, politics, ...selectedTopics], worstMatches, (profile) => [
      ...profile.politics,
      ...profile.interests,
    ]),
    restaurant: awfulRestaurants[(selectedTopics.length + goal.length) % awfulRestaurants.length],
    meal: badMeals[(politics.length + selectedTopics.join("").length) % badMeals.length],
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics((current) =>
      current.includes(topic)
        ? current.filter((item) => item !== topic)
        : current.length === 3
          ? [...current.slice(1), topic]
          : [...current, topic],
    );
  };

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="brand-row">
          <span className="brand-badge">DatemeNot</span>
          <span className="brand-caption">Bumble energy, weaponized incompatibility</span>
        </div>
        <div className="hero-copy">
          <p className="eyebrow">Swipe into your least ideal evening</p>
          <h1>The app that matches you with the wrong person, at the wrong place, over the wrong meal.</h1>
          <p className="lede">
            Set your type, your politics, and your favorite debate topics. DatemeNot responds by engineering a date
            that misses on chemistry, ideology, restaurant, and entree.
          </p>
        </div>
      </section>

      <section className="phone-frame">
        <div className="phone-topbar">
          <span>13:47</span>
          <span>For You</span>
          <span>76%</span>
        </div>

        <div className="phone-body">
          <aside className="control-panel">
            <div className="panel-block">
              <p className="panel-label">Who were you hoping for?</p>
              <div className="option-grid">
                {datingGoals.map((option) => (
                  <button
                    key={option.label}
                    className={goal === option.label ? "option active" : "option"}
                    onClick={() => setGoal(option.label)}
                    type="button"
                  >
                    <strong>{option.label}</strong>
                    <span>{option.vibe}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="panel-block">
              <p className="panel-label">Your political baseline</p>
              <div className="pill-row">
                {politicalStances.map((option) => (
                  <button
                    key={option.label}
                    className={politics === option.label ? "pill active" : "pill"}
                    onClick={() => setPolitics(option.label)}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="panel-block">
              <div className="panel-heading">
                <p className="panel-label">Topics you actually care about</p>
                <span>Pick up to 3</span>
              </div>
              <div className="pill-row">
                {topics.map((topic) => (
                  <button
                    key={topic.label}
                    className={selectedTopics.includes(topic.label) ? "pill active" : "pill"}
                    onClick={() => toggleTopic(topic.label)}
                    type="button"
                  >
                    {topic.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="match-stage">
            <article className="match-card">
              <div className="card-photo">
                <div className="photo-overlay">
                  <span className="photo-tag">98% bad fit</span>
                  <span className="photo-tag muted">Verified contrarian</span>
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
                <div className="detail-group">
                  <p className="detail-label">Political habits</p>
                  <div className="chip-row">
                    {scenario.match.politics.map((item) => (
                      <span key={item} className="chip">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="detail-group">
                  <p className="detail-label">Date-night red flags</p>
                  <div className="chip-row">
                    {scenario.match.interests.map((item) => (
                      <span key={item} className="chip">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="looking-for">{scenario.match.lookingFor}</p>
              </div>
            </article>

            <div className="swipe-actions">
              <button type="button" className="circle action-nope">
                x
              </button>
              <button type="button" className="primary-action">
                Forced Match
              </button>
              <button type="button" className="circle action-yikes">
                !
              </button>
            </div>
          </section>
        </div>
      </section>

      <section className="outcome-grid">
        <article className="outcome-card">
          <p className="outcome-kicker">The venue</p>
          <h3>{scenario.restaurant.name}</h3>
          <span>{scenario.restaurant.category}</span>
          <p>{scenario.restaurant.pitch}</p>
          <strong>{scenario.restaurant.whyItsWrong}</strong>
        </article>

        <article className="outcome-card accent">
          <p className="outcome-kicker">The meal</p>
          <h3>{scenario.meal.name}</h3>
          <p>{scenario.meal.description}</p>
          <strong>Ordered automatically because mutual disappointment is the core feature.</strong>
        </article>

        <article className="outcome-card summary">
          <p className="outcome-kicker">The date arc</p>
          <h3>Your horrible night, generated</h3>
          <p>
            You wanted <strong>{goal}</strong> energy with a <strong>{politics}</strong> worldview and a real talk
            about <strong>{selectedTopics.join(", ")}</strong>.
          </p>
          <p>
            DatemeNot instead booked you with <strong>{scenario.match.name}</strong> at{" "}
            <strong>{scenario.restaurant.name}</strong> for <strong>{scenario.meal.name}</strong>.
          </p>
        </article>
      </section>
    </main>
  );
}

export default App;
