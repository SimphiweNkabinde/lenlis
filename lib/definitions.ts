export interface ServerActionResponse {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
    data?: any
}

export type ListMemberRole = "owner" | "editor" | "viewer";

export interface ListItem {
    id: string
    text: string,
    checked?: boolean,
    amount?: number
}