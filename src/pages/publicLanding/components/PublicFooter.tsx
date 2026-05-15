import { footerLinks, socialLinks } from "../publicLandingData";

export function PublicFooter() {
  return (
    <footer className="flex flex-col items-center bg-white px-4 pb-4 pt-10">
      <nav
        className="flex flex-col items-center gap-[42px]"
        aria-label="لینک های سایت"
      >
        {footerLinks.map((link) => (
          <a
            className="text-base font-normal leading-6 text-[#1a1a1a]"
            href={link.href}
            key={link.href}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <p className="m-0 mt-8 text-center text-xs font-normal leading-4 text-[#4d4d4d]">
        تمام حقوق این وب سایت نیز برای شرکت ایران شناسا است.
      </p>

      <div
        className="mt-2 flex items-center justify-center [direction:ltr]"
        aria-label="شبکه های اجتماعی"
      >
        {socialLinks.map((link) => (
          <a
            className="grid place-items-center focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
            href={link.href}
            aria-label={link.label}
            key={link.label}
          >
            <img
              src={link.icon}
              alt=""
              className="object-contain"
              aria-hidden="true"
            />
          </a>
        ))}
      </div>
    </footer>
  );
}
