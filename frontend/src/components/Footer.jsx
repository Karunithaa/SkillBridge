export default function Footer({ className = "" }) {
  return (
    <footer className={`w-full border-t border-outline-variant bg-surface-container-low py-xl ${className}`}>
      <div className="mx-auto flex max-w-container-max flex-col items-center justify-between gap-md px-lg md:flex-row">
        <div className="flex flex-col items-center gap-xs md:items-start">
          <span className="font-headline-md text-headline-md font-bold text-primary">SkillBridge</span>
          <p className="font-label-sm text-label-sm text-on-surface-variant">© 2026 SkillBridge Platform</p>
        </div>
        <div className="flex flex-wrap justify-center gap-xl">
          <a className="font-label-sm text-label-sm text-on-surface-variant transition-all hover:text-primary" href="#">
            Privacy Policy
          </a>
          <a className="font-label-sm text-label-sm text-on-surface-variant transition-all hover:text-primary" href="#">
            Terms of Service
          </a>
          <a className="font-label-sm text-label-sm text-on-surface-variant transition-all hover:text-primary" href="#">
            Help Center
          </a>
        </div>
      </div>
    </footer>
  );
}
