//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P, SS } from '../../../docs/components/index.js';

export default function Overview() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Creating a Test Data Generator Plugin */}
      <section id="introduction">
        <H1>{_('Test Data Generator Plugin Tutorial')}</H1>
        <P>
          <Translate>
            This tutorial demonstrates how to create a plugin that
            generates mock data and test fixtures from .idea schema
            files. The plugin will transform your schema models into
            realistic test data for development, testing, and prototyping.
          </Translate>
        </P>
      </section>

      {/* Overview Section Content */}
      <section id="overview">
        <H1>{_('1. Overview')}</H1>
        <P>
          <Translate>
            Test data generation is crucial for development and testing
            workflows. This plugin generates realistic mock data from your
            .idea schema, including:
          </Translate>
        </P>
        <ul className="list-disc my-4 pl-6">
          <li className="my-2">
            <SS>Mock Data</SS>: <Translate>
              Realistic test data based on schema types
            </Translate>
          </li>
          <li className="my-2">
            <SS>Fixtures</SS>: <Translate>
              Predefined test datasets for consistent testing
            </Translate>
          </li>
          <li className="my-2">
            <SS>Factories</SS>: <Translate>
              Data generation functions for dynamic testing
            </Translate>
          </li>
          <li className="my-2">
            <SS>Relationships</SS>: <Translate>
              Proper handling of model relationships
            </Translate>
          </li>
          <li className="my-2">
            <SS>Customization</SS>: <Translate>
              Custom data generators and constraints
            </Translate>
          </li>
        </ul>
      </section>
    </>
  );
}