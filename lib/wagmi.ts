import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { ritualChain } from "./ritual";

export const wagmiConfig = createConfig({
  chains: [ritualChain],
  connectors: [injected()],
  transports: { [ritualChain.id]: http("https://rpc.ritualfoundation.org") }
});
