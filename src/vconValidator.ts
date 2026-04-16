import Ajv from 'ajv';

// vCon 0.4.0 spec — https://datatracker.ietf.org/doc/draft-ietf-vcon-vcon-core/
export const VCON_VERSION = '0.4.0';
export const VALID_ENCODINGS = ['base64url', 'json', 'none'] as const;
export type VConEncoding = typeof VALID_ENCODINGS[number];

export interface VConData {
    vcon: string;
    uuid: string;
    created: string;
    updated?: string;
    subject?: string;
    redacted?: string[];
    amended?: string[];          // 0.4.0: replaced "appended"
    parties?: VConParty[];
    dialog?: VConDialog[];
    attachments?: VConAttachment[];
    analysis?: VConAnalysis[];
    jumps?: VConJump[];
    group?: VConGroup[];
    signing?: VConSigning[];
    encryption?: VConEncryption[];
    [key: string]: any;
}

export interface VConParty {
    uuid: string;
    name?: string;
    tel?: string;
    email?: string;
    [key: string]: any;
}

export interface VConSessionId {
    local: string;   // 0.4.0
    remote: string;  // 0.4.0
}

export interface VConDialog {
    uuid: string;
    type: string;
    start?: string;
    end?: string;
    parties?: number[];
    mimetype?: string;
    encoding?: VConEncoding;     // 0.4.0: base64url | json | none
    body?: string;
    url?: string;
    duration?: number;
    critical?: boolean;          // 0.4.0: replaced "must_support"
    session_id?: VConSessionId;  // 0.4.0
    content_hash?: string | string[];  // 0.4.0
    meta?: any;
    [key: string]: any;
}

export interface VConAttachment {
    uuid: string;
    purpose: string;             // 0.4.0: renamed from "type"
    encoding?: VConEncoding;     // 0.4.0: base64url | json | none
    filename?: string;
    mimetype?: string;
    body?: string;
    url?: string;
    size?: number;
    content_hash?: string | string[];  // 0.4.0
    meta?: any;
    [key: string]: any;
}

export interface VConAnalysis {
    uuid: string;
    type: string;
    vendor?: string;             // 0.4.0
    product?: string;            // 0.4.0
    encoding?: VConEncoding;     // 0.4.0
    body?: string;
    url?: string;
    mimetype?: string;
    content_hash?: string | string[];  // 0.4.0
    meta?: any;
    [key: string]: any;
}

export interface VConJump {
    uuid: string;
    sequence?: number;
    start?: string;
    end?: string;
    duration?: number;
    meta?: any;
    [key: string]: any;
}

export interface VConGroup {
    uuid: string;
    name?: string;
    parties?: number[];
    meta?: any;
    [key: string]: any;
}

export interface VConSigning {
    uuid: string;
    type: string;
    body?: string;
    url?: string;
    mimetype?: string;
    meta?: any;
    [key: string]: any;
}

export interface VConEncryption {
    uuid: string;
    type: string;
    body?: string;
    url?: string;
    mimetype?: string;
    meta?: any;
    [key: string]: any;
}

export class VConValidator {
    private ajv: Ajv;
    private vconSchema: any;

    constructor() {
        this.ajv = new Ajv({ allErrors: true });
        this.initializeSchema();
    }

    private initializeSchema() {
        // vCon schema — vCon 0.4.0 spec
        const encodingEnum = { type: 'string', enum: VALID_ENCODINGS };
        const contentHash = { oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] };

        this.vconSchema = {
            type: 'object',
            required: ['vcon', 'uuid', 'created'],
            properties: {
                // Accept both X.Y and X.Y.Z version strings
                vcon: { type: 'string', pattern: '^[0-9]+\\.[0-9]+(\\.[0-9]+)?$' },
                uuid: { type: 'string', format: 'uuid' },
                created: { type: 'string', format: 'date-time' },
                updated: { type: 'string', format: 'date-time' },
                subject: { type: 'string' },
                redacted: { type: 'array', items: { type: 'string' } },
                amended: { type: 'array', items: { type: 'string' } },  // 0.4.0
                parties: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['uuid'],
                        properties: {
                            uuid: { type: 'string', format: 'uuid' },
                            name: { type: 'string' },
                            tel: { type: 'string' },
                            email: { type: 'string', format: 'email' }
                        }
                    }
                },
                dialog: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['uuid', 'type'],
                        properties: {
                            uuid: { type: 'string', format: 'uuid' },
                            type: { type: 'string' },
                            start: { type: 'string', format: 'date-time' },
                            end: { type: 'string', format: 'date-time' },
                            parties: { type: 'array', items: { type: 'number' } },
                            mimetype: { type: 'string' },
                            encoding: encodingEnum,          // 0.4.0
                            body: { type: 'string' },
                            url: { type: 'string', format: 'uri' },
                            duration: { type: 'number' },
                            critical: { type: 'boolean' },  // 0.4.0: was must_support
                            session_id: {                   // 0.4.0
                                type: 'object',
                                required: ['local', 'remote'],
                                properties: {
                                    local: { type: 'string' },
                                    remote: { type: 'string' }
                                }
                            },
                            content_hash: contentHash       // 0.4.0
                        }
                    }
                },
                attachments: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['uuid', 'purpose'],      // 0.4.0: was ["uuid", "type"]
                        properties: {
                            uuid: { type: 'string', format: 'uuid' },
                            purpose: { type: 'string' },   // 0.4.0: renamed from "type"
                            encoding: encodingEnum,         // 0.4.0
                            filename: { type: 'string' },
                            mimetype: { type: 'string' },
                            body: { type: 'string' },
                            url: { type: 'string', format: 'uri' },
                            size: { type: 'number' },
                            content_hash: contentHash       // 0.4.0
                        }
                    }
                },
                analysis: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['uuid', 'type'],
                        properties: {
                            uuid: { type: 'string', format: 'uuid' },
                            type: { type: 'string' },
                            vendor: { type: 'string' },    // 0.4.0
                            product: { type: 'string' },   // 0.4.0
                            encoding: encodingEnum,         // 0.4.0
                            body: { type: 'string' },
                            url: { type: 'string', format: 'uri' },
                            mimetype: { type: 'string' },
                            content_hash: contentHash       // 0.4.0
                        }
                    }
                },
                jumps: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['uuid'],
                        properties: {
                            uuid: { type: 'string', format: 'uuid' },
                            sequence: { type: 'number' },
                            start: { type: 'string', format: 'date-time' },
                            end: { type: 'string', format: 'date-time' },
                            duration: { type: 'number' }
                        }
                    }
                },
                group: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['uuid'],
                        properties: {
                            uuid: { type: 'string', format: 'uuid' },
                            name: { type: 'string' },
                            parties: { type: 'array', items: { type: 'number' } }
                        }
                    }
                },
                signing: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['uuid', 'type'],
                        properties: {
                            uuid: { type: 'string', format: 'uuid' },
                            type: { type: 'string' },
                            body: { type: 'string' },
                            url: { type: 'string', format: 'uri' },
                            mimetype: { type: 'string' }
                        }
                    }
                },
                encryption: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['uuid', 'type'],
                        properties: {
                            uuid: { type: 'string', format: 'uuid' },
                            type: { type: 'string' },
                            body: { type: 'string' },
                            url: { type: 'string', format: 'uri' },
                            mimetype: { type: 'string' }
                        }
                    }
                }
            }
        };
    }

    public isVConFile(content: string): boolean {
        try {
            const json = JSON.parse(content);
            return this.validateVCon(json);
        } catch (error) {
            return false;
        }
    }

    public validateVCon(data: any): boolean {
        const validate = this.ajv.compile(this.vconSchema);
        return validate(data) as boolean;
    }

    public getValidationErrors(data: any): string[] {
        const validate = this.ajv.compile(this.vconSchema);
        validate(data);
        return validate.errors?.map((error: any) => `${error.instancePath} ${error.message}`) || [];
    }

    public parseVCon(content: string): VConData | null {
        try {
            const data = JSON.parse(content);
            if (this.validateVCon(data)) {
                return data as VConData;
            }
            return null;
        } catch (error) {
            return null;
        }
    }
}
