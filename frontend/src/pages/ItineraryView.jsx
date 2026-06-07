import { useLocation, useNavigate } from 'react-router-dom';
import ItineraryTimeline from '../components/itinerary/ItineraryTimeline';
import styles from './ItineraryView.module.css';

// Mock data — replace with real API response later
const MOCK_ITINERARY = {
  title: '5-Day Adventure in Odisha',
  destination: 'Odisha',
  duration: 5,
  mood: 'Adventure',
  budget: 'Mid',
  days: [
    {
      day: 1,
      title: 'Temples & History',
      location: 'Bhubaneswar',
      activities: [
        { time: '8:00 AM',  title: 'Lingaraj Temple',    desc: 'Visit the 11th century temple dedicated to Lord Shiva, one of the oldest in Bhubaneswar.', isHiddenGem: false },
        { time: '11:00 AM', title: 'Udayagiri Caves',    desc: 'Explore ancient rock-cut caves with intricate Jain carvings dating back to the 1st century BC.', isHiddenGem: false },
        { time: '2:00 PM',  title: 'Ekamra Haat',        desc: 'Local crafts market — perfect for picking up authentic Odisha handicrafts and souvenirs.', isHiddenGem: false },
        { time: '6:00 PM',  title: 'Bindusagar Lake',    desc: 'A hidden sacred tank surrounded by dozens of small temples. Stunning at sunset.', isHiddenGem: true },
      ],
    },
    {
      day: 2,
      title: 'Beach & Spirituality',
      location: 'Puri',
      activities: [
        { time: '6:00 AM',  title: 'Jagannath Temple',   desc: 'One of the four sacred dhams in India. Arrive early to avoid crowds.', isHiddenGem: false },
        { time: '10:00 AM', title: 'Golden Beach',       desc: 'Puri\'s famous 5km stretch of golden sand — swim, relax, or try local snacks.', isHiddenGem: false },
        { time: '3:00 PM',  title: 'Chilika Lake Day Trip', desc: 'Asia\'s largest brackish water lagoon. Spot Irrawaddy dolphins and migratory birds.', isHiddenGem: true },
        { time: '7:00 PM',  title: 'Seafood Dinner',     desc: 'Fresh catch at the beachside shacks — try Chungdi Malai (prawn curry).', isHiddenGem: false },
      ],
    },
    {
      day: 3,
      title: 'Sun Temple & Architecture',
      location: 'Konark',
      activities: [
        { time: '7:00 AM',  title: 'Konark Sun Temple',  desc: 'UNESCO World Heritage Site — a 13th century marvel shaped like a giant chariot.', isHiddenGem: false },
        { time: '11:00 AM', title: 'Chandrabhaga Beach', desc: 'A peaceful, less-crowded beach near Konark. Perfect for a quiet morning walk.', isHiddenGem: true },
        { time: '2:00 PM',  title: 'Konark Museum',      desc: 'Houses sculptures and artifacts from the Sun Temple complex.', isHiddenGem: false },
      ],
    },
    {
      day: 4,
      title: 'Tribal Culture & Nature',
      location: 'Koraput',
      activities: [
        { time: '9:00 AM',  title: 'Koraput Tribal Market', desc: 'Weekly tribal haat where indigenous communities sell produce, crafts, and textiles.', isHiddenGem: true },
        { time: '1:00 PM',  title: 'Deomali Peak',       desc: 'Odisha\'s highest peak at 1672m. A hidden gem for trekkers with panoramic views.', isHiddenGem: true },
        { time: '5:00 PM',  title: 'Sabara Srikhetra',   desc: 'A spiritual site with tribal connections to the Jagannath tradition.', isHiddenGem: false },
      ],
    },
    {
      day: 5,
      title: 'Hills & Waterfalls',
      location: 'Daring Badi',
      activities: [
        { time: '8:00 AM',  title: 'Daring Badi Pine Forest', desc: 'Known as the Kashmir of Odisha — pine trees, misty mornings, and cool climate.', isHiddenGem: false },
        { time: '11:00 AM', title: 'Pudagada Waterfall',  desc: 'A secluded waterfall deep in the forest, rarely visited by tourists.', isHiddenGem: true },
        { time: '3:00 PM',  title: 'Barunei Hills',       desc: 'Sacred hilltop temple with sweeping views of the valley below.', isHiddenGem: true },
      ],
    },
  ],
};

export default function ItineraryView() {
  const navigate   = useNavigate();

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/plan')}>
          ← Plan Another Trip
        </button>
        <div className={styles.meta}>
          <div className="sec-tag">
            <i className="fa-solid fa-wand-magic-sparkles" />
            AI GENERATED
          </div>
          <h1 className={styles.title}>{MOCK_ITINERARY.title.toUpperCase()}</h1>
          <div className={styles.tags}>
            <span><i className="fa-solid fa-calendar" /> {MOCK_ITINERARY.duration} Days</span>
            <span><i className="fa-solid fa-face-smile" /> {MOCK_ITINERARY.mood}</span>
            <span><i className="fa-solid fa-wallet" /> {MOCK_ITINERARY.budget} Budget</span>
          </div>
        </div>
        <button className={styles.saveBtn}>
          <i className="fa-solid fa-bookmark" /> Save Itinerary
        </button>
      </div>

      {/* Timeline */}
      <ItineraryTimeline days={MOCK_ITINERARY.days} />
    </div>
  );
}