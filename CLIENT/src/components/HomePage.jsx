import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between w-full h-[calc(100vh-80px)] bg-neutral-900 px-6 md:px-10 py-10">
      <div className="md:w-1/2 h-full flex flex-col items-start justify-center lg:pl-32">
        <h1 className="text-5xl md:text-7xl font-extrabold uppercase bg-gradient-to-r from-blue-600 via-purple-400 to-pink-600 bg-clip-text text-transparent">
          Textini AI
        </h1>
        <h2 className="mt-4 text-lg md:text-xl font-semibold text-gray-200 text-left">
          Supercharge your creativity and productivity.
        </h2>
        <p className="mt-2 mb-6 text-sm md:text-base text-gray-300 max-w-[500px] text-left">
          Textini AI is a versatile tool designed to enhance creativity and
          productivity through the power of artificial intelligence.
        </p>
        <Link to="/dashboard">
          <button className="px-6 py-3 text-white bg-blue-600 rounded-lg shadow-lg transition-transform duration-200 hover:bg-white hover:text-black hover:scale-105">
            Get Started
          </button>
        </Link>
      </div>

      <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
        <img
          className="object-cover w-full md:w-[450px] h-auto md:h-[350px] rounded-3xl shadow-lg "
          src="hero-bg2.webp"
          alt="Display"
        />
      </div>
    </section>
  );
};

export default HomePage;
