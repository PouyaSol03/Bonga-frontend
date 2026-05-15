import type { City, DownloadOption, SocialLink } from "./publicLandingTypes";
import TehranIcon from "../../assets/icons/TehranIcon.svg";
import MashhadIcon from "../../assets/icons/MashhadIcon.svg";
import IsfahanIcon from "../../assets/icons/IsfahanIcon.svg";
import ShirazIcon from "../../assets/icons/ShirazIcon.svg";
import BazarIcon from "../../assets/Vectors/BazarIcon.svg";
import BazarTypo from "../../assets/Vectors/BazarTypo.svg";

import MyketIcon from "../../assets/Vectors/MyketIcon.svg";
import MyketTypo from "../../assets/Vectors/MyketTypo.svg";

import SibappIcon from "../../assets/Vectors/SibappIcon.svg";
import SibappTypo from "../../assets/Vectors/SibappTypo.svg";
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
    icon: BazarIcon,
    typo: BazarTypo,
  },
  {
    label: "مایکت",
    icon: MyketIcon,
    typo: MyketTypo,
  },
  {
    label: "سیب اپ",
    icon: SibappIcon,
    typo: SibappTypo,
  },
];

export const footerLinks = [
  { label: "درباره ما", href: "#about" },
  { label: "تماس با ما", href: "#contact" },
  { label: "سوالات متداول", href: "#faq" },
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
