import type { City, DownloadOption, SocialLink } from "./publicLandingTypes";
import TehranIcon from "../../shared/assets/icons/TehranIcon.svg";
import MashhadIcon from "../../shared/assets/icons/MashhadIcon.svg";
import IsfahanIcon from "../../shared/assets/icons/IsfahanIcon.svg";
import ShirazIcon from "../../shared/assets/icons/ShirazIcon.svg";
import BazarIcon from "../../shared/assets/Vectors/BazarIcon.svg";

import MyketIcon from "../../shared/assets/Vectors/MyketIcon.svg";

import SibappIcon from "../../shared/assets/Vectors/SibappIcon.svg";
import InstagramIcon from "../../shared/assets/Vectors/InstagramIcon.svg";
import FaceIcon from "../../shared/assets/Vectors/FaceIcon.svg";
import TelegramIcon from "../../shared/assets/Vectors/TelegramIcon.svg";
import LinkedingIcon from "../../shared/assets/Vectors/LinkedingIcon.svg";

export const landingAssets = {
  hero: "/landing-hero.png",
};

export const cities: City[] = [
  { name: "تهران", icon: TehranIcon },
  { name: "مشهد", icon: MashhadIcon },
  { name: "اصفهان", icon: IsfahanIcon },
  { name: "شیراز", icon: ShirazIcon },
];

export const downloadOptions: DownloadOption[] = [
  {
    label: "بازار",
    href: "https://cafebazaar.ir/",
    icon: BazarIcon,
    typo: "بازار",
  },
  {
    label: "مایکت",
    href: "https://myket.ir/",
    icon: MyketIcon,
    typo: "مایکت",
  },
  {
    label: "سیب اپ",
    href: "https://sibapp.com/",
    icon: SibappIcon,
    typo: "سیب اپ",
  },
];

export const socialLinks: SocialLink[] = [
  {
    label: "Instagram",
    href: "#instagram",
    icon: InstagramIcon,
  },
  {
    label: "Facebook",
    href: "#facebook",
    icon: FaceIcon,
  },
  {
    label: "Telegram",
    href: "#telegram",
    icon: TelegramIcon,
  },
  {
    label: "LinkedIn",
    href: "#linkedin",
    icon: LinkedingIcon,
  },
];
