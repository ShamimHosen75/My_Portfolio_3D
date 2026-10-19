// Logos shown as 3D balls in "My Techstack". Icons come from the simple-icons package.
import {
  siReact,
  siNextdotjs,
  siTypescript,
  siJavascript,
  siTailwindcss,
  siNodedotjs,
  siExpress,
  siMongodb,
  siSupabase,
  siFirebase,
  siMysql,
  siGo,
  siWordpress,
  siWoocommerce,
  siFigma,
  siGit,
  siGithub,
  siVercel,
  siVite,
  siThreedotjs,
  siHtml5,
  siCss,
  siPhp,
  siPython,
  siCplusplus,
  siElementor,
  siGreensock,
  siClaude,
} from "simple-icons";

export interface TechIcon {
  title: string;
  path: string;
  hex: string;
}

const pick = (i: { title: string; path: string; hex: string }): TechIcon => ({
  title: i.title,
  path: i.path,
  hex: i.hex,
});

export const techStack: TechIcon[] = [
  siReact,
  siNextdotjs,
  siTypescript,
  siJavascript,
  siTailwindcss,
  siNodedotjs,
  siExpress,
  siMongodb,
  siSupabase,
  siFirebase,
  siMysql,
  siGo,
  siWordpress,
  siWoocommerce,
  siFigma,
  siGit,
  siGithub,
  siVercel,
  siVite,
  siThreedotjs,
  siHtml5,
  siCss,
  siPhp,
  siPython,
  siCplusplus,
  siElementor,
  siGreensock,
  siClaude,
].map(pick);
