import { FunctionalComponent } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import { useMetaframe, useHashParamBoolean } from "@metapages/metaframe-hook";
import { MetaframeInputMap } from "@metapages/metapage";
import Plot from "react-plotly.js";

export const Plotly: FunctionalComponent = () => {
  // This is currently the most performant way to get metaframe
  // inputs and cleanup properly
  const metaframeObject = useMetaframe();
  const [data, setData] = useState<any[]>([]);
  const [config, setConfig] = useState<any>({});
  const [layout, setLayout] = useState<any>({});
  const [ debug ] = useHashParamBoolean("debug");


  useEffect(() => {
    if (metaframeObject.metaframe) {
      console.log('new metaframe object');
    }
  }, [metaframeObject.metaframe]);

  // listen to inputs and cleanup up listener
  useEffect(() => {
    if (!metaframeObject?.metaframe) {
      return;
    }
    const metaframe = metaframeObject.metaframe;
    const onInputs = (newinputs: MetaframeInputMap): void => {

      // Notify others inputs are recieved for performance
      metaframe.setOutputs({
        event: { id: newinputs.id, name: "inputs", time: performance.now() },
      });
      setData(newinputs.data || null);
      setConfig(newinputs.config || null);
      setLayout(newinputs.layout || null);
    };
    const disposer = metaframe.onInputs(onInputs);

    return () => {
      // If the metaframe is cleaned up, also remove the inputs listener
      disposer();
    };
  }, [metaframeObject.metaframe, setData, setConfig, setLayout]);

  const onError = useCallback((error :any) => {
    if (!metaframeObject?.metaframe) {
      return;
    }
    metaframeObject.metaframe.setOutputs({event: {
      name: "error",
      message: "plotly.js API method rejects",
      data: error,
    }});
  }, [metaframeObject.metaframe]);

  const onAfterPlot = useCallback(() => {
    if (!metaframeObject?.metaframe) {
      return;
    }
    metaframeObject.metaframe.setOutputs({event: {
      name: "plotly_afterplot",
    }});
  }, [metaframeObject.metaframe]);

  const onRedraw = useCallback(() => {
    if (!metaframeObject?.metaframe) {
      return;
    }
    metaframeObject.metaframe.setOutputs({event: {
      name: "plotly_redraw",
    }});
  }, [metaframeObject.metaframe]);

  return (
    <Plot
      style={{ width: "100%", height: "100%" }}
      data={data}
      layout={{ ...layout, ...{ autosize: true } }}
      config={config }
      useResizeHandler={true}
      debug={debug}
      className={"maxsize"}
      onError={onError}
      onAfterPlot={onAfterPlot}
      onRedraw={onRedraw}
    />
  );
};
