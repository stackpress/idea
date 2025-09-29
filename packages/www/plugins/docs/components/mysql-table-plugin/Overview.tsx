
//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P } from '../index.js';

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
            The MySQL Tables Plugin will:
          </Translate>
        </P>
        <ul className="px-ml-20 list-disc">
          <li>
            <Translate>
              Parse schema models and their columns
            </Translate>
          </li>
          <li>
            <Translate>
              Map schema types to MySQL data types
            </Translate>
          </li>
          <li>
            <Translate>
              Generate SQL CREATE TABLE statements
            </Translate>
          </li>
          <li>
            <Translate>
              Handle primary keys, foreign keys, and indexes
            </Translate>
          </li>
          <li>
            <Translate>
              Output SQL files that can be executed to create database 
              tables
            </Translate>
          </li>
        </ul>
      </section>
    </>
  );
}