import type { City, DownloadOption, SocialLink } from "./publicLandingTypes";
import TehranIcon from "../../assets/icons/TehranIcon.svg";
import MashhadIcon from "../../assets/icons/MashhadIcon.svg";
import IsfahanIcon from "../../assets/icons/IsfahanIcon.svg";
import ShirazIcon from "../../assets/icons/ShirazIcon.svg";
import BazarIcon from "../../assets/Vectors/BazarIcon.svg";

import MyketIcon from "../../assets/Vectors/MyketIcon.svg";

import SibappIcon from "../../assets/Vectors/SibappIcon.svg";
import InstagramIcon from "../../assets/Vectors/InstagramIcon.svg";
import FaceIcon from "../../assets/Vectors/FaceIcon.svg";
import TelegramIcon from "../../assets/Vectors/TelegramIcon.svg";
import LinkedingIcon from "../../assets/Vectors/LinkedingIcon.svg";

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
