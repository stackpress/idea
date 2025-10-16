//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P } from '../../../docs/components/index.js';
import Code from '../../../docs/components/Code.js';

//code examples
//--------------------------------------------------------------------//

const generatedOutputExample =
  `-- Generated MySQL Tables
-- Database: my_app
-- Generated at: 2024-01-15T10:30:00.000Z

CREATE DATABASE IF NOT EXISTS \`my_app\`;
USE \`my_app\`;

CREATE TABLE \`User\` (
  \`id\` VARCHAR(255) NOT NULL COMMENT 'ID',
  \`email\` VARCHAR(255) NOT NULL COMMENT 'Email',
  \`name\` VARCHAR(255) NOT NULL COMMENT 'Name',
  \`age\` TINYINT UNSIGNED NULL COMMENT 'Age',
  \`role\` ENUM('admin', 'user') NOT NULL DEFAULT 'user' COMMENT 'Role',
  \`active\` BOOLEAN NOT NULL DEFAULT true COMMENT 'Active',
  \`created\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Created',
  \`updated\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated',
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uk_User_email\` (\`email\`),
  KEY \`idx_User_age\` (\`age\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

//--------------------------------------------------------------------//

export default function GeneratedOutput() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Generated Output Section Content */}
      <section id="generated-output">
        <H1>{_('8. Generated Output')}</H1>
        <P>
          <Translate>
            The plugin will generate SQL like this. The output includes
            proper MySQL syntax with constraints, indexes, and foreign
            keys.
          </Translate>
        </P>
        <H2>{_('Example Generated SQL')}</H2>
        <Code
          copy
          language="sql"
          className="bg-black text-white"
        >
          {generatedOutputExample}
        </Code>
      </section>
    </>
  );
}