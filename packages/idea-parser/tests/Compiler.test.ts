import { describe, it } from 'mocha';
import { expect, use } from 'chai';
//NOTE: no extensions in tests because it's excluded in tsconfig.json and
//we are testing in a typescript environment via `ts-mocha -r tsx` (esm)
import Compiler from '../src/Compiler';
import { 
    DataToken, 
    DeclarationToken, 
    IdentifierToken, 
    ImportToken, 
    SchemaToken
} from '../src/types';

describe('Compiler Test', () => {

    // Line 46
    it('Should throw an exception with the message "Invalid data token type" when an invalid token type is encountered', () => {
        const invalidToken = { type: 'InvalidType' } as unknown as DataToken;
        expect(() => Compiler.data(invalidToken)).to.throw('Invalid data token type');
    });

    // Line 54
    it('Should throw an exception with the message "Invalid Enum" when an invalid enum is encountered', () => {
        const invalidEnumToken = { kind: 'notAnEnum', declarations: [] } as unknown as DeclarationToken;
        expect(() => Compiler.enum(invalidEnumToken)).to.throw('Invalid Enum');
    });

    // Line 86
    it('Should throw an exception with the message "Unknown reference {token.name}" when references is an empty object', () => {
        const token = { name: 'someReference' } as IdentifierToken;
        expect(() => Compiler.identifier(token, {})).to.throw('Unknown reference someReference');
    });


    // Line 109
    it('Should throw an exception with the message "Expecting a columns property" when the columns property is missing', () => {
        const tokenWithoutColumns = { kind: 'model',
            declarations: [{
                id: { name: 'TestModel' },
                init: { properties: [] }
            }]
        } as unknown as DeclarationToken;
        expect(() => Compiler.model(tokenWithoutColumns)).to.throw('Expecting a columns property');
    });

    // Line 152 
    it('Should throw an exception with the message "Invalid Plugin" when an invalid plugin is encountered', () => {
        const invalidPluginToken = { kind: 'notAPlugin', declarations: [] } as unknown as DeclarationToken;
        expect(() => Compiler.plugin(invalidPluginToken)).to.throw('Invalid Plugin');
    });

    // Line 168
    it('Should throw an exception with the message "Invalid Prop" when an invalid property is encountered', () => {
        const invalidPropToken = { kind: 'notAProp', declarations: [] } as unknown as DeclarationToken;
        expect(() => Compiler.prop(invalidPropToken)).to.throw('Invalid Prop');
    });

    // Line 184
    it('Should throw an exception with the message "Invalid Schema" when an invalid schema is encountered', () => {
        const invalidSchemaToken = { kind: 'notASchema', body: [] } as unknown as SchemaToken;
        expect(() => Compiler.schema(invalidSchemaToken)).to.throw('Invalid Schema');
    });

    // Line 205
    it('Should throw an exception with the message "Duplicate key" when a duplicate key is encountered in the schema', () => {
        const duplicateKeyToken = {
            kind: 'schema',
            body: [
                {
                    kind: 'enum',
                    declarations: [{
                        id: { name: 'DuplicateKey' },
                        init: { properties: [{ key: { name: 'key1' }, value: { value: 'value1' } }] }
                    }]
                },
                {
                    kind: 'enum',
                    declarations: [{
                        id: { name: 'DuplicateKey' },
                        init: { properties: [{ key: { name: 'key2' }, value: { value: 'value2' } }] }
                    }]
                }
            ]
        } as unknown as SchemaToken;
        expect(() => Compiler.schema(duplicateKeyToken)).to.throw('Duplicate DuplicateKey');
    });

    // Line 260
    it('Should throw an exception with the message "Invalid Type" when an invalid type is encountered', () => {
        const invalidTypeToken = { kind: 'notAType', declarations: [] } as unknown as DeclarationToken;
        expect(() => Compiler.type(invalidTypeToken)).to.throw('Invalid Type');
    });
    
    // Line 304
    it('Should throw an exception with the message "Invalid Import" when an invalid import is encountered', () => {
        const invalidImportToken = { type: 'NotAnImportDeclaration', source: { value: './invalid.idea' } } as unknown as ImportToken;
        expect(() => Compiler.use(invalidImportToken)).to.throw('Invalid Import');
    });
    
    



})