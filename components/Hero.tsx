import Link from "next/link";

const Hero = () => {
  return (
    <>
      <section
        id="home"
        className="relative min-h-screen z-20 bg-[url('/banner.jpg')] bg-cover bg-center pb-16 pt-[120px]"
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[800px] text-center">
                <h1 className="mb-15 text-6xl font-bold leading-tight text-yellow-600">
                  Get Tasks done by fellow students
                </h1>
                <p className="mb-30 text-gray-400 fontFamily-satoshi !leading-relaxed text-body-color">
                Connect with university students to either upload tasks you need
                done or earn money by completing tasks. Click Get started to upload your task today, or click on 
                Pick a task to pick from our selection of available tasks. If you get assigned to you task of interest you will receive payment within 3 
                days of completion.
                </p>
                
                <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Link
                    href="/tasks"
                    className="rounded-sm bg-yellow-600 px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-blue-600/80"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="viewtask"
                    className="inline-block rounded-sm bg-gray-800 px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-black/90 dark:bg-white/10 dark:text-white dark:hover:bg-white/5"
                  >
                    Pick Task
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </section>
    </>
  );
};

export default Hero;