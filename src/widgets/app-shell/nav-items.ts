import {
  IconBox,
  IconCar,
  IconChartHistogram,
  IconClipboardList,
  IconLayoutDashboard,
  IconReceipt,
  IconTools,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";
import type { Section } from "@/shared/config/roles";

export interface NavItem {
  section: Section;
  label: string;
  href: string;
  icon: Icon;
}

export const NAV_ITEMS: NavItem[] = [
  {
    section: "dashboard",
    label: "Дашборд",
    href: "/",
    icon: IconLayoutDashboard,
  },
  { section: "clients", label: "Клиенты", href: "/clients", icon: IconUsers },
  { section: "cars", label: "Автомобили", href: "/cars", icon: IconCar },
  {
    section: "orders",
    label: "Заказ-наряды",
    href: "/orders",
    icon: IconClipboardList,
  },
  {
    section: "priceList",
    label: "Прайс-лист",
    href: "/price-list",
    icon: IconTools,
  },
  {
    section: "warehouse",
    label: "Склад",
    href: "/warehouse",
    icon: IconBox,
  },
  {
    section: "finance",
    label: "Финансы",
    href: "/finance",
    icon: IconChartHistogram,
  },
  {
    section: "expenses",
    label: "Расходы",
    href: "/expenses",
    icon: IconReceipt,
  },
  {
    section: "staff",
    label: "Сотрудники",
    href: "/staff",
    icon: IconUsersGroup,
  },
];
