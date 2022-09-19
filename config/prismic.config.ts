import fetch from "node-fetch";
import * as prismic from "@prismicio/client";

export const createClient = (repoName: string, accessToken: string) =>
  prismic.createClient(repoName, {
    fetch,
    accessToken,
  });
