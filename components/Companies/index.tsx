"use client";

import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const data = [
    { imgSrc: "/taskmatewhite.png" },
    { imgSrc: "/mastercard.svg" },
    { imgSrc: "/paypal.svg"},
    { imgSrc: "/clerk.svg" },
    { imgSrc: "/visa.svg" }, 
    { imgSrc: "/vercel.svg" },
    { imgSrc: "/bank-transfer.svg" },
];

const MultipleItems = () => {
    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        speed: 2000,
        autoplaySpeed: 2000,
        cssEase: "linear",
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 4 } },
            { breakpoint: 700, settings: { slidesToShow: 2 } },
            { breakpoint: 500, settings: { slidesToShow: 2 } },
        ],
    };

    return (
        <div className="text-center bg-transparent py-10">
            <div className="mx-auto max-w-7xl">
                <Slider {...settings}>
                    {data.map((item, i) => (
                        <div key={i} className="flex justify-center">
                            <Image src={item.imgSrc} width={60} height={60} alt="Carousel Image" />
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default MultipleItems;
