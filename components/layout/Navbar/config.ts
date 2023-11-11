const NavbarItems = [
  {
    label: "Organizations",
    url: "/organizations",
    disabled: true,
  },
  {
    label: "Projects",
    url: "/projects",
    disabled: true,
  },
] satisfies NavbarOption[];

export type NavbarOption = {
  label: string;
  url?: string;
  disabled?: boolean;
};

export { NavbarItems };
