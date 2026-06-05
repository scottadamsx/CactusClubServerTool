import Navbar from "./Navbar";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <div className="flex flex-col leading-none">
          <h1 className="font-serif text-xl font-semibold tracking-tight">
            Cactus Club Cafe
          </h1>
          <h3 className="text-[0.7rem] font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Server Tool
          </h3>
        </div>
        <Navbar />
      </div>
    </header>
  );
};

export default Header;
