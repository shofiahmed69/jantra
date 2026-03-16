import LottiePlayer from "@/components/LottiePlayer";
import type { ServiceOffering } from "@/content/site";

interface ServiceShowcaseProps {
  service: ServiceOffering;
}

export default function ServiceShowcase({ service }: ServiceShowcaseProps) {
  const animationPosition = service.reverse
    ? "relative lg:absolute lg:right-[10%]"
    : "relative lg:absolute lg:left-[10%]";
  const contentPosition = service.reverse
    ? "relative lg:absolute lg:left-[15%] lg:top-[100px]"
    : "relative lg:absolute lg:right-[15%] lg:top-[100px]";
  const stackDirection = service.reverse ? "flex-col-reverse" : "flex-col";

  return (
    <section className="relative w-full py-16 md:py-32 min-h-0 md:min-h-[800px]" id={service.id}>
      <div className="container mx-auto px-6 relative">
        <div className={`flex ${stackDirection} lg:block gap-8`}>
          <div
            className={`${animationPosition} w-full lg:w-[45%] h-[250px] sm:h-[350px] md:h-[500px] z-10 rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br ${service.animationClassName} overflow-hidden flex items-center justify-center shadow-2xl`}
          >
            <LottiePlayer src={service.animationSrc} className="w-full h-full" />
          </div>
          <div className={`${contentPosition} w-full lg:w-[40%] z-20 glass-panel p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem]`}>
            <span className="text-orange-500 font-bold tracking-widest text-[10px] md:text-xs uppercase mb-3 md:mb-4 block">
              {service.label}
            </span>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">{service.title}</h2>
            <p className="text-slate-700 leading-relaxed mb-6 md:mb-8 text-sm md:text-base">
              {service.description}
            </p>
            <button className="bg-slate-900 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full hover:bg-orange-600 transition-all font-medium text-sm md:text-base">
              Start Your Project
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
