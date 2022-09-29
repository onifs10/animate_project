import fetch from "node-fetch";
import * as prismic from "@prismicio/client";

const routes = [
  {
    type: "detail",
    path: "/details/:uid",
  },
  {
    type: "about",
    path: "/about",
  },
];
export const createClient = (repoName: string, accessToken: string) =>
  prismic.createClient(repoName, {
    fetch,
    accessToken,
    routes,
  });
