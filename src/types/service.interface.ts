export interface Developer {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

export interface Version {
    id: string;
    name: string;
    description?: string;
    developer: Developer;
    updated_at: string;
}

export interface Metrics {
    latency: number;
    uptime: number;
    requests: number;
    errors: number;
}

export interface Service {
    id: string;
    name: string;
    description?: string;
    type: string;
    published: boolean;
    configured: boolean;
    versions: Version[];
    metrics: Metrics;
}