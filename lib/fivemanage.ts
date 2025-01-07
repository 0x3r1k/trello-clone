import { FivemanageClient } from "@fivemanage/sdk";

const fmClient = new FivemanageClient(process.env.FIVEMANAGE_TOKEN as string);

export { fmClient };
