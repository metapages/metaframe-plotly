import { FunctionalComponent } from "preact";
import { Plotly } from '/@/components/Plotly';
import { ButtonHelp } from '/@/components/ButtonHelp';
import { isIframe } from "@metapages/metapage";

export const Route: FunctionalComponent = () => (
  <>
    <Plotly />
    {isIframe() ? null : <ButtonHelp />}
  </>
);
