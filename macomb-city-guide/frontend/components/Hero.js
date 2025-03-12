import Image from "next/image";
import { Searchbar } from "@/components/Searchbar";

export function Hero({ 
  title = "Explore Macomb",
  subtitle = "Discover the best attractions, events, dining and more in Macomb, Illinois",
  backgroundImage = "/images/macomb-hero.jpg"
}) {
  return (
    <div className="relative h-[500px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Macomb City"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center p-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold max-w-3xl mb-4">
          {title}
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8">
          {subtitle}
        </p>
        <div className="w-full max-w-lg">
          <Searchbar type="general" />
        </div>
      </div>
    </div>
  );
}