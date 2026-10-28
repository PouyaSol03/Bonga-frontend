export type TransactionType = "sale" | "rent" | "project";

export type CategoryKey =
  | "apartment"
  | "villa-house"
  | "garden-villa"
  | "land"
  | "office"
  | "commercial-unit"
  | "warehouse"
  | "hotel-apartment"
  | "factory-workshop"
  | "daily-apartment-suite"
  | "daily-garden-villa"
  | "daily-hotel-apartment"
  | "daily-workspace"
  | "project-presale"
  | "project-partnership";

const categoryKeySet = new Set<CategoryKey>([
  "apartment",
  "villa-house",
  "garden-villa",
  "land",
  "office",
  "commercial-unit",
  "warehouse",
  "hotel-apartment",
  "factory-workshop",
  "daily-apartment-suite",
  "daily-garden-villa",
  "daily-hotel-apartment",
  "daily-workspace",
  "project-presale",
  "project-partnership",
]);

const formCodeByListingKey: Record<string, string> = {
  "project:project-partnership": "partnership",
  "project:project-presale": "presale-special",
  "rent:commercial-unit": "rent-commercial",
  "rent:daily-apartment-suite": "daily-apartment-suite",
  "rent:daily-garden-villa": "daily-garden-villa",
  "rent:daily-hotel-apartment": "daily-hotel",
  "rent:daily-workspace": "daily-office-booth",
  "rent:factory-workshop": "rent-factory-workshop",
  "rent:hotel-apartment": "rent-hotel",
  "rent:warehouse": "rent-warehouse",
  "sale:commercial-unit": "sale-commercial",
  "sale:factory-workshop": "sale-factory",
  "sale:garden-villa": "sale-garden-villa",
  "sale:hotel-apartment": "sale-hotel",
  "sale:office": "sale-office",
  "sale:warehouse": "sale-warehouse",
};

export function getAdvertiseFormCode(transaction: TransactionType, category: CategoryKey) {
  return formCodeByListingKey[`${transaction}:${category}`] ?? `${transaction}-${category}`;
}

export function getListingFromFormCode(
  formCode: string,
): { transaction: TransactionType; category: CategoryKey } | null {
  if (!formCode) return null;

  const mappedEntry = Object.entries(formCodeByListingKey).find(([, value]) => value === formCode);

  if (mappedEntry) {
    const [transaction, category] = mappedEntry[0].split(":") as [TransactionType, CategoryKey];

    return { transaction, category };
  }

  const [transaction, ...categoryParts] = formCode.split("-");
  const category = categoryParts.join("-") as CategoryKey;

  if (["sale", "rent", "project"].includes(transaction) && categoryKeySet.has(category)) {
    return { transaction: transaction as TransactionType, category };
  }

  return null;
}

export const categoryLabels: Record<CategoryKey, string> = {
  apartment: "آپارتمان",
  "villa-house": "خانه، ویلا",
  "garden-villa": "ویلا، باغ",
  land: "زمین، ملک کلنگی",
  office: "اداری",
  "commercial-unit": "تجاری",
  warehouse: "انبار، سوله",
  "hotel-apartment": "هتل، اقامتگاه",
  "factory-workshop": "صنعتی",
  "daily-apartment-suite": "آپارتمان، سوئیت",
  "daily-garden-villa": "ویلا، باغ",
  "daily-hotel-apartment": "هتل، اقامتگاه",
  "daily-workspace": "دفترکار، غرفه",
  "project-presale": "پیش فروش، فروش پروژه",
  "project-partnership": "مشارکت",
};

export const categoryGroupsByTransaction: Record<
  TransactionType,
  { title: string; items: CategoryKey[] }[]
> = {
  sale: [
    {
      title: "مسکونی",
      items: ["apartment", "land", "villa-house"],
    },
    {
      title: "اداری، تجاری، صنعتی، اقامتی",
      items: ["office", "commercial-unit", "factory-workshop", "hotel-apartment"],
    },
  ],

  rent: [
    {
      title: "مسکونی",
      items: ["apartment", "villa-house"],
    },
    {
      title: "روزانه",
      items: [
        "daily-apartment-suite",
        "daily-garden-villa",
        "daily-hotel-apartment",
        "daily-workspace",
      ],
    },
    {
      title: "اداری، تجاری، صنعتی، اقامتی",
      items: ["office", "commercial-unit", "factory-workshop", "hotel-apartment"],
    },
  ],

  project: [
    {
      title: "پروژه و مشارکت",
      items: ["project-presale", "project-partnership"],
    },
  ],
};

export const transactionTabs: { label: string; value: TransactionType }[] = [
  { label: "فروش", value: "sale" },
  { label: "اجاره", value: "rent" },
  { label: "پروژه", value: "project" },
];
