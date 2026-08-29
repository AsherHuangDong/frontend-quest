import { UI } from '../../experience/uiCopy';

/** Always-visible orientation for Async City hub. */
export function CityGuide() {
  return (
    <div className="banner onboarding emphasize">
      <h2>{UI.cityGuideTitle}</h2>
      <p className="anomaly-body" style={{ marginTop: 8 }}>
        {UI.cityGuideBody}
      </p>
      <ol className="steps">
        {UI.cityGuideSteps.map((step) => (
          <li key={step.n}>
            <span className="step-n">{step.n}</span>
            <div>
              <strong>{step.title}</strong>
              <p>{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
