export interface LoginResponse {
    access_token: string,
}

export const login = async (userName: string, password: string): Promise<LoginResponse> => {
    return fetch(`http://localhost:8080/api/auth/authenticate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({userName, password}),
    }).then(response => {
        if (!response.ok) {
            throw new Error(`${response.statusText}`);
        }
        return response.json()
    })
        .then((data: LoginResponse) => data);
}