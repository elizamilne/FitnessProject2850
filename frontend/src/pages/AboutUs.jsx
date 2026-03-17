import Navigation from "../components/Navigation";
import Statistics from "../components/Statistics";

function AboutUs() {
  return (
    <div className="h-screen bg-gray-900 flex flex-col items-center justify-center">
      <Navigation />

      <h1 className="text-4xl text-green-400 font-bold">
        📖 About Us
      </h1>

      <Statistics></Statistics>
    </div>
  );
}

export default AboutUs;
