//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P } from '../../../docs/components/index.js';
import Code from '../../../docs/components/Code.js';

//code examples
//----------------------------------------------------------------------

const generatedOutputExample = 
`# My Application Schema

API Reference documentation for the schema definitions.

## Overview

This document provides comprehensive API documentation for all schema elements including models, types, enums, and properties.

Generated on: 2024-01-15T10:30:00.000Z

## Table of Contents

- [Models](#models)
  - [User](#user)
- [Enums](#enums)
  - [UserRole](#userrole)

## Models

Models represent the main data structures in your application.

### User

**Mutability:** Immutable

#### Columns

| Name | Type | Required | Multiple | Description |
|------|------|----------|----------|-------------|
| id | \`String\` | ✓ | ✗ | Unique identifier for the user |
| email | \`String\` | ✓ | ✗ | User email address for authentication |
| name | \`String\` | ✓ | ✗ | Full name of the user |
| role | [UserRole](#userrole) | ✓ | ✗ | User's role in the system |

## Enums

Enums define sets of named constants with associated values.

### UserRole

#### Values

| Key | Value | Description |
|-----|-------|-----------|
| ADMIN | Administrator | - |
| USER | Regular User | - |
| GUEST | Guest User | - |

---

*Documentation generated on 1/15/2024, 10:30:00 AM*`

//----------------------------------------------------------------------

export default function GeneratedOutput() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Generated Output Section Content */}
      <section id="generated-output">
      <H1>{_('10. Generated Output')}</H1>
      <P>
        <Translate>
          The plugin will generate markdown documentation like this:
        </Translate>
      </P>
      <Code copy language='markdown' className='bg-black text-white'>
        {generatedOutputExample}
      </Code>
      </section>
    </>
  )
}