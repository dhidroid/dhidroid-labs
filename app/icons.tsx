"use client";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faMobileScreenButton, faServer, faCompassDrafting, faBriefcase, faLayerGroup, faFlask, faCloud, faHeadset, faUser, faShieldHalved, faHandshake, faLocationDot, faClipboardCheck, faPenRuler, faGears, faMagnifyingGlassChart, faNewspaper, faRocket, faUsers, faFileContract, faEnvelope, faGlobe, faBookOpen, faCalendarCheck, faLightbulb, faScaleBalanced, faArrowRight, } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";

config.autoAddCss = false;
const I = { code: faCode, mobile: faMobileScreenButton, server: faServer, compass: faCompassDrafting, briefcase: faBriefcase, layers: faLayerGroup, flask: faFlask, cloud: faCloud, headset: faHeadset, user: faUser, shield: faShieldHalved, handshake: faHandshake, pin: faLocationDot, clipboard: faClipboardCheck, pen: faPenRuler, gears: faGears, chart: faMagnifyingGlassChart, news: faNewspaper, rocket: faRocket, users: faUsers, file: faFileContract, mail: faEnvelope, globe: faGlobe, book: faBookOpen, calendar: faCalendarCheck, bulb: faLightbulb, scale: faScaleBalanced, linkedin: faLinkedin, "arrow-right": faArrowRight, "hammer": faGears, "ai": faFlask, "automation": faGears, "workflow": faGears, "prototype": faPenRuler, "ux": faPenRuler, "ui": faPenRuler, "research": faMagnifyingGlassChart, "strategy": faLightbulb, "design": faPenRuler, "development": faCode, "testing": faClipboardCheck, "deployment": faRocket, "maintenance": faGears };

export function Ico({ n }: { n: string }) {
  return <FontAwesomeIcon icon={I[n as keyof typeof I]} fixedWidth aria-hidden />;
}
