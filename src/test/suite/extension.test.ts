import * as assert from 'assert';
import { VConValidator } from '../../vconValidator';

suite('vCon Validator Test Suite', () => {
    test('Should validate a correct vCon file', () => {
        const validator = new VConValidator();
        const validVCon = {
            vcon: "1.0",
            uuid: "550e8400-e29b-41d4-a716-446655440000",
            created: "2023-01-15T10:30:00Z"
        };
        
        assert.strictEqual(validator.validateVCon(validVCon), true);
    });

    test('Should reject invalid vCon file', () => {
        const validator = new VConValidator();
        const invalidVCon = {
            vcon: "invalid",
            uuid: "not-a-uuid",
            created: "invalid-date"
        };
        
        assert.strictEqual(validator.validateVCon(invalidVCon), false);
    });

    test('Should detect vCon file from content', () => {
        const validator = new VConValidator();
        const content = JSON.stringify({
            vcon: "1.0",
            uuid: "550e8400-e29b-41d4-a716-446655440000",
            created: "2023-01-15T10:30:00Z"
        });
        
        assert.strictEqual(validator.isVConFile(content), true);
    });

    test('Should parse valid vCon content', () => {
        const validator = new VConValidator();
        const content = JSON.stringify({
            vcon: "1.0",
            uuid: "550e8400-e29b-41d4-a716-446655440000",
            created: "2023-01-15T10:30:00Z",
            subject: "Test Call"
        });
        
        const result = validator.parseVCon(content);
        assert.notStrictEqual(result, null);
        assert.strictEqual(result?.vcon, "1.0");
        assert.strictEqual(result?.subject, "Test Call");
    });
});


