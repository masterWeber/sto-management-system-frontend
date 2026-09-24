export const queryKeys = {
  me: ["me"] as const,
  staff: {
    all: ["staff"] as const,
    list: (params?: object) =>
      ["staff", "list", params ?? {}] as const,
    detail: (id: string) => ["staff", "detail", id] as const,
  },
  clients: {
    all: ["clients"] as const,
    list: (params?: object) =>
      ["clients", "list", params ?? {}] as const,
    detail: (id: string) => ["clients", "detail", id] as const,
  },
  cars: {
    all: ["cars"] as const,
    list: (params?: object) =>
      ["cars", "list", params ?? {}] as const,
    detail: (id: string) => ["cars", "detail", id] as const,
  },
  serviceCategories: {
    all: ["service-categories"] as const,
    list: (params?: object) =>
      ["service-categories", "list", params ?? {}] as const,
  },
  services: {
    all: ["services"] as const,
    list: (params?: object) =>
      ["services", "list", params ?? {}] as const,
    detail: (id: string) => ["services", "detail", id] as const,
  },
  productCategories: {
    all: ["product-categories"] as const,
    list: (params?: object) =>
      ["product-categories", "list", params ?? {}] as const,
  },
  products: {
    all: ["products"] as const,
    list: (params?: object) =>
      ["products", "list", params ?? {}] as const,
    detail: (id: string) => ["products", "detail", id] as const,
  },
  orders: {
    all: ["orders"] as const,
    list: (params?: object) =>
      ["orders", "list", params ?? {}] as const,
    detail: (id: string) => ["orders", "detail", id] as const,
  },
  expenses: {
    all: ["expenses"] as const,
    list: (params?: object) =>
      ["expenses", "list", params ?? {}] as const,
    detail: (id: string) => ["expenses", "detail", id] as const,
  },
  finance: {
    summary: (params: object) =>
      ["finance", "summary", params] as const,
  },
};
