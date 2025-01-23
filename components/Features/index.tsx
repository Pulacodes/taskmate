import Image from "next/image";


interface featuresdata {
    imgSrc: string;
    heading: string;
    subheading: string;
}

const featuresdata: featuresdata[] = [
    {
        imgSrc: '/Paypass.svg',
        heading: 'Secure transfers',
        subheading: 'Make easy online transfers to taskers using paypal or visa card',
    },

    {
        imgSrc: '/coins.svg',
        heading: 'Earn money',
        subheading: 'Start earning money today by completting tasks from other users.',
    },
]

const Features = () => {
    return (
        <div className="mx-auto max-w-7xl my-0 md:my-40 pt-36 px-6 relative" id="features-section">
            <div className="radial-bg hidden lg:block"></div>
            <div className="grid lg:grid-cols-2 gap-x-4 gap-y-4">
                {/* Column-1 */}
                <div>
                    <h3 className="feature-font text-lg font-semibold mb-4 text-blue-600 text-center md:text-start">FEATURES</h3>
                    <h2 className="text-offwhite text-3xl lg:text-5xl text-white font-semibold leading-snug mb-6 text-center md:text-start">The most trusted freelancer platform in Kibris</h2>
                    <p className="lg:text-lg font-normal text-bluish text-gray-400 text-center md:text-start">We get it—being a university student in Kibris is no walk in the park. Juggling classes, assignments, and a social life can make it tough to keep up with daily tasks. That&apos;s where Taskmate comes in. Let us lighten your load. Upload your tasks here and experience the ease of having them taken care of for you.</p>
                </div>
                {/* Column-2 */}
                <div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4 lg:-mr-56">
                        {featuresdata.map((items, i) => (
                            <div className="bg-gray-800 py-10 pr-12 pl-6 rounded-lg" key={i}>
                                <div className="rounded-full gg h-16 w-16 flex items-center justify-center mb-10">
                                    <Image src={items.imgSrc} alt={items.imgSrc} width={24} height={30} />
                                </div>
                                <h5 className="text-offwhite text-blue-600 text-lg font-medium mb-4">{items.heading}</h5>
                                <p className="text-lightblue text-gray-400 text-sm font-normal">{items.subheading}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Features;
