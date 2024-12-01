export interface AI {
    personality: string
}

export interface AIResponse {
    model: string,
    created_at: Date,
    message: {
        role: string,
        content: string
    }
}