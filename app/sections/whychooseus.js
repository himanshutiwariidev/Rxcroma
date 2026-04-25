import Image from "next/image";

const stats = [
  {
    value: "02 Million+",
    title: "Registered users as of",
    desc: "Jan 01, 2026",
    icon: "/images/icons/family.svg",
  },
  {
    value: "3.4 Million+",
    title: "Orders on Rxcroma",
    desc: "till date",
    icon: "/images/icons/deliveryBoy.svg",
  },
  {
    value: "25000+",
    title: "Unique items sold last",
    desc: "3 months",
    icon: "/images/icons/locationMarker.svg",
  },
  {
    value: "1900+",
    title: "Pin codes serviced last",
    desc: "3 months",
    icon: "/images/icons/pincodeServed.svg",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="w-full bg-[#F6F8FB] py-14">
      <div className="mx-auto w-full max-w-7xl px-4">
        {/* Title */}
        <h2 className="text-3xl font-extrabold text-[#2B2F33] sm:text-4xl">
          Why Choose Us?
        </h2>

        {/* Stats Row */}
        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((item, index) => (
            <div
              key={index}
              className="
                flex flex-col items-center text-center gap-3
                md:flex-row md:items-start md:text-left md:gap-4
                rounded-xl p-3
              "
            >
              {/* Icon */}
              <div className="relative h-14 w-14 flex-shrink-0">
                <Image
                  src={item.icon}
                  alt={item.value}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Text */}
              <div>
                <h3 className="text-xl font-extrabold text-[#2B2F33] md:text-2xl">
                  {item.value}
                </h3>
                <p className="mt-1 text-sm font-medium text-[#4B5563]">
                  {item.title}
                </p>
                <p className="text-sm text-[#6B7280]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
