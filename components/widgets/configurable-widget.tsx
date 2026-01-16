import type { ConfigurableWidget } from '@/types/strapi';

/** Props for ConfigurableWidgetComponent */
interface ConfigurableWidgetComponentProps {
  widget: ConfigurableWidget;
}

/** Stub component for redirect-form type */
const RedirectFormStub = ({ widget }: ConfigurableWidgetComponentProps) => (
  <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
    {widget.title && <h3 className="lead-form-heading mb-4">{widget.title}</h3>}
    <p className="text-gray-500 italic">Redirect Form Widget (Coming Soon)</p>
  </div>
);

/** Stub component for emi-calculator type */
const EMICalculatorStub = ({ widget }: ConfigurableWidgetComponentProps) => (
  <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
    {widget.title && <h3 className="lead-form-heading mb-4">{widget.title}</h3>}
    <p className="text-gray-500 italic">EMI Calculator Widget (Coming Soon)</p>
  </div>
);

/** Stub component for custom-html type */
const CustomHTMLStub = ({ widget }: ConfigurableWidgetComponentProps) => (
  <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
    {widget.title && <h3 className="lead-form-heading mb-4">{widget.title}</h3>}
    {widget.content ? (
      <div dangerouslySetInnerHTML={{ __html: widget.content }} />
    ) : (
      <p className="text-gray-500 italic">Custom HTML Widget (No content)</p>
    )}
  </div>
);

/**
 * Factory component that renders configurable widgets based on type
 * Uses type-based routing to appropriate sub-components
 */
const ConfigurableWidgetComponent = ({ widget }: ConfigurableWidgetComponentProps) => {
  switch (widget.type) {
    case 'redirect-form':
      return <RedirectFormStub widget={widget} />;
    case 'emi-calculator':
      return <EMICalculatorStub widget={widget} />;
    case 'custom-html':
      return <CustomHTMLStub widget={widget} />;
    default:
      console.warn(`Unknown configurable widget type: ${widget.type}`);
      return null;
  }
};

export default ConfigurableWidgetComponent;

