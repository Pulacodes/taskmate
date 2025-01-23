import Link from "next/link";

const Hero = () => {
  return (
    <>
      <section
        id="home"
        className="relative z-20 bg-gradient-to-r from-neutral-600 via-gray-950 to-blue-950 bg-cover bg-center pb-16 pt-[120px]"
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[800px] text-center">
                <h1 className="mb-15 text-4xl font-bold leading-tight bg-gradient-to-l from-yellow-500 via-blue-500 to-indigo-500 text-transparent bg-clip-text">
                  Get Tasks done by fellow students
                </h1>
                <p className="mb-30 text-gray-400 fontFamily-satoshi !leading-relaxed text-body-color">
                Connect with university students to either upload tasks you need
                done or earn money by completing tasks. 
                </p>
                
                <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Link
                    href="/tasks"
                    className="rounded-sm bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-blue-600/80"
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