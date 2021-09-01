import Arweave from "arweave";
import ArDB from "ardb";

export const arweave = Arweave.init({
  host: process.env.REACT_APP_AR_HOST || "127.0.0.1",
  port: process.env.REACT_APP_AR_PORT || 1984,
  protocol: "http",
});
export const ardb = new ArDB(arweave);
