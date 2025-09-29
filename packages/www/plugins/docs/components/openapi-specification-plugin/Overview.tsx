//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P, C } from '../index.js';

export default function Overview() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Overview Section Content */}
      <section id="overview">
      <H1>{_('1. Overview')}</H1>
      <P>
        <Translate>
          OpenAPI (formerly Swagger) specifications provide a standard
          way to document REST APIs. This plugin transforms your
          <C>.idea</C> schema definitions into comprehensive API
          documentation that follows industry standards and integrates
          seamlessly with existing API development workflows.
        </Translate>
      </P>
      <P>
        <Translate>
          This plugin will:
        </Translate>
      </P>
      <ul className="list-disc pl-6 my-4">
        <li className="my-2">
          <Translate>
            Generate OpenAPI 3.0 compliant specifications
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            Create schemas from idea models and types
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            Generate CRUD endpoints for models
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            Include validation rules and examples
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            Support custom endpoints and operations
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            Generate security schemes and authentication
          </Translate>
        </li>
      </ul>

      <H2>{_('What You\'ll Learn')}</H2>
      <P>
        <Translate>
          This section outlines the key concepts and skills you'll
          acquire through this tutorial. Understanding these fundamentals
          will enable you to create robust API documentation that serves
          both developers and automated tooling.
        </Translate>
      </P>
      <ul className="list-disc pl-6 my-4">
        <li className="my-2">
          <Translate>
            Processing idea schemas for API documentation
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            OpenAPI 3.0 specification structure
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            Schema generation and validation
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            Endpoint documentation patterns
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            Security and authentication schemes
          </Translate>
        </li>
      </ul>
      </section>
    </>
  );
}