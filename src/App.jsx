import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownUp, ArrowRight, Bookmark, Bus, CarFront, Check,
  ChevronRight, CircleDollarSign, Compass, Heart, Home, MapPin,
  Menu, Plus, Search, Sparkles, TrainFront, Trash2, Users, Wallet,
  X, Bike, Footprints, Clock3, Leaf, Star, Route, Save,
  SlidersHorizontal, RefreshCw, UserRound, LogOut, Mail, LockKeyhole
} from 'lucide-react';
import './App.css';

const places = [
  {
    id: 1, name: 'Lalbagh Botanical Garden', category: 'Park',
    area: 'Bengaluru', price: 80, rating: 4.7, time: '1–2 hours',
    emoji: '🌿', color: 'sage',
    tags: ['Nature', 'Relaxed', 'Family'],
    description: 'A peaceful green escape with glasshouse views, walking paths and beautiful gardens.'
  },
  {
    id: 2, name: 'Third Wave Coffee', category: 'Cafe',
    area: 'Indiranagar', price: 350, rating: 4.5, time: '45–90 min',
    emoji: '☕', color: 'peach',
    tags: ['Food', 'Date', 'Friends'],
    description: 'A cosy café stop for coffee, conversations and a relaxed break.'
  },
  {
    id: 3, name: 'Cubbon Park', category: 'Park',
    area: 'Bengaluru', price: 0, rating: 4.6, time: '1 hour',
    emoji: '🌳', color: 'mint',
    tags: ['Nature', 'Budget', 'Friends', 'Family'],
    description: 'Tree-lined paths and open lawns make this a great low-cost outing.'
  },
  {
    id: 4, name: 'Visvesvaraya Museum', category: 'Museum',
    area: 'Bengaluru', price: 120, rating: 4.4, time: '1–2 hours',
    emoji: '🔭', color: 'blue',
    tags: ['Culture', 'Family', 'Friends'],
    description: 'Interactive science and technology exhibits for curious minds.'
  },
  {
    id: 5, name: 'Church Street', category: 'Food & Shopping',
    area: 'Central Bengaluru', price: 250, rating: 4.5, time: '1–2 hours',
    emoji: '🛍️', color: 'lavender',
    tags: ['Food', 'Shopping', 'Date', 'Friends'],
    description: 'A lively street for cafés, browsing, snacks and people-watching.'
  },
  {
    id: 6, name: 'ISKCON Temple', category: 'Temple',
    area: 'Rajajinagar', price: 100, rating: 4.7, time: '1 hour',
    emoji: '🛕', color: 'gold',
    tags: ['Culture', 'Family', 'Relaxed'],
    description: 'A serene temple visit with striking architecture and a calm atmosphere.'
  },
  {
    id: 7, name: 'Ulsoor Lake', category: 'Scenic spot',
    area: 'Ulsoor', price: 50, rating: 4.2, time: '45–60 min',
    emoji: '🌅', color: 'blue',
    tags: ['Nature', 'Date', 'Relaxed'],
    description: 'A scenic stop to slow down and enjoy the lake-side atmosphere.'
  },
  {
    id: 8, name: 'VV Puram Food Street', category: 'Food',
    area: 'Basavanagudi', price: 220, rating: 4.6, time: '1 hour',
    emoji: '🥘', color: 'peach',
    tags: ['Food', 'Friends', 'Budget'],
    description: 'A popular food street for trying a variety of local snacks.'
  }
];

const transport = [
  {
    id: 'cab', name: 'Cab', provider: 'Sample cab estimate',
    icon: CarFront, fare: 220, duration: 35, distance: 10,
    note: 'Comfortable', color: 'sage'
  },
  {
    id: 'bike', name: 'Bike taxi', provider: 'Sample bike estimate',
    icon: Bike, fare: 110, duration: 30, distance: 10,
    note: 'Quick & affordable', color: 'peach'
  },
  {
    id: 'bus', name: 'Bus', provider: 'Sample public transport',
    icon: Bus, fare: 35, duration: 55, distance: 12,
    note: 'Budget friendly', color: 'blue'
  },
  {
    id: 'metro', name: 'Metro + walk', provider: 'Sample metro estimate',
    icon: TrainFront, fare: 50, duration: 45, distance: 11,
    note: 'Balanced option', color: 'lavender'
  },
  {
    id: 'walk', name: 'Walking', provider: 'Illustrative estimate',
    icon: Footprints, fare: 0, duration: 90, distance: 5,
    note: 'For short distances', color: 'mint'
  }
];

const initialPlan = [places[2], places[1], places[4]];

const readStore = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

function App() {
  const [page, setPage] = useState('Home');
  const [currentUser, setCurrentUser] = useState(
    () => readStore('soup-user', null)
  );

  const [authMode, setAuthMode] = useState('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [savedPlaces, setSavedPlaces] = useState(
    () => currentUser?.email
      ? readStore(`soup-favourites:${currentUser.email}`, [])
      : []
  );

  const [savedPlans, setSavedPlans] = useState(
    () => currentUser?.email
      ? readStore(`soup-plans:${currentUser.email}`, [])
      : []
  );

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [area, setArea] = useState('Bengaluru');
  const [group, setGroup] = useState('Friends');
  const [outingType, setOutingType] = useState('Friends hangout');
  const [budget, setBudget] = useState(800);
  const [people, setPeople] = useState(2);
  const [interest, setInterest] = useState('Any');

  const [plan, setPlan] = useState(
    () => currentUser?.email
      ? readStore(`soup-current-plan:${currentUser.email}`, initialPlan)
      : initialPlan
  );

  const [mode, setMode] = useState('bike');
  const [rideFrom, setRideFrom] = useState('CMR University');
  const [rideTo, setRideTo] = useState('Indiranagar');
  const [rideDistance, setRideDistance] = useState(10);
  const [rideResults, setRideResults] = useState(false);
  const [toast, setToast] = useState('');
  const [mobileNav, setMobileNav] = useState(false);

  // Save each account's information separately on this browser.
  useEffect(() => {
    if (currentUser?.email) {
      localStorage.setItem(
        `soup-favourites:${currentUser.email}`,
        JSON.stringify(savedPlaces)
      );
    }
  }, [savedPlaces, currentUser?.email]);

  useEffect(() => {
    if (currentUser?.email) {
      localStorage.setItem(
        `soup-plans:${currentUser.email}`,
        JSON.stringify(savedPlans)
      );
    }
  }, [savedPlans, currentUser?.email]);

  useEffect(() => {
    if (currentUser?.email) {
      localStorage.setItem(
        `soup-current-plan:${currentUser.email}`,
        JSON.stringify(plan)
      );
    }
  }, [plan, currentUser?.email]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(''), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const selectedTransport =
    transport.find(t => t.id === mode) || transport[1];

  const transportCost = selectedTransport.fare;

  const foodCost = plan.reduce(
    (sum, place) => sum + place.price * people,
    0
  );

  const total = transportCost + foodCost;
  const perPerson = Math.ceil(total / Math.max(1, people));
  const remaining = budget - total;

  const filteredPlaces = useMemo(() => {
    return places.filter(place => {
      const matchesCategory =
        category === 'All' || place.category === category;

      const searchableText = (
        place.name + ' ' +
        place.category + ' ' +
        place.area + ' ' +
        place.tags.join(' ')
      ).toLowerCase();

      return matchesCategory &&
        searchableText.includes(query.toLowerCase());
    });
  }, [category, query]);

  const recommendations = useMemo(() => {
    const preferences =
      interest === 'Any' ? [] :
      interest === 'Food' ? ['Food'] :
      interest === 'Nature' ? ['Nature'] :
      interest === 'Culture' ? ['Culture'] :
      interest === 'Date' ? ['Date'] : ['Budget'];

    return places
      .map(place => ({
        ...place,
        score:
          (place.price <= budget / Math.max(1, people) ? 2 : 0) +
          (preferences.length &&
            preferences.some(tag => place.tags.includes(tag)) ? 3 : 0) +
          (place.tags.includes(group) ? 1 : 0) +
          place.rating / 5
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [budget, people, interest, group]);

  function notify(message) {
    setToast(message);
  }

  function toggleFavourite(id) {
    setSavedPlaces(old =>
      old.includes(id)
        ? old.filter(item => item !== id)
        : [...old, id]
    );

    notify(
      savedPlaces.includes(id)
        ? 'Removed from favourites'
        : 'Added to favourites'
    );
  }

  function addToPlan(place) {
    setPlan(old =>
      old.some(item => item.id === place.id)
        ? old
        : [...old, place]
    );

    notify(
      plan.some(item => item.id === place.id)
        ? 'Already in your roadmap'
        : `${place.name} added to your roadmap`
    );
  }

  function removeFromPlan(id) {
    setPlan(old => old.filter(place => place.id !== id));
  }

  function savePlan() {
    if (!plan.length) {
      notify('Add a place before saving your plan');
      return;
    }

    const newPlan = {
      id: Date.now(),
      title: `${outingType} · ${area}`,
      names: plan.map(place => place.name),
      total,
      people,
      mode,
      created: new Date().toLocaleDateString()
    };

    setSavedPlans(old => [newPlan, ...old]);
    notify('Your outing plan is saved on this device');
  }

  function generatePlan() {
    setPlan(recommendations.slice(0, 3));
    setPage('Plan');
    notify('A suggested roadmap is ready');
  }

  function runRideCompare(event) {
    event.preventDefault();
    setRideResults(true);
  }

  function navTo(name) {
    setPage(name);
    setMobileNav(false);
  }

  // Demo login: data is stored locally and is not server authentication.
  function handleAuth(event) {
    event.preventDefault();
    setAuthError('');

    const email = authEmail.trim().toLowerCase();

    if (!email || !authPassword.trim()) {
      setAuthError('Enter your email and password to continue.');
      return;
    }

    if (authMode === 'signup' && !authName.trim()) {
      setAuthError('Please enter your name.');
      return;
    }

    const user = {
      name: authMode === 'signup'
        ? authName.trim()
        : (
          authName.trim() ||
          email.split('@')[0].replace(/[._-]/g, ' ')
        ),
      email
    };

    // Each email gets separate favourites, saved roadmaps and itinerary.
    const accountPlaces = readStore(`soup-favourites:${email}`, []);
    const accountPlans = readStore(`soup-plans:${email}`, []);

    // New accounts start with an empty itinerary.
    const accountItinerary = readStore(
      `soup-current-plan:${email}`,
      []
    );

    setSavedPlaces(accountPlaces);
    setSavedPlans(accountPlans);
    setPlan(accountItinerary);

    localStorage.setItem('soup-user', JSON.stringify(user));

    setCurrentUser(user);
    setPage('Home');
    setAuthPassword('');

    notify(`Welcome to SOUP, ${user.name}!`);
  }

  function logout() {
    localStorage.removeItem('soup-user');

    setCurrentUser(null);
    setPage('Home');
    setAuthMode('login');
    setAuthName('');
    setAuthEmail('');
    setAuthPassword('');
    setSavedPlaces([]);
    setSavedPlans([]);
    setPlan(initialPlan);

    notify('You have logged out');
  }

  function refreshPage() {
    window.location.reload();
  }

  const navItems = [
    { name: 'Home', icon: Home },
    { name: 'Rides', icon: CarFront },
    { name: 'Plan', icon: Route },
    { name: 'Discover', icon: Compass },
    { name: 'Saved', icon: Bookmark },
    { name: 'Profile', icon: UserRound }
  ];

  const placeCard = (place, compact = false) => (
    <article
      className={`place-card ${compact ? 'compact' : ''}`}
      key={place.id}
    >
      <div className={`place-art ${place.color}`}>
        <span className="place-emoji">{place.emoji}</span>

        <button
          className={`heart-btn ${
            savedPlaces.includes(place.id) ? 'active' : ''
          }`}
          onClick={() => toggleFavourite(place.id)}
          aria-label="Save favourite"
        >
          <Heart
            size={17}
            fill={
              savedPlaces.includes(place.id)
                ? 'currentColor'
                : 'none'
            }
          />
        </button>

        <span className="place-category">{place.category}</span>
      </div>

      <div className="place-info">
        <div className="place-title-line">
          <h3>{place.name}</h3>
          <span className="rating">
            <Star size={13} fill="currentColor" />
            {place.rating}
          </span>
        </div>

        <p className="place-location">
          <MapPin size={13} /> {place.area}
          <span>·</span>
          <Clock3 size={13} /> {place.time}
        </p>

        <p className="place-desc">{place.description}</p>

        <div className="place-card-bottom">
          <strong>
            {place.price === 0 ? 'Free' : `~₹${place.price}`}
            <small> / person</small>
          </strong>

          <button
            className="text-btn"
            onClick={() => addToPlan(place)}
          >
            <Plus size={15} /> Add to plan
          </button>
        </div>
      </div>
    </article>
  );

  // Login and signup screen
  if (!currentUser) {
    return (
      <div className="auth-screen">
        <div className="auth-decoration auth-decoration-one" />
        <div className="auth-decoration auth-decoration-two" />

        <section className="auth-card">
          <div className="auth-brand">
            <div className="brand-mark">S<span>·</span></div>
            <div>
              <div className="brand-name">SOUP</div>
              <div className="brand-sub">SMART OUTING PLANNER</div>
            </div>
          </div>

          <div className="auth-eyebrow">
            <Sparkles size={14} /> YOUR NEXT LITTLE ADVENTURE
          </div>

          <h1>
            {authMode === 'login'
              ? <>Good plans start <span>here.</span></>
              : <>Make room for <span>memories.</span></>}
          </h1>

          <p className="auth-intro">
            {authMode === 'login'
              ? 'Log in to plan your outings, compare travel costs, and save your favourite places.'
              : 'Create a demo profile to keep your outing plans and favourite places together.'}
          </p>

          <div className="auth-tabs">
            <button
              className={authMode === 'login' ? 'active' : ''}
              onClick={() => {
                setAuthMode('login');
                setAuthError('');
              }}
            >
              Log in
            </button>

            <button
              className={authMode === 'signup' ? 'active' : ''}
              onClick={() => {
                setAuthMode('signup');
                setAuthError('');
              }}
            >
              Sign up
            </button>
          </div>

          <form className="auth-form" onSubmit={handleAuth}>
            {authMode === 'signup' && (
              <label>
                <span>YOUR NAME</span>
                <div className="auth-input">
                  <UserRound size={17} />
                  <input
                    value={authName}
                    onChange={event => setAuthName(event.target.value)}
                    placeholder="e.g. Yash"
                    autoComplete="name"
                    required
                  />
                </div>
              </label>
            )}

            <label>
              <span>EMAIL ADDRESS</span>
              <div className="auth-input">
                <Mail size={17} />
                <input
                  type="email"
                  value={authEmail}
                  onChange={event => setAuthEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label>
              <span>PASSWORD</span>
              <div className="auth-input">
                <LockKeyhole size={17} />
                <input
                  type="password"
                  value={authPassword}
                  onChange={event => setAuthPassword(event.target.value)}
                  placeholder="Enter any demo password"
                  autoComplete={
                    authMode === 'login'
                      ? 'current-password'
                      : 'new-password'
                  }
                  required
                  minLength={4}
                />
              </div>
            </label>

            {authError && (
              <p className="auth-error">{authError}</p>
            )}

            <button
              className="primary-btn auth-submit"
              type="submit"
            >
              {authMode === 'login'
                ? 'Log in to SOUP'
                : 'Create demo account'}
              <ArrowRight size={16} />
            </button>
          </form>

          <p className="auth-disclaimer">
            Demo prototype · No account is created on a server.
            Use sample details only.
          </p>
        </section>

        <div className="auth-side-note">
          <span>🌿</span>
          <strong>Small budget. Big day out.</strong>
          <p>
            Find places, compare sample fares, and make a plan
            that feels right for you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">S<span>·</span></div>

          <div>
            <div className="brand-name">SOUP</div>
            <div className="brand-sub">SMART OUTING PLANNER</div>
          </div>

          <button
            className="mobile-close"
            onClick={() => setMobileNav(false)}
          >
            <X size={19} />
          </button>
        </div>

        <div className="nav-label">WORKSPACE</div>

        <nav>
          {navItems.map(item => (
            <button
              key={item.name}
              className={`nav-item ${
                page === item.name ? 'selected' : ''
              }`}
              onClick={() => navTo(item.name)}
            >
              <item.icon size={18} strokeWidth={1.8} />
              <span>{item.name}</span>

              {item.name === 'Saved' &&
                savedPlans.length + savedPlaces.length > 0 && (
                  <span className="nav-count">
                    {savedPlans.length + savedPlaces.length}
                  </span>
                )}

              {page === item.name && (
                <ChevronRight className="nav-arrow" size={16} />
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="tip-card">
            <div className="tip-icon">
              <Sparkles size={17} />
            </div>
            <strong>A little plan goes a long way.</strong>
            <p>
              Make room for good moments without stretching
              your budget.
            </p>
            <button onClick={() => navTo('Plan')}>
              Plan an outing <ArrowRight size={14} />
            </button>
          </div>

          <div className="demo-note">
            <span className="status-dot" />
            Demo mode <span>·</span> Sample data
          </div>
        </div>
      </aside>

      {mobileNav && (
        <button
          className="scrim"
          onClick={() => setMobileNav(false)}
          aria-label="Close menu"
        />
      )}

      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMobileNav(true)}
          >
            <Menu size={21} />
          </button>

          <div className="breadcrumb">
            Workspace <ChevronRight size={14} />
            <strong>{page}</strong>
          </div>

          <div className="top-actions">
            <span className="demo-pill">
              <span className="status-dot" /> MOCK DATA
            </span>

            <button
              className="top-icon-btn"
              onClick={refreshPage}
              title="Refresh page"
              aria-label="Refresh page"
            >
              <RefreshCw size={16} />
            </button>

            <button
              className="avatar avatar-button"
              onClick={() => navTo('Profile')}
              title="Open profile"
            >
              {(currentUser.name || currentUser.email || 'S')
                .trim()
                .charAt(0)
                .toUpperCase()}
            </button>
          </div>
        </header>

        <div className="page-content">
          {/* PROFILE */}
          {page === 'Profile' && (
            <>
              <div className="page-heading">
                <div className="eyebrow">
                  <UserRound size={14} /> YOUR SOUP SPACE
                </div>
                <h1>Your profile</h1>
                <p>
                  Manage your demo profile and see what you've saved
                  for your next outing.
                </p>
              </div>

              <section className="profile-hero panel">
                <div className="profile-avatar">
                  {(currentUser.name || currentUser.email || 'S')
                    .trim()
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="profile-identity">
                  <span className="soft-tag">SOUP MEMBER · DEMO</span>
                  <h2>{currentUser.name}</h2>
                  <p><Mail size={14} /> {currentUser.email}</p>
                </div>

                <button className="secondary-btn profile-logout" onClick={logout}>
                  <LogOut size={15} /> Log out
                </button>
              </section>

              <div className="profile-stats">
                <article className="stat-card">
                  <span className="stat-icon mint"><Heart size={17} /></span>
                  <div>
                    <span className="stat-label">FAVOURITE PLACES</span>
                    <strong>{savedPlaces.length}</strong>
                    <small>Places saved on this device</small>
                  </div>
                </article>

                <article className="stat-card">
                  <span className="stat-icon lavender"><Bookmark size={17} /></span>
                  <div>
                    <span className="stat-label">SAVED ROADMAPS</span>
                    <strong>{savedPlans.length}</strong>
                    <small>Outing plans saved</small>
                  </div>
                </article>

                <article className="stat-card">
                  <span className="stat-icon peach"><Wallet size={17} /></span>
                  <div>
                    <span className="stat-label">CURRENT BUDGET</span>
                    <strong>₹{budget.toLocaleString('en-IN')}</strong>
                    <small>Adjust this in Plan</small>
                  </div>
                </article>
              </div>

              <section className="panel profile-details">
                <div className="panel-heading">
                  <div>
                    <h2>Account details</h2>
                    <p>These details are stored locally in this browser for the demo.</p>
                  </div>
                </div>

                <div className="profile-detail-row">
                  <span>Full name</span>
                  <strong>{currentUser.name}</strong>
                </div>

                <div className="profile-detail-row">
                  <span>Email address</span>
                  <strong>{currentUser.email}</strong>
                </div>

                <div className="profile-detail-row">
                  <span>Account type</span>
                  <strong>Local demo profile</strong>
                </div>

                <div className="profile-actions">
                  <button className="secondary-btn" onClick={() => navTo('Saved')}>
                    <Bookmark size={15} /> View saved items
                  </button>
                  <button className="primary-btn" onClick={() => navTo('Plan')}>
                    <Sparkles size={15} /> Plan an outing
                  </button>
                </div>
              </section>

              <div className="notice profile-notice">
                <LockKeyhole size={15} />
                <span>
                  This is a frontend demonstration. It does not provide
                  secure server-side authentication; do not use a real password.
                </span>
              </div>
            </>
          )}

          {/* HOME */}
          {page === 'Home' && (
            <>
              <section className="welcome-row">
                <div>
                  <div className="eyebrow">
                    <Sparkles size={14} /> YOUR NEXT LITTLE ADVENTURE
                  </div>
                  <h1>Good plans. <span>Better memories.</span></h1>
                  <p className="lead">
                    Find places to go, compare ways to get there,
                    and keep your outing within budget.
                  </p>
                </div>

                <div className="welcome-art">
                  <span className="sun">☀</span>
                  <span className="hill hill-one" />
                  <span className="hill hill-two" />
                  <span className="tiny-house">⌂</span>
                </div>
              </section>

              <section className="quick-grid">
                <button className="quick-card green-card" onClick={() => navTo('Rides')}>
                  <span className="quick-icon"><ArrowDownUp size={20} /></span>
                  <span>
                    <strong>Compare rides</strong>
                    <small>Find an estimated travel cost</small>
                  </span>
                  <ArrowRight className="quick-arrow" size={18} />
                </button>

                <button className="quick-card peach-card" onClick={() => navTo('Plan')}>
                  <span className="quick-icon"><Sparkles size={20} /></span>
                  <span>
                    <strong>Plan an outing</strong>
                    <small>Build a day that fits your budget</small>
                  </span>
                  <ArrowRight className="quick-arrow" size={18} />
                </button>

                <button className="quick-card blue-card" onClick={() => navTo('Discover')}>
                  <span className="quick-icon"><Compass size={20} /></span>
                  <span>
                    <strong>Discover places</strong>
                    <small>Find your next favourite spot</small>
                  </span>
                  <ArrowRight className="quick-arrow" size={18} />
                </button>
              </section>

              <section className="stats-grid">
                <div className="stat-card">
                  <span className="stat-icon mint"><MapPin size={17} /></span>
                  <div>
                    <span className="stat-label">PLACES TO EXPLORE</span>
                    <strong>{places.length.toString().padStart(2, '0')}</strong>
                    <small>Curated demo spots</small>
                  </div>
                </div>

                <div className="stat-card">
                  <span className="stat-icon peach"><Wallet size={17} /></span>
                  <div>
                    <span className="stat-label">YOUR OUTING BUDGET</span>
                    <strong>₹{budget.toLocaleString('en-IN')}</strong>
                    <small>Adjust in Plan</small>
                  </div>
                </div>

                <div className="stat-card">
                  <span className="stat-icon lavender"><Bookmark size={17} /></span>
                  <div>
                    <span className="stat-label">SAVED FOR LATER</span>
                    <strong>{savedPlaces.length + savedPlans.length}</strong>
                    <small>Places & plans</small>
                  </div>
                </div>
              </section>

              <section className="section-block">
                <div className="section-heading">
                  <div>
                    <div className="eyebrow">A FEW GOOD IDEAS</div>
                    <h2>Places worth stepping out for</h2>
                  </div>
                  <button className="text-btn" onClick={() => navTo('Discover')}>
                    Explore all <ArrowRight size={15} />
                  </button>
                </div>

                <div className="place-grid">
                  {places.slice(0, 3).map(place => placeCard(place, true))}
                </div>
              </section>

              <div className="bottom-banner">
                <div className="banner-icon"><Leaf size={22} /></div>
                <div>
                  <strong>Small budget, big day out.</strong>
                  <p>Choose your vibe and we'll help you sketch a plan with sample costs.</p>
                </div>
                <button className="primary-btn" onClick={() => navTo('Plan')}>
                  Build my roadmap <ArrowRight size={16} />
                </button>
              </div>
            </>
          )}

          {/* RIDES */}
          {page === 'Rides' && (
            <>
              <div className="page-heading">
                <div className="eyebrow">
                  <ArrowDownUp size={14} /> GET THERE YOUR WAY
                </div>
                <h1>Compare transport</h1>
                <p>See sample costs and estimated travel times across different ways to get around.</p>
              </div>

              <section className="panel ride-form-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Where are you headed?</h2>
                    <p>Enter a route to generate illustrative estimates.</p>
                  </div>
                  <span className="soft-tag">Sample route</span>
                </div>

                <form onSubmit={runRideCompare} className="ride-form">
                  <label>
                    <span>FROM</span>
                    <div className="input-wrap">
                      <span className="route-dot from-dot" />
                      <input
                        value={rideFrom}
                        onChange={event => setRideFrom(event.target.value)}
                        required
                        placeholder="Starting point"
                      />
                    </div>
                  </label>

                  <button
                    type="button"
                    className="swap-btn"
                    onClick={() => {
                      setRideFrom(rideTo);
                      setRideTo(rideFrom);
                    }}
                    aria-label="Swap locations"
                  >
                    <ArrowDownUp size={17} />
                  </button>

                  <label>
                    <span>TO</span>
                    <div className="input-wrap">
                      <MapPin size={16} />
                      <input
                        value={rideTo}
                        onChange={event => setRideTo(event.target.value)}
                        required
                        placeholder="Destination"
                      />
                    </div>
                  </label>

                  <label className="distance-input">
                    <span>EST. DISTANCE (KM)</span>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={rideDistance}
                      onChange={event =>
                        setRideDistance(Math.max(1, Number(event.target.value) || 1))
                      }
                    />
                  </label>

                  <button className="primary-btn compare-btn" type="submit">
                    <Search size={16} /> Compare options
                  </button>
                </form>

                <div className="notice">
                  <Sparkles size={15} />
                  <span>Demo estimates only. Real fares and journey times may differ.</span>
                </div>
              </section>

              {rideResults && (
                <section className="section-block results-block">
                  <div className="section-heading">
                    <div>
                      <div className="eyebrow">YOUR ROUTE</div>
                      <h2>
                        {rideFrom} <ArrowRight size={19} className="inline-arrow" /> {rideTo}
                      </h2>
                      <p>Approx. {rideDistance} km · Sorted by estimated price</p>
                    </div>
                    <span className="soft-tag">{transport.length} options</span>
                  </div>

                  <div className="transport-list">
                    {transport
                      .map(item => {
                        const Icon = item.icon;
                        const fare = Math.round(item.fare * rideDistance / 10);
                        const minutes = Math.round(
                          item.duration * Math.sqrt(rideDistance / 10)
                        );

                        return { ...item, Icon, fare, minutes };
                      })
                      .sort((a, b) => a.fare - b.fare)
                      .map(item => (
                        <article
                          className={`transport-card ${mode === item.id ? 'chosen' : ''}`}
                          key={item.id}
                        >
                          <div className={`transport-icon ${item.color}`}>
                            <item.Icon size={21} />
                          </div>

                          <div className="transport-main">
                            <strong>{item.name}</strong>
                            <span>{item.note}</span>
                          </div>

                          <div className="transport-meta">
                            <strong>{item.minutes} min</strong>
                            <span>Est. duration</span>
                          </div>

                          <div className="transport-price">
                            <strong>{item.fare === 0 ? 'Free' : `₹${item.fare}`}</strong>
                            <span>Est. fare</span>
                          </div>

                          <button
                            className={`choose-btn ${mode === item.id ? 'chosen-btn' : ''}`}
                            onClick={() => {
                              setMode(item.id);
                              notify(`${item.name} selected for your budget`);
                            }}
                          >
                            {mode === item.id
                              ? <><Check size={14} /> Selected</>
                              : 'Choose'}
                          </button>
                        </article>
                      ))}
                  </div>

                  <div className="notice">
                    <CircleDollarSign size={16} />
                    <span>Selected transport is used in your outing budget. All amounts are mock estimates.</span>
                    <button className="text-btn" onClick={() => navTo('Plan')}>
                      Use in plan <ArrowRight size={14} />
                    </button>
                  </div>
                </section>
              )}

              {!rideResults && (
                <div className="empty-hint">
                  <div className="hint-illustration"><Route size={30} /></div>
                  <h3>Your route, your options.</h3>
                  <p>Enter any sample starting point and destination, then compare estimated costs and time.</p>
                </div>
              )}
            </>
          )}

          {/* PLAN */}
          {page === 'Plan' && (
            <>
              <div className="page-heading">
                <div className="eyebrow">
                  <Sparkles size={14} /> MAKE IT A GOOD DAY
                </div>
                <h1>Plan your outing</h1>
                <p>Tell us what you're in the mood for. We'll suggest places and help you keep track of costs.</p>
              </div>

              <div className="planner-layout">
                <div className="planner-left">
                  <section className="panel preference-panel">
                    <div className="panel-heading">
                      <div>
                        <h2>What's the plan?</h2>
                        <p>A few details help shape your outing.</p>
                      </div>
                      <span className="step-number">01</span>
                    </div>

                    <div className="form-grid">
                      <label className="field">
                        <span>AREA</span>
                        <select value={area} onChange={event => setArea(event.target.value)}>
                          <option>Bengaluru</option>
                          <option>Indiranagar</option>
                          <option>Central Bengaluru</option>
                          <option>Basavanagudi</option>
                          <option>Rajajinagar</option>
                        </select>
                      </label>

                      <label className="field">
                        <span>OUTING TYPE</span>
                        <select
                          value={outingType}
                          onChange={event => {
                            setOutingType(event.target.value);
                            setGroup(
                              event.target.value.includes('Family')
                                ? 'Family'
                                : event.target.value.includes('Date')
                                  ? 'Date'
                                  : 'Friends'
                            );
                          }}
                        >
                          <option>Friends hangout</option>
                          <option>Family outing</option>
                          <option>Date outing</option>
                          <option>Solo exploration</option>
                          <option>College outing</option>
                        </select>
                      </label>

                      <label className="field">
                        <span>GROUP SIZE</span>
                        <div className="number-field">
                          <Users size={16} />
                          <button
                            type="button"
                            onClick={() => setPeople(Math.max(1, people - 1))}
                          >
                            −
                          </button>
                          <strong>{people}</strong>
                          <button
                            type="button"
                            onClick={() => setPeople(Math.min(20, people + 1))}
                          >
                            +
                          </button>
                        </div>
                      </label>

                      <label className="field">
                        <span>YOUR TOTAL BUDGET (₹)</span>
                        <div className="number-field">
                          <span>₹</span>
                          <input
                            type="number"
                            min="100"
                            step="100"
                            value={budget}
                            onChange={event =>
                              setBudget(Math.max(100, Number(event.target.value) || 100))
                            }
                          />
                        </div>
                      </label>

                      <label className="field full-field">
                        <span>WHAT ARE YOU IN THE MOOD FOR?</span>
                        <div className="interest-chips">
                          {['Any', 'Food', 'Nature', 'Culture', 'Date', 'Budget'].map(value => (
                            <button
                              type="button"
                              key={value}
                              className={`interest-chip ${interest === value ? 'active' : ''}`}
                              onClick={() => setInterest(value)}
                            >
                              {value === 'Food' ? '🍜 ' :
                                value === 'Nature' ? '🌿 ' :
                                value === 'Culture' ? '🏛️ ' :
                                value === 'Date' ? '💛 ' :
                                value === 'Budget' ? '💸 ' : ''}
                              {value}
                            </button>
                          ))}
                        </div>
                      </label>
                    </div>

                    <button className="primary-btn full-width" onClick={generatePlan}>
                      <Sparkles size={17} /> Generate my roadmap <ArrowRight size={16} />
                    </button>

                    <p className="microcopy">
                      Suggestions use local sample data and simple matching rules, not a live AI service.
                    </p>
                  </section>

                  <section className="panel recommendation-panel">
                    <div className="panel-heading">
                      <div>
                        <h2>Picked for your vibe</h2>
                        <p>Recommendations update as your preferences change.</p>
                      </div>
                      <span className="step-number">02</span>
                    </div>

                    <div className="recommendation-list">
                      {recommendations.slice(0, 3).map(place => (
                        <div className="recommendation-row" key={place.id}>
                          <div className={`mini-place ${place.color}`}>{place.emoji}</div>
                          <div className="recommendation-copy">
                            <strong>{place.name}</strong>
                            <span>
                              {place.category} · {place.price ? `~₹${place.price}/person` : 'Free'} · ★ {place.rating}
                            </span>
                          </div>
                          <button
                            className="round-add"
                            onClick={() => addToPlan(place)}
                            aria-label={`Add ${place.name}`}
                          >
                            <Plus size={17} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="planner-right">
                  <section className="budget-card">
                    <div className="budget-top">
                      <div>
                        <div className="eyebrow light">YOUR OUTING ESTIMATE</div>
                        <p>Estimated total</p>
                      </div>
                      <div className="budget-icon"><Wallet size={19} /></div>
                    </div>

                    <div className="budget-total">
                      ₹{total.toLocaleString('en-IN')}
                    </div>

                    <div className="budget-per-person">
                      ₹{perPerson.toLocaleString('en-IN')}
                      <span> per person · {people} {people === 1 ? 'person' : 'people'}</span>
                    </div>

                    <div className="budget-meter">
                      <div
                        style={{
                          width: `${Math.min(100, Math.max(0, total / budget * 100))}%`
                        }}
                      />
                    </div>

                    <div className="budget-status">
                      <span>Budget ₹{budget.toLocaleString('en-IN')}</span>
                      <strong className={remaining < 0 ? 'over-budget' : ''}>
                        {remaining >= 0
                          ? `₹${remaining.toLocaleString('en-IN')} left`
                          : `₹${Math.abs(remaining).toLocaleString('en-IN')} over`}
                      </strong>
                    </div>

                    <div className="cost-breakdown">
                      <div>
                        <span><CarFront size={15} /> Transport</span>
                        <strong>₹{transportCost}</strong>
                      </div>
                      <div>
                        <span>🍽️ Food & places</span>
                        <strong>₹{foodCost}</strong>
                      </div>
                      <div>
                        <span><Users size={15} /> Group size</span>
                        <strong>{people} {people === 1 ? 'person' : 'people'}</strong>
                      </div>
                    </div>

                    <div className="budget-note">
                      {remaining < 0
                        ? 'Try a lower-cost transport option or remove a stop.'
                        : 'A flexible estimate to help you plan ahead.'}
                    </div>
                  </section>

                  <section className="panel roadmap-panel">
                    <div className="panel-heading">
                      <div>
                        <div className="eyebrow">YOUR DAY, MAPPED OUT</div>
                        <h2>
                          My roadmap <span className="count-bubble">{plan.length}</span>
                        </h2>
                      </div>
                      <button className="icon-action" onClick={savePlan} title="Save plan">
                        <Save size={17} />
                      </button>
                    </div>

                    <label className="field transport-select">
                      <span>TRAVEL BETWEEN STOPS</span>
                      <select value={mode} onChange={event => setMode(event.target.value)}>
                        {transport.map(item => (
                          <option value={item.id} key={item.id}>
                            {item.name} — {item.fare === 0 ? 'Free' : `₹${item.fare}`}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="roadmap-stops">
                      {plan.length ? (
                        plan.map((place, index) => (
                          <div className="roadmap-stop" key={place.id}>
                            <div className="stop-timeline">
                              <span>{index + 1}</span>
                              {index < plan.length - 1 && <i />}
                            </div>

                            <div className="stop-content">
                              <strong>{place.name}</strong>
                              <span>{place.category} · {place.time}</span>
                              <small>
                                Estimated visit cost: {place.price === 0 ? 'Free' : `₹${place.price}/person`}
                              </small>
                            </div>

                            <button
                              className="remove-stop"
                              onClick={() => removeFromPlan(place.id)}
                              title="Remove stop"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="empty-plan">
                          No stops yet. Add a recommendation to start your roadmap.
                        </div>
                      )}
                    </div>

                    <div className="roadmap-footer">
                      <button className="secondary-btn" onClick={() => navTo('Discover')}>
                        <Plus size={15} /> Add a place
                      </button>
                      <button className="primary-btn" onClick={savePlan}>
                        <Bookmark size={15} /> Save roadmap
                      </button>
                    </div>

                    <p className="microcopy">
                      Costs are planning estimates. Transport is counted once for this demo, not per itinerary leg.
                    </p>
                  </section>
                </div>
              </div>
            </>
          )}

          {/* DISCOVER */}
          {page === 'Discover' && (
            <>
              <div className="page-heading discover-heading">
                <div>
                  <div className="eyebrow">
                    <Compass size={14} /> GOOD PLACES, CLOSER
                  </div>
                  <h1>Find your next favourite</h1>
                  <p>Browse sample spots around Bengaluru, from green escapes to little food adventures.</p>
                </div>

                <div className="discover-count">
                  <strong>{filteredPlaces.length.toString().padStart(2, '0')}</strong>
                  <span>PLACES TO EXPLORE</span>
                </div>
              </div>

              <div className="discover-toolbar">
                <div className="search-box">
                  <Search size={17} />
                  <input
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                    placeholder="Search places, categories, interests..."
                  />
                  <SlidersHorizontal size={16} />
                </div>

                <div className="filter-chips">
                  {[
                    'All', 'Cafe', 'Park', 'Food',
                    'Temple', 'Museum', 'Scenic spot', 'Food & Shopping'
                  ].map(value => (
                    <button
                      className={`filter-chip ${category === value ? 'active' : ''}`}
                      onClick={() => setCategory(value)}
                      key={value}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div className="place-grid discover-grid">
                {filteredPlaces.map(place => placeCard(place))}
              </div>

              {filteredPlaces.length === 0 && (
                <div className="empty-hint">
                  <Search size={28} />
                  <h3>No places found</h3>
                  <p>Try another search or category.</p>
                  <button
                    className="secondary-btn"
                    onClick={() => {
                      setQuery('');
                      setCategory('All');
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}

              <div className="community-note">
                <div className="community-icon"><Sparkles size={19} /></div>
                <div>
                  <strong>Local gems, one day at a time.</strong>
                  <p>
                    This review prototype uses sample place information.
                    Community submissions can be added in a later version.
                  </p>
                </div>
                <span className="soft-tag">Prototype</span>
              </div>
            </>
          )}

          {/* SAVED */}
          {page === 'Saved' && (
            <>
              <div className="page-heading">
                <div className="eyebrow">
                  <Bookmark size={14} /> YOUR LITTLE COLLECTION
                </div>
                <h1>Saved for later</h1>
                <p>Your favourite places and saved roadmaps stay in this browser.</p>
              </div>

              <section className="section-block">
                <div className="section-heading">
                  <div>
                    <h2>
                      Favourite places <span className="count-bubble">{savedPlaces.length}</span>
                    </h2>
                    <p>Spots you bookmarked for another day.</p>
                  </div>
                  <button className="text-btn" onClick={() => navTo('Discover')}>
                    Discover places <ArrowRight size={15} />
                  </button>
                </div>

                {savedPlaces.length ? (
                  <div className="place-grid">
                    {places
                      .filter(place => savedPlaces.includes(place.id))
                      .map(place => placeCard(place))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-symbol"><Heart size={24} /></div>
                    <h3>Your favourites will live here</h3>
                    <p>Tap the heart on any place card to save it for later.</p>
                    <button className="secondary-btn" onClick={() => navTo('Discover')}>
                      Browse places <ArrowRight size={15} />
                    </button>
                  </div>
                )}
              </section>

              <section className="section-block saved-plans-section">
                <div className="section-heading">
                  <div>
                    <h2>
                      Saved roadmaps <span className="count-bubble">{savedPlans.length}</span>
                    </h2>
                    <p>Outing plans you've saved on this device.</p>
                  </div>
                  <button className="text-btn" onClick={() => navTo('Plan')}>
                    Create a plan <ArrowRight size={15} />
                  </button>
                </div>

                {savedPlans.length ? (
                  <div className="saved-plan-list">
                    {savedPlans.map(saved => (
                      <article className="saved-plan-card" key={saved.id}>
                        <div className="saved-plan-icon"><Route size={21} /></div>

                        <div className="saved-plan-copy">
                          <strong>{saved.title}</strong>
                          <span>{saved.names.join(' · ')}</span>
                          <small>
                            Saved {saved.created} · {saved.people}{' '}
                            {saved.people === 1 ? 'person' : 'people'} ·{' '}
                            {transport.find(item => item.id === saved.mode)?.name}
                          </small>
                        </div>

                        <div className="saved-plan-cost">
                          <strong>₹{saved.total}</strong>
                          <span>Estimated total</span>
                        </div>

                        <button
                          className="remove-stop"
                          onClick={() => {
                            setSavedPlans(old =>
                              old.filter(item => item.id !== saved.id)
                            );
                            notify('Saved roadmap removed');
                          }}
                          title="Delete saved roadmap"
                        >
                          <Trash2 size={16} />
                        </button>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-symbol"><Bookmark size={24} /></div>
                    <h3>No roadmaps saved yet</h3>
                    <p>Build an outing and select Save roadmap to keep it here.</p>
                    <button className="secondary-btn" onClick={() => navTo('Plan')}>
                      Plan an outing <ArrowRight size={15} />
                    </button>
                  </div>
                )}
              </section>
            </>
          )}
        </div>

        <footer className="app-footer">
          <span>SOUP <span className="footer-dot">·</span> Smart Outing Planner</span>
          <span>Made for better days out <span className="footer-heart">♥</span></span>
          <span className="footer-disclaimer">
            Demo prototype · Prices and times are simulated
          </span>
        </footer>
      </main>

      {toast && (
        <div className="toast">
          <Check size={17} /> {toast}
        </div>
      )}
    </div>
  );
}

export default App;