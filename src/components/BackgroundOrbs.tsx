export default function BackgroundOrbs() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="orb orb-animate absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-200/40" />
            <div
                className="orb orb-animate absolute bottom-[-10%] right-[-5%] w-[800px] h-[800px] bg-blue-100/30"
                style={{ animationDelay: "-5s" }}
            />
            <div
                className="orb orb-animate absolute top-[20%] right-[20%] w-[400px] h-[400px] bg-orange-100/20"
                style={{ animationDelay: "-10s" }}
            />
        </div>
    );
}
