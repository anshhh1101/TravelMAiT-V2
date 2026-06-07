import Hero        from '../components/sections/Hero';
import HowItWorks  from '../components/sections/HowItWorks';
import Destinations from '../components/sections/Destinations';
import FAQ          from '../components/sections/FAQ';

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Destinations />
      <FAQ />
    </main>
  );
}
