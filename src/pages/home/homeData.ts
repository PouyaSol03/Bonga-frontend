import type {
  CityOption,
  QuickAction,
  RecentSearch,
  SavedSearch,
  SearchSuggestion,
} from './homeTypes'

import type { AdCardData } from '../../components/AdCard'
import SaleCategoryIcon from '../../assets/icons/SaleCategoryIcon.svg'
import RentCategoryIcon from '../../assets/icons/RentCategoryIcon.svg'
import ProjectCategoryIcon from '../../assets/icons/ProjectCategoryIcon.svg'
import ConsultantCategoryIcon from '../../assets/icons/ConsultantCategoryIcon.svg'

export const latestMashhadAds: AdCardData[] = [
  {
    id: 1,
    agency: '',
    status: 'در انتظار پرداخت',
    statusCount: '۵',
    priceLabelPrimary: '',
    pricePrimary: '۳/۸۵۰ میلیارد',
    priceLabelSecondary: '',
    priceSecondary: '',
    area: '۱۱۰ متر',
    rooms: '۲ اتاق',
    year: '۱۴۰۰',
    title: 'آپارتمان ۱۱۰ متری شمال تک واحدی سنددار رحیمی',
    timeAndLocation: '۱ ساعت پیش در الهیه',
    imageClassName: 'ad-card__image--one',
    badges: [],
  },
  {
    id: 2,
    agency: 'دفتر املاک جلیلیان',
    status: 'در انتظار پرداخت',
    statusCount: '۵',
    priceLabelPrimary: 'اجاره:',
    pricePrimary: '۱/۱ میلیارد',
    priceLabelSecondary: 'رهن:',
    priceSecondary: '۷/۵ میلیون',
    area: '۱۷۰ متر',
    rooms: '۳ اتاق',
    year: '۱۳۹۰',
    title: 'اجاره آپارتمان ابتدای هاشمیه طبقه اول ۱۷۰ متری',
    timeAndLocation: '۱ روز پیش در الهیه',
    imageClassName: 'ad-card__image--two',
    badges: ['فوری', 'بروزرسانی'],
  },
  {
    id: 3,
    agency: 'دفتر املاک شریعت زاده',
    status: 'در انتظار پرداخت',
    statusCount: '۵',
    priceLabelPrimary: 'از:',
    pricePrimary: '۲ میلیون',
    priceLabelSecondary: 'تا:',
    priceSecondary: '۴ میلیون',
    area: '۸۰۰ متر',
    rooms: '۳ اتاق',
    year: 'تا ۱۰ نفر',
    title: 'اجاره باغ ویلادوبلکس ۳ خواب استخردار جکوزی شاندیز',
    timeAndLocation: 'یک هفته پیش در شاندیز',
    imageClassName: 'ad-card__image--three',
    badges: ['بروزرسانی'],
  },
  {
    id: 4,
    agency: 'دفتر املاک شریعت زاده',
    status: 'در انتظار پرداخت',
    statusCount: '۵',
    priceLabelPrimary: '',
    pricePrimary: '۳/۸۵۰ میلیارد',
    priceLabelSecondary: '',
    priceSecondary: '',
    area: '۱۱۰ متر',
    rooms: '۲ اتاق',
    year: '۱۴۰۰',
    title: 'آپارتمان ۱۱۰ متری شمال تک واحدی سنددار رحیمی',
    timeAndLocation: '۱ ساعت پیش در الهیه',
    imageClassName: 'ad-card__image--four',
    badges: ['فوری'],
  },
]

export const quickActions: QuickAction[] = [
  {
    label: 'فروش',
    icon: SaleCategoryIcon,
    options: [
      {
        label: 'فروش مسکونی',
        children: ['آپارتمان', 'خانه ویلایی', 'زمین', 'باغ، ویلا'],
      },
      {
        label: 'فروش اداری، تجاری، صنعتی، اقامتی',
        children: ['دفتر کار، اتاق اداری و مطب', 'مغازه و غرفه', 'صنعتی، کشاورزی و تجاری', 'اقامتگاه و هتل'],
      },
    ],
  },
  {
    label: 'اجاره',
    icon: RentCategoryIcon,
    options: [
      {
        label: 'اجاره مسکونی',
        children: ['آپارتمان', 'خانه ویلایی', 'اتاق و سوییت', 'باغ، ویلا'],
      },
      {
        label: 'اجاره اداری، تجاری، صنعتی، اقامتی',
        children: ['دفتر کار، اتاق اداری و مطب', 'مغازه و غرفه', 'انبار و کارگاه', 'اقامتگاه و هتل'],
      },
    ],
  },
  {
    label: 'پروژه',
    icon: ProjectCategoryIcon,
    options: [
      {
        label: 'پروژه‌های در حال ساخت',
        children: ['مسکونی', 'اداری و تجاری', 'ویلایی', 'زمین'],
      },
      {
        label: 'پروژه‌های آماده تحویل',
        children: ['مسکونی', 'اداری و تجاری', 'ویلایی', 'زمین'],
      },
    ],
  },
  {
    label: 'مشاورین',
    icon: ConsultantCategoryIcon,
    options: [
      {
        label: 'مشاورین املاک',
        children: ['مشاورین فعال', 'مشاورین نزدیک من', 'مشاورین منتخب', 'مشاورین تایید شده'],
      },
      {
        label: 'آژانس‌های املاک',
        children: ['آژانس‌های فعال', 'آژانس‌های نزدیک من', 'آژانس‌های منتخب', 'آژانس‌های تایید شده'],
      },
    ],
  },
]

export const initialRecentSearches: RecentSearch[] = Array.from({ length: 4 }, (_, index) => ({
  id: index + 1,
  title: 'فروش آپارتمان ۱۱۰ متری',
  subtitle: 'فروش آپارتمان',
  tags: ['مشهد', 'تهران', 'گرگان', 'شیراز'],
}))

export const searchSuggestions: SearchSuggestion[] = [
  { id: 1, title: 'هاشمیه', subtitle: 'در فروش آپارتمان', count: '۱۰۰۰+ آگهی' },
  { id: 2, title: 'هاشمیه', subtitle: 'در اجاره آپارتمان', count: '۱۰۰۰+ آگهی' },
  { id: 3, title: 'هاشمیه', subtitle: 'در فروش خانه ویلایی', count: '۱۰۰۰+ آگهی' },
  { id: 4, title: 'هاشمیه', subtitle: 'در اجاره واحد تجاری', count: '۱۰۰۰+ آگهی' },
  { id: 5, title: 'هاشمیه', subtitle: 'در فروش زمین', count: '۱۰۰۰+ آگهی' },
  { id: 6, title: 'هاشمیه', subtitle: 'در فروش زمین', count: '۱۰۰۰+ آگهی' },
]

export const initialSavedSearches: SavedSearch[] = Array.from({ length: 4 }, (_, index) => ({
  id: index + 1,
  title: 'فروش آپارتمان',
  tags: ['محله صیاد شیرازی', 'متراژ از ۱۰۰متر تا ۲۰۰ متر', 'شیراز', 'قیمت ۳ میلیارد تومان'],
}))

export const cityOptions: CityOption[] = [
  { name: 'مشهد', count: '۱۰۰+' },
  { name: 'تهران', count: '۱۰۰+' },
  { name: 'کرج', count: '۱۰۰+' },
  { name: 'شیراز', count: '۱۰۰+' },
  { name: 'اصفهان', count: '۱۰۰+' },
  { name: 'اهواز', count: '۱۰۰+' },
  { name: 'تبریز', count: '۱۰۰+' },
  { name: 'گرگان', count: '۱۰۰+' },
  { name: 'ساری', count: '۱۰۰+' },
  { name: 'رشت', count: '۱۰۰+' },
]

export const citySearchResults: CityOption[] = Array.from({ length: 4 }, () => ({
  name: 'هاشمیه',
  count: '۱۰۰۰+ آگهی',
}))