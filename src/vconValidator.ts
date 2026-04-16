import Ajv from 'ajv';

export interface VConData {
    vcon: string;
    uuid: string;
    created: string;
    updated?: string;
    subject?: string;
    redacted?: string[];
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

export interface VConDialog {
    uuid: string;
    type: string;
    start?: string;
    end?: string;
    parties?: number[];
    mimetype?: string;
    body?: string;
    url?: string;
    duration?: number;
    meta?: any;
    [key: string]: any;
}

export interface VConAttachment {
    uuid: string;
    type: string;
    filename?: string;
    mimetype?: string;
    body?: string;
    url?: string;
    size?: number;
    meta?: any;
    [key: string]: any;
}

export interface VConAnalysis {
    uuid: string;
    type: string;
    body?: string;
    url?: string;
    mimetype?: string;
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
        // Basic vCon schema based on IETF draft
        this.vconSchema = {
            type: "object",
            required: ["vcon", "uuid", "created"],
            properties: {
                vcon: { type: "string", pattern: "^[0-9]+\\.[0-9]+$" },
                uuid: { type: "string", format: "uuid" },
                created: { type: "string", format: "date-time" },
                updated: { type: "string", format: "date-time" },
                subject: { type: "string" },
                redacted: { type: "array", items: { type: "string" } },
                parties: {
                    type: "array",
                    items: {
                        type: "object",
                        required: ["uuid"],
                        properties: {
                            uuid: { type: "string", format: "uuid" },
                            name: { type: "string" },
                            tel: { type: "string" },
                            email: { type: "string", format: "email" }
                        }
                    }
                },
                dialog: {
                    type: "array",
                    items: {
                        type: "object",
                        required: ["uuid", "type"],
                        properties: {
                            uuid: { type: "string", format: "uuid" },
                            type: { type: "string" },
                            start: { type: "string", format: "date-time" },
                            end: { type: "string", format: "date-time" },
                            parties: { type: "array", items: { type: "number" } },
                            mimetype: { type: "string" },
                            body: { type: "string" },
                            url: { type: "string", format: "uri" },
                            duration: { type: "number" }
                        }
                    }
                },
                attachments: {
                    type: "array",
                    items: {
                        type: "object",
                        required: ["uuid", "type"],
                        properties: {
                            uuid: { type: "string", format: "uuid" },
                            type: { type: "string" },
                            filename: { type: "string" },
                            mimetype: { type: "string" },
                            body: { type: "string" },
                            url: { type: "string", format: "uri" },
                            size: { type: "number" }
                        }
                    }
                },
                analysis: {
                    type: "array",
                    items: {
                        type: "object",
                        required: ["uuid", "type"],
                        properties: {
                            uuid: { type: "string", format: "uuid" },
                            type: { type: "string" },
                            body: { type: "string" },
                            url: { type: "string", format: "uri" },
                            mimetype: { type: "string" }
                        }
                    }
                },
                jumps: {
                    type: "array",
                    items: {
                        type: "object",
                        required: ["uuid"],
                        properties: {
                            uuid: { type: "string", format: "uuid" },
                            sequence: { type: "number" },
                            start: { type: "string", format: "date-time" },
                            end: { type: "string", format: "date-time" },
                            duration: { type: "number" }
                        }
                    }
                },
                group: {
                    type: "array",
                    items: {
                        type: "object",
                        required: ["uuid"],
                        properties: {
                            uuid: { type: "string", format: "uuid" },
                            name: { type: "string" },
                            parties: { type: "array", items: { type: "number" } }
                        }
                    }
                },
                signing: {
                    type: "array",
                    items: {
                        type: "object",
                        required: ["uuid", "type"],
                        properties: {
                            uuid: { type: "string", format: "uuid" },
                            type: { type: "string" },
                            body: { type: "string" },
                            url: { type: "string", format: "uri" },
                            mimetype: { type: "string" }
                        }
                    }
                },
                encryption: {
                    type: "array",
                    items: {
                        type: "object",
                        required: ["uuid", "type"],
                        properties: {
                            uuid: { type: "string", format: "uuid" },
                            type: { type: "string" },
                            body: { type: "string" },
                            url: { type: "string", format: "uri" },
                            mimetype: { type: "string" }
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

