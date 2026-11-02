export type AboutMapMarker = {
  src: string;
  top: number;
  offset: number;
  delay: number;
};

export type AboutPageData = {
  hero: {
    eyebrow: string;
    title: string;
    summary: string;
    links: { label: string; href: string }[];
  };
  map: {
    label: string;
    location: string;
    title: string;
    summary: string;
    background: string;
    markers: AboutMapMarker[];
  };
  mission: {
    label: string;
    title: string;
    summary: string;
    statement: string;
  };
  founder: {
    label: string;
    name: string;
    nickname: string;
    summary: string;
    profileUrl: string;
    profileLinkLabel: string;
  };
  rhythm: {
    label: string;
    approachSummary: string;
    steps: string[];
  };
  focus: {
    label: string;
    title: string;
    areas: string[];
  };
  story: {
    eyebrow: string;
    title: string;
    asideLabel: string;
    asideText: string;
    asideHref: string;
    asideLinkLabel: string;
  };
};
