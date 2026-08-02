import { socialLinks } from "../publicLandingData";
import { Typography } from "../../../shared/ui/Typography";

export function PublicFooter() {
  return (
    <footer className="flex flex-col items-center bg-white px-4 pb-4 pt-8 min-[390px]:pt-10">

      <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-6 text-center text-xs font-normal leading-4 text-[#4d4d4d] min-[390px]:mt-8">
        تمام حقوق این وب سایت نیز برای شرکت ایران شناسا است.
      </Typography>

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
